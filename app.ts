import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv"
dotenv.config()

import {AppConfig, config as configLoader} from "./config.js";
const config:AppConfig = configLoader ?? (() =>
{ console.error("You are missing the config.yml file!\nExiting..."); process.exit(1); return undefined; })();

import session from "express-session";
import mysqlSession from "express-mysql-session";
import {handleWebhook} from "./src/Events/stripe-webhook-handler.js";

const app = express();

const options = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
};

const MySQLStore = mysqlSession(session);

const sessionStore = new MySQLStore(options);

app.use( session({
        key: process.env.session_key,
        secret: process.env.session_secret,
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
    }));

app.set("trust proxy", true);
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (config().allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

app.post('/webhooks/stripe', bodyParser.raw({ type: 'application/json' }), handleWebhook);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import ServerController from './src/controllers/ServerController.js';
app.use('/server', ServerController);


app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.listen(config.app_port, async () => {
    console.log("Server listening on port 3006");
});