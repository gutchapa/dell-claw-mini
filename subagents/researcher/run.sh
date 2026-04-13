#!/bin/bash
# RESEARCHER AGENT - Gathers information
TASK_FILE="$1"
TASK_DESC=$(jq -r '.desc' "$TASK_FILE")
TASK_ID=$(jq -r '.id' "$TASK_FILE")
OUTPUT_DIR="$HOME/.openclaw/workspace/agent-output/$TASK_ID"

mkdir -p "$OUTPUT_DIR"
jq '.status="running"' "$TASK_FILE" > "$TASK_FILE.tmp" && mv "$TASK_FILE.tmp" "$TASK_FILE"

echo "🔍 Researcher Agent starting: $TASK_ID"

# Simulate research
cat > "$OUTPUT_DIR/research.md" << EOF
# Research: $TASK_DESC

## Findings
- Key information gathered
- Sources analyzed
- Summary of findings

## Generated: $(date)
EOF

jq '.status="done" | .result="Research completed"' "$TASK_FILE" > "$TASK_FILE.tmp" && mv "$TASK_FILE.tmp" "$TASK_FILE"
echo "✅ Researcher Agent completed: $TASK_ID"