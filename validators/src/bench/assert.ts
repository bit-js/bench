import validators from '../validators/assert';
import { group, bench, run } from 'mitata';
import createSamples from './createSamples';

for (let i = 0; i < 15; ++i) bench('noop', () => { });

const samplesCount = 1e4;

group('Nested object', () => {
    const data = createSamples(samplesCount, {
        number: 12,

        negNumber: -3,
        maxNumber: 100,

        string: 'str',
        longString: '2345678ogjnboiu',

        deeplyNested: {
            foo: 'foo',
            num: 56,
            bool: true
        }
    });

    for (const name in validators) {
        // @ts-ignore
        const f = validators[name].nestedObject;
        bench(name, () => data.forEach(f));
    }
});

group('User list', () => {
    const data = createSamples(samplesCount, [
        {
            name: 'A',
            age: 18
        },
        {
            name: 'B',
            age: 20,
            nickname: 'C'
        }
    ]);

    for (const name in validators) {
        // @ts-ignore
        const f = validators[name].userList;
        bench(name, () => data.forEach(f));
    }
});

run();
