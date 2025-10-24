import changeExtension from "@commands/changeExtension";
import abortCommandHandler from "@utils/abort-command";
import chalk from "chalk";
import { Command } from "commander";
import { prompt } from "enquirer";
import { IChangeExtensionOpts, IFramework, IPackageManager } from "types/change-extension";

/* 
    command: 
        scaffold-it change-extension -p <path> --ignore-deps
        scaffold-it change-extension --path <path> --ignore-deps
*/

const registerChangeExtension = async (program: Command) => {
    return program
        .command('change-extension')
        .description('Change .js* files to .ts* in a folder (recursively)')
        .option('-p, --path <path>', 'target folder path', 'src')
        .option('--ignore-deps', 'Ignore dependencies')
        .action(async (opts: IChangeExtensionOpts) => {
            abortCommandHandler();
            // const folders = await getAllFolders('./', false);
            try{
                const answers: { target: string; framework: IFramework; package_manager: IPackageManager } = await prompt([
                    {
                        type: 'select',
                        name: 'package_manager',
                        message: 'Which package manager are you using?',
                        choices: [
                            'npm',
                            'yarn',
                            'pnpm'
                        ],
                    },
                    {
                        type: 'input',
                        // type: 'autocomplete',
                        name: 'target',
                        message: 'Which folder should we target?',
                        initial: opts.path || './src',
                        // validate: async(value) => {
                        //     const folders = await getSubfolders('./');
                        //     return folders.includes(value) || `Folder not found! Choose from: ${folders.join(', ')}`;
                        // },
                        // choices: folders,
                        // suggest: (input: string, choices: {name: string, value: string}[]) => {
                        //     console.log('input', input)
                        //     if(!input){
                        //         return []
                        //     }
                        //     return choices.filter(choice => choice.name.includes(input));
                        // }
                    },
                    {
                        type: 'select',
                        name: 'framework',
                        message: 'Which framework are you using?',
                        choices: [
                            'React',
                            'React Native',
                            'React with Vite',
                            'Node.js',
                            'Nest.js',
                            'Next.js',
                        ],
                    }
                ])
                await changeExtension({
                    targetDir: answers.target,
                    framework: answers.framework,
                    packageManager: answers.package_manager,
                    ignoreDeps: opts.ignoreDeps || false
                });
            }
            catch (err: unknown) {
                console.error(chalk.red(`\nError: ${err instanceof Error ? err.message : err}`));
                process.exit(1);
            }
        });
};

export default registerChangeExtension;