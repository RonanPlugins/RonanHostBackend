import {UUID} from "../../util/functions/UUID.js";
import UserRepository from "../../repositories/UserRepository.js";
import BaseRepository from "../../repositories/Base/BaseRepository.js";
import NotFoundError from "../../Error/NotFoundError.js";

export default class BaseService<
    T extends BaseRepository<K>,
    K extends { required: Record<string, any> }> {
    public repository: T;

    constructor(repository: T) {
        this.repository = repository;
    }

    async insert(entity: K["required"]): Promise<any> {
        return await this.repository.insert(entity);
    }

    async fetchOne(q:any): Promise<K | NotFoundError> {
        return await this.repository.fetchOne(q).catch(e => {throw e});
    }
    async fetchAllBy(column: string, value: any): Promise<K[]> {
        return await this.repository.fetchAllBy(column, value).catch(e => {throw e});
    }
    async fetchAll(...q:any[]): Promise<K[] | NotFoundError> {
        return await this.repository.fetchAll(...q).catch(e => {throw e});
    }
    async count(): Promise<number> {
        return await this.repository.count().catch(e => {throw e});
    }

    async countBy(column: string, value: any): Promise<number> {
        return await this.repository.countBy(column, value).catch(e => {throw e});
    }

    async exists(...q: any[]): Promise<boolean> {
        return await this.repository.exists(...q).catch(e => {throw e});
    }

    async existsBy(column: string, value: any): Promise<boolean> {
        return await this.repository.existsBy(column, value).catch(e => {throw e});
    }

    async fetchOneBy(column: string, value: any): Promise<K> {
        return await this.repository.fetchOneBy(column, value).catch(e => {throw e});
    }

    async fetchRange(offset: number, limit: number): Promise<K[]> {
        return await this.repository.fetchRange(offset, limit).catch(e => {throw e});
    }
    async searchBy(column: string, value: any, options = { caseSensitive: false, wildcards: false }): Promise<K[]> {
        return await this.repository.searchBy(column, value, options).catch(e => {throw e});
    }
    async fetchRangeBy(column: string, value: any, offset: number, limit: number): Promise<K[]> {
        return await this.repository.fetchRangeBy(column, value, offset, limit).catch(e => {throw e});
    }

    public async update(id: UUID, entity: Partial<K>): Promise<K> {
        const current = await this.repository.fetchOne(id);
        if (!current) throw new Error(`Entity with id ${id} not found`);
        const updated = Object.assign(current, entity);
        return await this.repository.update(id, updated);
    }

    async delete(id: UUID): Promise<void> {
        await this.repository.delete(id).catch(e => {throw e});
    }
}