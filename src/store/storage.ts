import { JWTDecoded } from 'did-jwt/lib/JWT.js';
import { Level } from 'level';
import { DIDDocumentStore } from '../interfaces/index.js';
import { sleep } from '../utils.js';

export class Storage implements DIDDocumentStore {
	db: Level<string, JWTDecoded>;

	constructor(location = './blockcore-did-server') {
		this.db = new Level<string, JWTDecoded>(location, { keyEncoding: 'utf8', valueEncoding: 'json' });
	}

	async open() {
		while (this.db.status === 'opening' || this.db.status === 'closing') {
			await sleep(150);
		}

		if (this.db.status === 'open') {
			return;
		}

		return this.db.open();
	}

	async close() {
		while (this.db.status === 'opening' || this.db.status === 'closing') {
			await sleep(150);
		}

		if (this.db.status === 'closed') {
			return;
		}

		return this.db.close();
	}

	async put(id: string, document: JWTDecoded) {
		this.db.batch().put;

		// The latest DID Document is always stored in the primary database, while history is accessible in a sublevel.
		const existingDocument = await this.get(id);

		// Move the existing document to the sublevel.
		if (existingDocument) {
			const history = this.db.sublevel('history', { keyEncoding: 'utf8', valueEncoding: 'json' });
			const historyId = `${id}:${existingDocument.payload.version}`;

			// Perform the operation in batch to ensure either both operations fails or both succed.
			return this.db.batch([
				{
					type: 'put',
					sublevel: history,
					key: historyId, // This key can be derived from first getting the currently active document and do version - 1.
					value: existingDocument,
				},
				// We don't need to delete existing, we will overwrite it.
				// {
				// 	type: 'del',
				// 	key: id,
				// },
				{
					type: 'put',
					key: id,
					value: document,
				},
			]);
		} else {
			return this.db.put(id, document);
		}
	}

	async batch(items: any[]) {
		return this.db.batch(items);
	}

	async get(id: string, sublevel?: string): Promise<any> {
		try {
			if (sublevel) {
				return await this.db.sublevel(sublevel).get(id, { keyEncoding: 'utf8', valueEncoding: 'json' });
			} else {
				return await this.db.get(id, { keyEncoding: 'utf8', valueEncoding: 'json' });
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			if (err.code === 'LEVEL_NOT_FOUND') {
				return undefined;
			} else {
				throw err;
			}
		}
	}

	/** This is to be used by server administrators. */
	async delete(did: string, sublevel?: string) {
		if (sublevel) {
			return this.db.sublevel(sublevel).del(did);
		} else {
			return this.db.del(did);
		}
	}

	async wipe() {
		for await (const [key, value] of this.db.iterator({})) {
			console.log('Delete:', key);
			console.log('Data:', value);
			await this.db.del(key);
		}
	}
}
