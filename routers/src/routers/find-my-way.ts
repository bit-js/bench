import findMyWay from 'find-my-way';
import { type Router, routes, Context } from '@routes';

const router = findMyWay();

for (let i = 0, { length } = routes; i < length; ++i) {
    const route = routes[i];
    router.on(route.method as any, route.path, route.handler);
}

export default {
    name: 'Fastify FindMyWay',
    match(req) {
        const ctx = new Context(req);
        const res = router.find(req.method as any, ctx.path);

        if (res === null) return null;
        ctx.params = res?.params;

        // @ts-ignore
        return res.handler(ctx);
    }
} satisfies Router;

