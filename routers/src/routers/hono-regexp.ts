import { RegExpRouter } from 'hono/router/reg-exp-router';
import { type Router, routes, Context } from '@routes';

const router = new RegExpRouter<(ctx: Context) => Response>();

for (let i = 0, { length } = routes; i < length; ++i) {
    const route = routes[i];
    router.add(route.method, route.path, route.handler);
}

export default {
    name: 'Hono RegExpRouter',
    match(req) {
        const ctx = new Context(req);

        const res = router.match(req.method, ctx.path);
        if (res[0].length === 0) return null;

        const params = ctx.params = {} as Record<string, string>;

        const match = res[1] as string[];
        const paramsIdx = res[0][0][1];

        for (const key in paramsIdx)
            params[key] = match[paramsIdx[key] as number];

        return res[0][0][0](ctx);
    }
} satisfies Router;
