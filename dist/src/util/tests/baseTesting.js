import UserRepository from "../../repositories/UserRepository.js";
const userRepository = new UserRepository;
import UserService from "../../services/UserService.js";
import { v4 } from "../functions/UUID.js";
const userService = new UserService(new UserRepository());
(async () => {
    // const u = await userRepository.getByEmail("me@rxavion.com");
    // console.log(u)
    const u = await userService.create({
        email: "", id: v4(), name: "", password: ""
    });
    console.log(u);
    console.log(await u.toJSON(["pterodactyl_user", "stripe_customer", "stripe_customer_id"]).catch(e => { console.error(e); }));
})();
