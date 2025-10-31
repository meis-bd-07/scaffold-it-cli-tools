export type IAnyObject<T extends Record<string, unknown> = Record<string, unknown>> = T;

export type IPackageJsonCore = IAnyObject<{
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
    [key: string]: unknown;
}>;