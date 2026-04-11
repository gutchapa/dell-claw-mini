#!/usr/bin/env python3
"""
LSP Scan: Find ALL TypeScript errors in Paperclip UI adapters
"""

import asyncio
import sys
sys.path.insert(0, '/home/dell/.openclaw/workspace')

from lsp_client import LspClient
import os

async def scan_paperclip_ui():
    client = LspClient()
    
    print("=" * 70)
    print("LSP SCAN: Paperclip UI TypeScript Errors")
    print("=" * 70)
    
    # Files to check
    files_to_check = [
        "/home/dell/paperclip-fork/ui/src/adapters/kimi-local/index.ts",
        "/home/dell/paperclip-fork/ui/src/adapters/ollama-local.ts",
        "/home/dell/paperclip-fork/ui/src/adapters/transcript.ts",
        "/home/dell/paperclip-fork/ui/src/adapters/index.ts",
        "/home/dell/paperclip-fork/ui/src/adapters/kimi-local/config-fields.tsx",
        "/home/dell/paperclip-fork/ui/src/adapters/kimi-local/build-config.ts",
    ]
    
    # Connect to TypeScript LSP
    import shutil
    tsserver = shutil.which("typescript-language-server")
    
    if not tsserver:
        print("❌ TypeScript LSP not found!")
        print("   Install: npm install -g typescript-language-server")
        return
    
    print(f"\n🔌 Connecting to TypeScript LSP...")
    connected = await client.connect(
        "typescript", 
        [tsserver, "--stdio"], 
        "/home/dell/paperclip-fork"
    )
    
    if not connected:
        print("❌ Failed to connect to LSP")
        return
    
    print("✅ LSP connected\n")
    
    total_errors = 0
    
    for file_path in files_to_check:
        if not os.path.exists(file_path):
            print(f"⚠️  File not found: {file_path}")
            continue
        
        # Read file
        with open(file_path, 'r') as f:
            content = f.read()
        
        print(f"📄 Checking: {os.path.basename(file_path)}")
        
        # Open in LSP
        await client.open_document("typescript", file_path, content)
        
        # Small delay for diagnostics
        await asyncio.sleep(0.5)
        
        # Get diagnostics
        try:
            # Try to get diagnostics (method varies by LSP implementation)
            diagnostics = await client._request("typescript", "textDocument/diagnostic", {
                "textDocument": {"uri": f"file://{file_path}"}
            })
            
            if diagnostics and "result" in diagnostics:
                items = diagnostics["result"].get("items", [])
                if items:
                    total_errors += len(items)
                    print(f"   ❌ {len(items)} errors:")
                    for item in items:
                        line = item.get("range", {}).get("start", {}).get("line", 0)
                        msg = item.get("message", "")
                        print(f"      Line {line}: {msg[:80]}")
                else:
                    print(f"   ✅ No errors")
            else:
                print(f"   ℹ️  No diagnostics returned")
                
        except Exception as e:
            print(f"   ⚠️  Could not get diagnostics: {e}")
    
    await client.disconnect("typescript")
    
    print("\n" + "=" * 70)
    if total_errors == 0:
        print("✅ ALL CLEAR - No TypeScript errors found!")
    else:
        print(f"❌ FOUND {total_errors} ERRORS - Need fixes")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(scan_paperclip_ui())
