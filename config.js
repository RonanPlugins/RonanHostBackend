import yaml from 'js-yaml';
import fs from 'fs';


export function getAppConfig() {
    try {
        const config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
        return config;
    } catch (e) {
        console.log(e);
    }

}
