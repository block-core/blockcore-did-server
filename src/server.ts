import { Config } from './interfaces';
import { Storage } from './store/storage';

console.log(`Starting Blockcore DID Server...`);

export class Server {
	constructor(private config: Config = {}) {
		if (!config.store) {
			config.store = new Storage();
		}
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
}
