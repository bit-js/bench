# Validators benchmark
Benchmarking validator performance.

Install all dependencies:
```bash
bun i
```

Run the benchmark.
```bash
# Bun JIT
bun bun-jit src/bench/[benchname].ts

# Bun JITLess
bun bun-jitless src/bench/[benchname].ts

# Node
bun tsx src/bench/[benchname].ts
```
