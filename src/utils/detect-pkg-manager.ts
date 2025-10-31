import path from 'path';

function fsSyncExists(p: string){ try { require('fs').accessSync(p); return true;} catch { return false;} }

const detectPkgManager = (root: string) => {
    if (fsSyncExists(path.join(root, 'yarn.lock'))) return 'yarn';
    if (fsSyncExists(path.join(root, 'pnpm-lock.yaml'))) return 'pnpm';
    return 'npm';
};

export default detectPkgManager;