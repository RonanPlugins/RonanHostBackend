import passport from 'passport';
import { Strategy } from 'passport-local';
import crypto from "../util/security/crypto.js";

import iUserRepo from "../repositories/UserRepository.js";
import iUserService from "../services/UserService.js";

const userService = new iUserService(new iUserRepo());

passport.serializeUser(function (user: any, cb: any) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

passport.deserializeUser(async function (user: any, cb: any) {
    process.nextTick(async function () {
        if (!user) return cb("Unauthorized: localStat")
        const u = await userService.fetchOne(user.email).catch(error => {
            return cb('Invalid username/email or password', null);
        });
        return cb(null, await u.toJSON(["password"]));
    });
});

export const strategy = new Strategy(
    { usernameField: 'emailOrUsername' },
    async function (email: string, password: string, done: any) {
        console.log(email,password)
        const user = await userService.fetchOne(email).catch(error => {
            return done('Invalid username/email or password', null);
        });

        if (!user) {
            return done('User not found', null);
        }
        //Check password
        const passwordMatch = await crypto.compare(password, user.password)

        if (!passwordMatch) return done('Invalid username/email or password', null);

        //toJSON sanitises the user instance (remove sensitive info such as password and discord)
        return done(null, await user.toJSON(["password"]));
    }
);
