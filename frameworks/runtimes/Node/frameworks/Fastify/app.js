import fastify from 'fastify';
import createDB from 'better-sqlite3';

const db = createDB(process.env.DB_PATH);
const items = db.prepare('select * from Items limit 10');

fastify({ logger: false })
    .get('/', () => 'Hi')
    .get('/user/:id/and/:name', ({ params }) => params.id + params.name)
    .get('/items', () => items.all())
    .listen({ port: 3000 });
