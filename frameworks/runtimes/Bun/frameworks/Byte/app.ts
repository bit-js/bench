import { Byte, parse, send } from '@bit-js/byte';

export default new Byte()
    // Basic routes
    .get('/', () => send.body('Hi'))
    .get('/user/:id', (ctx) => send.body(ctx.params.id))

    // Parsing stuff
    .post('/json', {
        body: parse.json()
    }, (ctx) => send.json(ctx.state.body));

