import { group, bench, run } from 'mitata';
import { FileSystemRouter } from '@bit-js/blitz';

const reqs = ['/index.html', '/styles/globals.css', '/scripts/index.js'].map((path) => new Request('http://localhost:3000' + path));

group('Bun', () => {
  // Native
  const native = new Bun.FileSystemRouter({
    style: 'nextjs',
    dir: 'public'
  });

  const nativeFetch = (req: Request) => native.match(req)?.filePath;
  bench('Native', () => reqs.map(nativeFetch));

  // Custom
  const custom = new FileSystemRouter({
    on: (path) => path,
    scan: (dir) => new Bun.Glob('**/*').scanSync(dir)
  }).scan('public');

  const customFetch = (req: Request) => custom(req).result;
  bench('Custom', () => reqs.map(customFetch));
});

run();
