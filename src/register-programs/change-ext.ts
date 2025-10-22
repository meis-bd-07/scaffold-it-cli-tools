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

interface MyMultiSelectPrompt extends prompt {
  hint?: string;
}

const registerChangeExtension = async (program: Command) => {
    return program
        .command('change-extension')
        .description('Change .js* files to .ts* in a folder (recursively)')
        .option('-p, --path <path>', 'target folder path', 'src')
        .option('--ignore-deps', 'Ignore dependencies')
        .action(async (opts: IChangeExtensionOpts) => {
            abortCommandHandler();
            try{
                const answers: { target: string; framework: IFramework; package_manager: IPackageManager, tasks: string[]; } = await prompt([
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
                        name: 'target',
                        message: 'Which folder should we target?',
                        initial: opts.path || './src',
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
                    },
                    {
                        type: 'multiselect', // <-- Multi-select
                        name: 'tasks',
                        message: 'Choose your tasks:',
                        choices: ['Add', 'Sub', 'Mul', 'Div'],
                        multiple: true,
                        hint: '(Use <space> to select, <return> to submit)',
                    },
                ])

                console.log('tasks', answers.tasks)
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