import { Hono } from 'hono';
import { Database } from 'bun:sqlite';
import { dbPath } from '@db';

const db = new Database(dbPath);
const items = db.query('select * from Items limit 10');

export default new Hono()
    .get('/', (ctx) => ctx.body('Hi'))
    .get('/user/:id', (ctx) => ctx.body(`Hi ${ctx.req.param('id')}`))
    .get('/items', (ctx) => ctx.json(items.all()));
