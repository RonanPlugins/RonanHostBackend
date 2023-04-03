import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import { handleWebhook } from "./src/EventHandler/stripe-webhook-handler.js";
// // Imports local
// import { handleStripeWebhook } from './src/controllers/handleStripeWebhook';
const app = express();

app.set("trust proxy", true);
app.use(function (req, res, next) {
    const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3006",
        "https://ronanhost.com",
        "https://api.ronanhost.com",
    ];
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});


app.use(bodyParser.raw({ type: 'application/json' }));
app.post('/webhooks/stripe', handleWebhook);

import BannerController from './src/models/controllers/BannerController.js';
app.use('/banner', BannerController);


app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.get('/status', (req, res) => {
    res.status(200).send({
        "status": "functional",
        "message": "Yes mate I am working. Please leave me alone!",
    }
    )
})

app.listen(process.env.APP_PORT, async () => {
    console.log("Server listening on port 3006");
});
