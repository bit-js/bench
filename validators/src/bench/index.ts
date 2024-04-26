import validators from '../validators';
import { group, bench, run } from 'mitata';

for (let i = 0; i < 15; ++i) bench('noop', () => { });

group('Assert', () => {
    const data = {
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
    };

    for (const name in validators) {
        // @ts-ignore
        const f = validators[name];
        console.log(name, f.toString());

        bench(name, () => f(data));
    }
});

run();
