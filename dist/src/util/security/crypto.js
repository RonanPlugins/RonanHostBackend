import bcrypt from "bcrypt";
const saltRounds = 10;
export default class crypto {
    static async hash(content) {
        return await bcrypt.hashSync(content, saltRounds);
    }
    static async compare(content, hash) {
        return await bcrypt.compare(content, hash);
    }
}
