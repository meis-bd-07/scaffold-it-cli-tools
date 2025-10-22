import { glob } from "glob";
import fs from 'fs/promises';
import path from 'path';

/* Helper function to recursively get files */
async function getFilesCustom(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(entry => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files).filter(f => f.endsWith('.js'));
}

async function getFiles(target: string) {
    const jsFiles = await glob('**/*.js*', { cwd: target, absolute: true, ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'] })
    return jsFiles;
}

export default getFiles;
export { getFilesCustom }