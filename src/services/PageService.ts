import PageRepository from "../repositories/PageRepository";
import Page from "../models/Page";

export default class PageService {
    private pageRepository: PageRepository;

    constructor(pageRepository: PageRepository) {
        this.pageRepository = pageRepository;
    }

    async find(page_identifier):Promise<Page|undefined> {
        return await this.pageRepository.find(page_identifier).catch(e => { throw e })
    }
    async findAll():Promise<Page|undefined> {
        return await this.pageRepository.findAll().catch(e => { throw e })
    }

    async edit(page_identifier, content):Promise<Page|undefined> {
        return await this.pageRepository.edit(page_identifier, content).catch(e => { throw e })
    }

    async create(name, content = undefined):Promise<Page|undefined> {
        const page_id = await this.pageRepository.create(name, content).catch(e => { throw e })
        return await this.find(page_id);
    }
}