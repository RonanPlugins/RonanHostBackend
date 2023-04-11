export default class PageService {
    constructor(pageRepository) {
        this.pageRepository = pageRepository;
    }
    async find(page_identifier) {
        return await this.pageRepository.find(page_identifier).catch(e => { throw e; });
    }
    async findAll() {
        return await this.pageRepository.findAll().catch(e => { throw e; });
    }
    async edit(page_identifier, content) {
        return await this.pageRepository.edit(page_identifier, content).catch(e => { throw e; });
    }
    async create(name, content = undefined) {
        const page_id = await this.pageRepository.create(name, content).catch(e => { throw e; });
        return await this.find(page_id);
    }
}
