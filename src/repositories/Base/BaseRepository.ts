import { query } from '../../util/data/database.js';
import NotFoundError from "../../Error/NotFoundError.js";
import DuplicateError from "../../Error/DuplicateError.js";
import {UUID} from "../../util/functions/UUID.js";

/**
 * Base repository for CRUD operations on a database table
 * @template T - The type of the object that this repository interacts with,
 * which must have a required property indicating the required fields of the object
 */
export default class BaseRepository<T extends {required: Record<string, any>}> {
    /**
     * Constructor for the base repository
     * @param {function} createInstance - A function that takes a database row and returns an instance of the T object
     */
    constructor(public createInstance: (row: any) => T) {}

    /**
     * The names of fields that are string types and should use string comparison in the database queries
     * @type {string[]}
     */
    protected stringFields: string[] = ['id']

    /**
     * Fetches all objects from the table that match the given query parameters
     * @param {...any} q - Query parameters to filter the objects by
     * @returns {Promise<T[]>} - A promise that resolves with an array of T objects
     */
    async fetchAll(...q):Promise<T[]> {
        const rows = await query(`SELECT * FROM ${this.tableName()} ${this.buildWhereClause(q)}`, this.buildValues(q));
        return rows.map(row => this.createInstance(row));
    }

    /**
     * Fetches all objects from the table that match the given column and value
     * @param {string} column - The column to filter by
     * @param {*} value - The value to filter by
     * @returns {Promise<T[]>} - A promise that resolves with an array of T objects
     */
    async fetchAllBy(column: string, value: any): Promise<T[]> {
        const rows = await query(`SELECT * FROM ${this.tableName()} WHERE ${column} = ?`, [value]);
        return rows.map(row => this.createInstance(row));
    }
    /**
     * Fetches one object from the table that matches the given query parameters
     * @param {...any} q - Query parameters to filter the object by
     * @returns {Promise<T>} - A promise that resolves with a T object, or throws a NotFoundError if no object is found
     * @throws {NotFoundError} - If no object is found that matches the query parameters
     */
    async fetchOne(...q):Promise<T> {
        const rows = await query(`SELECT * FROM ${this.tableName()} ${this.buildWhereClause(q)} LIMIT 1`, this.buildValues(q)).catch(e => {console.error(e)});
        if (rows && rows.length) return rows.length ? this.createInstance(rows[0]) : undefined; else throw new NotFoundError(this.tableName(), q);
    }
    /**
     * Returns the number of objects in the table
     * @returns {Promise<number>} - A promise that resolves with the number of objects in the table
     */
    async count():Promise<number> {
        return parseInt((await query(`SELECT COUNT(*) FROM ${this.tableName()}`))[0].count,10)
    }
    /**
     * Returns the number of objects in the table that match the given column and value
     * @param {string} column - The column to filter by
     * @param {*} value - The value to filter by
     * @returns {Promise<number>} -
     * A promise that resolves with the number of objects in the table that match the column and value
     */
    async countBy(column: string, value: any): Promise<number> {
        const result = await query(`SELECT COUNT(*) as count FROM ${this.tableName()} WHERE ${column} = ?`, [value]);
        return parseInt((await query(`SELECT COUNT(*) as count FROM ${this.tableName()} WHERE ${column} = ?`, [value]))[0].count, 10);
    }
    /**
     * Checks if an object exists in the table that matches the given query parameters
     * @param {...any} q - Query parameters to filter the object by
     * @returns {Promise<boolean>} -
     * A promise that resolves with true if an object exists that matches the query parameters, or false otherwise
     */
    async exists(...q): Promise<boolean> {
        return (await this.fetchAll(...q)).length > 0
    }
    /**
     * Checks if an object exists in the table that matches the given column and value
     * @param {string} column - The column to filter by
     * @param {*} value - The value to filter by
     * @returns {Promise<boolean>} -
     * A promise that resolves with true if an object exists that matches the column and value, or false otherwise
     */
    async existsBy(column: string, value: any): Promise<boolean> {
        return (await this.countBy(column, value)) > 0;
    }

    /**
     * Fetches one object from the table that matches the given column and value
     * @param {string} column - The column to filter by
     * @param {*} value - The value to filter by
     * @returns {Promise<T[]>} - A promise that resolves with an array of T objects that match the column and value
     */
    async fetchOneBy(column: string, value: any): Promise<T> {
        return this.fetchOne({ [column]: value });
    }

    /**
     * Fetches a range of objects from the table
     * @param {number} offset - The offset to start the range at
     * @param {number} limit - The number of objects to fetch
     * @returns {Promise<T[]>} - A promise that resolves with an array of T objects in the specified range
     */
    async fetchRange(offset: number, limit: number): Promise<T[]> {
        const rows = await query(`SELECT * FROM ${this.tableName()} LIMIT ? OFFSET ?`, [limit, offset]);
        return rows.map(row => this.createInstance(row));
    }

