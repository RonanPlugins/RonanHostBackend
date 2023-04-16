import BaseService from "../services/Base/BaseService.js";
import UserRepository from "../repositories/UserRepository.js";
import User from "../models/User.js";

export default class UserService extends BaseService<UserRepository, User> {
    constructor(repository: UserRepository) {
        super(repository);
    }

    async create(data:User["required"]):Promise<User> {
        return await this.repository.create(data).catch(e => {throw e})
    }

    async createFromStripeCallback(data: User["required"], stripe_customer_id): Promise<User> {
        return await this.repository.createFromStripeCallback(data, stripe_customer_id).catch(e => {throw e})
    }
}