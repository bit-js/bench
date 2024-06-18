import { Byte, send } from '@bit-js/byte';
import { Database } from 'bun:sqlite';
import { dbPath } from '@db';

const db = new Database(dbPath);
const items = db.query('select * from Items limit 10');

export default new Byte()
    .get('/', send.body('Hi'))
    .get('/user/:id', (ctx) => ctx.body(`Hi ${ctx.params.id}`))
    .get('/items', (ctx) => ctx.json(items.all()));
