import { Hono } from 'hono';
import { Database } from 'bun:sqlite';

const db = new Database(Bun.env.DB_PATH);
const items = db.query('select * from Items limit 10');

export default new Hono()
    .get('/', (ctx) => ctx.body('Hi'))
    .get('/user/:id/and/:name', (ctx) => {
        const { req } = ctx;
        return ctx.body(req.param('id') + req.param('name'));
    })
    .get('/items', (ctx) => ctx.json(items.all()));
