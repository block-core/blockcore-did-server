import { Config } from './interfaces/index.js';
import { Storage } from './store/storage.js';

console.log(`Starting Blockcore DID Server...`);

export class Server {
	private config: Config;
	// private textEncoder = new TextEncoder();
	private textDecoder = new TextDecoder();

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
		// let request: RequestSchema;
		let request: any;

		try {
			const requestString = this.textDecoder.decode(rawRequest);
			request = JSON.parse(requestString);
		} catch {
			throw new Error('expected request to be valid JSON.');
		}

		console.log(request);

		const response = { status: 'ok' };

		return response;
	}
}
