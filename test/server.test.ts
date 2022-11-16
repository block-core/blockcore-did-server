import test from 'ava';
import { createJWS, createJWT, decodeJWT, ES256KSigner } from 'did-jwt';
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

test('Generate DID Document', async (t) => {
	/** Signs a payload and encodes as JWT (JWS). The key should be in string format (hex, base58, base64). Adds "iat", "iss" to payload and "typ" to header. */
	const privateKey = Uint8Array.from([224, 238, 59, 150, 73, 84, 228, 234, 104, 62, 83, 160, 122, 31, 108, 129, 74, 29, 104, 195, 192, 81, 158, 11, 167, 100, 217, 121, 110, 12, 178, 14]);
	const signer = ES256KSigner(privateKey);

	const didDocument = {
		id: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd',
		verificationMethod: [
			{
				id: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#key-1',
				type: 'EcdsaSecp256k1VerificationKey2019',
				controller: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd',
				publicKeyBase58: 'wAAADkMFQkqxaUPB8jGq4ZoJVsaK9Y5M8riM76zugM6d',
			},
		],
		service: [
			{
				id: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#blockexplorer',
				type: 'BlockExplorer',
				serviceEndpoint: 'https://explorer.blockcore.net',
			},
			{
				id: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#didresolver',
				type: 'DIDResolver',
				serviceEndpoint: 'https://my.did.is',
			},
			{
				id: 'did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#edv',
				type: 'EncryptedDataVault',
				serviceEndpoint: 'https://vault.blockcore.net/',
			},
		],
		authentication: ['did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#key-1'],
		assertionMethod: ['did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#key-1'],
	};

	const payload = {
		type: 'identity',
		operation: 'create',
		sequence: 0,
		rule: 1,
		timestamp: Math.floor(Date.now() / 1000),
		content: didDocument,
	};

	const jwt = await createJWS(payload, signer, { kid: didDocument.verificationMethod[0].id });
	console.log(jwt);

	// const jws = await createJWS(payload, signer, {});
	// console.log(jws);

	const decoded = decodeJWT(jwt);
	console.log(decoded);
});
