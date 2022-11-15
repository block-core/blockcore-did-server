// Primarily done to improve testability.
export interface Store {
	open(): Promise<void>;

	close(): Promise<void>;

	put(id: string, document: string): Promise<void>;

	get(id: string): Promise<string | undefined>;

	delete(id: string): Promise<void>;

	wipe(): Promise<void>;
}

export interface Config {
	store: Store;
}

// export interface RequestSchema {
// 	messages: BaseMessage[];
// }

// export interface BaseMessage {
	
// }
