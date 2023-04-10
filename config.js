// config.ts
import yaml from 'js-yaml';
import fs from 'fs';
function loadConfig() {
    return yaml.load(fs.readFileSync('./config.yml', 'utf8'));
}
const config = (() => {
    try {
        return loadConfig();
    }
    catch (err) {
        console.error(err);
        return null;
    }
})();
export { config };
