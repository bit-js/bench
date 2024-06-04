import { Database } from 'bun:sqlite';

// DB
const db = new Database(Bun.env.DB_PATH);
const items = db.query('select * from Items limit 10');

// Responses
const jsonInit = { headers: [['Content-Type', 'application/json']] };
const msg = new Response('Hi');

export default {
  fetch: ({ url }: Request) => {
    const { length } = url;
    const startIdx = url.indexOf('/', 12) + 1;

    let endIdx = url.indexOf('?', startIdx);
    if (endIdx === -1) endIdx = length;

    if (startIdx === endIdx) return msg.clone();

    switch (url.charCodeAt(startIdx)) {
      case 105:
        return url.charCodeAt(startIdx + 1) === 116 &&
          url.charCodeAt(startIdx + 2) === 101 &&
          url.charCodeAt(startIdx + 3) === 109 &&
          url.charCodeAt(startIdx + 4) === 115 &&
          endIdx === startIdx + 5
          ? new Response(JSON.stringify(items.all()), jsonInit)
          : null

      case 117:
        return url.charCodeAt(startIdx + 1) === 115 &&
          url.charCodeAt(startIdx + 2) === 101 &&
          url.charCodeAt(startIdx + 3) === 114 &&
          url.charCodeAt(startIdx + 4) === 47 &&
          url.indexOf('/', startIdx + 5) === -1
          ? new Response(`Hi ${url.substring(startIdx + 6)}`)
          : null;
    }
  }
};
