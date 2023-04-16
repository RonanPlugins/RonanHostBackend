import express from "express";
import { Permissions } from "../enum/Permissions.js";
import { query } from "../util/data/database.js";
import randomResponse from "../util/message/checkLoggedInFailedResponse.js";
import pteroClient from "../util/external/builds/PterodactylClient.js"
import {findAvailableNode, getTotalAllocatedMemoryByNode} from "../util/nodes/NodeAllocator.js";
const router = express.Router();

const checkLoggedInAndHasPermission = (neededPermission: Permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ error: true, message: "Not Logged in" });
        }
        if (req.user.permissions_integer === -1) {
            return next()
        }
        if (req.user && (req.user.permissions_integer >= neededPermission ||req.user.permissions_integer === "-1")) {
            next();
        } else {
            return res.status(403).json({ error: true, message: randomResponse().message });
        }
    };
};

const getTableStatus = async (tableName) => {
    const [rows] = await query(`SHOW TABLE STATUS LIKE '${tableName}'`);
    return { total: rows.Rows };
};

router.get("/users", checkLoggedInAndHasPermission(Permissions.STATS_READ), async function (req, res, next) {
    const data = await getTableStatus('user');
    res.send(data);
});
router.get("/plans", checkLoggedInAndHasPermission(Permissions.STATS_READ), async function (req, res, next) {
    const data = await getTableStatus('plan');
    res.send(data);
});
router.get("/servers", checkLoggedInAndHasPermission(Permissions.STATS_READ), async function (req, res, next) {
    const servers = await pteroClient.getServers()
    res.send({ total: servers.length });
});
router.get("/nodes",async function (req, res, next) {
    const nodes = await getTotalAllocatedMemoryByNode(pteroClient)
    res.send({ total: nodes.length, nodes: nodes });
});
router.get("/locations", checkLoggedInAndHasPermission(Permissions.STATS_READ), async function (req, res, next) {
    const locations = await pteroClient.getLocations()
    res.send({ total: locations.length });
});
router.get("/all", checkLoggedInAndHasPermission(Permissions.STATS_READ), async function (req, res, next) {
    const users = (await getTableStatus('user')).total;
    const plans = (await getTableStatus('plan')).total;
    const servers = await pteroClient.getServers()
     const nodes = await getTotalAllocatedMemoryByNode(pteroClient)
    const locations = await pteroClient.getLocations()
    
    res.send({ users,plans,servers:servers.length,nodes:nodes,locations:locations.length });
});
export default router;