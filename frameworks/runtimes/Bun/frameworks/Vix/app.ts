import fun from 'vixeny/fun';
import { Database } from 'bun:sqlite';
import { dbPath } from '@db';

const db = new Database(dbPath);
const items = db.query('select * from Items limit 10');

const msg = new Response('Hi');

export default {
    fetch: fun()([
        {
            path: '/',
            type: 'response',
            r: () => msg.clone()
        },
        {
            path: '/user/:id',
            param: { unique: true },
            f: (ctx) => `Hi ${ctx.param}`
        },
        {
            path: '/items',
            f: () => JSON.stringify(items.all())
        }
    ])
}
