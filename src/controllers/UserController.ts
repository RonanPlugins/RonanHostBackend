import express from "express";
import MissingValuesError from "../Error/MissingValuesError.js";
import passport from "passport";
const router = express.Router();
import {v4} from "../util/functions/UUID.js";
import UserRepository from "../repositories/UserRepository.js"
import iUserService from "../services/UserService.js"
import randomResponse from "../util/message/checkLoggedInFailedResponse.js";
import User from "../models/User.js";
import e from "express";

const userService: iUserService = new iUserService(new UserRepository())

function checkLoggedIn(req:any, res:any, next:any) {
    if (req?.user) next(); else return res.status(403).json({ error: true, message: randomResponse().message});
}

router.get('/',checkLoggedIn, async (req:any, res:any) => {
    if (req?.user) return res.status(200).json(req?.user);
    const {query} = req.query;
    const missingValues = ['query'].filter(key => !req.params[key]);
    if (missingValues.length > 1) {
        const MVE = new MissingValuesError(missingValues);
        res.status(MVE.statusCode).body({ error: MVE })
        return
    }
    try {
        const user: User = await userService.fetchOne(query).catch(e => { return res.send(e) });
        if (!user) {
            return res.status(403);
        }
        return res.status(200).json(await user.toJSON(["password"]))
    } catch (error) {
        console.error(error)
        return res.status(404).json({
            error: error,
            message: 'Invalid username/id',
        });
    }
});

router.post('/login', passport.authenticate('local'), async function (req:any, res:any) {
    res.send(req.user);
});

router.post('/create', async function (req:any, res:any) {
    const { name, email, password, username } = req.body;
    const missingValues = ['name', 'email', 'password', 'username'].filter(key => !req.body[key]);
    if (missingValues.length > 1) {
        const MVE = new MissingValuesError(missingValues);
        return res.status(MVE.statusCode).send({ error: MVE })
    }
    const user:any = await userService.create({
        email: email, id: v4(), name: name, password: password, username: username
    }).catch((e) => {
        res.status(500).send(e.message); return undefined;
    })
    if (user) return res.status(200).json(await user.toJSON(["password"]));
})


/////////////////////////////////////////
// Protected from non-logged-in users. //
/////////////////////////////////////////
export async function logout(request, response, next) {
    checkLoggedIn(request, response, () => {
        request.logOut(error => error ? next(error) : response.sendStatus(200));
    });
}

export default router;