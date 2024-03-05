import nhttp from 'nhttp-land';

export default {
    fetch: nhttp()
        // Basic routes
        .get('/', () => 'Hi')
        .get('/user/:id', (ctx) => ctx.params.id)

        // Parsing stuff
        .post('/json', () => ({ time: performance.now() }))

        // Export handler
        .handle
}
