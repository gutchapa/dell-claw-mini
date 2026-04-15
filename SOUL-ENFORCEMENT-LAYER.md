# SOUL Enforcement Layer (SOUL-EL)
# Real-time compliance checking with user override

## How It Works

### 1. Before Every Action
```
Me: Plans to do X
SOUL-EL: Checks against SOUL.md principles
↓
[PASS] → Execute X
[VIOLATION] → Flag to user + Ask for override
```

### 2. Violation Detection
| Check | What It Monitors |
|-------|------------------|
| **Orchestration Check** | Am I using CrewAI? If not → FLAG |
| **Completeness Check** | Did I test before claiming done? |
| **Tool Check** | Am I using banned tools (rm, etc.)? |
| **Delegation Check** | Am I doing work agents should do? |
| **Safety Check** | Destructive actions without approval? |

### 3. Override System
```
[FLAG: SOUL.md Violation Detected]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Principle: "USE CREWAI ORCHESTRATION"
Action: Creating custom Python script
Status: ⚠️ VIOLATION

Options:
[1] ALLOW OVERRIDE - Execute anyway (I decide)
[2] CORRECT COURSE - Use proper CrewAI method
[3] MODIFY SOUL.md - Update principle for this case

Your choice: _
```

### 4. Audit Trail
All violations + overrides logged to:
- `memory/soul-violations.md` (for review)
- `observability/soul-metrics.json` (stats)

## Implementation

### File: .openclaw/soul-enforcer.sh
```bash
#!/bin/bash
# Pre-action hook
check_soul_compliance() {
    local action="$1"
    local principle="$2"
    
    # Check if action violates principle
    if violates_principle "$action" "$principle"; then
        echo "SOUL_VIOLATION: $principle"
        echo "ACTION: $action"
        echo "REQUESTING_OVERRIDE"
        return 1
    fi
    return 0
}
```

### File: src/soul-check.ts
```typescript
export class SOULEnforcer {
    async check(action: string): Promise<SOULResult> {
        const violations = this.detectViolations(action);
        
        if (violations.length > 0) {
            return {
                status: 'VIOLATION',
                violations,
                requiresOverride: true
            };
        }
        
        return { status: 'PASS' };
    }
}
```

## Example Workflow

**Scenario: You ask me to "Build a RAG system"**

```
Me: I'll create crewai_rag_builder.py...
SOUL-EL: 🚨 VIOLATION DETECTED
         Principle: "USE CREWAI ORCHESTRATION"
         Issue: Creating custom script instead of using CrewAI

[OPTION 1] Override: "Allow this time - need quick prototype"
[OPTION 2] Correct: "Use CrewAI proper with agents"
[OPTION 3] Update SOUL: "Add exception for prototypes"

You choose → Action proceeds with audit log
```

## Benefits

| For You | For Me |
|---------|--------|
| Visibility into violations | Clear guidance on boundaries |
| Override authority | Reduced guesswork |
| Audit trail | Accountability |
| Contextual flexibility | Learning from decisions |

## SOUL.md Update Required

Add section:
```markdown
## 🔒 Enforcement

This SOUL is enforced by SOUL-EL (SOUL Enforcement Layer).
- Violations are flagged in real-time
- Boss (RamEsh) has override authority
- All overrides logged for review
- Enforcement can be disabled per-task with explicit permission
```

---

**Status: Ready to implement** 🛡️
