import express from "express";
import randomResponse from "../util/message/checkLoggedInFailedResponse.js";
import MissingValuesError from "../Error/MissingValuesError.js";
import Page from "../models/Page.js";
import PageService from "../services/PageService.js";
import PageRepository from "../repositories/PageRepository.js";
import UserService from "../services/UserService.js";
import UserRepository from "../repositories/UserRepository.js";
import User from "../models/User.js";
import { getGrantedPermissions, Permissions } from "../enum/Permissions.js";
import { v4 } from "../util/functions/UUID.js";
import { ResetCache } from "../util/decorators/Memorize.js";
import { UUID } from "crypto";
import NotFoundError from "../Error/NotFoundError.js";

const router = express.Router();

const pageService = new PageService(new PageRepository())
const userService = new UserService(new UserRepository())

function checkLoggedIn(req, res, next) {
    if (req?.user) next(); else return res.status(403).json({ error: true, message: randomResponse().message });
}


router.post('/create', checkLoggedIn, async (req, res) => {
    // @ts-ignore
    const session_user_id = req?.user?.id;

    const user: User = <User>await userService.fetchOne(session_user_id).catch(e => {
        res.status(500).send(e)
    })

    if (getGrantedPermissions(user.permissions).includes(Permissions.PAGE_ADD)) {
        const missingValues = ['content', 'name'].filter(key => !req.body[key]);
        if (missingValues.length > 1) return res.status(new MissingValuesError(missingValues).statusCode).send({ error: new MissingValuesError(missingValues) })
        ResetCache()
        const ins = await pageService.insert({
            content: req.body.content, id: v4(), name: req.body.name
        }).catch(e => {
            return res.status(500).send(e)
        })
        console.log(ins)
        res.status(200).send(await ins.toJSON())
    } else return res.status(500).send("Unauthorized")
})
router.delete('/:page/delete', async (req, res) => {
    // @ts-ignore
    const session_user_id = req?.user?.id;

    const page = await pageService.fetchOne(req.params.page).catch(e => {return undefined});
    const user = await userService.fetchOne(session_user_id).catch(e => {return undefined});

    if (!page) return res.status(401).send(new NotFoundError("page", req.params.page));
    if (!user) return res.status(401).send(new NotFoundError("user", session_user_id));

    if (!getGrantedPermissions(user.permissions).includes(Permissions.PAGE_DELETE)) return res.status(500).send("Unauthorized");

    try {
        await pageService.delete(page.id)
    } catch(e) {
        return res.status(500).send({ success: false, message: "Page not found." })
    }
    res.status(200).send({ success: true });
});


router.get('/:page', async (req, res) => {
    const pageId = req.params.page;
    const missingValues = ['query'].filter(key => !req.params[key]);
    if (missingValues.length > 1) {
        const MVE = new MissingValuesError(missingValues);
        res.status(MVE.statusCode).send({ error: MVE })
    }
    try {
        const page: Page = <Page>await pageService.fetchOne(pageId).catch(e => { throw e })
        console.log(await page.toJSON())
        return res.status(200).json({ page: await page.toJSON() });
    } catch (error) {
        return res.status(400).send(error);
    }
});
router.put('/:page/edit', async (req, res) => {
    // @ts-ignore
    // const session_user_id = req?.user?.id;

    // const user: User = <User>await userService.fetchOne(session_user_id).catch(e => {
    //     return undefined;
    // })
    // if (!user) return res.status(500).send(new NotFoundError("user", session_user_id))

    // if (getGrantedPermissions(user.permissions).includes(Permissions.PAGE_ADD)) {
        const missingValues = ['content'].filter(key => !req.body[key]);
        if (missingValues.length > 1) return res.status(new MissingValuesError(missingValues).statusCode).send({ error: new MissingValuesError(missingValues) })
        const org = <Page>await pageService.fetchOne(req.params.page).catch(e => {return undefined});
        if (!org) return res.status(500).send(new NotFoundError("page", req.params.page))
        const ins = <Page>await pageService.update(org.id, {
            content: req.body.content
        }).catch(e => {
            console.log(e)
            return undefined;
        })
    if (!ins) return res.status(500).send("internal err")
        console.log(ins)
        res.status(200).send(await ins.toJSON())
    // } else return res.status(500).send("Unauthorized")
})
router.get('/', async (req: any, res: any) => {
    try {
        const pages = <Page[]>await pageService.fetchAll().catch(e => { throw e })
        console.log(pages)
        return res.status(200).json(await Promise.all(pages.map(async page => await page.toJSON())));
    } catch (error) {
        return res.status(400).send(error);
    }
});

export default router;