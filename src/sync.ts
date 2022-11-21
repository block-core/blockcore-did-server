import { Server } from './server';

export class SyncProcess {
	servers?: string[];

	constructor(private server: Server, servers: string | undefined) {
		this.servers = servers?.split(';').filter((i) => i);
		console.log('DID Servers:', this.servers);
	}

	async run() {
		console.log(`${new Date()}: Running Sync Process...`);

		if (!this.servers) {
			console.log('No servers configured for sync.');
			return;
		}

		for (let i = 0; i < this.servers.length; i++) {
			const server = this.servers[i];
			console.log(`Sync with: ${server}`);

			const didDocument = await this.server.resolve('did');
			console.log(didDocument);
		}
	}
}
