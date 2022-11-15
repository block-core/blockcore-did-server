import { Level } from 'level';
import { Store } from '../server';
import { sleep } from '../utils';

export class Storage implements Store {
	db: Level<string, object>;

	constructor(location: string = 'blockcore-did-server') {
		this.db = new Level(location, { keyEncoding: 'utf8', valueEncoding: 'valueEncoding' });
	}

	async open(): Promise<void> {
		while (this.db.status === 'opening' || this.db.status === 'closing') {
			await sleep(150);
		}

		if (this.db.status === 'open') {
			return;
		}

		return this.db.open();
	}

	async close(): Promise<void> {
		while (this.db.status === 'opening' || this.db.status === 'closing') {
			await sleep(150);
		}

		if (this.db.status === 'closed') {
			return;
		}

		return this.db.close();
	}

	put(document: string) {
		throw new Error('Method not implemented.');
	}

	get(did: string) {
		throw new Error('Method not implemented.');
	}

	delete(did: string) {
		throw new Error('Method not implemented.');
	}
}
