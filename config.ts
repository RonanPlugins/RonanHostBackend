import yaml from 'js-yaml';
import fs from 'fs';

export interface appConfig {
    Frontend_URL: string;
    Stripe_Domain: string;
    app_port: number;
    production: boolean;
    pterodactyl_URL: string;
    allowedOrigins: string[];
}



export default (():appConfig => {
    try {
        return yaml.load(fs.readFileSync('./config.yml', 'utf8'));
    } catch (err) {
        console.error(err);
        return null;
    }
})();