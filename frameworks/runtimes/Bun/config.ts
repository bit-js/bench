import type { Env, RuntimeConfig } from '@typings/runtime';
import { $ } from 'bun';

const env: Env = { 
    NODE_ENV: 'production',
    
    BUN_JSC_jitPolicyScale: '0.0',
    BUN_JSC_thresholdForOptimizeSoon: '0.0',
    BUN_JSC_thresholdForJITSoon: '0.0',
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
