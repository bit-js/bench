import type { RuntimeConfig } from '@typings/runtime';

const env: Record<string, string> = {
    NODE_ENV: 'production',

    BUN_JSC_jitPolicyScale: '0.0',
    BUN_JSC_thresholdForOptimizeSoon: '0.0',
    BUN_JSC_thresholdForJITSoon: '0.0'
};

const config: RuntimeConfig = {
    run: (path, cwd) => Bun.spawn(['bun', 'run', path], { env, cwd, stdout: 'inherit' }),
    build(cwd) {
        console.log('Installing dependencies...');
        Bun.spawnSync(['bun', 'i'], { cwd });
    },
    version: Bun.version
};

export default config;
