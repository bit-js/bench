# Web framework benchmark

This benchmark requires `oha` and `bun`.

## Usage

To run the benchmark:

```bash
# Install required dependencies
bun i

# Run the benchmark
bun bench
```

The results are in [results.md](./results.md), measured in average requests per seconds.

The global config [file](./config.ts) contains tests and test validators.

Configs for runtimes are located in `runtimes/:runtime/config.ts`.

Configs for frameworks are located in `runtimes/:runtime/frameworks/:framework/config.ts`.

See type definitions for each type of config [here](./lib/types).
