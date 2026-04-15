#!/bin/bash
# SOUL Enforcement Layer - Real-time compliance checking
SOUL_FILE="/home/dell/.openclaw/workspace/SOUL.md"
VIOLATION_LOG="/home/dell/.openclaw/workspace/memory/soul-violations.md"

log_violation() {
    local principle="$1"
    local action="$2"
    local override="$3"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "## Violation: $timestamp" >> "$VIOLATION_LOG"
    echo "- **Principle:** $principle" >> "$VIOLATION_LOG"
    echo "- **Action:** $action" >> "$VIOLATION_LOG"
    echo "- **Override:** $override" >> "$VIOLATION_LOG"
    echo "" >> "$VIOLATION_LOG"
}

check_action() {
    local action="$1"
    local violations=()
    local action_lower=$(echo "$action" | tr '[:upper:]' '[:lower:]')
    
    echo "🔍 SOUL-EL Checking: $action"
    
    # Check 1: Creating code/scripts without CrewAI
    if echo "$action_lower" | grep -qE "(write|create|build|make).*(script|python|code|file)" && \
       ! echo "$action_lower" | grep -qE "(crewai|crew|agent|task|ollama|adapter)"; then
        violations+=("USE CREWAI ORCHESTRATION")
    fi
    
    # Check 2: Claiming done without testing
    if echo "$action_lower" | grep -qE "(done|complete|finished|ready)" && \
       ! echo "$action_lower" | grep -qE "(test|verify|check|validate|confirmed)"; then
        violations+=("DO COMPLETE AND THOROUGH WORK")
    fi
    
    # Check 3: Doing work agents should do
    if echo "$action_lower" | grep -qE "(i will|i'll|let me).*(write|create|build|code)" && \
       ! echo "$action_lower" | grep -qE "(agent|dispatch|delegate|crew)"; then
        violations+=("DELEGATE TO AGENTS")
    fi
    
    if [ ${#violations[@]} -eq 0 ]; then
        echo "✅ PASS - No SOUL.md violations"
        return 0
    else
        echo "🚨 VIOLATION DETECTED"
        echo ""
        echo "Violated principles:"
        for v in "${violations[@]}"; do echo "  • $v"; done
        echo ""
        echo "Options:"
        echo "  [1] OVERRIDE - Execute anyway (you decide)"
        echo "  [2] CORRECT - Fix to comply with SOUL.md"
        echo "  [3] UPDATE SOUL - Modify principle"
        return 1
    fi
}

export -f check_action
export -f log_violation