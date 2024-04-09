import { Byte, send } from '@bit-js/byte';
import { Database } from 'bun:sqlite';

const db = new Database(Bun.env.DB_PATH);
const items = db.query('select * from Items limit 50');

export default new Byte()
    .get('/', () => send.body('Hi'))
    .get('/user/:id', (ctx) => send.body(ctx.params.id))
    .get('/items', () => send.json(items.all()));
