import chalk from "chalk";

const abortCommandHandler = () => {
    process.on("SIGINT", () => {
        console.log(chalk.yellow("\nCancelled by user (SIGINT)."));
        process.exit(130); // 128+2
    });
};

export default abortCommandHandler;