    /**
     * Fetches a range of objects from the table that match the given column and value
     * @param {string} column - The column to filter by
     * @param {*} value - The value to filter by
     * @param {number} offset - The offset to start the range at
     * @param {number} limit - The number of objects to fetch
     * @returns {Promise<T[]>} - A promise that resolves with an array of T objects in the specified range that match the column and value
     */
    async fetchRangeBy(column: string, value: any, offset: number, limit: number): Promise<T[]> {
        const rows = await query(`SELECT * FROM ${this.tableName()} WHERE ${column} = ? LIMIT ? OFFSET ?`, [value, limit, offset]);
        return rows.map(row => this.createInstance(row));
    }
    /**
     * Searches for objects in the table that match the given column and value
     * @param {string} column - The column to search in
     * @param {*} value - The value to search for
     * @param {object} options - Additional search options
     * @param {boolean} options.caseSensitive - Whether the search should be case-sensitive (default false)
     * @param {boolean} options.wildcards - Whether to allow wildcards in the search value (default false)
     * @returns {Promise<T[]>} - A promise that resolves with an array of T objects that match the search parameters
     */
    async searchBy(column: string, value: any, options = { caseSensitive: false, wildcards: false }): Promise<T[]> {
        const operator = options.caseSensitive ? 'LIKE BINARY' : 'LIKE';
        const searchValue = options.wildcards ? `%${value}%` : value;
        const rows = await query(`SELECT * FROM ${this.tableName()} WHERE ${column} ${operator} ?`, [searchValue]);
        return rows.map(row => this.createInstance(row));
    }
    /**
     * Inserts an object into the table
     * @param {T['required']} data - The data for the object to be inserted, including all required fields
     * @returns {Promise<T>} - A promise that resolves with the inserted T object
     * @throws {DuplicateError} - If the object being inserted violates a unique constraint in the database
     */
    async insert(data: T['required']): Promise<T> {
        const keys = Object.keys(data).join(', ');
        const values = Object.values(data);
        const placeholders = values.map(_ => '?').join(', ');
        await query(`INSERT INTO ${this.tableName()} (${keys}) VALUES (${placeholders})`, [...values]).catch(e => {
            if (e.errno === 1062) throw new DuplicateError(this.tableName(), data, e); else throw e
        });
        return this.createInstance((await query(`SELECT * FROM ${this.tableName()} WHERE id = ?`, [data.id]))[0])
    }
    /**
     * Updates an object in the table
     * @param {string} id - The ID of the object to update
     * @param {Partial<T>} data - The partial data for the object to be updated
     * @returns {Promise<T>} - A promise that resolves with the updated T object
     * @throws {NotFoundError} - If no object is found with the given ID
     * @throws {DuplicateError} - If the object being updated violates a unique constraint in the database
     */
    async update(id: string, data: Partial<T>): Promise<T> {
        const keys = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        await query(`UPDATE ${this.tableName()} SET ${keys} WHERE id = ?`, [...values, id]).catch(e => {
            if (e.errno === 1062) throw new DuplicateError(this.tableName(), data, e);
        });
        const result = await query(`SELECT * FROM ${this.tableName()} WHERE id = ?`, [id]);
        if (result && result.length) return this.createInstance(result[0]); else throw new NotFoundError(this.tableName(), id);
    }
    /**
     * Deletes an object from the table with the given ID
     * @param {UUID} id - The ID of the object to delete
     * @returns {Promise<void>} - A promise that resolves when the object has been deleted
     * @throws {NotFoundError} - If no object is found with the given ID
     */
    async delete(id: UUID): Promise<void> {
        const result = await query(`DELETE FROM ${this.tableName()} WHERE id = ?`, [id]);
        if (result.affectedRows === 0) {
            throw new NotFoundError(this.tableName(), id);
        }
    }
    /**
     * Gets the name of the table this repository interacts with
     * @returns {string} - The name of the table
     */
    tableName() {
        return this.constructor.name.toLowerCase();
    }
    /**
     * Builds the WHERE clause of a SQL query based on the given query parameters
     * @param {any[]} q - The query parameters to build the WHERE clause from
     * @returns {string} - The WHERE clause of the SQL query
     */
    protected buildWhereClause(q) {
        if (q.length) {
            const conditions = [];
            for (const arg of q) {
                if (typeof arg === 'number') {
                    conditions.push('id = ?');
                } else if (typeof arg === 'string') {
                    this.stringFields.forEach(field => conditions.push(`${field} = ?`));
                }
            }
            return 'WHERE ' + conditions.join(' OR ');
        } else {
            return '';
        }
    }
    /**
     * Builds the values array for a SQL query based on the given query parameters
     * @param {any[]} q - The query parameters to build the value array from
     * @returns {any[]} - The values array for the SQL query
     */
    protected buildValues(q) {
        return q.flatMap(x => typeof x === 'string' ? this.stringFields.map(() => x) : x);
    }
}
