import express from "express";
const router = express.Router();
import UserRepository from "../repositories/UserRepository.js";
import iUserService from "../services/UserService.js";
import randomResponse from "../util/message/checkLoggedInFailedResponse";
const userService = new iUserService(new UserRepository);
function checkLoggedIn(req, res, next) {
    if (req?.user)
        next();
    else
        return res.status(403).json({ error: true, message: randomResponse().message });
}
// router.get('/', async (req, res) => {
//     if (req?.user) return res.status(200).json(req?.user);
//     const {query} = req.query;
//     const missingValues = ['query'].filter(key => !req.params[key]);
//     if (missingValues.length > 1) {
//         const MVE = new MissingValuesError(missingValues);
//         res.status(MVE.statusCode).body({error: MVE})
//     }
//     try {
//         const user = await userService.find(query);
//         const sanitizedUser = user.toJSON();
//         const permissions = PermissionScope.getIndividualPermissions(user.permissions.permissions_integer)
//         return res.status(200).json({user: sanitizedUser});
//     } catch (error) {
//         console.error(error)
//         return res.status(404).json({
//             error: error,
//             message: 'Invalid username/id',
//         });
//     }
// });
/////////////////////////////////////////
// Protected from non-logged-in users. //
/////////////////////////////////////////
export async function logout(request, response, next) {
    checkLoggedIn(request, response, () => {
        request.logOut(error => error ? next(error) : response.sendStatus(200));
    });
}
//# sourceMappingURL=UserController.js.map