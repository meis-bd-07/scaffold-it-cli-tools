export type IPackageManager = 'npm' | 'yarn' | 'pnpm';
export type IFramework = 'React' | 'React Native' | 'React with Vite' | 'Node.js' | 'Nest.js' | 'Next.js';

export interface IChangeExtensionOpts {
    ignoreDeps: boolean;
    path: string;
    ignoreTestFile: boolean;
}

export interface IChangeExtensionCommand {
    targetDir: string;
    framework: IFramework;
    packageManager: IPackageManager;
    ignoreDeps?: boolean;
    ignoreTest?: boolean;
}