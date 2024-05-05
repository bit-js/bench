import Blitz from '@bit-js/blitz';
import { Database } from 'bun:sqlite';

const db = new Database(Bun.env.DB_PATH);
const items = db.query('select * from Items limit 50');

const jsonInit = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const router = new Blitz();

router.put('GET', '/', () => new Response('Hi'));
router.put('GET', '/user/:id', (ctx) => new Response(ctx.params.id));
router.put('GET', '/items', () => new Response(JSON.stringify(items.all()), jsonInit));

export default { fetch: router.build() };
