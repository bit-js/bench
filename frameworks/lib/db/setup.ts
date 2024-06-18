import { dbPath } from '@db';
import { Database } from 'bun:sqlite';

const authors = ['A', 'B', 'C', 'D', 'E'];
const authorsCount = authors.length;

const db = new Database(dbPath, { create: true });

export function prepareDatabase() {
  console.log('Initializing database...');

  // Check whether the table does exists
  if (db.prepare('select name from sqlite_schema where type="table" and name="Items"').get() === null) {
    console.log('Initializing database tables...');

    // Create the table
    db.run(`create table Items ( id varchar(255) primary key, author varchar(255) not null, price integer )`);

    const insert = db.query(`insert into Items (id, author, price) values ($0, $1, $2)`);
    for (let i = 1; i < 201; ++i)
      insert.run(i, authors[i % authorsCount], Math.round(Math.random() * 1024));
  } else console.log('Database tables already initialized!');
}

export function getTopItems() {
  return db.prepare('select * from Items limit 10').all();
}
