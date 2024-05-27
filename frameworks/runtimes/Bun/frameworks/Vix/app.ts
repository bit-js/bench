import fun from 'vixeny/fun';
import { Database } from 'bun:sqlite';

const db = new Database(Bun.env.DB_PATH);
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
            path: '/user/:id/and/:name',
            f: ({ param }) => param.id + param.name
        },
        {
            path: '/items',
            f: () => JSON.stringify(items.all())
        }
    ])
}
