import type { Env, RuntimeConfig } from '@typings/runtime';
import { $ } from 'bun';
import { dbPath } from '@db';

const env: Env = {
    NODE_ENV: 'production',
    DB_PATH: dbPath
};

const config: RuntimeConfig = {
    run: (path, cwd) => Bun.spawn(['bun', 'run', path], { env, cwd }),

    build(cwd) {
        console.log('Installing dependencies...');
        return $`cd ${cwd} && bun i`;
    },

    version: Bun.version
};

export default config;
