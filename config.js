import yaml from 'js-yaml';
import fs from 'fs';
export default (() => {
    try {
        return yaml.load(fs.readFileSync('./config.yml', 'utf8'));
    }
    catch (err) {
        console.error(err);
        return null;
    }
})();
