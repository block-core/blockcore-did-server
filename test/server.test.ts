import test from 'ava';
import { Server } from '../src/server.js';

test('Create the server', async (t) => {
	const server = new Server();
	t.assert(server != null);

	await server.start();

	await server.wipe();

	let didResolution = await server.resolve('did:is:test');
	t.assert(didResolution === undefined);

	const didDocument = {
		services: ['link'],
	};

	await server.update('did:is:test', JSON.stringify(didDocument));

	didResolution = await server.resolve('did:is:test');
	t.assert(didResolution !== undefined);

	await server.update('did:is:test', JSON.stringify(didDocument));

	didResolution = await server.resolve('did:is:test');
	console.log(didResolution);
});
