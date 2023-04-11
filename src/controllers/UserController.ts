import express from "express";
import MissingValuesError from "../Error/MissingValuesError.js";

const router = express.Router();

import UserRepository from "../repositories/UserRepository.js"
import iUserService from "../services/UserService.js"
import randomResponse from "../util/message/checkLoggedInFailedResponse.js";
import User from "../models/User";

const userService: iUserService = new iUserService(new UserRepository())

function checkLoggedIn(req, res, next) {
    if (req?.user) next(); else return res.status(403).json({ error: true, message: randomResponse().message});
}

router.get('/', async (req, res) => {
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
router.post('/login', passport.authenticate('local'), async function (req, res) {
    res.send(req.user);
});

/////////////////////////////////////////
// Protected from non-logged-in users. //
/////////////////////////////////////////
export async function logout(request, response, next) {
    checkLoggedIn(request, response, () => {
        request.logOut(error => error ? next(error) : response.sendStatus(200));
    });
}

export default router;