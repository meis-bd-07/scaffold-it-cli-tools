import { execa } from 'execa';

export async function runCommand(cmd: string, args: string[] = [], opts = {}) {
  const cp = execa(cmd, args, { stdio: 'inherit', ...opts });
  await cp;
}
