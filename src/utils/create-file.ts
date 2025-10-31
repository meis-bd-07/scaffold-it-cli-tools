import chalk from "chalk";
import fs from "fs";
import path from "path";
import readJSONFile from "./read-json";
import deepMerge from "./deep-merge";
import { IAnyObject } from "@types/type";

const createFile = async (dir: string, fileName: string, content: null | string | IAnyObject = null, activeDeepMerge: boolean = false) => {
    const filePath = path.join(dir, fileName);
    // Check if directory exists
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Check if file exists
    if (fs.existsSync(filePath)) {
        console.log(chalk.blueBright(`✅ ${fileName} already exists — appending content...`));
        if(content) {
            if(activeDeepMerge){
                let previousContent = await readJSONFile(filePath, true);
                const newContent = deepMerge(previousContent, content as IAnyObject);
                fs.writeFileSync(filePath, JSON.stringify(newContent, null, 2))
            } else{
                fs.appendFileSync(filePath, `\n${content}`)
            }
        };
    } else {
        console.log(chalk.green(`📄 Creating new ${fileName} file...`));
        fs.writeFileSync(filePath, (typeof content === "string" ? content : JSON.stringify(content, null, 2)) || "");
    }
};

export default createFile;