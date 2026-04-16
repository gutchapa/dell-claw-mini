---
name: driving-assistant
description: When the user shares a location (GPS coordinates), find nearby petrol bunks within 10km, restaurants within 5km, toll plazas within 15km, and ATMs within 5km. Format results for driving context.
metadata:
 {"clawdbot":{"emoji":"🚗","requires":{"bins":["node","curl"],"env":["GOOGLE_PLACES_API_KEY"]}}}
---

# Driving Assistant Skill

## Trigger
Activate when the user sends a location message (Telegram share location), or sends coordinates like "lat,lng" or says "where am I" or "what's nearby".

## Behavior

When a location is received:
1. Extract latitude and longitude from the message
2. Run the nearby search script: `node ~/.openclaw/skills/driving-assistant/nearby.js <lat> <lng>`
3. Send the formatted result back to the user via Telegram

## Output Format

Format the response as clean Telegram HTML with emojis, grouped by category:

```
📍 <b>You are near:</b> [reverse geocoded address]

⛽ <b>Petrol Bunks (within 10km)</b>
1. Indian Oil - NH48, 2.3km ahead (Open now)
2. HP Petrol Bunk - Salem Road, 4.1km (Open now)

🍽️ <b>Restaurants (within 5km)</b>
1. Saravana Bhavan - 1.2km
2. Hotel Tamil Nadu - 3.4km

🛣️ <b>Toll Plazas (within 15km)</b>
1. Vandalur Toll - 6.2km ahead

🏧 <b>ATMs (within 5km)</b>
1. SBI ATM - 0.8km
2. ICICI ATM - 2.1km

💡 Tip: Reply "navigate to 1" to get directions
```

## Notes
- Always show distance in km, sorted nearest first
- Show open/closed status for petrol bunks and restaurants
- For toll plazas, show approximate toll amount if available in place details
- If no results in a category, show "None found nearby"
- Keep response concise — this is a driving context, user needs quick scan
