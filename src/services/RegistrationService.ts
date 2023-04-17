import BaseService from "../services/Base/BaseService.js";
import RegistrationRepository from "../repositories/RegistrationRepository.js";
import Registration from "../models/Registration.js";

export default class RegistrationService extends BaseService<RegistrationRepository, Registration> {
    constructor(repository: RegistrationRepository) {
        super(repository);
    }

    async prepare(data:any, stripe_customer_id: string, email: string, name:string):Promise<Registration> {
        return await this.repository.prepare(data, stripe_customer_id, email, name).catch(e => {throw e})
    }

    async finalize(token, username, password, response) {
        return await this.repository.finalize(token, username, password, response).catch(e => {throw e})
    }
}