import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const root = process.cwd();
const require = createRequire(join(root, 'package.json'));
const tsc = require.resolve('typescript/bin/tsc');
const ignoredDirectories = new Set(['.git', '.next', '.nx', 'coverage', 'dist', 'node_modules']);
const configs = [];

function findConfigs(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        findConfigs(join(directory, entry.name));
      }
      continue;
    }

    if (
      entry.name === 'tsconfig.json' &&
      (directory.endsWith('/apps/movie-center-web') ||
        directory.endsWith('/apps/movie-center-web-e2e'))
    ) {
      configs.push(join(directory, entry.name));
    } else if (/^tsconfig\.(app|lib|spec)\.json$/.test(entry.name)) {
      configs.push(join(directory, entry.name));
    }
  }
}

findConfigs(root);
configs.sort();

for (const config of configs) {
  const configPath = relative(root, config);
  console.log(`Type-checking ${configPath}`);

  const result = spawnSync(
    process.execPath,
    [tsc, '--noEmit', '--pretty', 'false', '--project', configPath],
    { cwd: root, stdio: 'inherit' },
  );

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
