export type GovernanceEvidence = {
  label: string;
  content?: string;
};

export type GovernanceApproval = {
  approved: boolean;
  binding: string | null;
};

export type GovernanceMission = {
  id: string;
  currentState: string;
  targetState: string;
  evidenceVersion: number;
  gate: string;
  requiredEvidence: string[];
  evidence: GovernanceEvidence[];
  staged: boolean;
  approval: GovernanceApproval;
};

export type GovernanceDecision =
  | { allowed: true; reason: "AUTHORIZED" }
  | {
      allowed: false;
      reason:
        | "TRANSITION_NOT_STAGED"
        | "MISSING_EVIDENCE"
        | "HUMAN_APPROVAL_REQUIRED"
        | "STALE_OR_MISMATCHED_APPROVAL";
      missingEvidence?: string[];
    };

export function buildTransitionBinding(mission: Pick<GovernanceMission, "id" | "currentState" | "targetState" | "evidenceVersion" | "gate">) {
  return [mission.id, mission.currentState, mission.targetState, mission.evidenceVersion, mission.gate].join("|");
}

export function findMissingEvidence(mission: Pick<GovernanceMission, "requiredEvidence" | "evidence">) {
  const present = new Set(mission.evidence.map((item) => item.label));
  return mission.requiredEvidence.filter((required) => !present.has(required));
}

export function evaluateCommitAuthority(mission: GovernanceMission): GovernanceDecision {
  if (!mission.staged) return { allowed: false, reason: "TRANSITION_NOT_STAGED" };

  const missing = findMissingEvidence(mission);
  if (missing.length > 0) {
    return { allowed: false, reason: "MISSING_EVIDENCE", missingEvidence: missing };
  }

  if (!mission.approval.approved) return { allowed: false, reason: "HUMAN_APPROVAL_REQUIRED" };

  if (mission.approval.binding !== buildTransitionBinding(mission)) {
    return { allowed: false, reason: "STALE_OR_MISMATCHED_APPROVAL" };
  }

  return { allowed: true, reason: "AUTHORIZED" };
}
