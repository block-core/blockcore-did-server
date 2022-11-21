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

const server = new Server();
const app = new Koa();

const rateLimit = process.env['RATELIMIT'] ? Number(process.env['RATELIMIT']) : 5;
console.log(`RATE LIMIT: ${rateLimit} rpm`);

app.use(cors());

// TODO: Tune the rate limits: https://github.com/ysocorp/koa2-ratelimit
const limiter = RateLimit.middleware({
	interval: { min: 1 }, // 15 minutes = 15*60*1000
	max: rateLimit, // limit each IP to X requests per interval
});

//  apply to all requests
app.use(limiter);

app.use(async (ctx, next) => {
	ctx.body = await getRawBody(ctx.req);
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
	const response = await server.request(ctx.body);
	setResponse(response, ctx.response);
});

router.get('/1.0/identifiers/:did', async (ctx, _next) => {
	// ctx.request.ip
	let version = undefined;

	if (ctx.query['version']) {
		version = Number(ctx.query['version']);
	}

	const did = String(ctx.params['did']);

	const didDocument = await server.resolve(did, version);
	setResponse(didDocument, ctx.response);
});

// router.get('/wipe', async (ctx, _next) => {
// 	await server.wipe();
// 	setResponse({ wipe: 'ok' }, ctx.response);
// });

router.get('/', async (ctx, _next) => {
	setResponse({ online: 'true', example: '/1.0/identifiers/did:is:0f254e55a2633d468e92aa7dd5a76c0c9101fab8e282c8c20b3fefde0d68f217' }, ctx.response);
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

	await sync.run();

	setTimeout(() => {
		syncFunction();
	}, 10000);
};

try {
	const port = 4250;

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
