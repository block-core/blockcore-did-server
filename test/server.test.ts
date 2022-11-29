import test from 'ava';
import { didNotFound, Server } from '../src/server.js';

test('Create the server', async (t) => {
	const server = new Server();
	t.assert(server != null);

	await server.start();

	await server.wipe();

	const didResolution = await server.resolve('did:is:test');
	t.assert(didNotFound(didResolution.result));

	// const didDocument = {
	// 	services: ['link'],
	// };

	// await server.update('did:is:test', didDocument);

	// didResolution = await server.resolve('did:is:test');
	// t.assert(didResolution !== undefined);

	// await server.update('did:is:test', didDocument);

	// didResolution = await server.resolve('did:is:test');
	// console.log(didResolution);
});
