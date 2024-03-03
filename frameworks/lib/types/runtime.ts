import type { Subprocess } from 'bun';

export interface RuntimeConfig {
    /**
     * Execute a program using the current runtime
     * @param path The absolute path to the target file
     */
    run(path: string, cwd: string): Subprocess;

    /**
     * Current runtime version
     */
    version: string;
}
