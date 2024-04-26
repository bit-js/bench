import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { TypeSystemPolicy } from '@sinclair/typebox/system';

TypeSystemPolicy.AllowArrayObject = true;

export default TypeCompiler.Compile(
    Type.Object({
        number: Type.Number(),

        negNumber: Type.Number(),
        maxNumber: Type.Number(),

        string: Type.String(),
        longString: Type.String(),

        boolean: Type.Boolean(),

        deeplyNested: Type.Object({
            foo: Type.String(),
            num: Type.Number(),
            bool: Type.Boolean()
        })
    })
    // @ts-expect-error Check func is normally private
).checkFunc;
