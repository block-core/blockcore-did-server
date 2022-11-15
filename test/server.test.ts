import test from 'ava';
import { Server } from '../src/';

test('Create the server', async (t) => {
	const server = new Server();
	t.assert(server != null);

	await server.start();

	const didResolution = await server.resolve('did:is:test');
	t.assert(didResolution === undefined);
});
