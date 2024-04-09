import type { RuntimeConfig } from '@typings/runtime';
import { $ } from 'bun';

const env: Record<string, string> = {
    NODE_ENV: 'production'
};

const version = await $`node -v`.text();

const config: RuntimeConfig = {
    run: (path, cwd) => Bun.spawn(['node', path], { env, cwd, stdout: 'inherit' }),

    async build(cwd) {
        console.log('Installing dependencies...');
        await $`cd ${cwd} && bun update`;
    },

    // Remove the `v` at the beginning
    version: version.substring(1)
};

export default config;
