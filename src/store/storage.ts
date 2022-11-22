import { Level } from 'level';
import { DIDDocumentStore, DocumentEntry, DocumentUpdate } from '../interfaces/index.js';
import { sleep } from '../utils.js';
import * as lexint from 'lexicographic-integer-encoding';

export class Storage implements DIDDocumentStore {
	db: Level<string | number, DocumentEntry | any>;
	sequence = 0;

	constructor(location: string) {
		this.db = new Level<string | number, DocumentEntry | any>(location, { keyEncoding: 'utf8', valueEncoding: 'json' });
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

	async initialize() {
		const lastItem = await this.db
			.sublevel('update')
			.keys({ reverse: true, limit: 1, keyEncoding: lexint.default('hex') })
			.all();

		if (lastItem != null && lastItem.length > 0) {
			this.sequence = Number(lastItem[0]);
		} else {
			this.sequence = 0;
		}

		console.log('Current sequence: ', this.sequence);
	}

	async put(id: string, document: DocumentEntry) {
		// The latest DID Document is always stored in the primary database, while history is accessible in a sublevel.
		const existingDocument = await this.get(id);

		const update = this.db.sublevel<string, DocumentUpdate>('update', { keyEncoding: lexint.default('hex'), valueEncoding: 'json' });

		const updateDoc: DocumentUpdate = {
			did: id,
			version: Number(document.jws.payload['version']),
		};

		this.sequence += 1;
		const seq = this.sequence;

		// Move the existing document to the sublevel.
		if (existingDocument) {
			const history = this.db.sublevel('history', { keyEncoding: 'utf8', valueEncoding: 'json' });
			const historyId = `${id}:${existingDocument.jws.payload['version']}`;

			// Perform the operation in batch to ensure either both operations fails or both succed.
			return this.db.batch([
				{
					type: 'put',
					sublevel: history,
					key: historyId, // This key can be derived from first getting the currently active document and do version - 1.
					value: existingDocument,
				},
				{
					type: 'put',
					key: id,
					value: document,
				},
				{
					type: 'put',
					sublevel: update,
					key: seq,
					value: updateDoc,
				},
			]);
		} else {
			// Perform the operation in batch to ensure either both operations fails or both succed.
			return this.db.batch([
				{
					type: 'put',
					key: id,
					value: document,
				},
				{
					type: 'put',
					sublevel: update,
					key: seq,
					value: updateDoc,
				},
			]);
		}
	}

	async get(id: string, sublevel?: string): Promise<DocumentEntry | undefined> {
		try {
			if (sublevel) {
				const entry = await this.db.sublevel(sublevel).get<string, DocumentEntry>(id, { keyEncoding: 'utf8', valueEncoding: 'json' });
				return entry;
			} else {
				const entry = await this.db.get<string, DocumentEntry>(id, { keyEncoding: 'utf8', valueEncoding: 'json' });
				return entry;
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

	database(): Level<string | number, DocumentEntry> {
		return this.db;
	}
}
