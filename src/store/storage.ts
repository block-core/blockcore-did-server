import { Level } from 'level';
import { Store } from '../interfaces/index.js';
import { sleep } from '../utils.js';

export class Storage implements Store {
	db: Level<string, string>;

	constructor(location = './blockcore-did-server') {
		this.db = new Level<string, any>(location, { keyEncoding: 'utf8', valueEncoding: 'json' });
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

	async put(id: string, document: string) {
		this.db.batch().put;

		// The latest DID Document is always stored in the primary database, while history is accessible in a sublevel.
		const existingDocument = await this.get(id);

		// Move the existing document to the sublevel.
		if (existingDocument) {
			console.log('FOUND EXISTING DOCUMENT!');
			const doc = JSON.parse(existingDocument);
			const history = this.db.sublevel('history', { valueEncoding: 'json' });

			// Perform the operation in batch to ensure either both operations fails or both succed.
			return this.db.batch([
				{
					type: 'put',
					sublevel: history,
					key: `${id}:${doc.version}`, // This key can be derived from first getting the currently active document and do version - 1.
					value: doc,
				},
				// We don't need to delete existing, we will overwrite it.
				// {
				// 	type: 'del',
				// 	key: id,
				// },
				{
					type: 'put',
					key: id,
					value: JSON.parse(document),
				},
			]);
		} else {
			console.log('NEW DOCUMENT, WRITING NOW!');
			return this.db.put(id, document);
		}
	}

	async batch(items: any[]) {
		return this.db.batch(items);
	}

	async get(id: string) {
		try {
			return await this.db.get(id);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			if (err.code === 'LEVEL_NOT_FOUND') {
				return undefined;
			} else {
				throw err;
			}
		}
	}

	async delete(did: string) {
		return this.db.del(did);
	}

	async wipe() {
		for await (const [key, value] of this.db.iterator({})) {
			console.log('Delete:', key);
			console.log('Data:', value);
			await this.db.del(key);
		}
	}
}
