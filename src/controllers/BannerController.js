import express from "express";
import { query } from "../repositories/database";
const router = express.Router();
router.get("/", async function (req, res, next) {
    try {
        let banners = await query("SELECT * FROM website_banners WHERE enabled = 1");
        return res.status(200).json(banners[0]);
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ error: e, message: "Error" });
    }
});
export default router;
