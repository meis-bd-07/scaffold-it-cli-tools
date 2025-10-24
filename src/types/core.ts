/* types */
export type IAnyObject<T extends Record<string, unknown> = Record<string, unknown>> = T;

export type IPackageJsonCore = IAnyObject<{
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
    [key: string]: unknown;
}>;


/* data */
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