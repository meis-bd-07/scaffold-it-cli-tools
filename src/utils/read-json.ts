const fs = require('fs').promises;
import { parse } from "jsonc-parser";

async function readJSONFile(file: string, advancedParse: boolean = false){
  try{
    const txt = await fs.readFile(file, 'utf8');
    if(advancedParse) { return parse(txt) }
    return JSON.parse(txt);
  }
  catch {
    return {} 
  }
}

export default readJSONFile;