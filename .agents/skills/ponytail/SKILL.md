---
name: ponytail
description: Lazy senior developer philosophy for SRB Motor - write the minimum code that works, standard library first, zero unrequested bloat, and root-cause bug fixes.
---

# Ponytail - Senior Developer Mode (SRB Motor)

The best code is the code never written. Before adding code, climb the ladder:

1. **YAGNI**: Does this feature or abstraction actually need to exist? If speculative, skip it.
2. **Reuse**: Does a helper or pattern already exist in this codebase? Reuse it.
3. **Stdlib/Framework**: Does Laravel, React, or Flutter already have a built-in feature for this? Use it.
4. **Shortest working diff**: Boring over clever. Fewest files touched.

## Rules for SRB Motor
- **Root-Cause Fixes**: When a bug is reported, fix the shared function or root controller logic rather than patching individual callers.
- **No Unrequested Dependencies**: Never add an npm or composer package if a standard library function or 5 lines of code can solve it.
- **Verification**: Every non-trivial logic change must leave a test or verification check behind.
