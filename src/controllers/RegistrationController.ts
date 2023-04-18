import express from "express";
import MissingValuesError from "../Error/MissingValuesError.js";
import User from "../models/User.js";
import UserRepository from "../repositories/UserRepository.js"
import UserService from "../services/UserService.js"

import RegistrationService from "../services/RegistrationService.js";
import RegistrationRepository from "../repositories/RegistrationRepository.js";
import Registration from "../models/Registration.js";

const userService = new UserService(new UserRepository())
const registrationService = new RegistrationService(new RegistrationRepository())

const router = express.Router();

router.post('/', async (req:any, res:any) => {
    const {username, password, token} = req.body;
    const missingValues = ['token', 'password', 'username'].filter(key => !req.body[key]);
    if (missingValues.length > 1) {
        const MVE = new MissingValuesError(missingValues);
        res.status(MVE.statusCode).body({ error: MVE })
        return
    }
    // TODO: kris fix 
    // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    // This error is caused because finalize automatically sends back a res.send response and therefore you cannot send them twice
    try {
        const registration: Registration = await registrationService.fetchOne(token).catch(e => { return res.status(403).send(e) });
            console.log("here 0")

        if (!registration) {return res.status(204);} // 204 No Content
            console.log("here 1")

        await registrationService.finalize(token, username, password, res).then((re) => {
            console.log("here")
            return res.status(200);
        })
    } catch (e) {
            console.log("here lol")
        return res.status(500).send(e)
    }
})

export default router;
