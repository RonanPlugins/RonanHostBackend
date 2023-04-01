import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import Pterodactyl from "@avionrx/pterodactyl-js";
const pteroClient = new Pterodactyl.Builder()
    .setURL(process.env.PTERODACTYL_BASE_URL)
    .setAPIKey(process.env.PTERODACTYL_API_KEY)
    .asAdmin();
// // Imports local
// import { handleStripeWebhook } from './src/controllers/handleStripeWebhook';
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Hello, world!");
});
// app.post('/stripe/webhook', handleStripeWebhook);
app.listen(process.env.APP_PORT, async () => {
    const servers = await pteroClient.getServers();
    const userServers = servers.filter(server => server.user === 1);
    const allocations = await pteroClient.getNodes();
    const newServer = await pteroClient.createServer({
        allocation: { additional: [] },
        deploy: { locations: [1], dedicatedIp: false, portRange: ["25565", "25566"] },
        description: "My new Minecraft server",
        egg: 1,
        environment: { "SERVER_JARFILE": "server.jar", "MEMORY": "2G" },
        externalId: "",
        featureLimits: { allocations: 0, databases: 0, backups: 0 },
        image: "minecraft",
        limits: { memory: 1000, swap: 0, disk: 5000, io: 500, cpu: 0 },
        name: "My Minecraft Server",
        outOfMemoryKiller: false,
        pack: undefined,
        skipScripts: false,
        startWhenInstalled: false,
        startup: "java -Xmx{{MEMORY}} -Xms{{MEMORY}} -jar {{SERVER_JARFILE}} nogui",
        user: 4
    }).catch(err => { console.error(err); });
    console.log("Server listening on port 3006");
    console.log(newServer);
});
