import chalk from "chalk";

const abortCommandHandler = () => {
    // Handle Ctrl + C
    process.on("SIGINT", () => {
        console.log(chalk.yellow("\nCancelled by user (Ctrl+C / SIGINT)."));
        process.exit(130);
    });

    // Handle ESC
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding("utf8");
        process.stdin.on("data", (key: string) => {
            if (key === '\u0003') {
                console.log(chalk.yellow("\nExiting (Ctrl+C detected)"));
                process.exit();
            } else if (key === '\u001b') {
                console.log(chalk.yellow("\nExiting (ESC detected)"));
                process.exit();
            }
        });
    }
};

export default abortCommandHandler;