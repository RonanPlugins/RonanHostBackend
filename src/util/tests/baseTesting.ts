import UserRepository from "#repositories/UserRepository";
const userRepository = new UserRepository;

import UserService from "#services/UserService";

const userService = new UserService(UserRepository);

(async() => {
    // const u = await userRepository.getByEmail("me@rxavion.com");
    // console.log(u)
    const u = await userService.create({
        name: "john doeiscool",
        email: "kriffg@cro.ss",
        password: "JJXk"
    }).catch(e => {console.error(e)})
    console.log(u)
    console.log(await u.toJSON(["pterodactyl_user", "stripe_customer", "stripe_customer_id"]).catch(e => {console.error(e)}))
})();