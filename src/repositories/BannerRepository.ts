import BaseRepository from "./Base/BaseRepository.js";
import Banner from "../models/Banner.js";
import {Memorize, ResetCache} from "../util/decorators/Memorize.js";

export default class BannerRepository extends BaseRepository<Banner> {
    protected stringFields: string[] = ['id', 'click_url', 'text', 'enabled', 'allow_close', 'minutes_between_popup'];
    constructor() {
        // @ts-ignore
        super((row: any) => new Banner(...Object.values(row)));
    }
    tableName()  {
        return 'website_banners';
    }

    @Memorize()
    async fetchOne(...q): Promise<Banner> {
        return super.fetchOne(...q);
    }

    @Memorize()
    async fetchAllBy(column: string, value: any): Promise<Banner[]> {
        return super.fetchAllBy(column, value);
    }

    @Memorize()
    async fetchAll(...q): Promise<Banner[]> {
        return super.fetchAll(...q);
    }

    @ResetCache()
    async update(id: string, data: Partial<Banner>): Promise<Banner> {
        return super.update(id, data);
    }

}