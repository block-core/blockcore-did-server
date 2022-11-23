import * as dotenv from 'dotenv';
dotenv.config();

import Koa from 'koa';
import cors from '@koa/cors';
import { koaSwagger } from 'koa2-swagger-ui';
import getRawBody from 'raw-body';
import Router from 'koa-router';
import { Server } from './server';
import { RateLimit } from 'koa2-ratelimit';
import { SyncProcess } from './sync';

const database = process.env['DATABASE'];
const app = new Koa();
const server = new Server(database);
await server.start();

async function shutdown(signal: any) {
	console.log(`*^!@4=> Received signal to terminate: ${signal}`);
	await server.stop();
	process.kill(process.pid, signal);
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

const rateLimit = process.env['RATELIMIT'] ? Number(process.env['RATELIMIT']) : 30;
const port = process.env['PORT'] ? Number(process.env['PORT']) : 4250;
const maxsize = process.env['MAXSIZE'] ?? '16kb';

console.log(`RATE LIMIT: ${rateLimit} rpm`);
console.log(`MAX SIZE: ${maxsize}`);

app.use(cors());

// TODO: Tune the rate limits: https://github.com/ysocorp/koa2-ratelimit
const limiter = RateLimit.middleware({
	interval: { min: 1 }, // 15 minutes = 15*60*1000
	max: rateLimit, // limit each IP to X requests per interval
});

//  apply to all requests
app.use(limiter);

app.use(async (ctx, next) => {
	ctx.body = await getRawBody(ctx.req, {
		limit: maxsize,
	});
	await next();
});

app.use(
	koaSwagger({
		// routePrefix: '/swagger', // host at /swagger instead of default /docs
		// swaggerOptions: {
		// 	url: 'http://petstore.swagger.io/v2/swagger.json', // example path to json
		// },
	})
);

const router = new Router();

router.post('/', async (ctx, _next) => {
	try {
		const response = await server.request(ctx.body);
		setResponse(response, ctx.response);
	} catch (err: any) {
		setResponse({ error: err.message, status: 500 }, ctx.response);
	}
});

router.get('/.well-known/did-configuration.json', async (ctx, _next) => {
	const configuration = {
		'@context': 'https://identity.foundation/.well-known/did-configuration/v1',
		linked_dids: [process.env['VC']],
	};

	setResponse(configuration, ctx.response);
});

router.get('/1.0/log/:sequence', async (ctx, _next) => {
	try {
		const sequence = Number(ctx.params['sequence']);
		const items = await server.list(sequence);
		setResponse(items, ctx.response);
	} catch (err: any) {
		setResponse({ error: err.message, status: 500 }, ctx.response);
	}
});

router.get('/1.0/identifiers/:did', async (ctx, _next) => {
	try {
		// ctx.request.ip
		let version = undefined;

		if (ctx.query['version']) {
			version = Number(ctx.query['version']);
		}

		const did = String(ctx.params['did']);

		const didDocument = await server.resolve(did, version);
		setResponse(didDocument, ctx.response);
	} catch (err: any) {
		setResponse({ error: err.message, status: 500 }, ctx.response);
	}
});

// router.get('/wipe', async (ctx, _next) => {
// 	await server.wipe();
// 	setResponse({ wipe: 'ok' }, ctx.response);
// });

router.get('/', async (ctx, _next) => {
	setResponse({ online: 'true', wellKnown: '/.well-known/did-configuration.json', example: '/1.0/identifiers/did:is:0f254e55a2633d468e92aa7dd5a76c0c9101fab8e282c8c20b3fefde0d68f217' }, ctx.response);
});

app.use(router.routes()).use(router.allowedMethods());

app.use((ctx, _next) => {
	ctx.response.status = 400;
});

let sync: SyncProcess;

const syncFunction = async () => {
	if (sync == null) {
		sync = new SyncProcess(server, process.env['SERVERS']);
	}

	try {
		await sync.run();
	} catch (err: any) {
		console.error(`Failure during sync: ${err.message}`);
	}

	setTimeout(() => {
		syncFunction();
	}, 60000);
};

try {
	// Run the HTTP server that responds to queries.
	app.listen(port, () => {
		console.log(`Hosting Blockcore DID Server @ http://localhost:${port}`);
	});

	// Run the SYNC service that ensures data is synced cross server instances.
	syncFunction();
} catch (error) {
	const serializedError = JSON.stringify(error, Object.getOwnPropertyNames(error));
	console.log(`Blockcore DID Server initialization failed with error ${serializedError}`);
	process.exit(1);
}

const setResponse = (response: any, koaResponse: Koa.Response) => {
	koaResponse.status = response.status ? response.status : 200;
	koaResponse.set('Content-Type', 'application/json');
	// koaResponse.body = JSON.stringify(response);
	koaResponse.body = response;
};
