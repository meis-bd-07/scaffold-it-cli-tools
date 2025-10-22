import { Command } from "commander";

const aboutCli = (program: Command) => {
    return program
    .name('scaffold-it')
    .description('Scaffold-IT CLI - scaffold & utility commands')
    .version('0.1.0');
}

export default aboutCli;