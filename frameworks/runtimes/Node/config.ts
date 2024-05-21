import { dbPath } from '@db';
import type { Env, RuntimeConfig } from '@typings/runtime';
import { $ } from 'bun';

const env: Env = {
    NODE_ENV: 'production',
    DB_PATH: dbPath
};

const version = await $`node -v`.text();

const config: RuntimeConfig = {
    run: (path, cwd) => Bun.spawn(['node', path], { env, cwd, stdout: 'inherit' }),

    async build(cwd) {
        console.log('Installing dependencies...');
        await $`cd ${cwd} && bun i`;
    },

    // Remove the `v` at the beginning
    version: version.substring(1)
};

export default config;
