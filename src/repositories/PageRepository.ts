import BaseRepository from "./Base/BaseRepository.js";
import Page from "../models/Page.js";

export default class PageRepository extends BaseRepository<Page>{
    constructor() {
        // @ts-ignore
        super((row: any) => new Page(...Object.values(row)));
    }

    tableName()  {
        return 'page';
    }
}