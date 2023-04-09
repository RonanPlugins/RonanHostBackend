import UserRepository from "../repositories/UserRepository";
import {User} from "../models/User";
import {UUID} from "../types/UUID";

class UserService {
    private _userRepository: UserRepository;
    constructor(userRepository: UserRepository) {
        this._userRepository = userRepository;
    }
    get userRepository(): UserRepository {
        return this._userRepository;
    }
    set userRepository(value: UserRepository) {
        this._userRepository = value;
    }

    async create(email: string, firstName:string, lastName:string): Promise<User> {
        return await this.userRepository.create(email, firstName, lastName).catch(e => {throw e})
    }

    async getByEmail(email: string): Promise<User | undefined> {
        return await this.userRepository.getByEmail(email).catch(e => {throw e})
    }

    async getById(id: UUID): Promise<User | undefined> {
        return await this.userRepository.getById(id).catch(e => {throw e})
    }

    async getCustomerByStripeId(id: string): Promise<User | undefined> {
        return await this.userRepository.getCustomerByStripeId(id).catch(e => {throw e})
    }

    async getByPteroId(id: string|number): Promise<User | undefined> {
        return await this.userRepository.getByPteroId(id).catch(e => {throw e})
    }

    async updateEmail(id: number, email: string): Promise<void> {
        return await this.userRepository.updateEmail(id, email).catch(e => {throw e})
    }
    async delete(id: number): Promise<void> {
        return await this.userRepository.delete(id).catch(e => {throw e})
    }
}