import express from "express";
import bodyParser from "body-parser";

// Imports local
import { handleStripeWebhook } from './src/controllers/handleStripeWebhook';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.post('/stripe/webhook', handleStripeWebhook);

app.listen(process.env.APP_PORT, () => {
    console.log("Server listening on port 3006");
});