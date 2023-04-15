import express from "express";
import { Permissions } from "../enum/Permissions.js";
import { query } from "../util/data/database.js";
import randomResponse from "../util/message/checkLoggedInFailedResponse.js";
import pteroClient from "../util/external/builds/PterodactylClient.js"
import { Memorize } from "util/decorators/Memorize.js";
const router = express.Router();

const checkLoggedInAndHasPermission = (neededPermission: Permissions) => {
    return (req, res, next) => {
        if (req && req.user && req.user.permissions >= neededPermission) {
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
router.get("/nodes", checkLoggedInAndHasPermission(Permissions.STATS_READ), async function (req, res, next) {
    const nodes = await pteroClient.getNodes()
    res.send({ total: nodes.length });
});
router.get("/locations", checkLoggedInAndHasPermission(Permissions.STATS_READ), async function (req, res, next) {
    const locations = await pteroClient.getLocations()
    res.send({ total: locations.length });
});

export default router;
