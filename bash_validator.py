#!/usr/bin/env python3
"""Bash Command Validator - extracted from claw-code"""

import re
from typing import List, Tuple

class BashValidator:
    """Validates bash commands for safety"""
    
    DESTRUCTIVE_COMMANDS = ['rm', 'dd', 'mkfs', 'fdisk', 'format']
    DANGEROUS_PATTERNS = ['rm -rf /', ':(){ :|:& };:', '> /dev/sda']
    
    def validate(self, command: str) -> Tuple[bool, str]:
        """Validate a bash command. Returns (is_safe, reason)"""
        
        # Check for destructive commands
        for cmd in self.DESTRUCTIVE_COMMANDS:
            if command.strip().startswith(cmd):
                return False, f"Destructive command detected: {cmd}"
        
        # Check for dangerous patterns
        for pattern in self.DANGEROUS_PATTERNS:
            if pattern in command:
                return False, f"Dangerous pattern detected: {pattern}"
        
        return True, "Command appears safe"
    
    def is_read_only(self, command: str) -> bool:
        """Check if command only reads (doesn't modify)"""
        modifying_patterns = ['>', '>>', 'rm', 'mv', 'cp', 'mkdir', 'chmod']
        return not any(p in command for p in modifying_patterns)
