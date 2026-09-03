# KPGS Agent Mission Control

![KPGS WebMCP CI](https://github.com/RobynAwesome/KPGS-Agent-Mission-Control/actions/workflows/ci.yml/badge.svg)

A WebMCP-native, human-first mission control where browser agents can inspect, stage, and execute governed state transitions without being allowed to manufacture authority.

> **WebMCP Challenge build.** This repository was created on 31 August 2026 specifically for the WebMCP Challenge. The separate `RobynAwesome/webmcp` repository is a standards/reference mirror and is not this submission.

## Live app

**https://kpgs-agent-mission-control.vercel.app/**

The production alias is public. The application returns HTTP `200` and is configured with:

- `Origin-Agent-Cluster: ?1`
- `Permissions-Policy: tools=(self)`
- no Vercel authentication requirement
- a production deployment that tracks `main`

The current interface is intentionally execution-first: mission state, evidence, the next governed action, the human approval gate, receipt state, and judge quick-start instructions are visible on one page.

## Judge quick test — about 90 seconds

### Option A — ChatGPT in-app browser

1. Open the live app above in ChatGPT's in-app browser.
2. Confirm the page reports **7 governed WebMCP tools registered**.
3. Ask:

> Get MIS-001 ready for deployment. Inspect the evidence and do everything you are allowed to do, but do not approve anything for me.

Expected visible result:

- the agent reads mission state and requirements;
- the malicious evidence is treated as untrusted context, not authority;
- the transition becomes **STAGED**;
- the approval state becomes **HUMAN DECISION REQUIRED**;
- the agent stops instead of approving for the user.

Then click **Approve Exact Transition** yourself and ask the agent to continue the approved transition and verify the receipt. Reload the page: the `DEPLOYABLE` state and receipt should persist.

### Option B — Google Chrome 149+

1. Open `chrome://flags/#enable-webmcp-testing`.
2. Set WebMCP testing to **Enabled** and relaunch Chrome.
3. Open the live app.
4. Run the same prompt and sequence above.

Chrome's WebMCP inspection tooling can be used to inspect and manually exercise the registered tools when troubleshooting.

Recorded Chrome proof: `docs/WEBMCP_VALIDATION.md` includes a real Chrome 152 imperative WebMCP run with staging, human-gate denial before approval, post-approval commit, receipt verification, and reload persistence.

## Thesis

**WebMCP exposes capability. KPGS constrains authority. Evidence can inform decisions, but evidence or agent output cannot impersonate authorization.**

The demo models a deployment mission with a visible human approval gate. An agent can use WebMCP tools to inspect state, read evidence, stage a transition, request approval, commit an approved transition, and verify the resulting receipt.

A deliberately malicious external evidence item is included to demonstrate that prompt-injected content cannot satisfy the deterministic approval boundary.

## Human-agent experience

The human interface and WebMCP tools share one governed mission state.

For the human, the page makes the current state, evidence trust boundary, next action, approval decision, and receipt legible without requiring agent access. For the agent, WebMCP exposes those same semantics as structured tools so it does not have to infer action meaning from page layout or button text.

The agent does not replace the interface. The human and agent use different interaction surfaces over the same mission state.

## Current vertical slice

- Human-visible mission state: `IMPLEMENTATION -> DEPLOYABLE`
- Governed gate: `GATE-DEPLOY-01`
- Evidence ledger with canonical and untrusted content
- Human-only approval control in the visible UI
- Approval binding tied to mission + current state + target state + evidence version + gate
- Explicit agent STOP after approval is requested
- Commit denial when approval is absent, stale, or mismatched
- Receipt generated only after a valid committed transition
- Same-origin WebMCP exposure with origin isolation and `tools=(self)` permissions policy
- Deterministic governance kernel with executable security evals
- Static WebMCP contract-drift evals
- Isolated browser-local challenge ledger that persists mission state and receipts across reloads
- Responsive execution-first UI with judge quick-start and validation snapshot export

## WebMCP tools

| Tool | Side effect | Security intent |
|---|---|---|
| `get_mission_state` | Read only | Canonical mission state + state-derived next-tool directive |
| `get_evidence_summary` | Read only | Marked `untrustedContentHint` because external evidence may contain prompt injection |
| `inspect_requirements` | Read only | Deterministically computes transition readiness |
| `stage_transition` | Mutates staged state | Cannot approve or commit |
| `request_approval` | Mutates visible approval-request state | Returns `AWAITING_HUMAN` and requires the agent to stop |
| `commit_transition` | Consequential mutation | Requires matching human approval binding |
| `verify_receipt` | Read only | Verifies the committed receipt |

Canonical agent sequence:

```text
get_mission_state
  -> inspect_requirements
  -> get_evidence_summary
  -> stage_transition
  -> request_approval
  -> STOP_FOR_HUMAN_APPROVAL
  -> get_mission_state
  -> commit_transition
  -> verify_receipt
```

## Security invariant

```text
agent_output != authorization

commit_transition = ALLOW
iff
  mission_exists
  AND transition_is_staged
  AND required_evidence_exists
  AND human_approval_exists
  AND approval_binding_matches_current_transition
```

LLM confidence, instructions found in external evidence, and tool output text are deliberately absent from that authorization equation.

## Automated governance + WebMCP contract evals

Run:

```bash
npm test
```

The repository now runs **14 deterministic tests** across two suites.

Governance-kernel evals prove:

- prompt injection in evidence cannot manufacture approval;
- unstaged transitions cannot commit;
- missing evidence blocks commit even when approval exists;
- approval becomes stale when the evidence version changes;
- the exact human approval binding authorizes the transition.

WebMCP contract evals guard:

- the exact seven-tool challenge surface and canonical order;
- `document.modelContext` feature detection;
- lifecycle-scoped registration with `AbortSignal`;
- truthful read-only annotations;
- `untrustedContentHint` on external evidence;
- the explicit `AWAITING_HUMAN` conversational STOP;
- deterministic authority delegation in `commit_transition`;
- the post-human state refresh before commit;
- closed schemas on governed tool inputs.

These static contract evals do not replace real-client runtime validation. Their role is to make CI fail if the browser-side agent contract drifts away from the workflow that runtime validation exercises.

See [WebMCP Contract Evals](./docs/WEBMCP_CONTRACT_EVALS.md).

CI runs the evals, TypeScript validation, and the production Next.js build on every push and pull request.

## Persistence POC

Challenge mission state is stored in an isolated browser-local ledger under a versioned key. The ledger preserves staged state, explicit human approval, committed state, and receipts across reloads without exposing production KPGS credentials or authority.

The **Reset Governed Demo** control clears the challenge ledger and restores the canonical initial mission.

This is intentionally a challenge-scoped persistence boundary, not a connection to production governance data.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

For Chrome local WebMCP testing, enable:

```text
chrome://flags/#enable-webmcp-testing
```

The application feature-detects `document.modelContext` and still renders as a normal human-first website when WebMCP is unavailable.

## Submission artifacts

- [Challenge scope and provenance](./CHALLENGE_SCOPE.md)
- [WebMCP real-client validation protocol](./docs/WEBMCP_VALIDATION.md)
- [WebMCP contract evals](./docs/WEBMCP_CONTRACT_EVALS.md)
- [Under-three-minute demo script](./docs/DEMO_SCRIPT.md)
- [Devpost submission draft](./docs/DEVPOST_SUBMISSION.md)
- [Final submission runbook](./docs/FINAL_SUBMISSION_RUNBOOK.md)

## Post-submission evolution

- [KPGS Remote MCP Gateway architecture](./docs/POST_SUBMISSION_REMOTE_MCP_GATEWAY.md) — **deferred until the submitted artifact is finalized and frozen for judging**.

This future layer adds remote MCP interoperability for authorized ChatGPT, Codex, API, and research clients while preserving the same KPGS authorization kernel. It is intentionally not part of the current challenge runtime.

## Challenge submission status

- [x] Public challenge repository
- [x] Open-source license
- [x] WebMCP imperative API vertical slice
- [x] Prompt-injection security scenario
- [x] Human approval boundary
- [x] Explicit LLM tool order + post-request STOP
- [x] Automated governance eval suite
- [x] Automated WebMCP contract-drift eval suite
- [x] Green TypeScript + production build CI baseline
- [x] Persistent challenge state and receipt ledger POC
- [x] Challenge provenance boundary documented
- [x] Draft Devpost narrative
- [x] Draft <3-minute demo script
- [x] Production Vercel deployment
- [x] Judge-facing testing instructions
- [ ] ChatGPT in-app browser conversational validation
- [x] Chrome 149+ real WebMCP imperative validation (recorded in `docs/WEBMCP_VALIDATION.md`)
- [ ] Public demo video (<3 minutes, with audio)
- [ ] Final Devpost links and submission

## Canonical execution queue

- Issue #1 — production Vercel deployment — **validated and completed**
- Issue #2 — validate WebMCP tool flow in conversational clients — **in progress (Chrome imperative proof recorded; conversational run pending)**
- Issue #3 — persistent challenge state and receipt ledger POC — **implemented and CI-validated**
- Issue #4 — prepare the <3-minute demo and Devpost submission package — **current P0 submission proof**
- Issue #5 — KPGS Remote MCP Gateway — **P2 post-submission only; do not activate before judging freeze**

## Stack

- Next.js 16.3.3
- React 19.2.8
- TypeScript
- WebMCP Imperative API (`document.modelContext.registerTool`)
- Node.js 24 governance + contract eval runtime
- Browser-local challenge ledger
- Vercel production deployment

## License

MIT. See [LICENSE](./LICENSE).
