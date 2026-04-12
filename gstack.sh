#!/bin/bash
# GStack-Style Commands for OpenClaw
# Quick slash commands for common tasks

WORKSPACE="${WORKSPACE:-$HOME/.openclaw/workspace}"

show_help() {
    cat << 'EOF'
OpenClaw Quick Commands (GStack-style)
======================================

/review     - Trigger code review on current changes
/ship        - Git commit, push, and deploy
/qa          - Run tests and quality checks
/status      - Show agent status dashboard
/mem         - Query GBrain memory
/plan        - Create task plan
/think        - Brainstorm mode (structured thinking)
/ask <question> - Quick GBrain query

Usage:
  ./gstack.sh <command> [args]

Examples:
  ./gstack.sh review
  ./gstack.sh ship "Fix null pointer bug"
  ./gstack.sh ask "Project Hail Mary"
EOF
}

cmd_review() {
    echo "🔍 Starting Code Review..."
    
    # Run our code review agent
    if [ -f "$WORKSPACE/subagents/reviewer/review.sh" ]; then
        "$WORKSPACE/subagents/reviewer/review.sh"
    else
        echo "⚠️  Code reviewer not set up yet"
        echo "Running basic checks..."
        
        # Basic checks
        echo "✓ Checking for syntax errors..."
        find . -name "*.py" -exec python3 -m py_compile {} \; 2>/dev/null && echo "  Python: OK" || echo "  Python: ERRORS FOUND"
        
        echo "✓ Checking git status..."
        git diff --stat
    fi
}

cmd_ship() {
    local message="${1:-"Update from $(date)"}"
    
    echo "🚀 Shipping: $message"
    
    # Pre-flight checks
    echo "  → Running pre-ship checks..."
    cmd_qa || { echo "❌ QA failed, aborting ship"; exit 1; }
    
    # Git operations
    echo "  → Committing..."
    git add -A
    git commit -m "$message" || { echo "❌ Commit failed"; exit 1; }
    
    echo "  → Pushing..."
    git push || { echo "❌ Push failed"; exit 1; }
    
    echo "✅ Shipped successfully!"
}

cmd_qa() {
    echo "🧪 Running QA checks..."
    local failed=0
    
    # Check Python syntax
    echo "  → Python syntax check..."
    find "$WORKSPACE" -name "*.py" -type f | head -20 | while read f; do
        python3 -m py_compile "$f" 2>/dev/null || { echo "    ❌ $f"; failed=1; }
    done
    [ $failed -eq 0 ] && echo "    ✅ Python OK"
    
    # Check bash scripts
    echo "  → Bash syntax check..."
    find "$WORKSPACE" -name "*.sh" -type f | head -10 | while read f; do
        bash -n "$f" 2>/dev/null || { echo "    ❌ $f"; failed=1; }
    done
    [ $failed -eq 0 ] && echo "    ✅ Bash OK"
    
    # Check for secrets
    echo "  → Security scan..."
    if grep -r "API_KEY\|SECRET\|TOKEN" "$WORKSPACE"/*.md 2>/dev/null | grep -v "example\|template"; then
        echo "    ⚠️  Potential secrets in docs"
    else
        echo "    ✅ No obvious secrets"
    fi
    
    [ $failed -eq 0 ] && echo "✅ QA passed!" || echo "❌ QA failed!"
    return $failed
}

cmd_status() {
    if [ -f "$WORKSPACE/agent-status.sh" ]; then
        "$WORKSPACE/agent-status.sh"
    else
        echo "❌ Status dashboard not found"
    fi
}

cmd_mem() {
    local query="${1:-"latest tasks"}"
    
    if [ -d "$HOME/gbrain-repo" ]; then
        cd "$HOME/gbrain-repo"
        bun run src/cli.ts query "$query"
    else
        echo "❌ GBrain not set up"
    fi
}

cmd_plan() {
    echo "📋 Creating Task Plan..."
    
    cat << 'EOF'
Task Plan Template:
==================
1. UNDERSTAND
   - What is the goal?
   - What are the constraints?

2. RESEARCH  
   - What already exists?
   - What patterns to use?

3. IMPLEMENT
   - Step 1: ___
   - Step 2: ___
   - Step 3: ___

4. TEST
   - Test cases:
   - Edge cases:

5. REVIEW
   - Self-review checklist:
   - Peer review needed?

EOF
}

cmd_think() {
    echo "🧠 Structured Thinking Mode"
    echo "==========================="
    echo ""
    
    # Force structured approach like Superpowers plugin
    read -p "What problem are you solving? " problem
    echo ""
    
    echo "1️⃣  BRAINSTORM"
    echo "   Possible approaches:"
    echo "   - ___"
    echo "   - ___"
    echo "   - ___"
    echo ""
    
    echo "2️⃣  ANALYZE"
    echo "   Pros/cons of each approach"
    echo ""
    
    echo "3️⃣  DECIDE"
    echo "   Best approach: ___"
    echo "   Reason: ___"
    echo ""
    
    echo "4️⃣  PLAN"
    echo "   Implementation steps:"
    echo ""
    
    cmd_plan
}

cmd_ask() {
    local question="$*"
    [ -z "$question" ] && question="What are my recent tasks?"
    
    echo "🔍 Querying GBrain: $question"
    cmd_mem "$question"
}

# Main dispatch
case "${1:-help}" in
    review)      cmd_review ;;
    ship)        shift; cmd_ship "$*" ;;
    qa)          cmd_qa ;;
    status)      cmd_status ;;
    mem|memory)  shift; cmd_mem "$*" ;;
    plan)        cmd_plan ;;
    think)       cmd_think ;;
    ask)         shift; cmd_ask "$*" ;;
    help|--help|-h) show_help ;;
    *)           echo "Unknown command: $1"; show_help; exit 1 ;;
esac