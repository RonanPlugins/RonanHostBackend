import express from "express";
import { query } from "../repositories/database.js";
import pteroClient from "../util/external/builds/PterodactylClient.js";
import randomResponse from "../util/message/checkLoggedInFailedResponse.js";
import CustomerRepository from "../repositories/CustomerRepository.js";
import Stripe from "stripe";
import MissingValuesError from "../Error/MissingValuesError.js";
import { findAvailableNode } from "../util/nodes/NodeAllocator";
import Server from "../models/Server";
const stripe = new Stripe(process.env.STRIPE_API_KEY, { apiVersion: "2022-11-15" });
const router = express.Router();
const customerApi = new CustomerRepository();
function checkLoggedIn(req, res, next) {
    if (req?.user)
        next();
    else
        return res.status(403).json({ error: true, message: randomResponse().message });
}
/////////////////////////////////////////
// Protected from non-logged-in users. //
/////////////////////////////////////////
router.post('/create', checkLoggedIn, async function (req, res, next) {
    const session_user_id = req?.user?.id;
    console.log("Create server");
    const { name, ram, version, backups, databases } = req.body || null;
    //NEW
    const missingValues = ['name', 'ram', 'version', 'backups', 'databases'].filter(key => !req.body[key]);
    if (missingValues.length > 0) {
        const MVE = new MissingValuesError(missingValues);
        res.status(MVE.statusCode).body({ error: MVE });
    }
    const featureLimits = {
        allocations: 0, databases: databases, backups: backups
    };
    const customerObj = await customerApi.getCustomerById(req?.user?.id);
    const stripeCus = await stripe.customers.retrieve(customerObj.stripe_customer_id);
    const subscriptions = await stripe.subscriptions.list({
        customer: stripeCus.id,
    });
    const plan = (await query("SELECT * FROM plan WHERE stripe_product_id = ?", [subscriptions.data[0].items.data[0].id]))[0];
    const specRatio = plan.memory / ram;
    const node = await pteroClient.getNode(String((await findAvailableNode(pteroClient, plan.memory))[0]))
        .catch(e => {
        return undefined;
    });
    const availableAllocations = (await node.getAllocations())
        .filter(allocation => allocation.assigned === false)
        .slice(0, plan.allocations + 1);
    const defaultAllocation = availableAllocations[0];
    const additionalAllocations = availableAllocations.slice(1, plan.allocations + 1)
        .map(allocation => allocation.id);
    const newServer = await pteroClient.createServer({
        allocation: { additional: [], default: defaultAllocation.id },
        deploy: { dedicatedIp: false, portRange: ["25565", "25566"], locations: [1] },
        description: "My new Minecraft server",
        egg: 5,
        environment: { "SERVER_JARFILE": "server.jar", "BUILD_NUMBER": version },
        featureLimits: featureLimits,
        image: "quay.io/pterodactyl/core:java",
        limits: { memory: ram, swap: plan.swap, disk: (plan.disk * specRatio), io: plan.io, cpu: (plan.cpu * specRatio) },
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
