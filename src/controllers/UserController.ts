import express from "express";
import MissingValuesError from "../Error/MissingValuesError.js";
import passport from "passport";
const router = express.Router();
import {v4} from "../util/functions/UUID.js";
import UserRepository from "../repositories/UserRepository.js"
import iUserService from "../services/UserService.js"
import randomResponse from "../util/message/checkLoggedInFailedResponse.js";
import User from "../models/User";

const userService: iUserService = new iUserService(new UserRepository())

function checkLoggedIn(req:any, res:any, next:any) {
    if (req?.user) next(); else return res.status(403).json({ error: true, message: randomResponse().message});
}

router.get('/', async (req:any, res:any) => {
    if (req?.user) return res.status(200).json(req?.user);
    const {query} = req.query;
    const missingValues = ['query'].filter(key => !req.params[key]);
    if (missingValues.length > 1) {
        const MVE = new MissingValuesError(missingValues);
        res.status(MVE.statusCode).body({error: MVE})
    }
    try {
        const user: User = await userService.fetchOne(query).catch(e => {return e});
        return res.status(200).json({user: await user.toJSON(["password"])});
    } catch (error) {
        console.error(error)
        return res.status(404).json({
            error: error,
            message: 'Invalid username/id',
        });
    }
});

// TODO ARR4NN setup
router.post('/login', passport.authenticate('local'), async function (req:any, res:any) {
    res.send(req.user);
});

router.post('/create', async function (req:any, res:any) {
    const { name, email, password } = req.body;
    const missingValues = ['name', 'email', 'password'].filter(key => !req.body[key]);
    if (missingValues.length > 1) {
        const MVE = new MissingValuesError(missingValues);
        console.log(MVE.statusCode)
        res.status(MVE.statusCode).send({ error: MVE })
        return;
    }

    const user:any = await userService.create({
        email: email, id: v4(), name: name, password: password
    }).catch((e) => {
        console.log(e)
    })
    //You need to send it as user.toJSON(["password"]) "password" makes it exclude password from result
    // dont forget to await toJSON()
    console.log(user)
    res.json(await user.toJSON(["password"]))

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