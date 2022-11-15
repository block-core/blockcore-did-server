console.log(`Starting Blockcore DID Server...`);

// Primarily done to improve testability.
export interface Storage {
	open(): Promise<void>;

	close(): Promise<void>;

    put(document: string);

    get(did: string);

    delete(did: string);
}

export type Config = {
	storage: Storage;
};

export class Server {
	constructor() {}

	async start() {}

	async stop() {}
}
