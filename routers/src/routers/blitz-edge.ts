import { EdgeRouter } from '@bit-js/blitz';
import { type Router, routes, RequestContext } from '@routes';

const router = new EdgeRouter();

for (let i = 0, { length } = routes; i < length; ++i) {
    const route = routes[i];
    router.put(route.method, route.path, route.handler);
}

export default {
    name: 'Blitz EdgeRouter',
    match: router.build(RequestContext)
} satisfies Router;
