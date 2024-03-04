import { $ } from 'bun';

import type { GlobalConfig } from '@typings/global';

import requestBody from './assets/body.json';
import fixNum from './lib/utils/fixNum';

function toURL(path: string) {
    return `http://localhost:3000${path}`;
}

// Make everything as random as possible
function makePart(charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$1234567890') {
    const result = [];
    const charsetLen = charset.length;
    const length = 30 + Math.round(Math.random() * 160);

    for (let cnt = 0; cnt < length; ++cnt)
        result.push(charset[Math.floor(Math.random() * charsetLen)]);

    return result.join('');
}

const randomID = makePart();

const config: GlobalConfig = {
    tests: [
        {
            name: 'Static',
            description: 'Should return "Hi" as a response',

            path: '/',
            method: 'GET',

            async validate(res) {
                if (!res.ok) throw new Error('Response is not ok');
                if (await res.text() !== 'Hi') throw new Error('Response body should be "Hi"');
            }
        },
        {
            name: 'Query',
            description: 'Should return the query value as a response',

            path: `/user/${randomID}`,
            method: 'GET',

            async validate(res) {
                if (!res.ok) throw new Error('Response is not ok');
                if (await res.text() !== randomID) throw new Error('Response body should be corresponding to the ID parameter value');
            }
        },
        {
            name: 'JSON',
            description: 'Should return the JSON body message as a response',

            path: '/json',
            method: 'POST',
            bodyFile: './assets/body.json',

            async validate(res) {
                if (!res.ok) throw new Error('Response is not ok');

                const body = await res.json();
                if (!Bun.deepEquals(body, requestBody.message)) throw new Error(`Response body should be the JSON body sent, instead recieved: ${body}`);
            }
        }
    ],

    // Validate each test
    async validateTest(test) {
        console.info(`- Running test "${test.name}"`);

        test.validate(await fetch(toURL(test.path), {
            method: test.method,
            body: typeof test.bodyFile === 'string'
                ? await Bun.file(test.bodyFile).text()
                : null
        }));
    },

    /**
     * Run the benchmark
     */
    async runTest(test) {
        const args = [
            'bombardier', '--fasthttp',
            // Default options 
            '--connections', '1000',
            '--duration', '30s',
            // Print format
            '--format', 'json',
            '--print', 'result'
        ];

        if (typeof test.method === 'string')
            args.push('--method', test.method);
        if (typeof test.bodyFile === 'string')
            args.push('--body-file', test.bodyFile);

        args.push(toURL(test.path));

        const output = await $`${args}`.text();
        const res = JSON.parse(output).result.rps.mean;

        console.log(`* Mean: ${res}`);
        return fixNum(res);
    }
};

export default config;
