import { schema } from '@bit-js/vld';

export default schema.compile({
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
