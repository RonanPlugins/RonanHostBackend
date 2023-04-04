import express from "express";
import { query } from "../../repositories/database.js";
import { pteroClient } from "../../../src/util/node/PterodactylClient.js";

const router = express.Router();

function checkLoggedIn(req, res, next) {
    if (req?.user) {
        next();
    } else {
        return res.status(403).json({
            error: true,
            message: 'You are not logged in! Login required to access this endpoint.',
        });
    }
}


/////////////////////////////////////////
// Protected from non-logged-in users. //
/////////////////////////////////////////
router.post('/create', async function (req, res, next) {
    const session_user_id = req?.user?.id;
    console.log("Create server")

    // const permissions = await permissionsService.find(session_user_id).catch(error => {
    //     return res.status(403).json({ message: "Unauthorized" })
    // })
    // if (!permissions) return res.status(403).json({ message: "Unauthorized" })

    const { name, ram, version, backups, databases } = req.body || null;
    console.log(name, ram, version, backups, databases)

    if (![name, ram, version, backups, databases].every(Boolean)) {
        return res.status(404).json({
            error: true,
            message: 'Missing required value. (Required Values = name, ram, version, backups,databases)',
        });
    }

    await pteroClient.createServer({
        allocation: { additional: [] },
        deploy: { dedicatedIp: false, portRange: ["25565", "25566"], locations: [1] },
        description: "My new Minecraft server",
        egg: 5,
        environment: { "SERVER_JARFILE": "server.jar", "MEMORY": "2G", "BUILD_NUMBER": "latest" },
        externalId: "",
        featureLimits: { allocations: 0, databases: databases, backups: backups },
        image: "minecraft",
        limits: { memory: ram, swap: 0, disk: 1000, io: 500, cpu: 0 },
        name: name,
        outOfMemoryKiller: false,
        pack: undefined,
        skipScripts: false,
        startWhenInstalled: false,
        startup: "java -Xmx{{MEMORY}} -Xms{{MEMORY}} -jar {{SERVER_JARFILE}} nogui",
        user: 1
    }).then((newServer) => {
        // console.log(`New server created with ID: ${newServer.id}`);
        res.send({
            success: true,
            ...newServer
        })

    }).catch((error) => {
        res.send(error)
        console.log(error)
    });



    // const hasPermission = permissions.hasPermission(Permissions.GLOBAL_ADD);
    // if (hasPermission === true) {
    // const page = pageService.create(route, name, markdown)
    //     .catch(error => {
    //         return res.status(500).json({ error: error })
    //     })
    // return res.status(201).json({ page: page, success: true })
    // } else return res.status(403).json({ message: "Missing required Permissions(GLOBAL_ADD)" })
})



//////////////////////////////////////////////
// NOT protected from non-logged-in users! //
////////////////////////////////////////////


router.get("/", async function (req, res, next) {
    try {
        let servers = await query("SELECT * FROM servers WHERE id = ?", [req.user.id]);
        return res.status(200).json(banners[0])
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: e, message: "Error" });
    }
});

export default router;

