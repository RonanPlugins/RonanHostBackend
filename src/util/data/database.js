import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});
export const query = (sql, params) => new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results, fields) => {
        if (error) {
            reject(error);
        }
        else {
            resolve(results);
        }
    });
});
//# sourceMappingURL=database.js.map