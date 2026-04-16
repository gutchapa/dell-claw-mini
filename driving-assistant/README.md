# Driving Assistant 🚗

Smart directional driving assistant for OpenClaw with road position awareness.

## Features

- **Directional Search**: Shows only places AHEAD of your travel direction
- **Road Position**: Indicates if place is ⬆️ ahead, ➡️⬅️ left/right, or ↪️ side road
- **Pure Veg Filter**: Restaurant searches filtered for vegetarian options
- **Custom Search**: Can search any place type (hospital, hotel, mechanic, temple, etc.)

## Installation

```bash
# Copy to OpenClaw skills
cp -r driving-assistant ~/.openclaw/skills/

# Set Google API key
export GOOGLE_API_KEY="your_key_here"
```

## Usage

### Basic (no direction)
```bash
node nearby.js 12.988956 80.221450
```

### With route (directional filtering)
```bash
node nearby.js <current_lat> <current_lng> <start_lat,start_lng> <dest_lat,dest_lng>

# Example: Chennai to Namakkal
node nearby.js 11.5 78.5 12.988956,80.221450 11.2189,78.1675
```

### Custom search
```bash
# Search hospitals
node nearby.js 11.5 78.5 12.9,80.2 11.2,78.2 hospital

# Search hotels
node nearby.js 11.5 78.5 12.9,80.2 11.2,78.2 hotel

# Search mechanics
node nearby.js 11.5 78.5 12.9,80.2 11.2,78.2 mechanic
```

## Road Position Legend

| Icon | Position | Meaning |
|------|----------|---------|
| ⬆️ | Ahead | Continue straight, on your way |
| ➡️ | Right side | Exit right, may need U-turn back |
| ⬅️ | Left side | Exit left, may need U-turn back |
| ↪️ | Side road | Off main highway, U-turn to return |

## Categories

- ⛽ Petrol Bunks (10km radius)
- 🍽️ Pure Veg Restaurants (5km radius)
- 🛣️ Toll Plazas (15km radius)
- 🏧 ATMs (5km radius)

## Telegram Integration

When user shares location and says "whereami":
1. Extract lat/lng from location message
2. Run: `node nearby.js <lat> <lng>`
3. Send formatted output to user

## Files

- `nearby.js` - Main script with road position logic
- `SKILL.md` - OpenClaw skill definition
- `README.md` - This file

## Requirements

- Node.js
- curl
- Google Places API key

## License

MIT
