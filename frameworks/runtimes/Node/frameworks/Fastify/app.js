import fastify from 'fastify';

fastify()
    .get('/', () => 'Hi')
    .get('/user/:id', (req) => req.params.id)
    .post('/json', () => ({ time: performance.now() }))
    .listen({ port: 3000 });
