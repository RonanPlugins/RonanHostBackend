export default class BaseService {
    constructor(repository) {
        this.repository = repository;
    }
    async create(entity) {
        return await this.repository.insert(entity);
    }
    async getById(id) {
        return await this.repository.findOne(id);
    }
    async update(id, entity) {
        const current = await this.repository.findOne(id);
        if (!current)
            throw new Error(`Entity with id ${id} not found`);
        const updated = Object.assign(current, entity);
        return await this.repository.update(updated);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
}
