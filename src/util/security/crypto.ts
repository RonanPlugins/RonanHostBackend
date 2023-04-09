import bcrypt from "bcrypt";
const saltRounds = 10;

export default class crypto {
    static async hash(content:string) {
        return await bcrypt.hashSync(content, saltRounds);
    }

    static async compare(content:string, hash:bcrypt.Hash):Promise<boolean> {
        return await bcrypt.compare(content, hash);
    }
}