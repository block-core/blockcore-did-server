import { Server } from './server';

export class SyncProcess {
	servers?: string[];

	constructor(private server: Server, servers: string | undefined) {
		this.servers = servers?.split(';').filter((i) => i.trim());
		console.log('DID Servers:', this.servers);
	}

	async run() {
		console.log(`${new Date()}: Running Sync Process...`);

		if (!this.servers || this.servers.length == 0) {
			console.log('No servers configured for sync.');
			return;
		}

		for (let i = 0; i < this.servers.length; i++) {
			const server = this.servers[i];

			// Load last sequence for this server:
			let sequence = 0;

			console.log(`Sync with: ${server}`);
			console.log('Fetching:', `${server}/1.0/log/0`);

			// Used to populate local instance of Blockcore DID Server:
			const rawResponse = await fetch(`${server}/1.0/log/0`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});

			const content = await rawResponse.json();

			console.log(content.length);

			for (let i = 0; i < content.length; i++) {
				const did = content[i].did;
				const version = content[i].ver;

				console.log('Do we have DID: ', did);
				console.log('Version: ', version);

				const doc = await this.server.resolve(did, version);

				if (doc.didResolutionMetadata.error === 'notFound') {
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
		}
	}
}
