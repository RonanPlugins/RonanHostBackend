import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import { handleWebhook } from "./src/EventHandler/stripe-webhook-handler.js";
const app = express();
app.post('/webhooks/stripe', handleWebhook);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
import ServerController from './src/models/controllers/ServerController.js';
app.use('/server', ServerController);
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.listen(process.env.APP_PORT, async () => {
    console.log("Server listening on port 3006");
});
