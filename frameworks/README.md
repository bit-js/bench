# Web framework benchmark
This benchmark requires `bombardier` and `bun`.

## Install
If you don't have Go installed, check out [go.dev](//go.dev/doc/install).

To install `bombardier`:
```bash
# Install the CLI without a `go.mod` file
go install -mod=mod github.com/codesenberg/bombardier

# Check after install
bombardier --version
```

To install `bun`, check out the guide [here](//bun.sh/docs/installation).

## Usage

To run the benchmark:
```bash
# Install required dependencies
bun i

# Run the benchmark
bun bench
```

The results are in [results.md](./results.md)

The global config [file](./config.ts) contains tests and test validators.

Configs for runtimes are located in `runtimes/:runtime/config.ts`.

Configs for frameworks are located in `runtimes/:runtime/frameworks/:framework/config.ts`.

See type definitions for each type of config [here](./lib/types).
