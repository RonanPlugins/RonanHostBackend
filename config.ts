// config.ts
import yaml from 'js-yaml';
import fs from 'fs';

function loadConfig() {
    return yaml.load(fs.readFileSync('./config.yml', 'utf8'));
}

type AppConfig = ReturnType<typeof loadConfig>;
const config = (() => {
    try {
        return loadConfig() as AppConfig;
    } catch (err) {
        console.error(err);
        return null;
    }
})();

export { AppConfig, config };