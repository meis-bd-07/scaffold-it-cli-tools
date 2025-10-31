import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { CONFIG_FILES, eslintIgnoreRules } from '@types/core';
import { IAnyObject } from '@types/type';

function updateEslintConfig(filePath:string, rules: IAnyObject) {
  const ext = path.extname(filePath);

  if (ext === '.json') {
    const config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    config.rules = config.rules || {...rules};
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
    console.log(chalk.greenBright(`✅ Updated eslint setup: ${filePath}`));
  } else if (ext === '.js' || ext === '.cjs') {
    let content = fs.readFileSync(filePath, 'utf-8');

    if (!content.includes('@typescript-eslint/ban-ts-comment')) {
        const rulesToAdd = Object.entries(rules)
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    return `'${key}': ${JSON.stringify(value)},`;
                } else if (typeof value === 'object') {
                    return `'${key}': ${JSON.stringify(value, null, 2)},`;
                } else {
                    return `'${key}': '${value}',`;
                }
            }).join('\n    ');

        const rulesRegex = /rules\s*:\s*{([^}]*)}/;

        if (rulesRegex.test(content)) {
            // Add to existing rules section
            content = content.replace(rulesRegex, (match, p1) => {
            return `rules: {${p1}\n    ${rulesToAdd}\n  }`;
            });
        } else {
            // Create new rules section
            const exportRegex = /(module\.exports\s*=\s*{)/;
            content = content.replace(exportRegex, `$1\n  rules: {\n    ${rulesToAdd}\n  },`);
        }

        fs.writeFileSync(filePath, content);
        console.log(chalk.greenBright(`✅ Updated ESLint setup: ${filePath}`));
    } else {
        console.log(chalk.dim(`ℹ️ ESLint rules already included`));
    }
  } else {
    console.log(`⚠️ Skipped unsupported file type: ${filePath}`);
  }
}

function findAndUpdateEslintConfig(rules: IAnyObject = eslintIgnoreRules) {
  const root = process.cwd();
  for (const file of CONFIG_FILES) {
    const filePath:string = path.join(root, file);
    if (fs.existsSync(filePath)) {
      updateEslintConfig(filePath, rules);
      return;
    }
  }
  console.log(chalk.dim('❌ No ESLint config found in project root.'));
}

export default findAndUpdateEslintConfig;
