#!/usr/bin/env python3
"""LSP Client for Pi Agent - with auto-detection"""

import json
import asyncio
import os
import shutil
from dataclasses import dataclass

@dataclass
class LspLocation:
    path: str
    line: int
    character: int

class LspClient:
    def __init__(self):
        self._servers = {}
        self._request_id = 0
    
    async def connect(self, language, command, root_path):
        if language in self._servers:
            return False
        try:
            if not shutil.which(command[0]):
                return False
            proc = await asyncio.create_subprocess_exec(
                *command, stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE
            )
            self._servers[language] = {"proc": proc, "root": root_path}
            await self._initialize(language, root_path)
            return True
        except Exception as e:
            print(f"Error: {e}")
            return False
    
    async def _initialize(self, lang, root):
        params = {"processId": os.getpid(), "rootUri": f"file://{root}", "capabilities": {}}
        await self._request(lang, "initialize", params)
        await self._notify(lang, "initialized", {})
    
    async def _request(self, lang, method, params, timeout=10):
        srv = self._servers.get(lang)
        if not srv:
            return None
        self._request_id += 1
        req = {"jsonrpc": "2.0", "id": self._request_id, "method": method, "params": params}
        srv["proc"].stdin.write((json.dumps(req) + "\r\n").encode())
        await srv["proc"].stdin.drain()
        try:
            line = await asyncio.wait_for(srv["proc"].stdout.readline(), timeout)
            return json.loads(line.decode().strip())
        except:
            return None
    
    async def _notify(self, lang, method, params):
        srv = self._servers.get(lang)
        if srv:
            n = {"jsonrpc": "2.0", "method": method, "params": params}
            srv["proc"].stdin.write((json.dumps(n) + "\r\n").encode())
            await srv["proc"].stdin.drain()
    
    async def open_document(self, lang, path, content):
        await self._notify(lang, "textDocument/didOpen", {
            "textDocument": {"uri": f"file://{path}", "languageId": lang, "version": 1, "text": content}
        })
    
    async def hover(self, lang, path, line, char):
        resp = await self._request(lang, "textDocument/hover", {
            "textDocument": {"uri": f"file://{path}"}, "position": {"line": line, "character": char}
        })
        if resp and "result" in resp:
            c = resp["result"].get("contents")
            return c if isinstance(c, str) else c.get("value", "") if isinstance(c, dict) else ""
        return None
    
    async def disconnect(self, lang):
        if lang in self._servers:
            try:
                await self._notify(lang, "shutdown", {})
                self._servers[lang]["proc"].terminate()
            except:
                pass
            del self._servers[lang]

def find_lsp_servers():
    servers = []
    if shutil.which("rust-analyzer"):
        servers.append(("rust", ["rust-analyzer"], "/home/dell/claw-code/rust"))
    if shutil.which("pylsp"):
        servers.append(("python", ["pylsp"], "/home/dell"))
    elif shutil.which("python3"):
        servers.append(("python", ["python3", "-m", "pylsp"], "/home/dell"))
    return servers

async def test():
    print("=" * 60)
    print("LSP Client Test")
    print("=" * 60)
    
    servers = find_lsp_servers()
    if not servers:
        print("\n❌ No LSP servers found!")
        print("\nInstall one:")
        print("  • Python: pip install python-lsp-server")
        print("  • Rust:   rustup component add rust-analyzer")
        print("\nLSP Client is READY - needs server.")
        return

    print(f"\n✅ Found {len(servers)} server(s)")
    c = LspClient()
    lang, cmd, root = servers[0]
    
    print(f"\nTesting {lang}...")
    if await c.connect(lang, cmd, root):
        print("✅ Connected!")
        await c.disconnect(lang)
        print("✅ Disconnected")
    
    print("\n" + "=" * 60)
    print("LSP Client Ready!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test())

