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

for (const runtimeName of readdirSync(runtimesPath)) {
    const runtimePath = `${runtimesPath}/${runtimeName}`;

    const runtimeConfig: RuntimeConfig = await import(`${runtimePath}/config.ts`).then(getDefault);
    console.log(`'${runtimeName}': ${JSON.stringify(runtimeConfig)}`);

    writer.setRuntimeVersion(runtimeName, runtimeConfig.version);

    // Run each framework
    for (const frameworkName of readdirSync(`${runtimePath}/frameworks`)) {
        const frameworkPath = `${runtimePath}/frameworks/${frameworkName}`;
        const frameworkConfig: FrameworkConfig = await import(`${frameworkPath}/config.ts`).then(getDefault);

        // Run build script
        if (typeof frameworkConfig.build === 'function')
            frameworkConfig.build(frameworkPath);

        // Prepare result store
        writer.prepareFramework(runtimeName, frameworkName, frameworkConfig);

        // Boot up the server
        const serverProcess = runtimeConfig.run(`${frameworkPath}/${frameworkConfig.main}`, frameworkPath);

        console.log(`Preparing framework: ${frameworkName}`);
        await Bun.sleep(10000);

        // Test the server 
        for (const test of config.tests) {
            await config.validateTest(test);
            await Bun.sleep(10000);

            // Result is added in the order of tests
            const result = await config.runTest(test);
            writer.addResult(frameworkName, result);
        }

        // End the server
        serverProcess.kill();
        writer.finalizeResult(frameworkName);
    }
}
