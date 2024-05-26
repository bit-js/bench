import type { Env, RuntimeConfig } from '@typings/runtime';
import { $ } from 'bun';
import { dbPath } from '@db';

const env: Env = {
    NODE_ENV: 'production',
    DB_PATH: dbPath,

    BUN_JSC_reoptimizationRetryCounterMax: '1000',
    BUN_JSC_jitPolicyScale: '0.0',
    BUN_JSC_thresholdForJITAfterWarmUp: '0',

    BUN_JSC_thresholdForOptimizeSoon: '0',
    BUN_JSC_thresholdForFTLOptimizeSoon: '0',

    BUN_JSC_maximumOptimizationDelay: '0'
};

const config: RuntimeConfig = {
    run: (path, cwd) => Bun.spawn(['bun', 'run', path], { env, cwd, stdout: 'ignore' }),

    async build(cwd) {
        console.log('Installing dependencies...');
        await $`cd ${cwd} && bun i`;
    },

    version: Bun.version
};

export default config;
