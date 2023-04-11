import Pterodactyl from '@avionrx/pterodactyl-js';
export default new Pterodactyl.Builder()
    .setURL(process.env.PTERODACTYL_BASE_URL)
    .setAPIKey(process.env.PTERODACTYL_API_KEY)
    .asAdmin();