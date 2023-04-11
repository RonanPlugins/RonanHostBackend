export default class BaseService {
    constructor(repository) {
        this.repository = repository;
    }
    async insert(entity) {
        return await this.repository.insert(entity);
    }
    async fetchOne(q) {
        return await this.repository.fetchOne(q).catch(e => { throw e; });
    }
    async fetchAll(...q) {
        return await this.repository.fetchAll(...q);
    }
    async update(id, entity) {
        const current = await this.repository.fetchOne(id);
        if (!current)
            throw new Error(`Entity with id ${id} not found`);
        const updated = Object.assign(current, entity);
        return await this.repository.update(id, updated);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
}
