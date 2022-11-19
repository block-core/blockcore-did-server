import { decodeJWT, verifyJWS } from 'did-jwt';
import { JWTDecoded } from 'did-jwt/lib/JWT.js';
import { JsonWebKey, DIDResolutionResult, DIDDocument, VerificationMethod } from 'did-resolver';
import { Config } from './interfaces/index.js';
import { Storage } from './store/storage.js';
import { BlockcoreIdentityTools, BlockcoreIdentity } from '@blockcore/identity';

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
	async resolve(did: string, version?: number): Promise<DIDResolutionResult> {
		if (!did.startsWith(BlockcoreIdentity.PREFIX)) {
			return {
				didDocument: null,
				didDocumentMetadata: {},
				didResolutionMetadata: { error: 'unsupportedDidMethod' },
			};
		}

		let jws: JWTDecoded | undefined;

		if (version != null) {
			const queryId = `${did}:${version}`;
			jws = await this.config.store.get(queryId, 'history');
		} else {
			jws = await this.config.store.get(did);
		}

		if (!jws) {
			return {
				didDocument: null,
				didDocumentMetadata: {},
				didResolutionMetadata: { error: 'notFound' },
			};
		}

		const result: DIDResolutionResult = {
			didDocument: jws.payload['didDocument'],
			didDocumentMetadata: {
				versionId: String(jws.payload['version']),
				nextVersionId: String(Number(jws.payload['version']) + 1),
				updated: String(jws.payload.iat),
				// created: jws.payload.iat,
				deactivated: false,
				proof: `${jws.data}.${jws.signature}`,
			},
			didResolutionMetadata: {
				contentType: 'application/did+json',
				retrieved: this.tools.getTimestampInSeconds(),
			},
		};

		return result;
	}

	async update(did: string, document: JWTDecoded) {
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
		} catch {
			throw new Error('Expected body to be text.');
		}

		try {
			jws = decodeJWT(requestBody);
		} catch {
			throw new Error('Expected body to be valid JSON Web Token.');
		}

		this.validateJws(jws);

		const did = this.getIdFromKid(jws.header['kid']);
		const didDocument = jws.payload['didDocument'];
		const version = jws.payload['version'];
		const kid = jws.header['kid'];

		let item: DIDResolutionResult;
		let verificationMethodID: VerificationMethod;
		let verificationMethod: VerificationMethod;

		// The didDocument can be empty if the request is a delete one.
		if (didDocument != null) {
			this.validateDidDocument(didDocument);

			// The first key in verificationMethod must ALWAYS be the key used to derive the DID ID.
			// TODO: Consider simply doing a basic comparison between existing saved document and incoming document, not needing to perform too much operations.
			verificationMethodID = this.validateIdentifier(didDocument);
		}

		// If the version is 0, we don't have an existing DID Document to resolve.
		if (Number(version) === 0) {
			// Validate again here since users can submit empty version 0 requests.
			if (didDocument == null) {
				throw new Error('The didDocument must be set for initial creation of a new DID Document.');
			}

			// Get the verification method specified in the kid directly from payload when creating DID Document for the first time.
			verificationMethod = this.getAuthenticationMethod(kid, didDocument);

			// Ensure that the first verificationMethod and authentication is the same upon initial create.
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			if (!this.equalKeys(verificationMethod.publicKeyJwk!, verificationMethodID!.publicKeyJwk!)) {
				throw new Error('The first verificationMethod key must be the same as the kid for DID Document creation operation.');
			}

			item = await this.resolve(did);

			// Make sure we receive an notFound response
			if (item.didResolutionMetadata?.error !== 'notFound') {
				throw new Error('The DID Document already exists. You must increase the version number. Resolve the existing DID Document to get latest version id.');
			}

			// TODO: Check if already exists in database.
		} else {
			item = await this.resolve(did);

			if (item == null) {
				throw new Error(`The DID Document does not exists on this server, you must set version to 0 to create a new DID Document.`);
			}

			if (item.didDocumentMetadata.deactivated) {
				throw new Error('The DID Document has been deactivated and cannot be updated any longer.');
			}

			if (item.didDocument == null) {
				throw new Error('The DID Document has been deactivated and cannot be updated any longer.');
			}

			// Verify that the version is same as next version:
			if (Number(item.didDocumentMetadata.nextVersionId) !== Number(version)) {
				throw new Error('The version of the updated DID Document must correspond to the nextVersionId of the current active DID Document.');
			}

			// Get the verification method specified in the kid from the current active document.
			verificationMethod = this.getAuthenticationMethod(kid, item.didDocument);
		}

		// Validate the signature of the selected verification method used in the kid and the raw jws payload.
		this.validateSignature(requestBody, verificationMethod);

		// Store the decoded document:
		await this.update(did, jws);

		const response = { status: 200, result: 'saved' };

		return response;
	}

	private getIdFromKid(kid: string): string {
		const [id] = kid.split('#');
		return String(id);
	}

	private equalKeys(key1: JsonWebKey, key2: JsonWebKey) {
		return key1.x === key2.x && key1.y === key1.y && key1.crv === key2.crv;
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

	private async validateSignature(jws: string, verificationMethod: VerificationMethod) {
		const result = await verifyJWS(jws, verificationMethod);
		return result;
	}

	private validateKey(jwk: JsonWebKey | undefined) {
		if (jwk == null) {
			throw new Error('Invalid jwk. kty MUST be EC. crv MUST be secp256k1.');
		}

		if (jwk.kty !== 'EC' || jwk.crv !== 'secp256k1') {
			throw new Error('Invalid jwk. kty MUST be EC. crv MUST be secp256k1.');
		}
	}

	private validateDidDocument(didDocument: DIDDocument) {
		if (!didDocument.id) {
			throw new Error('The didDocument.id must be set.');
		}

		if (!didDocument.authentication || didDocument.authentication.length < 1) {
			throw new Error('The didDocument.authentication must be set and contain minimum one entry.');
		}
	}

	/** If the version is 0, we will require that the initial request is signed with a key that verifies the actual DID ID. */
	private validateIdentifier(didDocument: DIDDocument) {
		if (didDocument.verificationMethod == null || didDocument.verificationMethod.length == 0 || didDocument.verificationMethod[0] == null) {
			throw new Error('The list of verificationMethod must be 1 or more.');
		}

		// Get the first verificationMethod, which must always be there.
		const verificationMethod = didDocument.verificationMethod[0];
		this.validateKey(verificationMethod.publicKeyJwk);

		// Verify that the public key of the verificationMethod found generates the correct DID Subject.
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const identifier = this.tools.getIdentifierFromJsonWebKey(verificationMethod.publicKeyJwk!);
		const didId = `${BlockcoreIdentity.PREFIX}:${identifier}`;

		// The derived identfier from the initial key signing the request MUST equal the DID ID.
		if (didId !== didDocument.id) {
			throw new Error('The DID ID does not correspond to the key provided in the request.');
		}

		return verificationMethod;
	}

	/** Attempts to find the verificationMethod (key) specified in the kid among items in the "authentcation" list. */
	private getAuthenticationMethod(kid: string, didDocument: DIDDocument): VerificationMethod {
		if (didDocument == null) {
			throw new Error('Verification key needed to verify request was not found in DID Document.');
		}

		let verificationMethod: VerificationMethod | undefined;
		let keyId = '';

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		for (const vm of didDocument.authentication!) {
			// Check if the key is a reference of full value:
			if (typeof vm === 'string') {
				if (kid.endsWith(vm)) {
					keyId = vm;
					break;
				}
			} else {
				if (kid.endsWith(vm.id)) {
					verificationMethod = vm;
					break;
				}
			}
		}

		// If the vm that was found is string, we need to look up in the verificationMethod list.
		if (keyId) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			for (const vm of didDocument.verificationMethod!) {
				if (keyId.endsWith(vm.id)) {
					verificationMethod = vm;
					break;
				}
			}
		}

		if (!verificationMethod) {
			throw new Error('Verification key needed to verify request was not found in DID Document.');
		}

		return verificationMethod;
	}
}
