import chalk from "chalk";
import { execSync } from 'child_process';

const checkNpmVersion = () => {
    const npmVer = execSync('npm -v', { encoding: 'utf8' }).trim();
    console.log(chalk.green(`✔ npm version: ${npmVer}`));
    return 'npm';
}

const checkYarnVersion = () => {
    const yarnVer = execSync('yarn -v', { encoding: 'utf8' }).trim();
    console.log(chalk.green(`✔ yarn version: ${yarnVer}`));
    return 'yarn';
}

const checkPnpmVersion = () => {
    const pnpmVer = execSync('pnpm -v', { encoding: 'utf8' }).trim();
    console.log(chalk.green(`✔ pnpm version: ${pnpmVer}`));
    return 'pnpm';
}

const checkPkgManagerVersion = async (manager: null | "npm" | "yarn" | "pnpm" = null ) => {
    /* 2️⃣ Check npm/yarn/pnpm availability */
    try{
        let packageManager = '';
        if(manager){
            switch(manager){
                case "npm": 
                    packageManager = checkNpmVersion();
                    break;
                case "yarn": 
                    packageManager = checkYarnVersion();
                    break;
                case "pnpm":
                    packageManager = checkPnpmVersion();
                    break;
                default:
                    console.error(chalk.red('❌ No package manager found (npm, yarn, or pnpm). Please install one.'));
                    process.exit(1);
            }
        }
        else {
            packageManager = checkNpmVersion();
            if(!packageManager){
                packageManager = checkYarnVersion();
            }
            if(!packageManager){
                packageManager = checkPnpmVersion();
            }
            if(!packageManager){
                console.error(chalk.red('❌ No package manager found (npm, yarn, or pnpm). Please install one.'));
                process.exit(1);
            }
        }
        return packageManager;
    }
    catch {
        console.error(chalk.red('❌ No package manager found (npm, yarn, or pnpm). Please install one.'));
        process.exit(1);
    }
};

export default checkPkgManagerVersion;