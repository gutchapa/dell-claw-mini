#!/usr/bin/env python3
"""
Integration Test: MCP + LSP on Paperclip Code
FIXED: Proper async cleanup to prevent "Event loop is closed" error
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
            
            for line in output.split("\n"):
                if ".ts" in line and "[FILE]" in line:
                    filename = line.replace("[FILE]", "").strip()
                    files.append(filename)
        
        print(f"✅ Found {len(files)} TypeScript files")
        
        # Step 3: Read execute.ts via MCP
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
        
        # Step 4: Connect LSP for TypeScript
        print("\n🔧 Step 4: Connecting TypeScript LSP...")
        
        import shutil
        tsserver = shutil.which("typescript-language-server") or shutil.which("tsserver")
        
        if tsserver:
            connected = await lsp.connect("typescript", [tsserver, "--stdio"], "/home/dell/paperclip-fork")
            if connected:
                print("✅ TypeScript LSP connected!")
                await lsp.open_document("typescript", "/tmp/execute.ts", code_content)
                print("✅ Document opened in LSP")
                await lsp.disconnect("typescript")
            else:
                print("⚠️  Could not connect to TypeScript LSP")
        else:
            print("⚠️  TypeScript LSP not installed")
        
        # Step 7: Read package.json
        print("\n📖 Step 5: Reading package.json...")
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
                print(f"✅ Package: {pkg.get('name', 'unknown')} v{pkg.get('version', 'unknown')}")
            except:
                print("✅ Read package.json")
        
        print("\n" + "=" * 70)
        print("✅ INTEGRATION TEST COMPLETE!")
        print("=" * 70)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        
    finally:
        # CRITICAL FIX: Proper cleanup sequence to prevent "Event loop is closed" error
        print("\n🔌 Disconnecting...")
        try:
            # Close MCP first with proper cleanup
            if "fs" in mcp._servers:
                proc = mcp._servers["fs"]["proc"]
                
                # 1. Close stdin explicitly to signal EOF
                if proc.stdin and not proc.stdin.is_closing():
                    try:
                        proc.stdin.close()
                        await proc.stdin.wait_closed()
                    except:
                        pass
                
                # 2. Terminate process and wait for full exit
                if proc.returncode is None:
                    proc.terminate()
                    try:
                        await asyncio.wait_for(proc.wait(), timeout=2.0)
                    except asyncio.TimeoutError:
                        proc.kill()
                        await proc.wait()
                
                del mcp._servers["fs"]
            
            print("✅ Cleanup complete")
        except Exception as e:
            print(f"⚠️  Cleanup warning: {e}")
        
        # 3. Small sleep to let event loop clean up transports
        await asyncio.sleep(0.01)

if __name__ == "__main__":
    # Use proper asyncio runner with cleanup
    try:
        asyncio.run(analyze_paperclip())
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        sys.exit(1)
