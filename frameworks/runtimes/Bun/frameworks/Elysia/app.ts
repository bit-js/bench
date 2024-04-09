import { Elysia } from 'elysia';

const app = new Elysia()
    // Basic routes
    .get('/', 'Hi')
    .get('/user/:id', (ctx) => ctx.params.id)

    // Parsing stuff
    .post('/json', () => ({ time: performance.now() }));

app.listen(3000);
