import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv"
import {strategy} from './Strategies/local.js'

import passport from "passport";

import {AppConfig, config as configLoader} from "../config.js";
import session from "express-session";
import mysqlSession from "express-mysql-session";
import {handleWebhook} from "./Events/stripe-webhook-handler.js";
import ServerController from './controllers/ServerController.js';
import userController from "./controllers/UserController.js";
import pageController from "./controllers/PageController.js";
import crypto from "./util/security/crypto.js";
import {
    getGrantedPermissions,
    getGrantedPermissionsNames,
    getPermissionInteger,
    Permissions
} from "./enum/Permissions.js";

dotenv.config();
const config:AppConfig = configLoader ?? (() =>
{ console.error("You are missing the config.yml file!\nExiting..."); process.exit(1); return undefined; })();

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
app.use((req:any, res:any, next:any) => {
    const origin = req.headers.origin;
    if (config.allowedOrigins.includes(origin)) {
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

app.use('/server', ServerController);
app.use('/user', userController);
app.use('/page', pageController)


app.get("/", (req:any, res:any) => {
    res.send("Hello, world!");
});

app.listen(config.app_port, async () => {
    console.log("Server listening on port "+config.app_port);
});

process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  // some other closing procedures go here
  process.exit(0);
});