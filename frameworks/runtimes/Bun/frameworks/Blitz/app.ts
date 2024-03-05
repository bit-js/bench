import Blitz from '@bit-js/blitz';

const init = {
    headers: { 'Content-Type': 'application/json' }
};

// Create a router
const router = new Blitz();

router.put('GET', '/', () => new Response('Hi'));
router.put('GET', '/user/:id', (ctx) => new Response(ctx.params.id));
router.put('POST', '/json', () => new Response(
    JSON.stringify({ time: performance.now() }), init
));

// Get the fetch function
export default { fetch: router.build() };
