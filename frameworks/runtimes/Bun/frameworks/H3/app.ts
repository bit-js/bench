import {
    createApp,
    createRouter,
    defineEventHandler,
    toWebHandler,
    setResponseHeader
} from 'h3';

const app = createApp().use(
    createRouter()
        // Basic routes
        .get('/', defineEventHandler(() => 'Hi'))
        .get('/user/:id', defineEventHandler((event) => event.context.params!.id))

        // Parsing stuff
        .post('/json', defineEventHandler((event) => {
            setResponseHeader(event, 'Content-Type', 'application/json');
            return { time: performance.now() };
        }))
);

export default { fetch: toWebHandler(app) };
