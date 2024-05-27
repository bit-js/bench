import type { Subprocess } from 'bun';

export interface RuntimeConfig {
    /**
     * Execute a program using the current runtime
     * @param path The absolute path to the target file
     */
    run(path: string, cwd: string): Subprocess;

    /**
     * Default build command
     */
    build?(cwd: string): Promise<any>;

    /**
     * Current runtime version
     */
    version: string;
}

export interface Env extends Record<string, string> {
    NODE_ENV: 'production',
    DB_PATH: typeof import('@db').dbPath
}
