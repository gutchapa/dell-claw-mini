#!/bin/bash
# Multi-Agent Orchestrator
# Routes tasks to specialized agents

WORKSPACE="${WORKSPACE:-$HOME/.openclaw/workspace}"
ORCH_DIR="$WORKSPACE/orchestrator"
mkdir -p "$ORCH_DIR"/{queue,running,completed}

submit_task() {
    local desc="$1"
    local id="task_$(date +%s)_$RANDOM"
    cat > "$ORCH_DIR/queue/${id}.json" << EOF
{"id":"$id","desc":"$desc","agent":"$2","status":"queued"}
EOF
    echo "📥 Submitted: $id → ${2:-auto-assign}"
}

assign_and_run() {
    local task_file="$1"
    local id=$(/tmp/jq -r '.id' "$task_file")
    local desc=$(/tmp/jq -r '.desc' "$task_file")
    local agent=$(/tmp/jq -r '.agent // "auto"' "$task_file")
    
    # Auto-detect agent if not specified
    if [ "$agent" = "auto" ] || [ -z "$agent" ]; then
        if echo "$desc" | grep -qiE "code|script|write|fix|debug"; then agent="coder"
        elif echo "$desc" | grep -qiE "research|find|search|look"; then agent="researcher"
        elif echo "$desc" | grep -qiE "plan|design|architect"; then agent="planner"
        elif echo "$desc" | grep -qiE "test|review|check|audit"; then agent="reviewer"
        else agent="executor"; fi
    fi
    
    echo "🔀 Routing: $id → $agent agent"
    mv "$task_file" "$ORCH_DIR/running/${id}_${agent}.json"
    
    # DISPATCH TO AGENT
    python3 "$WORKSPACE/subagents/$agent/run-phi3.py" "$ORCH_DIR/running/${id}_${agent}.json" &
}

check_results() {
    for f in "$ORCH_DIR/running"/*.json; do
        [ -f "$f" ] || continue
        local status=$(/tmp/jq -r '.status // "running"' "$f")
        local id=$(/tmp/jq -r '.id' "$f")
        if [ "$status" = "done" ] || [ "$status" = "error" ]; then
            mv "$f" "$ORCH_DIR/completed/"
            echo "✅ Completed: $id"
        fi
    done
}

case "${1:-}" in
    submit) shift; submit_task "$*"; ;;
    dispatch) for f in "$ORCH_DIR/queue"/*.json; do [ -f "$f" ] && assign_and_run "$f"; done ;;
    check) check_results ;;
    *) echo "Usage: submit|dispatch|check" ;;
esac