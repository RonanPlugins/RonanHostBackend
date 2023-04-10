import {UUID} from "#UUID";
export default abstract class BaseService<T> {
    protected repository: any

    protected constructor(repository: any) {
        this.repository = repository;
    }

    async create(entity: any): Promise<any> {
        return await this.repository.insert(entity);
    }

    async getById(id: UUID): Promise<any | undefined> {
        return await this.repository.findOne(id);
    }

    async update(id: UUID, entity: Partial<any>): Promise<any> {
        const current = await this.repository.findOne(id);
        if (!current) throw new Error(`Entity with id ${id} not found`);
        const updated = Object.assign(current, entity);
        return await this.repository.update(updated);
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}