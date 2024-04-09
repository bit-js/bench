import { readdirSync } from 'fs';
import { resolve } from 'path';

import config from '../config';

import { ResultWriter } from './result';

import type { RuntimeConfig } from '@typings/runtime';
import type { FrameworkConfig } from '@typings/framework';

function getDefault(imports: any) {
    return imports.default;
}

using writer = new ResultWriter(config.tests);

// Check every runtimes
const runtimesPath = resolve('./runtimes');
const isTestMode = Bun.env.NODE_ENV === 'test';

for (const runtimeName of readdirSync(runtimesPath)) {
    const runtimePath = `${runtimesPath}/${runtimeName}`;

    const runtimeConfig: RuntimeConfig = await import(`${runtimePath}/config.ts`).then(getDefault);
    console.log(`'${runtimeName}': ${JSON.stringify(runtimeConfig)}`);

    writer.setRuntimeVersion(runtimeName, runtimeConfig.version);

    // Run each framework
    for (const frameworkName of readdirSync(`${runtimePath}/frameworks`)) {
        const frameworkPath = `${runtimePath}/frameworks/${frameworkName}`;
        const frameworkConfig: FrameworkConfig = await import(`${frameworkPath}/config.ts`).then(getDefault);

        console.log(`Preparing framework: ${frameworkName}`);

        // Run build script
        if (typeof runtimeConfig.build === 'function')
            await runtimeConfig.build(frameworkPath);
        if (typeof frameworkConfig.build === 'function')
            await frameworkConfig.build(frameworkPath);

        // Prepare result store
        writer.prepareFramework(runtimeName, frameworkName, frameworkConfig);

        // Boot up the server
        const serverProcess = runtimeConfig.run(`${frameworkPath}/${frameworkConfig.main}`, frameworkPath);
        Bun.sleepSync(7000);

        try {
            // Test the server 
            for (const test of config.tests) {
                await config.validateTest(test);
                if (isTestMode) continue;

                // Result is added in the order of tests
                const result = await config.runTest(test);
                writer.addResult(frameworkName, result);
            }
        } catch (e) {
            console.log(`${frameworkName} failed!`, e);
            process.exit();
        } finally {
            // End the server
            serverProcess.kill();
            writer.finalizeResult(frameworkName);
        }

        Bun.sleepSync(1000);
    }
}
