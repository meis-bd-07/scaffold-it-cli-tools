import path from 'path';
const fs = require('fs').promises;

const findProjectRoot =  async (start = process.cwd()) => {
    let dir = start;
    while (dir !== path.parse(dir).root) {
        try {
            await fs.access(path.join(dir, 'package.json'));
            return dir;
        } catch (e) {
            dir = path.dirname(dir);
        }
    }
    throw new Error('No package.json found upwards from current folder.');
};

export default findProjectRoot;