import bcrypt from "bcrypt";
import {Hashed} from "../../@types/crypto";
const saltRounds = 10;

export default class crypto {
    static async hash(content:string):Promise<Hashed<string>> {
        return <Hashed<string>>bcrypt.hashSync(content, saltRounds);
    }

    static async compare(content:string, hash:bcrypt.Hash):Promise<boolean> {
        return await bcrypt.compare(content, hash);
    }
}