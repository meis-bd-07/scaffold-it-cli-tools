import { glob } from "glob";
import fs from "fs/promises";
import path from "path";
import { IGNORED_DIRS } from "types/core";

async function getFoldersCustom(dir: string): Promise<{ name: string; value: string }[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const folders = entries
    .filter(entry => {
      if (!entry.isDirectory()) return false;          // only directories
      if (entry.name.startsWith(".")) return false;    // skip dot-folders
      if (IGNORED_DIRS.includes(entry.name)) return false; // skip ignored
      return true;
    })
    .map(entry => ({
      name: entry.name,                     // folder name only
      value: path.resolve(dir, entry.name)  // full path
    }));
  return folders;
}

async function getAllFolders(root: string, recursive: boolean = true) {
  if(!recursive){
    return await getFoldersCustom(root);
  }

  const entries = await glob("**/*", {
    cwd: root,            // base directory to search in
    withFileTypes: true,  // return Dirent objects
    dot: false,           // skip hidden files/folders (like .git)
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**', '**/bin/**', '**/.husky/**', '**/.vscode/**'],
  });

  // Filter to only directories
  const folders = entries.filter(entry => entry.isDirectory()).map(entry => `${root}/${entry.name}`);
  return folders;
}
export default getAllFolders;
