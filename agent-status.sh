#!/bin/bash
# Agent Status Dashboard
# Shows real-time status of all agents

WORKSPACE="${WORKSPACE:-$HOME/.openclaw/workspace}"
OBS_DIR="$WORKSPACE/observability"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

show_header() {
    clear
    echo "========================================"
    echo "    🤖 AGENT STATUS DASHBOARD"
    echo "========================================"
    echo ""
}

show_agent_status() {
    local agent=$1
    local status_file="$OBS_DIR/agents/$agent/status.json"
    
    if [ -f "$status_file" ]; then
        local status=$(jq -r '.status // "unknown"' "$status_file" 2>/dev/null || echo "unknown")
        local task=$(jq -r '.current_task // "none"' "$status_file" 2>/dev/null || echo "none")
        local since=$(jq -r '.since // ""' "$status_file" 2>/dev/null || echo "")
        
        case $status in
            "active") color=$GREEN; icon="🟢" ;;
            "idle") color=$YELLOW; icon="🟡" ;;
            "error") color=$RED; icon="🔴" ;;
            *) color=$NC; icon="⚪" ;;
        esac
        
        printf "${color}%s %-12s${NC} | Status: %-8s | Task: %s\n" "$icon" "$agent" "$status" "$task"
        
        if [ -n "$since" ] && [ "$status" = "active" ]; then
            local elapsed=$(( ($(date +%s) - $(date -d "$since" +%s 2>/dev/null || echo 0)) / 60 ))
            echo "                    └─ Running for: ${elapsed} min"
        fi
    else
        printf "⚪ %-12s | Status: unknown  | Task: none\n" "$agent"
    fi
    echo ""
}

show_metrics() {
    echo "📊 METRICS"
    echo "----------"
    
    local metrics_file="$OBS_DIR/metrics/daily.json"
    if [ -f "$metrics_file" ]; then
        local total_tasks=$(jq -r '.tasks_total // 0' "$metrics_file" 2>/dev/null)
        local success_rate=$(jq -r '.success_rate // "N/A"' "$metrics_file" 2>/dev/null)
        local avg_latency=$(jq -r '.avg_latency_ms // "N/A"' "$metrics_file" 2>/dev/null)
        
        echo "Tasks Today:    $total_tasks"
        echo "Success Rate:   $success_rate"
        echo "Avg Latency:    ${avg_latency}ms"
    else
        echo "No metrics available yet"
    fi
    echo ""
}

show_recent_activity() {
    echo "📋 RECENT ACTIVITY"
    echo "------------------"
    
    local log_file="$OBS_DIR/logs/activity.log"
    if [ -f "$log_file" ]; then
        tail -10 "$log_file" 2>/dev/null | while read line; do
            echo "  $line"
        done
    else
        echo "  No activity logged yet"
    fi
    echo ""
}

main() {
    show_header
    
    # Check if observability dir exists
    if [ ! -d "$OBS_DIR" ]; then
        echo "⚠️  Observability directory not found"
        echo "Creating structure at $OBS_DIR..."
        mkdir -p "$OBS_DIR"/{agents/{coder,researcher,planner,executor,reviewer},logs,metrics,traces}
        echo "✅ Structure created"
        echo ""
    fi
    
    echo "🤖 AGENTS"
    echo "---------"
    for agent in coder researcher planner executor reviewer; do
        show_agent_status "$agent"
    done
    
    show_metrics
    show_recent_activity
    
    echo "========================================"
    echo "Last updated: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "========================================"
}

# Run
main