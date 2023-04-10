import UserRepository from "#repositories/UserRepo";
const userRepository = new UserRepository()(async () => {
    await userRepository.getByEmail("me@rxavion.com");
})();
//# sourceMappingURL=baseTesting.js.map