import express from 'express';
import createDB from 'better-sqlite3';

const db = createDB(process.env.DB_PATH);
const items = db.prepare('select * from Items limit 10');

const app = express()
    .get('/', (_, res) => {
        res.end('Hi');
    })
    .get('/user/:id', (req, res) => {
        res.end(req.params.id);
    })
    .get('/items', (_, res) => {
        res.json(items.all());
    });

app.listen(3000);
