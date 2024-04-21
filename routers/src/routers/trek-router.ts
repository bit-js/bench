// @ts-ignore
import TrekRouter from 'trek-router';
import { type Router, routes, Context } from '@routes';

const router = new TrekRouter();

for (let i = 0, { length } = routes; i < length; ++i) {
    const route = routes[i];
    router.add(route.method, route.path, route.handler);
}

export default {
    name: 'TrekRouter',
    match(req) {
        const ctx = new Context(req);

        const res = router.find(req.method, ctx.path);
        if (typeof res[0] === 'undefined') return null;

        ctx.params = res[1];
        return res[0](ctx);
    }
} satisfies Router;
