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
    try {
        console.log(1)
        await registrationService.finalize(token, username, password, res)
    } catch (e) {
        console.log(2)
        console.error(e)
        return res.status(500).send(e)
    }

})

export default router;