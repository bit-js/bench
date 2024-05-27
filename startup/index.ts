import config from "./config";

const buf = new Uint8Array(35);

function createParts(length: number) {
  const parts = new Array(length);

  for (let i = 0; i < length; ++i) {
    crypto.getRandomValues(buf);

    const partLen = (Math.random() * 5 >>> 0) + 5;
    for (let i = 0; i < partLen; ++i)
      buf[i] = buf[i] % 26 + 97;

    parts[i] = String.fromCharCode(...buf.slice(0, partLen));
  }

  return parts;
}

function producePath(parts: string[]) {
  return `/${parts.join('/')}`;
}

function createPaths(count: number, length: number, params: number) {
  // Decide parameter indices
  const paramsArr = new Array<number>(params);

  for (let i = 0; i < params; ++i)
    paramsArr[i] = i;

  // Shuffling
  for (let i = params; i > 0; --i) {
    const rand = Math.random() * i >>> 0;
    const temp = paramsArr[i - 1];

    paramsArr[i - 1] = paramsArr[rand];
    paramsArr[rand] = temp;
  }

  // Create paths
  const paths = new Array<string[]>(count);

  for (let i = 0; i < count; ++i)
    paths[i] = createParts(length);

  for (let i = 0; i < params; ++i)
    paths[i][paramsArr[i]] = `:${paths[i][paramsArr[i]]}`;

  return paths.map(producePath);
}

// Main code
const samples = createPaths(config.pathCount, config.pathLength, config.paramsCount);

async function run(name: string, content: string) {
  const file = `${import.meta.dir}/dist/${name}.js`;

  const quoted = JSON.stringify(name);
  await Bun.write(file, `console.time(${quoted});${content};console.timeEnd(${quoted});`);

  return Bun.$`bun run ${file}`;
}

// Register frameworks
run('Quark', `
import { Quark } from '@bit-js/quark';

const app = new Quark();
${samples.map(path => `app.get('${path}', (ctx) => ctx.body('${path}'))`).join('\n')}
app.fetch(new Request('http://localhost:3000'));
`);

run('Hono', `
import { Hono } from 'hono/quick';
import { LinearRouter } from 'hono/router/linear-router';

const app = new Hono({ router: new LinearRouter() });
${samples.map(path => `app.get('${path}', (ctx) => ctx.body('${path}'));`).join('\n')}
app.fetch(new Request('http://localhost:3000'));
`);
