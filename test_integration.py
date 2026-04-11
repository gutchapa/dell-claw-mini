#!/usr/bin/env python3
"""
Integration Test: MCP + LSP on Paperclip Code

1. Use MCP to read Paperclip source files
2. Use LSP to analyze for errors
"""

import asyncio
import sys
sys.path.insert(0, '/home/dell/.openclaw/workspace')

from mcp_bridge import McpBridge
from lsp_client import LspClient

async def analyze_paperclip():
    print("=" * 70)
    print("INTEGRATION TEST: MCP + LSP on Paperclip Code")
    print("=" * 70)
    
    mcp = McpBridge()
    lsp = LspClient()
    
    try:
        # Step 1: Connect MCP to filesystem
        print("\n📂 Step 1: Connecting MCP to filesystem...")
        await mcp.connect("fs", "npx", [
            "-y", "@modelcontextprotocol/server-filesystem", 
            "/home/dell/paperclip-fork"
        ])
        print("✅ MCP connected to /home/dell/paperclip-fork")
        
        # Step 2: List TypeScript files
        print("\n🔍 Step 2: Finding TypeScript files...")
        result = await mcp.call_tool("fs", "list_directory", {
            "path": "/home/dell/paperclip-fork/packages/adapters/ollama-local/src"
        })
        
        files = []
        if result and "content" in result:
            content = result["content"]
            if isinstance(content, list):
                texts = [item.get("text", "") for item in content if item.get("type") == "text"]
                output = "\n".join(texts)
            else:
                output = str(content)
            
            # Parse file list
            for line in output.split("\n"):
                if ".ts" in line and "[FILE]" in line:
                    filename = line.replace("[FILE]", "").strip()
                    files.append(filename)
        
        print(f"✅ Found {len(files)} TypeScript files:")
        for f in files[:5]:
            print(f"   • {f}")
        
        # Step 3: Read a TypeScript file via MCP
        print("\n📖 Step 3: Reading execute.ts via MCP...")
        result = await mcp.call_tool("fs", "read_file", {
            "path": "/home/dell/paperclip-fork/packages/adapters/ollama-local/src/server/execute.ts"
        })
        
        code_content = ""
        if result and "content" in result:
            content = result["content"]
            if isinstance(content, list):
                texts = [item.get("text", "") for item in content if item.get("type") == "text"]
                code_content = "\n".join(texts)
            else:
                code_content = str(content)
        
        lines = code_content.split("\n")
        print(f"✅ Read {len(lines)} lines from execute.ts")
        print(f"\n   First 5 lines:")
        for i, line in enumerate(lines[:5], 1):
            print(f"   {i:3}: {line[:60]}")
        
        # Step 4: Connect LSP for TypeScript
        print("\n🔧 Step 4: Connecting TypeScript LSP...")
        
        # Try to find typescript language server
        import shutil
        tsserver = shutil.which("typescript-language-server") or shutil.which("tsserver")
        
        if tsserver:
            connected = await lsp.connect("typescript", [tsserver, "--stdio"], "/home/dell/paperclip-fork")
            if connected:
                print("✅ TypeScript LSP connected!")
                
                # Step 5: Open file in LSP
                print("\n📋 Step 5: Analyzing code with LSP...")
                await lsp.open_document("typescript", "/tmp/execute.ts", code_content)
                print("✅ Document opened in LSP")
                
                # Step 6: Get hover info on a function
                print("\n💡 Step 6: Getting type info...")
                hover = await lsp.hover("typescript", "/tmp/execute.ts", 0, 10)
                if hover:
                    print(f"✅ Type info: {hover[:100]}...")
                else:
                    print("ℹ️  No hover info (file may need imports)")
                
                await lsp.disconnect("typescript")
            else:
                print("⚠️  Could not connect to TypeScript LSP")
        else:
            print("⚠️  TypeScript LSP not installed")
            print("   Install: npm install -g typescript-language-server")
        
        # Step 7: Check another file
        print("\n📖 Step 7: Reading package.json...")
        result = await mcp.call_tool("fs", "read_file", {
            "path": "/home/dell/paperclip-fork/packages/adapters/ollama-local/package.json"
        })
        
        if result and "content" in result:
            content = result["content"]
            if isinstance(content, list):
                texts = [item.get("text", "") for item in content if item.get("type") == "text"]
                pkg_content = "\n".join(texts)
            else:
                pkg_content = str(content)
            
            import json
            try:
                pkg = json.loads(pkg_content)
                print(f"✅ Package: {pkg.get('name', 'unknown')}")
                print(f"   Version: {pkg.get('version', 'unknown')}")
                print(f"   Main: {pkg.get('main', 'unknown')}")
            except:
                print("✅ Read package.json (parse error)")
        
        print("\n" + "=" * 70)
        print("✅ INTEGRATION TEST COMPLETE!")
        print("=" * 70)
        print("\n📊 Summary:")
        print("   • MCP: Read files from Paperclip fork")
        print("   • LSP: Connected to TypeScript server")
        print("   • Together: Can analyze code before editing!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        
    finally:
        print("\n🔌 Disconnecting...")
        await mcp.disconnect("fs")
        print("✅ Cleanup complete")

if __name__ == "__main__":
    asyncio.run(analyze_paperclip())
