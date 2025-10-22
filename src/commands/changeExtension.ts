import checkNodeVersion from '@utils/check-node-version';
import checkPkgManagerVersion from '@utils/check-npm-version';
import detectPkgManager from '@utils/detect-pkg-manager';
import findProjectRoot from '@utils/find-project-root';
import getFiles from '@utils/get-files';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

/* 
what it need to check here:
. check node version ≥ 18.x (LTS preferred) - done
. check npm / yarn / pnpm version - done

1. check root - done
2. check package.json - done
3. determine npm / yarn / pnpm file exit - done
4. check typescript active in code with tsconfig.json
5. check dependencies and dev-dependencies for typescript
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

export async function changeExt(targetDir: string) {
  try{
    const root = await findProjectRoot();
    console.log(chalk.dim(`Project root: ${root}`));

    await checkNodeVersion();
    const projectPackageManager = detectPkgManager(root)
    const npmVersion = await checkPkgManagerVersion(projectPackageManager);




    

  }
  catch(err: unknown){
    console.error(chalk.red(`Error: ${err instanceof Error ? err.message : err}`));
    process.exit(1);
  }


  const absoluteTarget = path.resolve(process.cwd(), targetDir);
  console.log(`Targeting: ${absoluteTarget}`);
  const files = await getFiles(absoluteTarget);
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
  console.log('Conversion done. Please review code — manual fixes likely needed (types, imports).');
}
