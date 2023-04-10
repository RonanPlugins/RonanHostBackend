import { query } from '#database';

export default class Base<T> {
    constructor(private createInstance: (row: any) => T) {}


    async fetchAll(...q):Promise<T[]> {
        const rows = await query(`SELECT * FROM ${this.tableName()} ${this.buildWhereClause(q)}`, this.buildValues(q));
        return rows.map(row => this.createInstance(row));
    }

    async fetchOne(...q):Promise<T|undefined> {
        const rows = await query(`SELECT * FROM ${this.tableName()} ${this.buildWhereClause(q)} LIMIT 1`, this.buildValues(q)).catch(e => {console.error(e)});
        if (rows && rows.length) return rows.length ? this.createInstance(rows[0]) : undefined; else return undefined;
    }

    tableName() {
        return this.constructor.name.toLowerCase();
    }

    private buildWhereClause(q) {
        if (q.length) {
            const conditions = [];
            for (const arg of q) {
                if (typeof arg === 'number') {
                    conditions.push('id = ?');
                } else if (typeof arg === 'string') {
                    conditions.push('(name = ? OR email = ?)');
                }
            }
            return 'WHERE ' + conditions.join(' OR ');
        } else {
            return '';
        }
    }

    private buildValues(q) {
        return q.flatMap(x => typeof x === 'string' ? [x, x] : x);
    }
}
