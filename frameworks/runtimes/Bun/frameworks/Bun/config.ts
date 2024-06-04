import type { FrameworkConfig } from '@typings/framework';

const options: FrameworkConfig = {
  version: Bun.version.substring(0, Bun.version.lastIndexOf('.')),
  main: 'app.ts'
};

export default options;

