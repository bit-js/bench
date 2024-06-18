import type { FrameworkConfig } from '@typings/framework';
import router from './app';

const options: FrameworkConfig = {
    version: '1.3',
    main: 'index.ts',

    build: (cwd) => Bun.write(cwd + '/output.ts', router.inline({
        routerImportSource: './app',
        contextImportSource: '@bit-js/blitz'
    }))
};

export default options;
