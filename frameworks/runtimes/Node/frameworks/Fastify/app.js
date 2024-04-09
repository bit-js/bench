import fastify from 'fastify';
import createDB from 'better-sqlite3';

const db = createDB(process.env.DB_PATH);
const items = db.prepare('select * from Items limit 50');

fastify()
    .get('/', () => 'Hi')
    .get('/user/:id', (req) => req.params.id)
    .get('/items', () => items.all())
    .listen({ port: 3000 });
