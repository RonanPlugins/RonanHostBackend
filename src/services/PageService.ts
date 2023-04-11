import BaseService from "./Base/BaseService.js";
import PageRepository from "../repositories/PageRepository.js";
import Page from "../models/Page.js";

export default class PageService extends BaseService<PageRepository, Page> {
    constructor(repository: PageRepository) {
        super(repository);
    }
}