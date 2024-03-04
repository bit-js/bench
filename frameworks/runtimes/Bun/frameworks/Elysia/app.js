import { Elysia } from 'elysia';

const app = new Elysia()
    // Basic routes
    .get('/', 'Hi')
    .get('/user/:id', (ctx) => ctx.params.id)

    // Parsing stuff
    .post('/json', (ctx) => ctx.body, { type: 'json' });

app.listen(3000);
