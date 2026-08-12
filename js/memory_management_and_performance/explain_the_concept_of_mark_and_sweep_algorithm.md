The mark-and-sweep algorithm is the primary garbage collection algorithm used by JavaScript engines. It works in two phases: marking all reachable objects, then sweeping (freeing) all unmarked objects.

**Phase 1 — Marking**:
Starting from a set of "roots" (the global object, the current call stack, and closures), the algorithm traverses all references recursively. Every object it can reach is marked as "alive."

```
Roots: [global, stack variables, closures]
  → object A (marked)
    → object B (marked)
      → object D (marked)
  → object C (marked)
    → object E (marked)

Object F: not reachable from any root → NOT marked
Object G: not reachable from any root → NOT marked
```

**Phase 2 — Sweeping**:
The algorithm scans the entire heap. Any object that was not marked is considered garbage and its memory is reclaimed.

```
Before sweep: [A, B, C, D, E, F, G]
After sweep:  [A, B, C, D, E]  — F and G freed
```

**Advantages over reference counting** (the older approach):
- Handles circular references. Two objects referencing each other but unreachable from roots will both be collected.
```
function createCycle() {
  let a = {};
  let b = {};
  a.ref = b;
  b.ref = a;
  // When createCycle returns, a and b form a cycle
  // but are unreachable from roots → collected by mark-sweep
}
```
- Reference counting cannot handle this because both objects always have a reference count > 0.

**Modern enhancements** (V8 Orinoco):

- **Tri-color marking**: Objects are categorized as white (unvisited), gray (discovered but not yet scanned), and black (fully scanned). This enables incremental work.
- **Incremental marking**: Instead of marking all objects at once (which causes pauses), the engine does small marking steps between JavaScript execution.
- **Concurrent marking**: Marking work runs on background threads, reducing main-thread pauses.
- **Lazy sweeping**: The actual memory reclamation is deferred and done incrementally.

The algorithm has some overhead—reachable objects must be traced, and memory may become fragmented. Compaction (moving objects together) is sometimes performed after sweeping to reduce fragmentation, though it is expensive.
