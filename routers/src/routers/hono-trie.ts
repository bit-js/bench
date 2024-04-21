import { TrieRouter } from 'hono/router/trie-router';
import { type Router, routes, Context } from '@routes';

const router = new TrieRouter<(ctx: Context) => Response>();

for (let i = 0, { length } = routes; i < length; ++i) {
    const route = routes[i];
    router.add(route.method, route.path, route.handler);
}

export default {
    name: 'Hono TrieRouter',
    match(req) {
        const ctx = new Context(req);

        const res = router.match(req.method, ctx.path)[0];
        if (res.length === 0) return null;

        ctx.params = res[0][1];
        return res[0][0](ctx);
    }
} satisfies Router;

