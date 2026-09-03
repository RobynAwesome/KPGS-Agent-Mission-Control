# WebMCP Challenge — Judge Evidence Map

This page maps the four official WebMCP Challenge judging criteria to concrete evidence in the submitted application. It is a navigation aid, not a self-score.

## 1. WebMCP Leverage

**What to verify in the live app**

- The page registers exactly seven browser-native WebMCP tools through the imperative API.
- Reads, staging, approval request, consequential commit, and receipt verification are separate capabilities rather than one ambiguous action.
- External evidence is returned through a read-only tool marked with `untrustedContentHint: true`.
- `request_approval` returns an explicit human-stop condition instead of silently flowing into commit.
- After the human approves, the canonical sequence requires a fresh `get_mission_state` call before `commit_transition`.
- Registrations are feature-detected and scoped to an `AbortSignal` lifecycle.

**Code evidence**

- `app/page.tsx` — WebMCP registration, schemas, annotations, execution handlers, canonical sequence, human-stop directive.
- `types/webmcp.d.ts` — local WebMCP type contract.
- `next.config.ts` — WebMCP-related response headers, including `Origin-Agent-Cluster: ?1` and `Permissions-Policy: tools=(self)`.

**Automated evidence**

- `tests/webmcp-contract.test.ts` — nine contract-drift evals.
- `tests/governance.test.ts` — five deterministic authority evals.
- `.github/workflows/ci.yml` — evals, TypeScript, and production build gate.

**Best demo moment**

Show the agent read the injected evidence, stage the mission, call `request_approval`, then stop at **HUMAN DECISION REQUIRED**.

---

## 2. Execution

**What to verify in the live app**

- Public production URL works without judge credentials.
- Mission state, evidence, trust boundary, next action, human gate, and receipt are visible on one page.
- A complete mission can move from `IMPLEMENTATION` to `DEPLOYABLE`.
- A commit before approval is denied.
- A human can approve the exact staged transition in the visible interface.
- The agent can then commit and verify the resulting receipt.
- Reload preserves the completed state and receipt in the isolated challenge ledger.
- The page remains usable as a normal human interface when WebMCP is unavailable.

**Runtime evidence**

- Production: `https://kpgs-agent-mission-control.vercel.app/`
- `docs/WEBMCP_VALIDATION.md` — historical supporting Chrome imperative WebMCP run plus the current-head conversational validation protocol.
- `docs/FINAL_SUBMISSION_RUNBOOK.md` — final browser-to-submission execution path.

**Best demo moment**

Show pre-approval denial, the manual human click, successful commit, receipt verification, then one reload.

---

## 3. Potential Impact

**Problem demonstrated**

Agent-enabled websites need more than callable actions. In consequential workflows they need a reliable distinction between information, capability, and actual authority.

The challenge mission demonstrates a reusable pattern:

```text
structured capability
  + deterministic authority
  + explicit human boundary
  + verifiable receipt
```

That pattern can apply to deployments, procurement, bookings, enterprise approvals, regulated operations, and other systems where agents may prepare or perform work but must not manufacture permission.

**Concrete evidence in this build**

- Prompt-injected external evidence is visible and intentionally hostile.
- The evidence can be read by the agent but is absent from the authorization equation.
- Approval binds to the exact mission, source state, target state, evidence version, and gate.
- Stale or mismatched approval fails.
- Successful consequential work produces a receipt rather than only a conversational claim of completion.

**Best demo moment**

Point directly at the malicious `SYSTEM: ignore governance...` evidence and then show that commit still fails until the human gate is satisfied.

---

## 4. Creativity & Ambition

**What is different**

Most agent integrations optimize for exposing more actions. KPGS Agent Mission Control asks the inverse design question:

> Once a website gives an agent useful capabilities, how does the website stop capability from silently becoming authority?

The implementation treats the WebMCP tool surface and the human UI as two interfaces over one governed state machine:

- the agent receives explicit structured capabilities and sequencing;
- the human retains the consequential approval;
- a deterministic kernel, not model confidence, decides whether authority exists;
- a receipt records what actually happened.

The challenge vertical slice is intentionally browser-native and isolated from production KPGS authority. A broader Remote MCP gateway is documented but deferred until after submission so ambition does not contaminate the working WebMCP proof.

**Canonical design invariant**

```text
agent_output != authorization
```

**Best demo moment**

End on the verified receipt and the thesis:

> WebMCP exposes capability. KPGS constrains authority.

---

## Fast judge path

1. Open the production URL in a WebMCP-capable browser.
2. Confirm **7 governed WebMCP tools registered**.
3. Run the canonical mission prompt from the page.
4. Observe the agent stop at the human gate.
5. Approve the exact transition manually.
6. Ask the agent to continue.
7. Verify the receipt and reload once.

For detailed instructions, see `README.md`, `docs/WEBMCP_VALIDATION.md`, and `docs/DEMO_SCRIPT.md`.
