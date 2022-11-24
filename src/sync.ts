import { didNotFound, Server } from './server';

export class SyncProcess {
	servers?: string[];

	constructor(private server: Server, servers: string | undefined) {
		this.servers = servers?.split(';').filter((i) => i.trim());
		console.log('DID Servers:', this.servers);
	}

	async process(sequence: number, server: string) {
		const url = `${server}/1.0/log/${sequence}`;
		console.log('Fetching:', url);

		// Used to populate local instance of Blockcore DID Server:
		const rawResponse = await fetch(url, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});

		const content = await rawResponse.json();

		console.log(content.length);

		if (content.length == 0) {
			console.log('No more data to process, sync completed.');
			return;
		}

		for (let i = 0; i < content.length; i++) {
			const did = content[i].did;
			const version = content[i].ver;

			console.log('Do we have DID: ', did);
			console.log('Version: ', version);

			const doc = await this.server.resolve(did, version);

			if (didNotFound(doc)) {
				const fetchUrl = `${server}/1.0/identifiers/${did}?versionId=${version}`;

				console.log('Fetch URL: ', fetchUrl);
				// TODO: The LATEST didDocument is not accessible with the version parameter... what to do?
				const rawResponse2 = await fetch(fetchUrl, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				});

				const content = await rawResponse2.json();

				if (content) {
					const jws = content.didDocumentMetadata.proof.jwt;
					await this.server.request(jws);
				}
			}

			// Keep track of the last sequence:
			sequence = content[i].seq;
		}

		console.log('Last sequence: ', sequence);

		// Continue processing until we're done.
		await this.process(sequence, server);
	}

	async run() {
		console.log(`${new Date()}: Running Sync Process...`);

		if (!this.servers || this.servers.length == 0) {
			console.log('No servers configured for sync.');
			return;
		}

		for (let i = 0; i < this.servers.length; i++) {
			const server = this.servers[i];

			if (!server) {
				continue;
			}

			// Load last sequence for this server:
			const sequence = 0;

			await this.process(sequence, server);
		}
	}
}
