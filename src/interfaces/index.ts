import { JsonWebKey } from 'did-resolver';

// Primarily done to improve testability.
export interface Store {
	open(): Promise<void>;

	close(): Promise<void>;

	put(id: string, document: any): Promise<void>;

	get(id: string, sublevel?: string): Promise<any | undefined>;

	delete(id: string, sublevel?: string): Promise<void>;

	wipe(): Promise<void>;
}

export interface Config {
	store: Store;
}

export interface DIDDocument {
	id: string;
	verificationMethod: VerificationMethod[];
	service: Service[];
	authentication: string[] | any[];
	assertionMethod: string[] | any[];
}

export interface VerificationMethod {
	id: string;
	type: string;
	controller: string;
	publicKeyJwk: JsonWebKey;
}

export interface Service {
	id: string;
	type: string;
	serviceEndpoint: string;
}

// export interface IDIDDocumentResolutionMetadata {
// 	error?: string;
// 	proof?: JwtProof2020;
// }

// export interface IDIDDocumentMetadata {
// 	created?: Date;
// 	updated?: Date;
// 	decativated?: boolean;
// 	nextUpdate?: any;
// 	versionId?: string;
// 	nextVerionId?: string;
// 	equivalentId?: string;
// }
