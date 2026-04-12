#!/bin/bash
# Code Review Agent
# Multi-agent code review with scoring

WORKSPACE="${WORKSPACE:-$HOME/.openclaw/workspace}"
REVIEW_DIR="$WORKSPACE/subagents/reviewer"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[REVIEW]${NC} $1"; }
pass() { echo -e "${GREEN}[PASS]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
fail() { echo -e "${RED}[FAIL]${NC} $1"; }

# Reviewers
reviewer_syntax() {
    log "👤 Reviewer 1/5: Syntax Checker"
    local score=100
    local issues=0
    
    # Python
    find "$WORKSPACE" -name "*.py" -type f | head -20 | while read f; do
        if ! python3 -m py_compile "$f" 2>/dev/null; then
            fail "Python syntax error in: $f"
            ((issues++))
        fi
    done
    
    # Bash
    find "$WORKSPACE" -name "*.sh" -type f | head -10 | while read f; do
        if ! bash -n "$f" 2>/dev/null; then
            fail "Bash syntax error in: $f"
            ((issues++))
        fi
    done
    
    score=$((100 - issues * 20))
    [ $score -lt 0 ] && score=0
    
    if [ $score -eq 100 ]; then
        pass "Syntax: Perfect (100/100)"
    else
        warn "Syntax: $score/100 ($issues issues)"
    fi
    
    return $score
}

reviewer_security() {
    log "👤 Reviewer 2/5: Security Scanner"
    local score=100
    local issues=0
    
    # Check for dangerous patterns
    local patterns=(
        "eval\s*\("
        "exec\s*\("
        "subprocess\.call.*shell=True"
        "os\.system\s*\("
        "input\s*\(.*eval"
    )
    
    for pattern in "${patterns[@]}"; do
        if grep -r "$pattern" "$WORKSPACE"/*.py 2>/dev/null; then
            warn "Potential security issue: $pattern"
            ((issues++))
        fi
    done
    
    # Check for secrets
    if grep -r "API_KEY\|SECRET\|PASSWORD" "$WORKSPACE"/*.py 2>/dev/null | grep -v "example\|template\|getenv"; then
        warn "Hardcoded secrets detected"
        ((issues++))
    fi
    
    score=$((100 - issues * 25))
    [ $score -lt 0 ] && score=0
    
    if [ $score -eq 100 ]; then
        pass "Security: Perfect (100/100)"
    else
        warn "Security: $score/100 ($issues issues)"
    fi
    
    return $score
}

reviewer_style() {
    log "👤 Reviewer 3/5: Style Guide"
    local score=100
    local issues=0
    
    # Check for long lines
    local long_lines=$(find "$WORKSPACE" -name "*.py" -exec grep -l '.
{120}' {} \; 2>/dev/null | wc -l)
    if [ $long_lines -gt 0 ]; then
        warn "$long_lines files with lines >120 chars"
        ((issues++))
    fi
    
    # Check for TODO/FIXME
    local todos=$(grep -r "TODO\|FIXME\|XXX" "$WORKSPACE"/*.py 2>/dev/null | wc -l)
    if [ $todos -gt 3 ]; then
        warn "$todos TODOs found (should be < 3)"
        ((issues))
    fi
    
    score=$((100 - issues * 15))
    [ $score -lt 0 ] && score=0
    
    if [ $score -eq 100 ]; then
        pass "Style: Perfect (100/100)"
    else
        warn "Style: $score/100"
    fi
    
    return $score
}

reviewer_docs() {
    log "👤 Reviewer 4/5: Documentation"
    local score=100
    local issues=0
    
    # Check for docstrings
    local py_files=$(find "$WORKSPACE" -name "*.py" | wc -l)
    local docstrings=$(grep -r '"""' "$WORKSPACE"/*.py 2>/dev/null | wc -l)
    
    if [ $py_files -gt 0 ]; then
        local ratio=$((docstrings / py_files))
        if [ $ratio -lt 2 ]; then
            warn "Low docstring coverage ($docstrings/$py_files files)"
            ((issues++))
        fi
    fi
    
    # Check for README updates
    if git diff HEAD~5 --name-only 2>/dev/null | grep -q "README"; then
        pass "README recently updated"
    else
        warn "README not updated in last 5 commits"
        ((issues++))
    fi
    
    score=$((100 - issues * 20))
    [ $score -lt 0 ] && score=0
    
    if [ $score -eq 100 ]; then
        pass "Docs: Perfect (100/100)"
    else
        warn "Docs: $score/100"
    fi
    
    return $score
}

reviewer_tests() {
    log "👤 Reviewer 5/5: Test Coverage"
    local score=100
    
    # Check for test files
    local test_files=$(find "$WORKSPACE" -name "*test*.py" -o -name "test_*" 2>/dev/null | wc -l)
    local py_files=$(find "$WORKSPACE" -name "*.py" | wc -l)
    
    if [ $py_files -eq 0 ]; then
        score=100
    elif [ $test_files -eq 0 ]; then
        fail "No test files found"
        score=0
    else
        local coverage=$((test_files * 100 / py_files))
        if [ $coverage -lt 20 ]; then
            warn "Low test coverage: $coverage%"
            score=50
        else
            pass "Test coverage: $coverage%"
        fi
    fi
    
    if [ $score -eq 100 ]; then
        pass "Tests: Perfect (100/100)"
    else
        warn "Tests: $score/100"
    fi
    
    return $score
}

# Main
main() {
    echo "========================================"
    echo "   🔍 CODE REVIEW AGENT"
    echo "========================================"
    echo ""
    
    reviewer_syntax
    local s1=$?
    
    reviewer_security
    local s2=$?
    
    reviewer_style
    local s3=$?
    
    reviewer_docs
    local s4=$?
    
    reviewer_tests
    local s5=$?
    
    # Calculate overall
    local overall=$(( (s1 + s2 + s3 + s4 + s5) / 5 ))
    
    echo ""
    echo "========================================"
    echo "   📊 REVIEW SUMMARY"
    echo "========================================"
    echo "Syntax:      $s1/100"
    echo "Security:    $s2/100"
    echo "Style:       $s3/100"
    echo "Docs:        $s4/100"
    echo "Tests:       $s5/100"
    echo "----------------------------------------"
    
    if [ $overall -ge 80 ]; then
        echo -e "Overall:     ${GREEN}$overall/100${NC} ✅ APPROVED"
    elif [ $overall -ge 60 ]; then
        echo -e "Overall:     ${YELLOW}$overall/100${NC} ⚠️  NEEDS IMPROVEMENT"
    else
        echo -e "Overall:     ${RED}$overall/100${NC} ❌ REJECTED"
    fi
    echo "========================================"
    
    return $(( 100 - overall ))
}

main