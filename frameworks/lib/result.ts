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

type ParsedResult = [framework: string, version: string, runtime: string, avg: number, ...number[]];

function compareParsedResult(a: ParsedResult, b: ParsedResult) {
    return b[3] - a[3];
}

export class ResultWriter {
    readonly writer: FileSink;
    readonly minimalWriter: FileSink;
    readonly runtimeVersions: string[] = [];

    results: Record<string, FrameworkResults> = {};

    /**
     * Target file
     */
    constructor(readonly categories: Test[], path: string = './results.md', minimalResultPath: string = './results.txt') {
        this.writer = Bun.file(path).writer();
        this.minimalWriter = Bun.file(minimalResultPath).writer();
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
        this.runtimeVersions.push(runtime, version);
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

    compileResults() {
        const resultArray: ParsedResult[] = [];
        const { results } = this;

        for (const framework in results)
            resultArray.push([
                framework, results[framework].version, results[framework].runtime,
                results[framework].avg, ...results[framework].values
            ]);
        resultArray.sort(compareParsedResult);
        return resultArray;
    }

    writeResult(resultArray: ParsedResult[]) {
        const labels = ['Frameworks', 'Version', 'Runtime', 'Average'];
        for (const category of this.categories)
            labels.push(category.name);

        const { writer } = this;

        writer.write(`| ${labels.join(' | ')} |\n|${' :---: |'.repeat(labels.length)}`);

        // Write all results
        for (let i = 0, { length } = resultArray; i < length; ++i)
            writer.write(`\n| ${resultArray[i].join(' | ')} |`);

        const { runtimeVersions } = this;
        for (let i = 0, { length } = runtimeVersions; i < length; i += 2)
            writer.write(`\n\n**${runtimeVersions[i]}**: ${runtimeVersions[i + 1]}`);

        return writer;
    }

    writeMinimalResult(resultArray: ParsedResult[]) {
        const { minimalWriter } = this;

        // Write all results
        {
            const [result] = resultArray;
            minimalWriter.write(`${result[0]} ${result[1]}: ${result[3]}`);
        }

        for (let i = 1, { length } = resultArray; i < length; ++i) {
            const result = resultArray[i];
            minimalWriter.write(`\n${result[0]} ${result[1]}: ${result[3]}`);
        }

        return minimalWriter;
    }

    [Symbol.dispose]() {
        const results = this.compileResults();
        this.writeResult(results).end();
        this.writeMinimalResult(results).end();
    }
}
