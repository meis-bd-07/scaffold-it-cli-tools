import checkDependencyFromJson from '@utils/check-dependencies-from-json';
import checkDependencyFromFile from '@utils/check-dependency-from-file';
import isFileExist from '@utils/check-file-exist';
import checkNodeVersion from '@utils/check-node-version';
import checkPkgManagerVersion from '@utils/check-npm-version';
import findProjectRoot from '@utils/find-project-root';
import readJSONFile from '@utils/read-json';
import chalk from 'chalk';
import { prompt } from 'enquirer';
import { IChangeExtensionCommand } from 'types/change-extension';
import { frameworkDeps } from 'types/core';
import path from 'path';
import getFiles from '@utils/get-files';
import fs from 'fs';
// import walkDirectories from '@utils/walk-directories';

// import inquirer from 'inquirer';
import inquirer from 'inquirer';
import fileTreeSelection from 'inquirer-file-tree-selection-prompt';
import getAllFolders from '@utils/get-folder';
import createFile from '@utils/create-file';

/* 
7. update all file from targeted folder default src
10. check eslint and add ts-ignore option
*/

/* 
{
  "rules": {
    "@typescript-eslint/ban-ts-comment": "off"
  }
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


    let tsConfigData = await readJSONFile(tsConfig, true);
    createFile(root, "global.d.ts", `// declare module 'some-broken-lib';`);
    const activeJs = {
      // Enable JavaScript files
      compilerOptions: {
        "allowJs": true,
        "checkJs": false, 
        "strict": false,
        "noImplicitAny": false, 
        "skipLibCheck": true, 
        "noEmit": true,         
      },
      include: ["src", "global.d.ts"],
      exclude: ["node_modules", "dist", "build"]
    }
    createFile(root, "tsconfig.jsonc", activeJs, true);
    tsConfigData = {...tsConfigData, "extends": Array.from(new Set([...(tsConfigData.extends || []), "./tsconfig.jsonc"]))}
    fs.writeFileSync(tsConfig, JSON.stringify(tsConfigData, null, 2), 'utf8');
    console.log(chalk.yellowBright('✨ Modify tsconfig.json for enable of no type checking !'))


    if(targetDir === '' || targetDir === '.' || targetDir === '/' || targetDir === './'){
      /* get all file folder and files */
      const absoluteTarget = path.resolve(process.cwd(), targetDir === "/" ? '.' : targetDir);
      console.log(`Targeting: ${absoluteTarget}`);
      const files = await getFiles(absoluteTarget);
      if (!files.length) {
        console.log('No .js files found to convert.');
        process.exit(1)
      }

      const folders = await getAllFolders(absoluteTarget, false);
      console.log('folders', folders)

      // Register the prompt type
      // inquirer.registerPrompt('file-tree-selection', fileTreeSelection);

      // const IGNORED_DIRS = ['node_modules', 'dist', 'build', '.git'];


  //     const IGNORED_DIRS = ['node_modules', 'dist', 'build', '.git', '.husky', '.vscode', 'bin', 'dist', 'build'];
  //     const ROOT_DIR = path.resolve(absoluteTarget); // or your actual base dir

  //     // Check if root exists
  //     if (!fs.existsSync(ROOT_DIR)) {
  //       console.error(`❌ Root folder not found: ${ROOT_DIR}`);
  //       process.exit(1);
  //     }

  //     const answers = await inquirer.prompt([
  //   {
  //     type: 'file-tree-selection',
  //     name: 'selectedFiles',
  //     message: 'Select files or folders:',
  //     root: ROOT_DIR,
  //     multiple: true,
  //     onlyShowDir: false,
  //     filter: (itemPath: string) => {
  //       const base = path.dirname(itemPath);

  //       // 🚫 Ignore unwanted directories
  //       if (IGNORED_DIRS.includes(base.replace('/', ''))) return false;

  //       // ✅ Always include directories (to allow navigation)
  //       try {
  //         const stats = fs.statSync(itemPath);
  //         if (stats.isDirectory()) return true;
  //       } catch {
  //         return false;
  //       }

  //       // ✅ Only include .js / .jsx files
  //       return /\.(jsx?)$/.test(base);
  //     },
  //   },
  // ]);

  // if (!answers.selectedFiles || answers.selectedFiles.length === 0) {
  //   console.log('\n⚠️  No files selected.\n');
  //   return;
  // }

  // console.log('\n✅ Selected paths:\n', answers.selectedFiles);

      // const _files = walkDirectories(absoluteTarget);
      
      // const answers: { fileFolders: string[] } = await prompt([
      //   {
      //     type: 'multiselect', // <-- Multi-select
      //     name: 'fileFolders',
      //     message: 'Choose your files & folders:',
      //     choices: _files,
      //     multiple: true,
      //     /* @ts-ignore */
      //     hint: '(Use <space> to select, <return> to submit)',
      //   },
      // ])
      // console.log('answers', answers)


       /* TODO: check file / folder exist in .gitignore */
      /* TODO: avoid node_modules, dist, bin, build, .vscode, .husky etc */
      /* if target folder is root then show a list for multiple check for folders and files */
    }
    else{
      const absoluteTarget = path.resolve(process.cwd(), targetDir);
      console.log(chalk.dim(`Targeting directory: ${absoluteTarget}`));
      const files = await getFiles(absoluteTarget);
      if (!files.length) {
        console.log(chalk.bgBlueBright(`🚫 No .js/.jsx files found under src to rename automatically.`));
        process.exit(1)
      }
      let impactedFile = 0;
      for (const file of files){
        const ext = path.extname(file);
        const base = file.slice(0, -ext.length);
        const newExt = ext === '.js' ? '.ts' : '.tsx';
        const newPath = base + newExt;
        fs.renameSync(file, newPath);
        impactedFile++;
        // console.log('Renamed:', path.relative(root, f), '→', path.relative(root, newPath));
      }
      console.log(chalk.bgGreen(`✨ Total ${impactedFile} ${impactedFile > 2 ? 'files' : 'file'} impacted.`))
    }
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
