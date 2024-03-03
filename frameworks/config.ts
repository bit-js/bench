import type { GlobalConfig } from '@typings/global';
import requestBody from './assets/body.json';

function toURL(path: string) {
    return `http://localhost:3000${path}`;
}

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

            path: '/user/:id',
            method: 'GET',

            async validate(res) {
                if (!res.ok) throw new Error('Response is not ok');
                if (await res.text() !== ':id') throw new Error('Response body should be corresponding to the ID parameter value');
            }
        },
        {
            name: 'JSON',
            description: 'Should return the JSON body as a response',

            path: '/json',
            method: 'POST',
            bodyFile: './assets/body.json',

            async validate(res) {
                if (!res.ok) throw new Error('Response is not ok');
                if (!Bun.deepEquals(await res.json(), requestBody)) throw new Error('Response body should be the JSON body sent');
            }
        }
    ],

    // Validate each test
    async validateTest(test) {
        console.info(`- Running test "${test.name}"`);
        console.info(`+ ${test.description}`);

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
    runTest(test) {
        const args = [
            'bombardier', '--fasthttp',
            // Default options 
            '--connections', '250',
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

        const output = Bun.spawnSync(args).stdout.toString();
        console.log(output);

        const res = JSON.parse(output).result.rps.mean;

        console.log(`* Mean: ${res}`);
        return +(+res).toFixed(2);
    }
};

export default config;
