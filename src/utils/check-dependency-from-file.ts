import chalk from 'chalk';
import readJSONFile from './read-json';
import { IAnyObject } from '@type/global';

type IOptions = {
    fileData?: IAnyObject | null;
    needReturn?: boolean
}

const checkDependencyFromFile = async (filePath: string, dependency: string, options: IOptions = {fileData: null, needReturn: false}) => {
  const pkg = options.fileData ?? await readJSONFile(filePath);
  const deps = pkg.dependencies || {};
  const devDeps = pkg.devDependencies || {};
  let found = false;

  if (deps[dependency]) {
    console.log(chalk.green(`✅ ${dependency} found in dependencies (version: ${deps.typescript})`));
    found = true;
  } else if (devDeps[dependency]) {
    console.log(chalk.green(`✅ ${dependency} found in devDependencies (version: ${devDeps.typescript})`));
    found = true;
  }
  if(!found){
    console.log(chalk.yellow(`⚠️ ${dependency} not found in either dependencies or devDependencies.`));
    process.exit(1);
  }
  if(options.needReturn){
    return pkg;
  }
};

export default checkDependencyFromFile;
