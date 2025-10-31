export const IGNORED_DIRS = ['node_modules', 'dist', 'build', 'bin', 'dist', 'build', '.git', '.husky', '.vscode'];
export const reactTypes = ['react', 'react-dom', '@types/react', '@types/react-dom'];
export const reactNativeTypes = ['react', 'react-native', '@types/react', '@types/react-native'];
export const nodeTypes = ['node', 'express', '@types/node', '@types/express'];

export const frameworkDeps = {
    'React': reactTypes,
    'React Native': reactNativeTypes,
    'React with Vite': [],
    'Node.js': nodeTypes,
    'Nest.js': [],
    'Next.js': [],
}

export const CONFIG_FILES = [
  '.eslintrc.js',
  '.eslintrc.cjs',
  '.eslintrc.json',
  '.eslintrc.yml',
  '.eslintrc.yaml',
  'eslint.config.js',
];
export const eslintIgnoreRules = {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
}
