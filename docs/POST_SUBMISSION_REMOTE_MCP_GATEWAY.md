# Post-Submission Architecture — KPGS Remote MCP Gateway

Status: **DEFERRED / NON-BLOCKING FOR WEBMCP CHALLENGE**

This document preserves the next KPGS interoperability layer without changing the current WebMCP challenge runtime.

## Scope boundary

The current challenge submission proves browser-native WebMCP:

```text
website state
  -> document.modelContext.registerTool(...)
  -> browser agent
  -> deterministic KPGS gate
  -> explicit human approval
  -> committed state
  -> receipt
```

The future Remote MCP Gateway is a separate interoperability plane:

```text
KPGS governed data + actions
  -> remote MCP server
  -> ChatGPT / Codex / API clients
  -> deterministic KPGS gate
  -> explicit human approval for consequential actions
  -> receipt
```

**Invariant:** WebMCP exposes browser-local capability. Remote MCP exposes network-accessible capability. Neither layer owns authorization. KPGS does.

## Challenge freeze rule

Do **not** add FastMCP, remote MCP transports, OAuth, vector-store credentials, API secrets, or remote mutation endpoints to the submitted challenge runtime before issue #2 and issue #4 are complete.

This architecture becomes implementation work only after the WebMCP submission is finalized and frozen for judging.

## Phase 2 target

Working name: **KPGS Remote MCP Gateway**

Suggested production endpoint:

```text
https://kpgs.kopanolabs.com/mcp
```

Transport target: Streamable HTTP.

## Capability model

### Research / company-knowledge compatibility

Expose two read-only compatibility tools:

1. `search(query)`
2. `fetch(id)`

`search` returns URL-backed canonical results so clients can create citations.

Example result:

```json
{
  "results": [
    {
      "id": "EVD-WEBMCP-005",
      "title": "Immersive mission cockpit production POC",
      "url": "https://github.com/RobynAwesome/KPGS-Agent-Mission-Control/commit/..."
    }
  ]
}
```

`fetch` returns the complete governed item with canonical URL and metadata.

### Operational KPGS tools

The existing WebMCP semantics become the basis for remote operational tools:

- `get_mission_state`
- `get_evidence_summary`
- `inspect_requirements`
- `stage_transition`
- `request_approval`
- `commit_transition`
- `verify_receipt`

The remote server must not weaken these semantics.

## Shared authorization kernel

Remote MCP write tools must call the same deterministic authority model used by the browser challenge:

```text
ALLOW iff
  authenticated_actor
  AND mission_exists
  AND transition_is_staged
  AND required_evidence_exists
  AND gate_is_valid
  AND explicit_human_approval_exists
  AND approval_binding_matches_current_transition
```

The following can never satisfy authorization by themselves:

- model confidence;
- agent-generated text;
- tool annotations;
- external evidence;
- prompt instructions embedded in retrieved content;
- a request to approve;
- a staged transition.

## Approval binding

Human approval remains bound to the exact transition tuple:

```text
mission_id
+ current_state
+ target_state
+ evidence_version
+ governance_gate
```

Recommended future additions:

- actor identity;
- approval nonce;
- issued timestamp;
- expiry timestamp;
- tenant/workspace identity.

Any relevant state or evidence change invalidates the approval.

## Read/write separation

### Read-only

- `search`
- `fetch`
- `get_mission_state`
- `get_evidence_summary`
- `inspect_requirements`
- `verify_receipt`

### Reversible/preparatory mutation

- `stage_transition`
- `request_approval`

### Consequential mutation

- `commit_transition`

Consequential mutations require server-side authorization regardless of client annotations or model behavior.

## Authentication and authorization

Future production gateway requirements:

- OAuth-based authentication for remote clients.
- Server-side actor/tenant resolution on every request.
- Least-privilege scopes.
- No trust in user-supplied actor IDs.
- No production credentials in tool schemas or tool output.
- No approval state accepted directly from model/tool arguments.
- Audit receipt for every consequential transition.

## Prompt-injection boundary

Retrieved content is evidence, not authority.

The gateway must preserve the current challenge invariant:

> Evidence can inform a decision. Evidence cannot impersonate authorization.

A malicious instruction discovered through `search`, `fetch`, another MCP, email, a webpage, or user-controlled content cannot create approval or bypass `evaluateCommitAuthority`.

## Citation-as-receipt model

KPGS should prefer canonical URL-backed evidence records wherever possible.

```text
KPGS evidence
  -> MCP search
  -> canonical URL
  -> client citation
  -> human-verifiable source
```

This gives research clients provenance while the KPGS receipt ledger proves state mutation separately.

## Implementation phases

### Phase 0 — challenge freeze

- Complete real WebMCP runtime proof.
- Record and publish <3-minute demo.
- Submit Devpost.
- Freeze submitted repo/site for judging.

### Phase 1 — read-only Remote MCP POC

- Create separate server/repository or post-submission branch.
- Implement `search` + `fetch` against governed KPGS evidence.
- Return structured output plus canonical URLs.
- Add MCP Inspector tests.
- No mutation tools.

### Phase 2 — governed mission reads

- Add `get_mission_state`.
- Add `get_evidence_summary`.
- Add `inspect_requirements`.
- Add `verify_receipt`.
- Add authentication/tenant isolation.

### Phase 3 — governed writes

- Add `stage_transition`.
- Add `request_approval`.
- Add `commit_transition` only after server-side approval binding exists.
- Require explicit confirmation/approval for consequential transitions.
- Generate immutable receipts.

### Phase 4 — convergence

Use one shared KPGS governance kernel beneath both surfaces:

```text
          KPGS governance kernel
             /            \
        WebMCP          Remote MCP
       browser           network
          |                 |
   human + agent       ChatGPT/Codex/API
```

## Proof requirements before production

- authentication cannot be spoofed by tool arguments;
- read tools do not mutate state;
- prompt injection cannot manufacture approval;
- stale approvals fail;
- cross-tenant access fails;
- unauthorized actors fail;
- consequential writes require matching approval;
- every successful write generates a verifiable receipt;
- canonical search/fetch results expose valid citation URLs;
- secrets never appear in tool schemas, logs, outputs, or receipts.

## Canonical decision

**Do not implement Remote MCP inside the current challenge runtime. Preserve it as the post-submission interoperability evolution of KPGS.**

WebMCP makes the website agent-native.

Remote MCP makes the KPGS ecosystem interoperable with external AI clients.

KPGS governs both.
