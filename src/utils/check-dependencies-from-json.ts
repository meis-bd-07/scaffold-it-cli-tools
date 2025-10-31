import { IPackageJsonCore } from "@types/type";
import chalk from "chalk";

const checkDependencyFromJson = (jsonData: IPackageJsonCore = {}, deps: string[] = []) => {
    const allDeps = {...jsonData.dependencies || {}, ...jsonData.devDependencies || {}}
    let hasDependencyIssue = false;
    deps.forEach(dep => {
        if(allDeps[dep]){
            console.log(chalk.green(`✅ ${dep} found (version: ${allDeps[dep]}.)`))
        } else{
            console.log(chalk.red(`📦 ${dep} not found in dependencies !`))
            hasDependencyIssue = true;
        }
    })
    return hasDependencyIssue;
};

export default checkDependencyFromJson;