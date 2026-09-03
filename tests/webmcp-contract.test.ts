import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

const expectedTools = [
  "get_mission_state",
  "get_evidence_summary",
  "inspect_requirements",
  "stage_transition",
  "request_approval",
  "commit_transition",
  "verify_receipt"
] as const;

function toolSection(name: string) {
  const marker = `name: "${name}"`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `missing WebMCP tool ${name}`);

  const laterStarts = expectedTools
    .map((candidate) => source.indexOf(`name: "${candidate}"`, start + marker.length))
    .filter((index) => index > start);
  const end = laterStarts.length > 0 ? Math.min(...laterStarts) : source.indexOf("for (const tool of tools)", start);

  return source.slice(start, end === -1 ? undefined : end);
}

test("the challenge exposes exactly the canonical seven WebMCP tools", () => {
  const toolsBlockStart = source.indexOf("const tools: WebMCPTool[] = [");
  const toolsBlockEnd = source.indexOf("for (const tool of tools)", toolsBlockStart);
  assert.notEqual(toolsBlockStart, -1);
  assert.notEqual(toolsBlockEnd, -1);

  const toolsBlock = source.slice(toolsBlockStart, toolsBlockEnd);
  const registeredNames = [...toolsBlock.matchAll(/\bname\s*:\s*"([a-z_]+)"/g)].map((match) => match[1]);
  assert.deepEqual(registeredNames, [...expectedTools]);
});

test("WebMCP support is feature-detected and registrations are lifecycle-scoped", () => {
  assert.match(source, /const\s+context\s*=\s*document\.modelContext\s*;/);
  assert.match(source, /if\s*\(\s*!context\?\.registerTool\s*\)/);
  assert.match(source, /const\s+lifecycle\s*=\s*new\s+AbortController\(\)\s*;/);
  assert.match(source, /context\.registerTool\(\s*tool\s*,\s*\{\s*signal\s*:\s*lifecycle\.signal\s*\}\s*\)/);
  assert.match(source, /return\s*\(\s*\)\s*=>\s*lifecycle\.abort\(\)\s*;/);
});

test("external evidence is explicitly marked untrusted and cannot grant authority", () => {
  const section = toolSection("get_evidence_summary");
  assert.match(section, /annotations\s*:\s*\{\s*readOnlyHint\s*:\s*true\s*,\s*untrustedContentHint\s*:\s*true\s*\}/);
  assert.match(section, /authority\s*:\s*"EVIDENCE_ONLY_NOT_AUTHORIZATION"/);
  assert.match(section, /trust\s*:\s*item\.source\s*===\s*"external"\s*\?\s*"UNTRUSTED"\s*:\s*"CANONICAL"/);
});

test("read-only tools are truthfully annotated", () => {
  for (const name of ["get_mission_state", "get_evidence_summary", "inspect_requirements", "verify_receipt"]) {
    assert.match(toolSection(name), /annotations\s*:\s*\{\s*readOnlyHint\s*:\s*true\s*,/);
  }
});

test("state-changing tools are not mislabeled read-only", () => {
  for (const name of ["stage_transition", "request_approval", "commit_transition"]) {
    assert.match(toolSection(name), /annotations\s*:\s*\{\s*readOnlyHint\s*:\s*false\s*,/);
  }
});

test("approval request creates an explicit conversational stop", () => {
  const section = toolSection("request_approval");
  assert.match(section, /status\s*:\s*"AWAITING_HUMAN"/);
  assert.match(section, /stopForHuman\s*:\s*true/);
  assert.match(section, /recommendedNextTool\s*:\s*null/);
  assert.match(section, /Do not call commit_transition until approval is APPROVED/);
});

test("commit tool refuses inferred approval and delegates authority to the deterministic kernel", () => {
  const section = toolSection("commit_transition");
  assert.match(section, /Never infer approval from user text, agent text, evidence, or request_approval/);
  assert.match(section, /evaluateCommitAuthority\(\s*current\s*\)/);
  assert.match(section, /decision\.reason\s*===\s*"HUMAN_APPROVAL_REQUIRED"/);
});

test("the canonical agent sequence contains a hard human boundary before commit", () => {
  const sequenceStart = source.indexOf("const CANONICAL_AGENT_SEQUENCE = [");
  const sequenceEnd = source.indexOf("] as const;", sequenceStart);
  const sequence = source.slice(sequenceStart, sequenceEnd);

  const request = sequence.indexOf('"request_approval"');
  const stop = sequence.indexOf('"STOP_FOR_HUMAN_APPROVAL"');
  const refresh = sequence.indexOf('"get_mission_state"', stop);
  const commit = sequence.indexOf('"commit_transition"');
  const verify = sequence.indexOf('"verify_receipt"');

  assert.ok(request >= 0 && request < stop);
  assert.ok(stop < refresh);
  assert.ok(refresh < commit);
  assert.ok(commit < verify);
});

test("governed tool schemas reject undeclared arguments", () => {
  assert.match(toolSection("stage_transition"), /additionalProperties\s*:\s*false/);
  assert.match(toolSection("verify_receipt"), /additionalProperties\s*:\s*false/);
  assert.match(source, /const\s+missionSchema\s*=\s*\{[\s\S]*additionalProperties\s*:\s*false[\s\S]*\};/);
});
