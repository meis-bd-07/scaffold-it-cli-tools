import chalk from "chalk";
import { Command } from "commander";

/* 
    command: scaffold-it hello
*/

const testCli = (program: Command) => {
    return program
        .command("hello")
        .description("test command")
        .action(() => {
            console.log(chalk.green("scaffold-it is wired up ✅"));
        });
}

export default testCli;