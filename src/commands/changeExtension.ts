import checkDependencyFromJson from '@utils/check-dependencies-from-json';
import checkDependencyFromFile from '@utils/check-dependency-from-file';
import isFileExist from '@utils/check-file-exist';
import checkNodeVersion from '@utils/check-node-version';
import checkPkgManagerVersion from '@utils/check-npm-version';
import findProjectRoot from '@utils/find-project-root';
import readJSONFile from '@utils/read-json';
import chalk from 'chalk';
import { IChangeExtensionCommand } from 'types/change-extension';
import { frameworkDeps } from 'types/core';

/* 
6. update tsconfig.json from allowing of ts-ignore globally
7. update all file from targeted folder default src
8. add @ts-ignore or related setup for allowing no usages of type
9. show some notes about adding type and remove ts-ignore from global setup
10. check eslint and add ts-ignore option
11. create global.d.ts and add into tsconfig
*/

/* 
// @ts-nocheck

@ts-ignore
@ts-expect-error


{
  "rules": {
    "@typescript-eslint/ban-ts-comment": "off"
  }
}

---
// global.d.ts
declare module 'some-broken-lib';

{
  "include": ["src", "global.d.ts"]
}
*/

async function changeExtension(props: IChangeExtensionCommand) {
  const { targetDir, framework, packageManager = 'npm', ignoreDeps = false } = props
  try{
    const root = await findProjectRoot();
    console.log(chalk.dim(`🧩 Project root: ${root}`));

    await checkNodeVersion();
    await checkPkgManagerVersion(packageManager);

    const pkgPath = await isFileExist('package.json', 'file', root);
    const tsConfig = await isFileExist('tsconfig.json', 'file', root);
    const pkgData = await checkDependencyFromFile(pkgPath, 'typescript', { needReturn: true });

    if(!ignoreDeps){
      const hasDependencyIssue = checkDependencyFromJson(pkgData, frameworkDeps[framework]);
      if(hasDependencyIssue){ process.exit(1) }
    }
    else {
      console.log(chalk.yellow(`⚠️  Ignoring Framework (${framework}) dependency check.`));
    }
    const tsConfigData = await readJSONFile(tsConfig, true);
    console.log('tsConfigData:', tsConfigData)
    /* TODO: update necessary field for auto type check */
    /* 
      fields: 
      "strict": false, // disable strict mode at first to avoid 1000+ errors
      "noImplicitAny": false 
    */

    /* TODO: check file / folder exist in .gitignore */
    /* TODO: avoid node_modules, dist, bin, build, .vscode, .husky etc */
    /* if target folder is root then show a list for multiple check for folders and files */
  }
  catch(err: unknown){
    console.error(chalk.red(`Error: ${err instanceof Error ? err.message : err}`));
    process.exit(1);
  }


  // const absoluteTarget = path.resolve(process.cwd(), targetDir);
  // console.log(`Targeting: ${absoluteTarget}`);
  // const files = await getFiles(absoluteTarget);

  /* for root folder show another checkbox to select folder as multiple */
  /* try to avoid those file / folder that in gitignore */

  // if (!files.length) {
  //   console.log('No .js files found to convert.');
  //   return;
  // }
  // for (const file of files) {
  //   const stat = await fs.stat(file);
  //   if (stat.isFile()) {
  //     const newPath = file.replace(/\.js$/, '.ts');
  //     // Safety: skip files already with .d.ts or .test.js -> let user adapt pattern as needed
  //     if (file.endsWith('.test.js') || file.endsWith('.spec.js')) {
  //       console.log(`Skipping test file: ${file}`);
  //       continue;
  //     }
  //     // Read and perform a lightweight transform: convert "module.exports" -> "export default" if found
  //     let content = await fs.readFile(file, 'utf-8');

  //     // very light heuristics (do NOT assume this is perfect)
  //     content = content
  //       .replace(/module\.exports\s*=\s*/, 'export default ')
  //       .replace(/exports\.(\w+)\s*=\s*/, 'export const $1 = ')
  //       // convert require(...) to import ... if simple patterns exist - we won't do heavy AST here
  //       .replace(/const\s+(\w+)\s*=\s*require\(['"](.+)['"]\);?/g, 'import $1 from \'$2\';');

  //     // Write to new file and remove old one (safe approach: write new then unlink old)
  //     await fs.writeFile(newPath, content, 'utf-8');
  //     await fs.unlink(file);
  //     console.log(`${path.relative(process.cwd(), file)} -> ${path.relative(process.cwd(), newPath)}`);
  //   }
  // }
  // console.log('Conversion done. Please review code — manual fixes likely needed (types, imports).');
}

export default changeExtension
