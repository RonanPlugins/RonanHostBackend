import express from "express";
const router = express.Router();
import ServerController from './controllers/ServerController.js';
import userController from "./controllers/UserController.js";
import pageController from "./controllers/PageController.js";

router.use('/server', ServerController);
router.use('/user', userController);
router.use('/page', pageController)


router.get("/", (req:any, res:any) => {
    res.send("Hello, world!");
});


export default router;