import BaseService from "./Base/BaseService.js";
import BannerRepository from "../repositories/BannerRepository.js";
import Banner from "../models/Banner.js";

export default class BannerService extends BaseService<BannerRepository, Banner> {
    constructor(repository: BannerRepository) {
        super(repository);
    }
}