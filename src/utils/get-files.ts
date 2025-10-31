import { glob } from "glob";
import fs from "fs/promises";
import path from "path";

export async function getFilesV2(roots: string[] = []) {
  const files: string[] = [];

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      // Skip hidden files/folders (starting with .)
      if (entry.name.startsWith(".")) continue;

      const fullPath:string = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        if (entry.name.endsWith(".test.js") || entry.name.endsWith(".spec.js")) continue;
        if (!entry.name.endsWith(".js") && !entry.name.endsWith(".jsx")) continue;
        files.push(fullPath);
      }
    }
  }

  for (const root of roots) {
    const absPath = path.resolve(root);
    try {
      const stat = await fs.stat(absPath);
      if (stat.isDirectory()) await walk(absPath);
    } catch{}
  }

  return files;
}


async function getFiles(target: string, extension: string | string[] = ['**/*.js', '**/*.jsx'], recursive: boolean = true, ignoreDirs: string[] = []) {
  if(!recursive){
    /* return only target folder files  */
  }
  const jsFiles = await glob(extension, { cwd: target, dot: false, absolute: true, ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**', '**/bin/**', '**/.husky/**', '**/.vscode/**', ...ignoreDirs] })
  return jsFiles;
}

export default getFiles;


/* 
/* Helper function to recursively get files */
// async function getFilesCustom(dir: string): Promise<string[]> {
//   const entries = await fs.readdir(dir, { withFileTypes: true });
//   const files = await Promise.all(
//     entries.map(entry => {
//       const res = path.resolve(dir, entry.name);
//       return entry.isDirectory() ? getFiles(res) : res;
//     })
//   );
//   return Array.prototype.concat(...files).filter(f => f.endsWith('.js') || f.endsWith('.jsx'));
// }
