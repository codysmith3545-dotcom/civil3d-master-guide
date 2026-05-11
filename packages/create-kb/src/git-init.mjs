// git init + initial commit helper.

import { spawnSync } from 'node:child_process';

export async function runGitInit(cwd, message) {
  const env = { ...process.env, GIT_TERMINAL_PROMPT: '0' };
  const opts = { cwd, stdio: 'inherit', env };

  const initRes = spawnSync('git', ['init', '-q'], opts);
  if (initRes.status !== 0) throw new Error('git init failed');

  spawnSync('git', ['add', '-A'], opts);

  // Use -c overrides so we don't depend on user-global config being set.
  const commitRes = spawnSync(
    'git',
    [
      '-c', 'user.email=scaffold@example.com',
      '-c', 'user.name=create-knowledge-base',
      '-c', 'commit.gpgsign=false',
      'commit', '-q', '-m', message,
    ],
    opts
  );
  if (commitRes.status !== 0) {
    // Non-fatal — the repo is initialized, just no commit yet.
    console.warn('  git commit failed (possibly empty tree). Continuing.');
  }
}
