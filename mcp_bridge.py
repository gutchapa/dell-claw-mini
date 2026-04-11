#!/usr/bin/env python3
"""MCP Bridge for Pi Agent"""

import json
import asyncio
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from enum import Enum

class McpConnectionStatus(Enum):
    DISCONNECTED = "disconnected"
    CONNECTING = "connecting"
    CONNECTED = "connected"
    ERROR = "error"

@dataclass
class McpToolInfo:
    name: str
    description: Optional[str] = None

@dataclass
class McpServerState:
    server_name: str
    status: McpConnectionStatus
    tools: List[McpToolInfo] = field(default_factory=list)

class McpBridge:
    def __init__(self):
        self._servers = {}
        self._request_id = 0
    
    async def connect(self, name, cmd, args=None):
        state = McpServerState(server_name=name, status=McpConnectionStatus.CONNECTING)
        full = [cmd] + (args or [])
        
        proc = await asyncio.create_subprocess_exec(
            *full,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE
        )
        
        self._servers[name] = {"proc": proc, "state": state}
        
        # Initialize
        init = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "clientInfo": {"name": "pi-agent", "version": "1.0"}
            }
        }
        await self._send(name, init)
        resp = await self._recv(name)
        
        # List tools
        await self._send(name, {"jsonrpc": "2.0", "id": 2, "method": "tools/list"})
        tools = await self._recv(name)
        
        if tools and "result" in tools:
            for t in tools["result"].get("tools", []):
                state.tools.append(McpToolInfo(name=t["name"], description=t.get("description")))
        
        state.status = McpConnectionStatus.CONNECTED
        return state
    
    async def _send(self, name, data):
        srv = self._servers[name]
        line = json.dumps(data) + "\n"
        srv["proc"].stdin.write(line.encode())
        await srv["proc"].stdin.drain()
    
    async def _recv(self, name, timeout=10):
        srv = self._servers[name]
        try:
            line = await asyncio.wait_for(srv["proc"].stdout.readline(), timeout)
            return json.loads(line.decode().strip())
        except:
            return None
    
    async def call_tool(self, server, tool, args):
        self._request_id += 1
        req = {
            "jsonrpc": "2.0",
            "id": self._request_id,
            "method": "tools/call",
            "params": {"name": tool, "arguments": args}
        }
        await self._send(server, req)
        resp = await self._recv(server, timeout=30)
        return resp.get("result", {}) if resp else None
    
    async def disconnect(self, name):
        if name in self._servers:
            self._servers[name]["proc"].terminate()
            await asyncio.sleep(0.5)
            del self._servers[name]

# Test
async def test():
    bridge = McpBridge()
    try:
        print("Connecting to filesystem MCP...")
        state = await bridge.connect("fs", "npx", ["-y", "@modelcontextprotocol/server-filesystem", "/home/dell"])
        print(f"Tools: {[t.name for t in state.tools]}")
        
        result = await bridge.call_tool("fs", "list_directory", {"path": "/home/dell"})
        print(f"Result: {str(result)[:200]}")
        print("✅ MCP Bridge WORKS!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await bridge.disconnect("fs")

if __name__ == "__main__":
    asyncio.run(test())
