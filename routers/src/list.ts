import blitz from './routers/blitz';
import blitzEdge from './routers/blitz-edge';

import honoRegexp from './routers/hono-regexp';
import honoTrie from './routers/hono-trie';

import memoirist from './routers/memoirist';
import trekRouter from './routers/trek-router';
import findMyWay from './routers/find-my-way';

export default [
    blitz, blitzEdge,
    honoRegexp, honoTrie,
    memoirist, trekRouter, findMyWay
];
