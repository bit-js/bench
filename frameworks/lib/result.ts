import type { FrameworkConfig } from '@typings/framework';
import type { Test } from '@typings/global';
import type { FileSink } from 'bun';
import fixNum from './utils/fixNum';

interface FrameworkResults {
    values: number[];

    runtime: string;
    version: string;

    avg: number;
    total: number;
}

type ParsedResult = [framework: string, runtime: string, avg: number, ...number[]];

function compareParsedResult(a: ParsedResult, b: ParsedResult) {
    return b[2] - a[2];
}

export class ResultWriter {
    readonly writer: FileSink;
    readonly runtimeVersionsBuilder: string[] = [];

    results: Record<string, FrameworkResults> = {};

    /**
     * Target file
     */
    constructor(readonly categories: Test[], path: string = './results.md') {
        this.writer = Bun.file(path).writer();
    }

    prepareFramework(runtime: string, framework: string, config: FrameworkConfig) {
        this.results[framework] = {
            values: [],

            avg: 0,
            total: 0,

            version: config.version,
            runtime
        };
    }

    /**
     * Set the version for a runtime
     */
    setRuntimeVersion(runtime: string, version: string) {
        this.runtimeVersionsBuilder.push('**', runtime, '**', ': ', version, '\n');
    }

    /**
     * Set the test result for a framework
     * Result must be added corresponds to the category order
     */
    addResult(framework: string, result: number) {
        const frameworkStore = this.results[framework];
        frameworkStore.values.push(result);
        frameworkStore.total += result;
    }

    /**
     * Calculate other fields based on existing fields
     */
    finalizeResult(framework: string) {
        const frameworkStore = this.results[framework];
        frameworkStore.avg = fixNum(frameworkStore.total / frameworkStore.values.length);
    }

    [Symbol.dispose]() {
        // Write results label
        const labels = ['Frameworks', 'Runtime', 'Average'];

        for (const category of this.categories)
            labels.push(category.name);

        this.writer.write(`| ${labels.join(' | ')} |`);
        this.writer.write('\n');

        // Write delimiters
        this.writer.write(`|${' :---: |'.repeat(labels.length)}\n`);

        // Sort the results
        const resultArray: ParsedResult[] = [];
        const { results } = this;

        for (const framework in results)
            resultArray.push([
                framework, results[framework].runtime,
                results[framework].avg, ...results[framework].values
            ]);
        resultArray.sort(compareParsedResult);

        // Render all results
        for (const result of resultArray) {
            this.writer.write(`| ${result.join(' | ')} |`);
            this.writer.write('\n');
        }
        this.writer.write('\n');

        // Write runtime versions
        this.writer.write(this.runtimeVersionsBuilder.join('\n'));

        // Flush
        this.writer.end();
    }
}
