import BaseService from "#baseService";
export default class UserService extends BaseService {
    constructor(repository) {
        super(repository);
        this.repository = repository;
    }
}
