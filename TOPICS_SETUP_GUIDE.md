# Multi-Agent Telegram Topics Setup Guide

## What We're Building
One Telegram group with Forum Topics, where each topic routes to a different OpenClaw agent:
- **#General** → main agent (default)
- **#School** → school agent (education tasks)
- **#Coding** → coding agent (development work)

## Step 1: Create Telegram Group (You Do This)

1. Open Telegram → New Group
2. Name it something like "Gutchapa HQ"
3. Add @gutchmac_bot to the group
4. Go to Group Settings → Enable "Topics" (forum mode)
5. Create these topics:
   - `#General`
   - `#School`
   - `#Coding`

## Step 2: Get Group ID

Option A: Forward any message from the group to @userinfobot
Option B: Run this on Mac Mini terminal:
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates" | grep -o '"chat":{[^}]*}' | head -5
```

You'll get a negative number like `-1001234567890`

## Step 3: Get Topic IDs

Option A: Check the URL when you click each topic (last number is topic ID)
Option B: Run on Mac Mini:
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates" | grep -o '"message_thread_id":[0-9]*' | sort -u
```

Usually:
- General topic = 1
- Your created topics = 2, 3, 4, etc.

## Step 4: Apply Config (I'll Do This Remotely)

Once you give me the group ID and topic IDs, I'll update the Mac Mini's openclaw.json

## What Each Agent Gets

| Agent | Workspace | Purpose | Memory |
|-------|-----------|---------|--------|
| main | ~/.openclaw/workspace/ | General chat | Shared with current |
| school | ~/.openclaw/workspace-school/ | School/curriculum | Isolated |
| coding | ~/.openclaw/workspace-coding/ | Development | Isolated |

## Benefits
- ✅ One bot, multiple isolated brains
- ✅ Each topic remembers its own context
- ✅ No cross-contamination between topics
- ✅ Native Telegram feature (no hacks)

## Downsides
- ⚠️ Each agent uses separate API calls (cost adds up)
- ⚠️ Topics don't share memory (school agent won't know what main knows)
- ⚠️ More agents = more potential for bugs

---

**Reply with your Group ID and Topic IDs when ready!**
