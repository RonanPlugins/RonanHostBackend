import BaseService from "#baseService";
import {User} from "#models/User";
import UserRepository from "#repositories/UserRepository";
import {UUID} from "#UUID";

export default class UserService extends BaseService<User, UserRepository> {
    private repository: UserRepository;
    constructor(repository: UserRepository) {
        super(repository);
        this.repository = repository;
    }
}