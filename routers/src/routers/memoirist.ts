import Memoirist from 'memoirist';
import { type Router, routes, Context } from '@routes';

const router = new Memoirist<(ctx: Context) => Response>();

for (let i = 0, { length } = routes; i < length; ++i) {
    const route = routes[i];
    router.add(route.method, route.path, route.handler);
}

export default {
    name: 'Memoirist',
    match(req) {
        const ctx = new Context(req);

        const res = router.find(req.method, ctx.path);
        if (res === null) return null;

        ctx.params = res.params;
        return res.store(ctx);
    }
} satisfies Router;
