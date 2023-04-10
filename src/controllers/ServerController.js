import express from "express";
import { query } from "#data/database";
import randomResponse from "../util/message/checkLoggedInFailedResponse.js";
import UserRepository from "../repositories/UserRepository.js";
import Stripe from "stripe";
import MissingValuesError from "../Error/MissingValuesError.js";
import { findAvailableNode } from "../util/nodes/NodeAllocator.js";
import Server from "../models/Server.js";
// const pteroClient = new Pterodactyl.Builder()
//     .setURL(process.env.PTERODACTYL_BASE_URL)
//     .setAPIKey(process.env.PTERODACTYL_API_KEY)
//     .asAdmin();
import pteroClient from "../util/external/builds/PterodactylClient.js";
const stripe = new Stripe(process.env.STRIPE_API_KEY, { apiVersion: "2022-11-15" });
const router = express.Router();
export default router;
const userApi = new UserRepository();
function checkLoggedIn(req, res, next) {
    if (req?.user)
        next();
    else
        return res.status(403).json({ error: true, message: randomResponse().message });
}
//////////////////////////////////////////
// Protected from non-logged-in users. //
////////////////////////////////////////
router.post('/create', checkLoggedIn, async function (req, res, next) {
    const session_user_id = req?.user?.id;
    console.log("Create server");
    const { name, ram, version, disk, cpu, allocations = 0, backups, databases } = req.body || null;
    //NEW
    const missingValues = ['name', 'ram', 'version', 'disk', 'cpu', 'backups', 'databases'].filter(key => !req.body[key]);
    if (missingValues.length > 0) {
        const MVE = new MissingValuesError(missingValues);
        res.status(MVE.statusCode).body({ error: MVE });
    }
    const featureLimits = {
        allocations: 0, databases: databases, backups: backups
    };
    const customerObj = await userApi.getById(req?.user?.id);
    const stripeCus = await stripe.customers.retrieve(customerObj.stripe_customer_id);
    const subscriptions = await stripe.subscriptions.list({
        customer: stripeCus.id,
    });
    const plan = (await query("SELECT * FROM plan WHERE stripe_product_id = ?", [subscriptions.data[0].items.data[0].id]))[0];
    const node = await pteroClient.getNode(String((await findAvailableNode(pteroClient, plan.memory))[0]))
        .catch(e => {
        return undefined;
    });
    const availableAllocations = (await node.getAllocations())
        .filter(allocation => allocation.assigned === false)
        .slice(0, plan.allocations + 1);
    const defaultAllocation = availableAllocations[0];
    const additionalAllocations = availableAllocations.slice(1, allocations)
        .map(allocation => allocation.id);
    const newServer = await pteroClient.createServer({
        allocation: { additional: [], default: defaultAllocation.id },
        deploy: { dedicatedIp: false, portRange: ["25565", "25566"], locations: [1] },
        description: "My new Minecraft server",
        egg: 5,
        environment: { "SERVER_JARFILE": "server.jar", "BUILD_NUMBER": version },
        featureLimits: featureLimits,
        image: "quay.io/pterodactyl/core:java",
        limits: { memory: ram, swap: plan.swap, disk: disk, io: plan.io, cpu: cpu },
        name: name,
        outOfMemoryKiller: false,
        skipScripts: false,
        startWhenInstalled: false,
        startup: "java -Xmx{{SERVER_MEMORY}} -Xms{{SERVER_MEMORY}} -jar {{SERVER_JARFILE}} nogui",
        user: 1
    }).catch((error) => {
        res.send(error);
        console.log(error);
    });
    // @ts-ignore
    res.send({ success: true, server: new Server(...Object.values(newServer)) });
});
// Pass updates as JSON.stringify()
// Example for updates
//
router.post('/update', checkLoggedIn, async function (req, res, next) {
    const session_user_id = req?.user?.id;
    console.log("Create server");
    const missingValues = ['updates', 'server'].filter(key => !req.body[key]);
    if (missingValues.length > 0) {
        const MVE = new MissingValuesError(missingValues);
        res.status(MVE.statusCode).body({ error: MVE });
    }
    const server = req.body.server;
    const updatesArray = JSON.parse(req.body.updates);
    const serFu = await pteroClient.getServer(String(server));
    for (const update of updatesArray) {
        for (const key in update) {
            switch (key) {
                case 'ram':
                    await serFu.setMemory(Number(update.ram));
                    break;
                case 'disk':
                    await serFu.setDisk(Number(update.disk));
                    break;
                case 'cpu':
                    await serFu.setCPU(Number(update.cpu));
                    break;
                case 'backups':
                    await serFu.setDatabaseAmount(Number(update.databases));
                    break;
                // add cases for other properties as needed
            }
        }
    }
    res.status(200).json({ success: true });
});
