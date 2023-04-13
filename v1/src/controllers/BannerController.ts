import express from "express";
import BannerRepository from "../repositories/BannerRepository.js";
import BannerService from "../services/BannerService.js";

const bannerService = new BannerService(new BannerRepository())

const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
        return res.status(200).json((await bannerService.fetchAllBy("enabled", true))[0])
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: e, message: "Error" });
    }
});

export default router;
