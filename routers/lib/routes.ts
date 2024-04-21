import buildPath from './buildPath';

export interface Router {
    name: string;
    match(req: Request): Response | null | undefined;
}

export class Route {
    static currentID: number = 0;

    readonly handler: () => Response;
    readonly req: Request;

    readonly id: string;

    constructor(readonly path: string, readonly method: string) {
        this.path = path;
        this.method = method;
        this.req = new Request('http://127.0.0.1' + buildPath(path), { method });

        const currentId = this.id = `${++Route.currentID}`;
        this.handler = () => new Response(currentId);
    }
}

function route(path: string, method?: string) {
    return typeof method === 'undefined' ? new Route(path, 'GET') : new Route(path, method);
}

export const routes = [
    route('/'), route('/user'), route('/user/avatar'),
    route('/user/lookup/username/:username'),
    route('/user/lookup/email/:address'), route('/event/:id'),
    route('/event/:id/comments'), route('/event/:id/comment', 'POST'),
    route('/map/:location/events'), route('/status'), route('/static/*'),
    route('/very/deeply/nested/route/hello/there')
];

// Use for Blitz EdgeRouter
export class RequestContext {
    readonly path: string;
    readonly params: any;

    constructor(req: Request) {
        const start = req.url.indexOf('/', 12) + 1;
        const end = req.url.indexOf('?', start);

        this.path = end === -1 ? req.url.substring(start) : req.url.substring(start, end);
    }
}

export class Context {
    readonly path: string;
    params: any;

    constructor(req: Request) {
        const start = req.url.indexOf('/', 12);
        const end = req.url.indexOf('?', start + 1);

        this.path = end === -1 ? req.url.substring(start) : req.url.substring(start, end);
    }
}
