import { compile } from '@bit-js/vld';

export const nestedObject = compile.assert({
    type: 'object',
    properties: {
        number: { type: 'number' },

        negNumber: { type: 'number' },
        maxNumber: { type: 'number' },

        string: { type: 'string' },
        longString: { type: 'string' },

        boolean: { type: 'boolean' },

        deeplyNested: {
            type: 'object',
            properties: {
                foo: { type: 'string' },
                num: { type: 'number' },
                bool: { type: 'boolean' }
            },
            required: ['foo', 'num', 'bool']
        }
    },
    required: [
        'number', 'negNumber', 'maxNumber',
        'string', 'longString', 'boolean', 'deeplyNested'
    ]
});

export const userList = compile.assert({
    type: 'array',
    items: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            age: { type: 'number' },
            nickname: { type: 'string' }
        },
        required: ['name', 'age']
    }
});
