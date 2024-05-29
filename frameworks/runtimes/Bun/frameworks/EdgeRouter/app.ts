import { EdgeRouter } from '@bit-js/blitz';
import { Database } from 'bun:sqlite';

// DB
const db = new Database(Bun.env.DB_PATH);
const items = db.query('select * from Items limit 10');

// Responses
const jsonInit = {
    headers: [['Content-Type', 'application/json']]
};
const msg = new Response('Hi');

const router = new EdgeRouter();

router.on('GET', '/', () => msg.clone());
router.on('GET', '/user/:id', (ctx) => new Response(`Hi ${ctx.params.id}`));
router.on('GET', '/items', () => new Response(JSON.stringify(items.all()), jsonInit));

export default { fetch: router.build() };

