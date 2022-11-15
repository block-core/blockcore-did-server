// Primarily done to improve testability.
export interface Store {
	open(): Promise<void>;

	close(): Promise<void>;

	put(document: string);

	get(did: string);

	delete(did: string);
}

export type Config = {
	store?: Store;
};
