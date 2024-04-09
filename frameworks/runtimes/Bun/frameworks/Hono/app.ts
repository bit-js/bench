import { Hono } from 'hono';

export default new Hono()
    // Basic routes
    .get('/', (ctx) => ctx.body('Hi'))
    .get('/user/:id', (ctx) => ctx.body(ctx.req.param('id')))

    // Parsing stuff
    .post('/json', (ctx) => ctx.json({ time: performance.now() }));
