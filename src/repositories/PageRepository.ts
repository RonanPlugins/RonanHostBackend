import BaseRepository from "./Base/BaseRepository.js";
import Page from "../models/Page.js";
import {Memorize, ResetCache, UpdateCacheOnUpdate} from "../util/decorators/Memorize.js";
import {v4} from "../util/functions/UUID.js";

export default class PageRepository extends BaseRepository<Page> {
    protected stringFields: string[] = ['id', 'name'];
    constructor() {
        // @ts-ignore
        super((row: any) => new Page(...Object.values(row)));
    }
    tableName()  {
        return 'page';
    }

    @Memorize()
    async fetchAll(...q): Promise<Page[]> {
        return super.fetchAll(...q);
    }

    @UpdateCacheOnUpdate()
    async delete(id: String): Promise<Boolean> {
        return super.delete(id);
    }

    @Memorize()
    async fetchOne(...q): Promise<Page> {
        return super.fetchOne(...q);
    }
    @UpdateCacheOnUpdate()
    async update(id: string, data: Partial<Page>): Promise<Page> {
        return super.update(id, data);
    }
}