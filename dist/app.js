import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import Pterodactyl from "@avionrx/pterodactyl-js";
import { findAvailableNode } from "./src/util/node/NodeAllocator";
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
    // const newServer = await pteroClient.createServer({
    //     name: "Building",
    //     user: 1,
    //     egg: 1,
    //     image: "quay.io/pterodactyl/core:java",
    //     startup: "java -Xms128M -Xmx128M -jar server.jar",
    //     environment: {
    //         "BUNGEE_VERSION": "latest",
    //         "SERVER_JARFILE": "server.jar"
    //     },
    //     limits: {
    //         "memory": 128,
    //         "swap": 0,
    //         "disk": 512,
    //         "io": 500,
    //         "cpu": 100
    //     },
    //     featureLimits: {
    //         allocations: 0,
    //         databases: 5,
    //         backups: 1
    //     },
    //     //@ts-ignore
    //     allocation: {
    //         default: "",
    //         additional: []
    //     }
    // }).catch(e => {console.error(e)})
    // const newServer = await pteroClient.createServer({
    //     allocation: { additional: [] },
    //     deploy: { locations: [1], dedicatedIp: false, portRange: ["25565", "25566"] },
    //     description: "My new Minecraft server",
    //     egg: 1,
    //     environment: { "SERVER_JARFILE": "server.jar", "MEMORY": "2G" },
    //     externalId: "",
    //     featureLimits: { allocations: 0, databases: 0, backups: 0 },
    //     image: "minecraft",
    //     limits: { memory: 1000, swap: 0, disk: 5000, io: 500, cpu: 0 },
    //     name: "My Minecraft Server",
    //     outOfMemoryKiller: false,
    //     pack: undefined,
    //     skipScripts: false,
    //     startWhenInstalled: false,
    //     startup: "java -Xmx{{MEMORY}} -Xms{{MEMORY}} -jar {{SERVER_JARFILE}} nogui",
    //     user: 3
    // }).catch(err => {console.error(err)});
    const node = await pteroClient.getNodes();
    // const availableAllocation = (await node.getAllocations())
    //     .find(allocation => allocation.assigned === false);
    //
    // if (!availableAllocation) throw new NoNodeAllocationsError(node);
    console.log(findAvailableNode);
    const nodeId = await findAvailableNode(pteroClient, 500);
    console.log("Server listening on port 3006");
    console.log(nodeId);
});
