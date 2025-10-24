import fs from 'fs';
import path from 'path';

function formatWalkDirectories(dir: string, depth = 0): { name: string; value: string }[] {
  const items = fs.readdirSync(dir);
  let result: { name: string; value: string }[] = [];

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const isDir = fs.statSync(fullPath).isDirectory();
    const indent = '  '.repeat(depth);
    const displayName = isDir ? `📁 ${indent}${item}/` : `📄 ${indent}${item}`;

    result.push({ name: displayName, value: fullPath });

    if (isDir) {
      result = result.concat(formatWalkDirectories(fullPath, depth + 1));
    }
  }

  return result;
}

export default formatWalkDirectories;