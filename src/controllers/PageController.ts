import express from "express";
import randomResponse from "../util/message/checkLoggedInFailedResponse.js";
import MissingValuesError from "../Error/MissingValuesError.js";
import Page from "../models/Page.js";
import PageService from "../services/PageService.js";
import PageRepository from "../repositories/PageRepository.js";
import UserService from "../services/UserService.js";
import UserRepository from "../repositories/UserRepository.js";
import User from "../models/User.js";
import {getGrantedPermissions, Permissions} from "../enum/Permissions.js";
import {v4} from "../util/functions/UUID.js";

const router = express.Router();

const pageService = new PageService(new PageRepository())
const userService = new UserService(new UserRepository())

function checkLoggedIn(req, res, next) {
    if (req?.user) next(); else return res.status(403).json({ error: true, message: randomResponse().message});
}


router.post('/create', checkLoggedIn, async (req, res) => {
    // @ts-ignore
    const session_user_id = req?.user?.id;

    const user: User = <User>await userService.fetchOne(session_user_id).catch(e => {
        res.status(500).send(e)
    })

    if (getGrantedPermissions(user.permissions).includes(Permissions.PAGE_ADD)) {
        const missingValues = ['content', 'name'].filter(key => !req.body[key]);
        if (missingValues.length > 1) return res.status(new MissingValuesError(missingValues).statusCode).send({error: new MissingValuesError(missingValues)})
        const ins = await pageService.insert({
            content: req.body.content, id: v4(), name: req.body.name
        }).catch(e => {
            return res.status(500).send(e)
        })
        console.log(ins)
        res.status(200).send(await ins.toJSON())
    } else return res.status(500).send("Unauthorized")
})

router.get('/:page', async (req, res) => {
    const pageId = req.params.page;
    const missingValues = ['query'].filter(key => !req.params[key]);
    if (missingValues.length > 1) {
        const MVE = new MissingValuesError(missingValues);
        res.status(MVE.statusCode).send({error: MVE})
    }
    try {
        const page: Page = <Page> await pageService.fetchOne(pageId).catch(e => {throw e})
        return res.status(200).json({page: await page.toJSON()});
    } catch (error) {
        return res.status(400).send(error);
    }
});
router.put('/:page/edit', checkLoggedIn, async (req, res) => {
    // @ts-ignore
    const session_user_id = req?.user?.id;

    const user: User = <User>await userService.fetchOne(session_user_id).catch(e => {
        res.status(500).send(e)
    })

    if (getGrantedPermissions(user.permissions).includes(Permissions.PAGE_ADD)) {
        const missingValues = ['content', 'name'].filter(key => !req.body[key]);
        if (missingValues.length > 1) return res.status(new MissingValuesError(missingValues).statusCode).send({error: new MissingValuesError(missingValues)})
        const org = <Page> await pageService.fetchOne(req.body.name);
        const ins = <Page> await pageService.update(org.id,{
            content: req.body.content
        }).catch(e => {
            return res.status(500).send(e)
        })
        console.log(ins)
        res.status(200).send(await ins.toJSON())
    } else return res.status(500).send("Unauthorized")
})
router.get('/', async (req:any, res:any) => {
    try {
        const Pages = await pageService.fetchAll().catch(e => { throw e })
        console.log(Pages)
        return res.status(200).json(Pages);
    } catch (error) {
        return res.status(400).send(error);
    }
});

export default router;