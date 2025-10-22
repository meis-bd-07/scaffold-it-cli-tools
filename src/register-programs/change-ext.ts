import { changeExt } from "@commands/changeExtension";
import { Command } from "commander";
import { prompt } from "enquirer";

/* 
    command: 
        scaffold-it change-extension -p <path>
        scaffold-it change-extension --path <path>
*/

const registerChangeExtension = async (program: Command) => {
    return program
        .command('change-extension')
        .description('Change .js* files to .ts* in a folder (recursively)')
        .option('-p, --path <path>', 'target folder path', 'src')
        .action(async (opts) => {
            const { target } = await prompt<{ target: string }>({
                type: 'input',
                name: 'target',
                message: 'Which folder should we target?',
                initial: opts.path || './src',
            });
            await changeExt(target);
        });
};

export default registerChangeExtension;