import { type Route, routes, type Router } from '@routes';
import list from '@routers';

import { group, run, bench } from 'mitata';

async function validate(router: Router, route: Route) {
    const res = router.match(route.req);
    console.log(res)
    const text = res ? await res.text() : '';

    if (text !== route.id) {
        console.log(route);
        console.log(res);

        console.log(`Router: '${router.name}'. Expected ID: '${route.id}'. Instead recieved: '${text}'.`);
        process.exit(1);
    }
}

// Avoid JIT bias
for (let i = 0; i < 15; ++i)
    bench('noop', () => { });

for (let i = 0, { length } = routes; i < length; ++i) {
    const route = routes[i];

    group(`${route.method} ${route.path}`, () => {
        for (let j = 0, { length } = list; j < length; ++j) {
            const router = list[j];
            validate(router, route);

            bench(router.name, () => router.match(route.req));
        }
    });
}

run();
