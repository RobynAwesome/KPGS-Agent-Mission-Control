# WebMCP Challenge Scope and Provenance

## Submission repository

`RobynAwesome/KPGS-Agent-Mission-Control`

Created: **31 August 2026**

Purpose: WebMCP Challenge submission application.

## Challenge-created work

The following implementation belongs to this challenge repository and was created during the submission period:

- Next.js / React mission-control application.
- WebMCP imperative tool registration and schemas.
- Governed seven-tool browser workflow and explicit agent sequencing.
- Human approval boundary and conversational STOP condition.
- Prompt-injection demonstration evidence.
- Deterministic challenge governance kernel.
- Governance security eval suite.
- WebMCP contract-drift eval suite.
- Browser-local persistent challenge ledger and receipt persistence.
- CI pipeline.
- WebMCP validation protocol and recorded Chrome runtime proof.
- Judge evidence map, demo script, and Devpost submission narrative.

## Pre-existing concepts and reference material

KPGS (Kopano-Phu Governance System), governance terminology, state-transition thinking, evidence classification, proof/receipt concepts, and the invariant `agent_output != authorization` predate this challenge.

`RobynAwesome/Introduction-to-MCP` is the broader pre-existing KPGS/GSMB governance and research repository. It is a conceptual and governance reference for this challenge, **not the submitted WebMCP application and not a source of challenge application code**.

The challenge implementation deliberately narrows those broader ideas into an isolated browser-native WebMCP vertical slice. The challenge repo owns its own React application, WebMCP tool definitions, challenge governance kernel, test suites, local persistence boundary, deployment, and submission evidence.

The separate `RobynAwesome/webmcp` repository is a standards/reference mirror of WebMCP material and is **not** the challenge application or challenge-created product code.

The connected KPGS Sovereign Mission Control Airtable base also predates this repository. For the challenge it is used only as an operational projection to track the submission system, mission, repository, issues, and proof records. It is not exposed as production authority to judges or browser agents.

## Canonical alignment without code inheritance

The broader KPGS source of truth currently models the same governing separation demonstrated by the challenge:

```text
agent capability != human authorization
```

Its master mission-control bridge also preserves richer post-challenge directions such as formal FEP evidence classes and cryptographically sealed receipts. Those features are **not being imported into the submitted runtime at the deadline** merely to increase scope. The challenge remains the smaller, validated vertical slice described by its own code and tests.

This separation is intentional: conceptual provenance is disclosed while challenge implementation provenance remains independently inspectable in this repository's dated commit history.

## Explicit post-submission boundary

A future **KPGS Remote MCP Gateway** is documented in `docs/POST_SUBMISSION_REMOTE_MCP_GATEWAY.md` as a post-submission evolution only.

Remote MCP infrastructure is **not part of the current challenge runtime**. Before the submitted project is finalized and frozen for judging, do not introduce:

- FastMCP or another remote MCP server framework;
- a public `/mcp` transport endpoint;
- OAuth/client registration flows;
- OpenAI API or vector-store credentials;
- remote `search` / `fetch` services;
- remote mutation endpoints;
- production KPGS authority or secrets.

The challenge submission remains browser-native WebMCP. The Remote MCP design is preserved solely to prevent architectural loss and implementation drift after submission.

## Canonical source rule

- This GitHub repository's code and dated commit history are canonical for the challenge implementation.
- GitHub Actions is canonical for challenge build/eval execution evidence.
- `RobynAwesome/Introduction-to-MCP` is canonical for the broader pre-existing KPGS/GSMB conceptual lineage, not for claiming challenge-created code.
- Airtable is an operational projection and governance index, not a replacement for repository truth.
- Live deployment evidence becomes authoritative only after a deployment is validated and tied to a commit.

## Security boundary

No production KPGS credentials, secrets, authority records, or privileged Airtable access are required by the challenge application.

The current persistence POC uses an isolated browser-local challenge ledger so the demo can preserve state and receipts across reload while remaining disconnected from production governance authority.
