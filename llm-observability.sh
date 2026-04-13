#!/bin/bash
# LLM Observability Tracker
# Records token usage, performance metrics, costs

WORKSPACE="${WORKSPACE:-$HOME/.openclaw/workspace}"
METRICS_FILE="$WORKSPACE/observability/metrics/llm-metrics.jsonl"
mkdir -p "$WORKSPACE/observability/metrics"

log_llm_metrics() {
    local task_id=$1
    local agent=$2
    local model=$3
    local tokens_in=$4
    local tokens_out=$5
    local prompt_eval_ms=$6
    local cost_usd=$7
    
    # Calculate tokens/sec
    local tokens_total=$((tokens_in + tokens_out))
    local tokens_per_sec=0
    if [ $prompt_eval_ms -gt 0 ]; then
        tokens_per_sec=$((tokens_total * 1000 / prompt_eval_ms))
    fi
    
    # Append to JSONL
    cat >> "$METRICS_FILE" << EOF
{"timestamp":"$(date -u +%Y-%m-%dT%H:%M:%SZ)","task_id":"$task_id","agent":"$agent","model":"$model","tokens_in":$tokens_in,"tokens_out":$tokens_out,"tokens_total":$tokens_total,"tokens_per_sec":$tokens_per_sec,"prompt_eval_ms":$prompt_eval_ms,"cost_usd":$cost_usd}
EOF
}

show_llm_dashboard() {
    echo "🤖 LLM PERFORMANCE METRICS"
    echo "=========================="
    
    if [ ! -f "$METRICS_FILE" ]; then
        echo "No LLM metrics recorded yet"
        return
    fi
    
    # Calculate totals
    local total_tasks=$(wc -l < "$METRICS_FILE")
    local total_tokens=$(awk '{print $0}' "$METRICS_FILE" | grep -o '"tokens_total":[0-9]*' | cut -d: -f2 | awk '{sum+=$1} END {print sum}')
    local total_cost=$(awk '{print $0}' "$METRICS_FILE" | grep -o '"cost_usd":[0-9.]*' | cut -d: -f2 | awk '{sum+=$1} END {printf "%.4f", sum}')
    local avg_tps=$(awk '{print $0}' "$METRICS_FILE" | grep -o '"tokens_per_sec":[0-9]*' | cut -d: -f2 | awk '{sum+=$1; count++} END {if(count>0) print int(sum/count)}')
    
    echo "Tasks Tracked:     $total_tasks"
    echo "Total Tokens:      ${total_tokens:-0}"
    echo "Total Cost:        \$${total_cost:-0.0000}"
    echo "Avg Speed:         ${avg_tps:-0} tokens/sec"
    echo ""
    echo "Recent Tasks (last 5):"
    tail -5 "$METRICS_FILE" | while read line; do
        local task=$(echo "$line" | grep -o '"task_id":"[^"]*"' | cut -d'"' -f4)
        local agent=$(echo "$line" | grep -o '"agent":"[^"]*"' | cut -d'"' -f4)
        local tps=$(echo "$line" | grep -o '"tokens_per_sec":[0-9]*' | cut -d: -f2)
        local cost=$(echo "$line" | grep -o '"cost_usd":[0-9.]*' | cut -d: -f2)
        printf "  %-20s | %-10s | %5d t/s | \$%s\n" "$task" "$agent" "$tps" "$cost"
    done
}

case "${1:-}" in
    log)
        shift
        log_llm_metrics "$@"
        ;;
    show)
        show_llm_dashboard
        ;;
    *)
        echo "Usage: llm-observability.sh log <task_id> <agent> <model> <tokens_in> <tokens_out> <prompt_eval_ms> <cost_usd>"
        echo "       llm-observability.sh show"
        ;;
esac