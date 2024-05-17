import { EdgeRouter } from '@bit-js/blitz';
import { type Router, routes, Context } from '@routes';

const router = new EdgeRouter();

for (let i = 0, { length } = routes; i < length; ++i) {
    const route = routes[i];
    router.on(route.method, route.path, route.handler);
}

export default {
    name: 'Blitz EdgeRouter',
    match: router.build(Context)
} satisfies Router;
