export interface FrameworkConfig {
    /**
     * The framework version
     */
    version: string;

    /**
     * The main file
     */
    main: string;

    /**
     * Build script
     */
    build?(cwd: string): Promise<any>;
}
