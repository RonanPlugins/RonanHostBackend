import express from "express";
import BannerRepository from "../repositories/BannerRepository.js";
import BannerService from "../services/BannerService.js";
import Banner from "models/Banner.js";

const bannerService = new BannerService(new BannerRepository())

const router = express.Router();

router.get("/", async function (req, res, next) {
    try {
        const banners = <Banner[]>await bannerService.fetchAllBy("enabled",true).catch(e => { throw e })
        return res.status(200).json(await Promise.all(banners.map(async banner=> await banner.toJSON())));
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: e, message: "Error" });
    }
});

export default router;
