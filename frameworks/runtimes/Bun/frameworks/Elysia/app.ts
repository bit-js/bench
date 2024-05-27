import { Elysia } from 'elysia';
import { Database } from 'bun:sqlite';

const db = new Database(Bun.env.DB_PATH);
const items = db.query('select * from Items limit 10');

const app = new Elysia()
    .get('/', 'Hi')
    .get('/user/:id', (ctx) => `Hi ${ctx.params.id}`)
    .get('/items', () => items.all());

app.listen(3000);
