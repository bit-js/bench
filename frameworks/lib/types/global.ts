export interface Test {
    name: string;
    description: string;

    path: string;
    method?: string;

    headers?: Record<string, string>;
    bodyFile?: string;

    validate(res: Response): Promise<void>;
}

export interface GlobalConfig {
    tests: Test[];

    /**
     * Execute tests and produce errors if result is invalid
     */
    validateTest(test: Test): Promise<void>;

    /**
     * Run the test and return the result
     */
    runTest(test: Test): Promise<number>;
}
