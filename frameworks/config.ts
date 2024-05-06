import { $ } from 'bun';
import type { GlobalConfig } from '@typings/global';
import fixNum from './lib/utils/fixNum';
import { getTopItems } from './lib/db';

function toURL(path: string) {
    return `http://127.0.0.1:3000${path}`;
}

const length = Math.round(Math.random() * 20);

// Make everything as random as possible
function makePart(charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$1234567890') {
    const result = [];
    const charsetLen = charset.length;

    for (let cnt = 0; cnt < length; ++cnt)
        result.push(charset[Math.floor(Math.random() * charsetLen)]);

    return result.join('');
}

const randomID = makePart();

const config: GlobalConfig = {
    tests: [
        {
            name: 'Text',
            description: 'Should return "Hi" as a response',

            path: '/',
            method: 'GET',

            async validate(res) {
                if (!res.ok) throw new Error('Response is not ok');
                if (await res.text() !== 'Hi') throw new Error('Response body should be "Hi"');
            }
        },
        {
            name: 'Params',
            description: 'Should return the query value as a response',

            path: `/user/${randomID}`,
            method: 'GET',

            async validate(res) {
                if (!res.ok) {
                    console.log('Body:', await res.text());
                    console.log('Info:', res);
                    throw new Error('Response should be ok');
                }

                if (await res.text() !== randomID) throw new Error('Response body should be corresponding to the ID parameter value');
            }
        },
        {
            name: 'DB Query',
            description: 'Query from table Items and return the top 50 items in JSON',

            path: '/items',
            method: 'GET',

            async validate(res) {
                if (!res.ok) {
                    console.log('Body:', await res.text());
                    console.log('Info:', res);
                    throw new Error('Response should be ok');
                }

                const body = await res.json() as any;
                const expected = getTopItems();

                if (!Bun.deepEquals(body, expected)) {
                    console.log('Expected:', expected);
                    console.log('Recieve:', body);

                    throw new Error(`Body is invalid`);
                }
            }
        }
    ],

    // Validate each test
    async validateTest(test) {
        const url = toURL(test.path);
        console.info(`- Running test "${test.name}": "${url}"`);

        test.validate(await fetch(url, {
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
            '--connections', '500',
            '--duration', '20s',
            // Print format
            '--format', 'json',
            '--print', 'result'
        ];

        if (typeof test.method === 'string')
            args.push('--method', test.method);
        if (typeof test.bodyFile === 'string')
            args.push('--body-file', test.bodyFile);

        args.push(toURL(test.path));

        const res = JSON.parse(
            await $`${args}`.text()
        ).result.rps.mean;

        console.log(`* Mean: ${res}`);
        return fixNum(res);
    }
};

export default config;
