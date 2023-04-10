export default class UserService {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }
    get userRepository() {
        return this._userRepository;
    }
    set userRepository(value) {
        this._userRepository = value;
    }
    async create(email, firstName, lastName, password) {
        return await this.userRepository.create(email, firstName, lastName, password).catch(e => { throw e; });
    }
    async getByEmail(email) {
        return await this.userRepository.getByEmail(email).catch(e => { throw e; });
    }
    async getById(id) {
        return await this.userRepository.getById(id).catch(e => { throw e; });
    }
    async getCustomerByStripeId(id) {
        return await this.userRepository.getCustomerByStripeId(id).catch(e => { throw e; });
    }
    async getByPteroId(id) {
        return await this.userRepository.getByPteroId(id).catch(e => { throw e; });
    }
    async updateEmail(id, email) {
        return await this.userRepository.updateEmail(id, email).catch(e => { throw e; });
    }
    async delete(id) {
        return await this.userRepository.delete(id).catch(e => { throw e; });
    }
}
//# sourceMappingURL=UserService.js.map