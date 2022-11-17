import { decodeJWT } from 'did-jwt';
import { JWTDecoded } from 'did-jwt/lib/JWT.js';
import { Config, DIDDocument, VerificationMethod } from './interfaces/index.js';
import { Storage } from './store/storage.js';
import { BlockcoreIdentityTools, BlockcoreIdentity } from '@blockcore/identity';

console.log(`Starting Blockcore DID Server...`);

export class Server {
	private config: Config;
	// private textEncoder = new TextEncoder();
	private textDecoder = new TextDecoder();
	private tools = new BlockcoreIdentityTools();

	constructor() {
		this.config = {
			store: new Storage(),
		};
	}

	async start() {
		return this.config.store.open();
	}

	async stop() {
		return this.config.store.close();
	}

	// https://github.com/block-core/blockcore-did-resolver
	/** This is a generic resolve method that is to be used by the Universal DID Resolver */
	async resolve(did: string) {
		return this.config.store.get(did);
	}

	async update(did: string, document: string) {
		return this.config.store.put(did, document);
	}

	async wipe() {
		return this.config.store.wipe();
	}

	async request(rawRequest: Uint8Array) {
		let requestBody;
		let jws;

		try {
			requestBody = this.textDecoder.decode(rawRequest);
			console.log(requestBody);
		} catch {
			throw new Error('Expected body to be text.');
		}

		try {
			jws = decodeJWT(requestBody);
			console.log(jws);
		} catch {
			throw new Error('Expected body to be valid JSON Web Token.');
		}

		// Runs a basic validation on the deserialized values.
		this.validateJws(jws);

		this.validateDidDocument(jws.payload['didDocument']);

		this.validateVerificationMethod(jws.header['kid'], Number(jws.payload['version']), jws.payload['didDocument']);

		// this.validateSignature();

		const response = { status: 200, result: 'saved' };

		return response;
	}

	private validateJws(jws: JWTDecoded) {
		if (jws.header.alg !== 'ES256K') {
			throw new Error('The header.alg must be ES256K.');
		}

		if (jws.header['kid'] == null || jws.header['kid'] == '') {
			throw new Error('The header.kid must be set.');
		}

		if (jws.payload['version'] === undefined || jws.payload['version'] === null || jws.payload['version'] === '') {
			throw new Error('The payload.version must be set.');
		}

		if (Number(jws.payload['version']) < 0) {
			throw new Error('The payload.version must be positive number.');
		}

		if (!jws.payload.iat) {
			throw new Error('The payload.iat must be set.');
		}
	}

	validateKey(jwk: JsonWebKey) {
		if (jwk.kty !== 'EC' || jwk.crv !== 'secp256k1') {
			throw new Error('Invalid jwk. kty MUST be EC. crv MUST be secp256k1.');
		}
	}

	private validateDidDocument(didDocument: DIDDocument) {
		if (!didDocument.id) {
			throw new Error('The didDocument.id must be set.');
		}

		if (!didDocument.verificationMethod || didDocument.verificationMethod.length < 1) {
			throw new Error('The didDocument.verificationMethod must be set and contain minimum one entry.');
		}
	}

	private validateVerificationMethod(kid: string, version: number, didDocument: DIDDocument) {
		// const [did, key] = kid.split('#');

		let verificationMethod: VerificationMethod | undefined;

		for (const vm of didDocument.verificationMethod) {
			if (kid.endsWith(vm.id)) {
				verificationMethod = vm;
				break;
			}
		}

		if (!verificationMethod) {
			throw new Error('Verification key needed to verify request was not found in DID Document.');
		}

		this.validateKey(verificationMethod.publicKeyJwk);

		// If the version is 0, we will require that the initial request is signed with a key that verifies the actual DID ID.
		if (version === 0) {
			// Verify that the public key of the verificationMethod found generates the correct DID Subject.
			const identifier = this.tools.getIdentifierFromJsonWebKey(verificationMethod.publicKeyJwk);
			const didId = `${BlockcoreIdentity.PREFIX}:${identifier}`;

			// The derived identfier from the initial key signing the request MUST equal the DID ID.
			if (didId !== didDocument.id) {
				throw new Error('The DID ID does not correspond to the key provided in the request.');
			}
		}
	}
}
