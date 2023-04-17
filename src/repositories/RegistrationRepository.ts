import BaseRepository from "./Base/BaseRepository.js";
import Registration from "../models/Registration.js";
import buildHTML, {sendDynamic} from "../lib/email/build/buildHTML.js";
import {v4} from "../util/functions/UUID.js";

export default class RegistrationRepository extends BaseRepository<Registration> {
    protected stringFields: string[] = ['id', 'stripe_customer_id', 'data'];

    constructor() {
        // @ts-ignore
        super((row: any) => new Registration(...Object.values(row)));
    }
    tableName()  {
        return 'registrations';
    }

    async prepare(data:any, stripe_customer_id: string, email: string, name:string):Promise<Registration> {
        const uid = v4();
        const registration = await super.insert({
            data: JSON.stringify(data), id: uid, stripe_customer_id: stripe_customer_id, email: email, name: name
        })

        const sd = await sendDynamic(email, undefined, "Register an account",
            "d-6c1921db7ebe4f33a3550be7fbd9d425", {"registrationLink":"https://ronanhost.com/register?token="+uid})
            .catch(e => {console.error(e);
                return undefined; })

        return registration || undefined;
    }

}