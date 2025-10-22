import chalk from 'chalk';
import fs, { Stats } from 'fs';
import path from 'path';

// const isFileExist = async (file: string, type: 'file' | 'directory' = 'file', root: string | null = null) => {
//     const pkgPath = root ? path.join(root, file) : file;

//     fs.stat(pkgPath, (err: unknown, stats: Stats) => {
//         if (err) {
//             console.log(chalk.red(`❌ ${file} File does not exist`));
//             console.log(chalk.dim(`\n💡 Details: ${err instanceof Error ? err.message : err}`));
//             process.exit(1);
//         } else {
//             if(type === 'file' && !stats.isFile()){
//                 console.log(chalk.red(`\n📄 ${file} is not a file.`));
//                 process.exit(1);
//             }
//             else if(type === 'directory' && !stats.isDirectory()){
//                 console.log(chalk.red(`\n📁 ${file} is not a directory.`));
//                 process.exit(1);
//             }
//         } 
//     })
//     return pkgPath;
// };

export const isFileExist = async (file: string, type: 'file' | 'directory' = 'file', root: string | null = null, exit: boolean = false): Promise<string> => {
    const pkgPath = root ? path.join(root, file) : file;
    try {
        const stats: Stats = await fs.promises.stat(pkgPath);
        if (type === 'file' && !stats.isFile()) {
            console.log(chalk.red(`📄 ${file} is not a file.`));
            if(exit){ process.exit(1) }
        }

        if (type === 'directory' && !stats.isDirectory()) {
            console.log(chalk.red(`📁 ${file} is not a directory.`));
            if(exit){ process.exit(1) }
        }
        return pkgPath;
    } catch (err) {
        console.log(chalk.red(`❌ ${file} does not exist.`));
        console.log(chalk.dim(`💡 Details: ${err instanceof Error ? err.message : err}`));
        if(exit){ process.exit(1) }
        return "";
    }
};

export default isFileExist;