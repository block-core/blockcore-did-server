import { Level } from 'level';
import { Store } from '../interfaces';
import { sleep } from '../utils';

export class Storage implements Store {
	db: Level<string, string>;

	constructor(location = 'blockcore-did-server') {
		this.db = new Level(location, { keyEncoding: 'utf8', valueEncoding: 'json' });
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
		return this.db.put(id, document);
	}

	async get(id: string) {
		try {
			return await this.db.get(id);
		} catch (err) {
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
