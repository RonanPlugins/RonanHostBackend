import { query } from '../../util/data/database.js';
import NotFoundError from "../../Error/NotFoundError.js";
import DuplicateError from "../../Error/DuplicateError.js";
export default class BaseRepository {
    constructor(createInstance) {
        this.createInstance = createInstance;
    }
    async fetchAll(...q) {
        const rows = await query(`SELECT * FROM ${this.tableName()} ${this.buildWhereClause(q)}`, this.buildValues(q));
        return rows.map(row => this.createInstance(row));
    }
    async fetchOne(...q) {
        const rows = await query(`SELECT * FROM ${this.tableName()} ${this.buildWhereClause(q)} LIMIT 1`, this.buildValues(q)).catch(e => { console.error(e); });
        if (rows && rows.length)
            return rows.length ? this.createInstance(rows[0]) : undefined;
        else
            throw new NotFoundError(this.tableName(), q);
    }
    async insert(data) {
        const keys = Object.keys(data).join(', ');
        const values = Object.values(data);
        const placeholders = values.map(_ => '?').join(', ');
        await query(`INSERT INTO ${this.tableName()} (id, ${keys}) VALUES (?, ${placeholders})`, [data.id, ...values]).catch(e => {
            if (e.errno === 1062)
                throw new DuplicateError(this.tableName(), data, e);
        });
        return this.createInstance((await query(`SELECT * FROM ${this.tableName()} WHERE id = ?`, [data.id]))[0]);
    }
    async update(id, data) {
        const keys = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        await query(`UPDATE ${this.tableName()} SET ${keys} WHERE id = ?`, [...values, id]).catch(e => {
            if (e.errno === 1062)
                throw new DuplicateError(this.tableName(), data, e);
        });
        const result = await query(`SELECT * FROM ${this.tableName()} WHERE id = ?`, [id]);
        if (result && result.length)
            return this.createInstance(result[0]);
        else
            throw new NotFoundError(this.tableName(), id);
    }
    async delete(id) {
        const result = await query(`DELETE FROM ${this.tableName()} WHERE id = ?`, [id]);
        if (result.affectedRows === 0) {
            throw new NotFoundError(this.tableName(), id);
        }
    }
    tableName() {
        return this.constructor.name.toLowerCase();
    }
    buildWhereClause(q) {
        if (q.length) {
            const conditions = [];
            for (const arg of q) {
                if (typeof arg === 'number') {
                    conditions.push('id = ?');
                }
                else if (typeof arg === 'string') {
                    conditions.push('(name = ? OR email = ?)');
                }
            }
            return 'WHERE ' + conditions.join(' OR ');
        }
        else {
            return '';
        }
    }
    buildValues(q) {
        return q.flatMap(x => typeof x === 'string' ? [x, x] : x);
    }
}
