# WebMCP Challenge Scope and Provenance

## Submission repository

`RobynAwesome/KPGS-Agent-Mission-Control`

Created: **31 August 2026**

Purpose: WebMCP Challenge submission application.

## Challenge-created work

The following work belongs to this challenge repository and was created for the submission period:

- Next.js / React mission-control application.
- WebMCP imperative tool registration and schemas.
- Governed mission transition workflow.
- Human approval boundary.
- Prompt-injection demonstration evidence.
- Deterministic governance kernel.
- Governance security eval suite.
- Browser-local persistent challenge ledger and receipt persistence.
- CI pipeline.
- WebMCP validation protocol.
- Demo script and Devpost submission narrative.

## Pre-existing concepts and reference material

KPGS (Kopano-Phu Governance System), governance terminology, state-transition thinking, proof/receipt concepts, and related architectural ideas predate this challenge.

The repository `RobynAwesome/webmcp` is a standards/reference mirror of WebMCP material and is **not** the challenge application or challenge-created product code.

The connected KPGS Sovereign Mission Control Airtable base also predates this repository. For the challenge it is used only as an operational projection to track the submission system, mission, repository, issues, and proof records. It is not exposed as production authority to judges or browser agents.

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

- GitHub repository code and commit history are canonical for the submission implementation.
- GitHub Actions is canonical for build/eval execution evidence.
- Airtable is an operational projection and governance index, not a replacement for repository truth.
- Live deployment evidence becomes authoritative only after a deployment is validated and tied to a commit.

## Security boundary

No production KPGS credentials, secrets, authority records, or privileged Airtable access are required by the challenge application.

The current persistence POC uses an isolated browser-local challenge ledger so the demo can preserve state and receipts across reload while remaining disconnected from production governance authority.
