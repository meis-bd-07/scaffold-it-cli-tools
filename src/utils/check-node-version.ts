import chalk from "chalk";

const checkNodeVersion = async () => {
    /* 1️⃣ Check Node.js version */
    const nodeVersion = process.version.replace('v', '');
    const [major] = nodeVersion.split('.').map(Number);

    if (isNaN(major) || major < 18) {
      console.error(chalk.red(`❌ Node.js v18 or higher required. Found: ${process.version}`));
      process.exit(1);
    }
    console.log(chalk.green(`✔ Node.js version: ${process.version}`));
}

export default checkNodeVersion;