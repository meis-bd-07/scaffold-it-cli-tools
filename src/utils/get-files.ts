import { glob } from "glob";

async function getFiles(target: string, extension: string | string[] = ['**/*.js', '**/*.jsx'], recursive: boolean = true) {
  if(!recursive){
    /* return only target folder files  */
  }
  const jsFiles = await glob(extension, { cwd: target, absolute: true, ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**', '**/bin/**', '**/.husky/**', '**/.vscode/**'] })
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