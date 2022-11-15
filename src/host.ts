import Koa from 'koa';
import cors from '@koa/cors';
import { koaSwagger } from 'koa2-swagger-ui';
import getRawBody from 'raw-body';
import Router from 'koa-router';
import { Server } from './server';

const server = new Server();
const app = new Koa();

app.use(cors());

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
	console.log('RESPONSE:', response);
	setResponse(response, ctx.response);
});

router.get('/', async (ctx, _next) => {
	setResponse({ "online": "true" }, ctx.response);
});

app.use(router.routes()).use(router.allowedMethods());

app.use((ctx, _next) => {
	console.log('BAD REQUEST!!');
	ctx.response.status = 400;
});

try {
	const port = 4250;
	app.listen(port, () => {
		console.log(`Hosting Blockcore DID Server @ http://localhost:${port}`);
	});
} catch (error) {
	const serializedError = JSON.stringify(error, Object.getOwnPropertyNames(error));
	console.log(`Blockcore DID Server initialization failed with error ${serializedError}`);
	process.exit(1);
}

const setResponse = (response: any, koaResponse: Koa.Response) => {
	koaResponse.status = response.status ? response.status : 200;
	koaResponse.set('Content-Type', 'application/json');
	koaResponse.body = JSON.stringify(response);
};
