#!/usr/bin/env node
import { Command } from 'commander';
// import { prompt } from 'enquirer';
// import { changeExt } from './commands/changeExtension';
// import testCli from 'register-programs/test-cli';
// import aboutCli from 'register-programs/about-cli';
import aboutCli from '@rp/about-cli';
import testCli from '@rp/test-cli';
import registerChangeExtension from '@rp/change-ext';
// import { createVite } from './commands/createVite';
// import { createRN } from './commands/createRN';
// import { addTs } from './commands/addTs';
// import { addEslint } from './commands/addEslint';
// import { addHusky } from './commands/addHusky';
// import { modifyGit } from './commands/modifyGit';

const program = new Command();


export async function main() {
  /* 
    about this cli command 
    command: scaffold-it --help
  */
  aboutCli(program);

  /* 
    test this cli command 
    command: scaffold-it hello
  */
  testCli(program);

  /* 
    rename file extension to ts* from js*
    command: scaffold-it change-extension
  */
  registerChangeExtension(program);



//   program
//     .command('create-vite')
//     .description('Create a Vite React project with custom folder structure')
//     .action(async () => {
//       await createVite();
//     });

//   program
//     .command('create-rn')
//     .description('Create a React Native project with custom folder structure')
//     .action(async () => {
//       await createRN();
//     });

//   program
//     .command('add-ts')
//     .description('Add TypeScript support to an existing project (react, react-native, node, next, nest)')
//     .action(async () => {
//       await addTs();
//     });

//   program
//     .command('add-eslint')
//     .description('Add eslint to an existing project')
//     .action(async () => {
//       await addEslint();
//     });

//   program
//     .command('add-husky')
//     .description('Add Husky & lint-staged hooks to project')
//     .action(async () => {
//       await addHusky();
//     });

//   program
//     .command('modify-git')
//     .description('Modify git commands or add custom git utilities')
//     .action(async () => {
//       await modifyGit();
//     });

// program
//   .command('add-alias')
//   .description('Add path alias support to your project (updates tsconfig or jsconfig)')
//   .action(async () => {
//     await addAlias();
//   });

//   program
//     .command('change-ext')
//     .description('Change .js files to .ts in a folder (recursively)')
//     .option('-p, --path <path>', 'target folder path', '.')
//     .action(async (opts) => {
//         const { target } = await prompt<{ target: string }>({
//             type: 'input',
//             name: 'target',
//             message: 'Which folder should we target?',
//             initial: opts.path || './src',
//         });
//         await changeExt(target);
//     });

  await program.parseAsync(process.argv);
}

// if run directly (node dist/index.cjs) call main
if (require.main === module) {
  main().catch(err => {
    // minimal error handling
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}
