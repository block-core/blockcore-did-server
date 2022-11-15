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
}
