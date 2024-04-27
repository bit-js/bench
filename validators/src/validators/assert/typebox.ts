import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { TypeSystemPolicy } from '@sinclair/typebox/system';

TypeSystemPolicy.AllowArrayObject = true;

function compile(type: any) {
    // @ts-expect-error Check func is normally private
    return TypeCompiler.Compile(type).checkFunc;
}

export const nestedObject = compile(
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
);

export const userList = compile(
    Type.Array(Type.Object({
        name: Type.String(),
        age: Type.Number(),
        nickname: Type.Optional(Type.String())
    }))
)


