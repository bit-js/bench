import { $ } from 'bun';
import type { GlobalConfig } from '@typings/global';
import fixNum from './lib/utils/fixNum';
import { getTopItems } from './lib/db';

function toURL(path: string) {
    return `http://127.0.0.1:3000${path}`;
}

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

            path: `/user/[a-z][a-z][0-9]/and/[a-z][a-z][0-9]`,
            method: 'GET',

            async validate(res) {
                if (!res.ok) {
                    console.log('Body:', await res.text());
                    console.log('Info:', res);
                    throw new Error('Response should be ok');
                }
            }
        },
        {
            name: 'DB Query',
            description: 'Query from table Items and return the top 10 items in JSON',

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
        const url = toURL(test.path ?? test.pathRegex!);
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
            'oha',
            // Default options 
            '-c', '500',
            '-z', '20s',
            // Print format
            '--json',
            '--no-tui',
            '--ipv4'
        ];

        if (typeof test.method === 'string')
            args.push('--method', test.method);
        if (typeof test.bodyFile === 'string')
            args.push('-D', test.bodyFile);

        if (typeof test.path === 'string')
            args.push(toURL(test.path));
        else
            args.push('--rand-regex-url', toURL(test.pathRegex!));

        console.log(args);
        const res = JSON.parse(
            await $`${args}`.text()
        ).summary.requestsPerSec;

        console.log(`* Mean: ${res}`);
        return fixNum(res);
    }
};

export default config;
