import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import { handleWebhook } from "./src/EventHandler/stripe-webhook-handler.js";
// // Imports local
// import { handleStripeWebhook } from './src/controllers/handleStripeWebhook';
const app = express();
app.use(bodyParser.raw({ type: 'application/json' }));
app.post('/webhooks/stripe', handleWebhook);
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
app.listen(process.env.APP_PORT, async () => {
    console.log("Server listening on port 3006");
});
