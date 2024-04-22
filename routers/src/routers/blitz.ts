import Blitz from '@bit-js/blitz';
import { type Router, routes, Context } from '@routes';

const router = new Blitz();

for (let i = 0, { length } = routes; i < length; ++i) {
    const route = routes[i];
    router.put(route.method, route.path, route.handler);
}

export default {
    name: 'Blitz',
    match: router.build(Context)
} satisfies Router;
