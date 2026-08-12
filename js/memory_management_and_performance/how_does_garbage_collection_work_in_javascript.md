Garbage collection (GC) in JavaScript is an automatic memory management process that frees memory occupied by objects that are no longer reachable by the running code. Developers do not manually allocate or deallocate memory—the JavaScript engine handles it.

JavaScript primarily uses the **mark-and-sweep** algorithm (explained in detail in another answer). The engine periodically traces from "roots" (global object, currently executing stack, closures) and marks all reachable objects. Unmarked objects are considered garbage and their memory is reclaimed.

**Generational garbage collection**: Modern engines (V8, SpiderMonkey) divide the heap into generations:

- **Young generation (nursery)**: Where new objects are allocated. Most objects are short-lived (temporary variables, function-scoped objects). GC here is fast and frequent (scavenge/young collection).
- **Old generation**: Objects that survive multiple young GC cycles are promoted here. GC here is less frequent but more expensive (mark-sweep-compact).

When an object survives a GC cycle in the young generation, it is copied to the old generation. This is based on the observation that most objects die young (the "generational hypothesis").

**V8's garbage collector** (Orinoco):

- **Scavenge**: Fast minor GC for the young generation. Uses semi-space copying.
- **Mark-Sweep-Compact**: Major GC for the old generation. Marks live objects, sweeps dead ones, and compacts memory to reduce fragmentation.
- **Incremental marking**: Breaks marking work into smaller chunks to avoid long pauses.
- **Concurrent marking**: Runs marking on background threads while the main thread continues executing.
- **Idle-time GC**: Performs GC work during idle periods (using `requestIdleCallback`).

**What triggers GC**: The engine decides when to run GC based on memory allocation rate, heap size, and heuristics. You cannot force GC directly (though `global.gc()` exists in Node.js with `--expose-gc`).

**Best practices**: Avoid unnecessary object allocation, nullify references to large objects when done, prefer primitive types when possible, and be mindful of closures retaining references to unused data.
