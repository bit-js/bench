import { Byte } from '@bit-js/byte';
import { Database } from 'bun:sqlite';

const db = new Database(Bun.env.DB_PATH);
const items = db.query('select * from Items limit 50');

export default new Byte()
    .get('/', (ctx) => ctx.body('Hi'))
    .get('/user/:id', (ctx) => ctx.body(ctx.params.id))
    .get('/items', (ctx) => ctx.json(items.all()));
