const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charsetLen = charset.length;

function rand() {
    let parts = '';
    let len = 5 + Math.floor(Math.random() * 10);

    while (len > 0) {
        parts += charset[Math.floor(Math.random() * charsetLen)];
        --len;
    }

    return parts;
}

export default function buildPath(path: string) {
    let parts: string = '';

    let paramIdx = path.indexOf(':');
    let start = 0;

    while (paramIdx !== -1) {
        if (paramIdx !== start) parts += path.substring(start, paramIdx);

        ++paramIdx;
        start = path.indexOf('/', paramIdx);

        if (start === -1) {
            parts += rand();
            return parts;
        }

        parts += rand();
        paramIdx = path.indexOf(':', start + 1);
    };

    // Wildcard check
    parts += path.charCodeAt(path.length - 1) === 42
        ? `${path.substring(start, path.length - 2)}/${rand()}`
        : path.substring(start);

    return parts;
}

