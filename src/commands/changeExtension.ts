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
import getFiles, { getFilesV2 } from '@utils/get-files';
import fs from 'fs';
import getAllFolders from '@utils/get-folder';
import createFile from '@utils/create-file';
import findAndUpdateEslintConfig from '@utils/update-eslint-config';


async function changeExtension(props: IChangeExtensionCommand) {
  const { targetDir, framework, packageManager = 'npm', ignoreDeps = false, ignoreTest = true } = props
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

    let files: string[] = [];
    if(targetDir === '' || targetDir === '.' || targetDir === '/' || targetDir === './'){
      /* get all file folder and files */
      const absoluteTarget = path.resolve(process.cwd(), targetDir === "/" ? '.' : targetDir);
      console.log(chalk.dim(`Targeting directory: ${absoluteTarget}`));
      const folders = await getAllFolders(absoluteTarget, false);

      /* ask target folders */
      const {targetFolders}: { targetFolders: string[] } = await prompt([
        {
          type: 'multiselect',
          name: 'targetFolders',
          message: 'Choose your target folders: (no file will be impacted from this directory)',
          choices: folders,
          multiple: true,
          /* @ts-ignore */
          hint: '(Use <space> to select, <return> to submit)',
        },
      ])
      if(targetFolders.length === 0){
        console.log(chalk.bgBlueBright(`🚫 No folder selected !`));
        process.exit(1)
      }

      files = await getFilesV2(targetFolders)
      if (!files.length) {
        console.log('No .js or .jsx files found to convert.');
        process.exit(1)
      }
    }
    else{
      const absoluteTarget = path.resolve(process.cwd(), targetDir);
      console.log(chalk.dim(`Targeting directory: ${absoluteTarget}`));
      files = await getFiles(absoluteTarget);
    }
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
      if(ignoreTest){
        if (file.endsWith('.test.js') || file.endsWith('.spec.js')) {
          console.log(chalk.yellowBright(`Skipping test file: ${file}`));
          continue;
        }
      }
    }
    console.log(chalk.bgGreen(`✨ Total ${impactedFile} ${impactedFile > 2 ? 'files' : 'file'} impacted.`))
    findAndUpdateEslintConfig();
  }
  catch(err: unknown){
    console.error(chalk.red(`Error: ${err instanceof Error ? err.message : err}`));
    process.exit(1);
  }
}

export default changeExtension
