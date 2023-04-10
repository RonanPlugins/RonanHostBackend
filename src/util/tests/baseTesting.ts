import UserRepository from "#repositories/UserRepo";
const userRepository = new UserRepository;

(async() => {
    const u = await userRepository.getByEmail("me@rxavion.com");
    console.log(await u.toJSON(["pterodactyl_user", "stripe_customer"]).catch(e => {console.error(e)}))
})();