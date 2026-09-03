# WebMCP Contract Evals

KPGS Agent Mission Control now treats its browser WebMCP surface as a testable contract, not only as UI code.

These evals are deliberately static and deterministic. They do **not** replace the required real-client WebMCP run in `docs/WEBMCP_VALIDATION.md`; instead, they fail CI when the source-level agent contract drifts away from the governed workflow that the runtime proof is expected to exercise.

## What CI protects

`tests/webmcp-contract.test.ts` verifies that:

1. exactly seven challenge tools are exposed, in the canonical order;
2. `document.modelContext` support is feature-detected before registration;
3. tool registrations are scoped to an `AbortController` lifecycle;
4. external evidence is marked with `untrustedContentHint: true` and returned as evidence, never authorization;
5. read-only tools are annotated read-only and mutating tools are not;
6. `request_approval` produces `AWAITING_HUMAN`, removes the recommended next tool, and tells the agent to stop;
7. `commit_transition` explicitly rejects inferred approval and delegates authority to the deterministic governance kernel;
8. the canonical agent sequence places `STOP_FOR_HUMAN_APPROVAL` before the post-human state refresh and commit;
9. governed input schemas reject undeclared arguments.

The existing `tests/governance.test.ts` independently verifies that:

- prompt-injected evidence cannot manufacture approval;
- unstaged transitions cannot commit;
- missing evidence blocks commit even when approval exists;
- stale approval bindings are rejected after evidence changes;
- only the exact human approval binding authorizes commit.

Together, these two suites protect both sides of the proof:

```text
WebMCP agent contract
        |
        v
browser tools
        |
        v
deterministic KPGS authority kernel
        |
        v
human-bound transition receipt
```

## What these evals do not claim

Static contract evals cannot prove that a particular browser client discovered or called the tools correctly. That proof remains runtime-owned and must be captured with a real WebMCP-capable client before submission.

See:

- `docs/WEBMCP_VALIDATION.md`
- `docs/FINAL_SUBMISSION_RUNBOOK.md`
- issue #2
