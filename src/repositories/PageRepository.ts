const db = require("../../lib/functions/database/db");
const NotFoundError = require("../Error/NotFoundError");
const Page = require("../Page").default;
const { v4: uuid } = require("uuid");
const DuplicateError = require("../Error/DuplicateError");

export default class PageRepository {
    async find(page_identifier) {
        const result = await db.query('SELECT * FROM page WHERE id = ? OR name = ?', [page_identifier, page_identifier])
            .catch(error => {
                throw error;
            })
        if (result.length === 0) {
            throw new NotFoundError('Page', { page_identifier: page_identifier });
        }
        return new Page(...Object.values(result[0]));
    }
     async findAll() {
        const result = await db.query('SELECT * FROM page')
            .catch(error => {
                throw error;
            })
        if (result.length === 0) {
            throw new NotFoundError();
        }
        return new Page(...Object.values(result[0]));
    }
     async edit(page_identifier, content) {
        const page = await this.find(page_identifier);

        return await db.query(`UPDATE page SET content = ? WHERE id = ?`, [content, page.id])
            .catch(error => {
                throw error;
            })
    }
     async create(name, content) {
        const insertId = uuid();
        await db.query('INSERT INTO page (id, name, content) VALUES (?,?,?)',
            [insertId, name, content])
            .catch(error => {
                if (error.code === "ER_DUP_ENTRY") {
                    const field = error.message.split("'")[1];
                    throw new DuplicateError('Page', {
                        values: {
                            insertId,
                            name,
                            content
                        }
                    }, error)
                }
                throw error;
            })
        return insertId;
    }

}