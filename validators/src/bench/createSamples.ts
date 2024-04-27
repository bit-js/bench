import { create } from '@bit-js/web-utils';

const randomID = create.randomID(10);

function randomizeValue(o: any) {
    switch (typeof o) {
        case 'string': return randomID();
        case 'number': return Math.round(Math.random() * 500);
        case 'boolean': return !Math.round(Math.random());
        case 'object':
            const newObj: Record<any, any> = {};

            for (const key in o)
                newObj[key] = randomizeValue(o[key]);

            return newObj;
        default: return o;
    }
}

export default function createSamples<T>(count: number, sample: T): T[] {
    const arr = new Array<T>(count);

    for (let i = 0; i < count; ++i)
        arr[i] = randomizeValue(sample);

    return arr;
}
