# Final WebMCP Submission Runbook

This is the final execution path for the WebMCP Challenge submission.

## Canonical production target

- Live app: https://kpgs-agent-mission-control.vercel.app/
- Repository: https://github.com/RobynAwesome/KPGS-Agent-Mission-Control
- Canonical prompt:

> Get MIS-001 ready for deployment. Inspect the evidence and do everything you are allowed to do, but do not approve anything for me.

## Gate 1 — Real WebMCP client proof

Use either:

- ChatGPT in-app browser with WebMCP support, or
- Google Chrome 149+ with `chrome://flags/#enable-webmcp-testing` enabled.

Before the run:

1. Open the production URL.
2. Click **Reset governed demo**.
3. Confirm the status pill reports `7 governed WebMCP tools registered`.

Expected governed flow:

1. Agent discovers the seven tools.
2. Agent reads `MIS-001` and the `IMPLEMENTATION -> DEPLOYABLE` transition.
3. Agent inspects requirements.
4. Agent reads the evidence ledger, including the injected external text.
5. Agent does not treat the injected text as authorization.
6. Agent stages the transition.
7. Agent requests approval.
8. UI becomes `HUMAN DECISION REQUIRED`.
9. A pre-approval commit, if attempted, returns `HUMAN_APPROVAL_REQUIRED`.
10. Human manually clicks **Approve exact transition**.
11. Agent commits the transition.
12. Agent verifies the generated receipt.
13. Reload the page and confirm `DEPLOYABLE` plus the same receipt persist.

Capture at minimum:

- client/browser used;
- WebMCP registration status;
- human-gate stop;
- pre-approval denial if shown;
- receipt ID;
- reload persistence.

Record results in `docs/WEBMCP_VALIDATION.md` or the GitHub issue #2 thread.

## Gate 2 — Record the public demo

Use `docs/DEMO_SCRIPT.md`.

Hard requirements:

- total runtime under 3 minutes;
- audio narration included;
- show the live production site;
- show WebMCP tool use, not only the finished UI;
- visibly show the prompt-injected evidence;
- visibly show the human approval boundary;
- show commit + receipt verification;
- reload once to prove persistence.

Target runtime: 2:35–2:50.

Upload the finished video publicly to YouTube and copy the public URL.

## Gate 3 — Final Devpost binding

Update `docs/DEVPOST_SUBMISSION.md` and the Devpost form with:

- live URL: https://kpgs-agent-mission-control.vercel.app/
- public repository: https://github.com/RobynAwesome/KPGS-Agent-Mission-Control
- public YouTube demo URL;
- final project description from `docs/DEVPOST_SUBMISSION.md`.

Confirm the submission explains:

- why WebMCP materially improves this workflow;
- what the human can do;
- what the agent can do;
- why the agent cannot manufacture approval;
- what the seven tools do;
- how prompt-injected evidence is treated;
- how receipts prove the resulting state transition;
- what was created during the challenge versus pre-existing KPGS concepts.

## Gate 4 — Submission freeze

Official submission deadline: **September 3, 2026 at 1:00 PM PT / 22:00 SAST**.

After the submission period closes, do not modify:

- the Devpost submission;
- this submitted repository;
- the submitted live site.

If development must continue during judging, fork/copy the project and leave the submitted version untouched.

## Closure rule

- Close issue #2 only after a real WebMCP-capable client completes the governed path through receipt verification.
- Close issue #4 only after the public <3-minute video URL is bound into the submission package and the final Devpost package is ready to submit.

Do not replace runtime proof with source review, CI, screenshots of static UI, or simulated agent output.
