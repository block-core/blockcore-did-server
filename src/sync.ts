import { Server } from './server';

export class SyncProcess {
	servers?: string[];

	constructor(server: Server, servers: string | undefined) {
		console.log('SyncProcess created... server:', server);
		console.log('Servers:', servers);
		this.servers = servers?.split(';').filter((i) => i);
        console.log('Parsed Servers:', this.servers);
	}

	async run() {
		console.log(`${new Date()}: Running Sync Process...`);
	}
}
