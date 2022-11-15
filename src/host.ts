import Koa from 'koa';
import { koaSwagger } from 'koa2-swagger-ui';

console.log('Starting Blockcore DID Server...');

const app = new Koa();

app.use(
	koaSwagger({
		// routePrefix: '/swagger', // host at /swagger instead of default /docs
		// swaggerOptions: {
		// 	url: 'http://petstore.swagger.io/v2/swagger.json', // example path to json
		// },
	})
);

app.listen(4250);

console.log('Hosting Server @ http://localhost:4250');
