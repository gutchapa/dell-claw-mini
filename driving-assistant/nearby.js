#!/usr/bin/env node
/**
 * nearby.js — Smart Driving Assistant with Road Position & Custom Search
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const [, , lat, lng, startStr, destStr, ...customSearch] = process.argv;

if (!lat || !lng) {
  console.error("Usage: node nearby.js <lat> <lng> [start] [dest] [custom search]");
  console.error("Example: node nearby.js 11.5 78.5 12.9,80.2 11.2,78.2 hospital");
  process.exit(1);
}

const API_KEY = "AIzaSyDuyuISb-hGwkT4FV7j_CYlxgUlRysy5fE";
const ROUTE_FILE = path.join(__dirname, '.route_cache.json');

function saveRoute(start, destination) {
  fs.writeFileSync(ROUTE_FILE, JSON.stringify({ start, destination, timestamp: Date.now() }, null, 2));
}

function loadRoute() {
  try {
    if (fs.existsSync(ROUTE_FILE)) return JSON.parse(fs.readFileSync(ROUTE_FILE, 'utf8'));
  } catch (e) {}
  return null;
}

function getBearing(lat1, lng1, lat2, lng2) {
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function getRoadPosition(currentBearing, placeBearing) {
  const diff = ((placeBearing - currentBearing + 540) % 360) - 180;
  if (Math.abs(diff) <= 30) return { position: "ahead", icon: "⬆️", note: "on your way" };
  if (diff > 30 && diff < 60) return { position: "right", icon: "➡️", note: "right side" };
  if (diff < -30 && diff > -60) return { position: "left", icon: "⬅️", note: "left side" };
  if (Math.abs(diff) >= 60 && Math.abs(diff) <= 120) return { position: "side", icon: "↪️", note: "side road" };
  return { position: "behind", icon: "⬇️", note: "behind you" };
}

function fetchWithCurl(url) {
  try {
    return JSON.parse(execSync(`curl -s "${url}"`, { encoding: 'utf8', timeout: 30000 }));
  } catch (e) {
    return { error: e.message };
  }
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const DEFAULT_SEARCHES = [
  { label: "⛽ Petrol Bunks", type: "gas_station", radius: 10000, road_filter: true },
  { label: "🍽️ Pure Veg Restaurants", type: "restaurant", keyword: "pure veg vegetarian", radius: 5000, road_filter: true },
  { label: "🛣️ Toll Plazas", keyword: "toll plaza", radius: 15000, road_filter: true },
  { label: "🏧 ATMs", type: "atm", radius: 5000, road_filter: false },
];

function fetchNearby(search, currentBearing) {
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${search.radius}&key=${API_KEY}`;
  if (search.type) url += `&type=${search.type}`;
  if (search.keyword) url += `&keyword=${encodeURIComponent(search.keyword)}`;
  
  const data = fetchWithCurl(url);
  if (!data.results || data.status !== 'OK') return [];
  
  return data.results.map(place => {
    const placeLat = place.geometry.location.lat;
    const placeLng = place.geometry.location.lng;
    const km = distanceKm(parseFloat(lat), parseFloat(lng), placeLat, placeLng);
    const placeBearing = getBearing(parseFloat(lat), parseFloat(lng), placeLat, placeLng);
    const roadPos = currentBearing ? getRoadPosition(currentBearing, placeBearing) : { position: "unknown", icon: "", note: "" };
    
    return {
      name: place.name,
      vicinity: place.vicinity || "",
      km: km,
      bearing: placeBearing,
      roadPosition: roadPos,
      open: place.opening_hours?.open_now,
      rating: place.rating,
    };
  }).filter(p => !search.road_filter || p.roadPosition.position !== "behind")
    .sort((a, b) => a.km - b.km)
    .slice(0, 6);
}

function formatCategory(search, places) {
  const aheadOnly = places.filter(p => p.roadPosition.position === "ahead");
  const sideOnly = places.filter(p => ["left", "right", "side"].includes(p.roadPosition.position));
  
  let block = `\n${search.label} <i>(within ${search.radius/1000}km)</i>\n`;
  
  // Always show both sections
  block += `  <b>⬆️ Ahead on your way:</b>\n`;
  if (aheadOnly.length > 0) {
    aheadOnly.slice(0, 3).forEach((p, i) => {
      const openTag = p.open === true ? " ✅" : p.open === false ? " ❌" : "";
      const rating = p.rating ? ` ⭐${p.rating}` : "";
      block += `  ${i+1}. <b>${p.name}</b> — ${p.km.toFixed(1)}km${openTag}${rating}\n`;
      if (p.vicinity) block += `     <i>${p.vicinity}</i>\n`;
    });
  } else {
    block += `     None found ahead\n`;
  }
  
  block += `\n  <b>↪️ Left/Right side (exit/U-turn needed):</b>\n`;
  if (sideOnly.length > 0) {
    sideOnly.slice(0, 3).forEach((p, i) => {
      const openTag = p.open === true ? " ✅" : p.open === false ? " ❌" : "";
      const rating = p.rating ? ` ⭐${p.rating}` : "";
      const side = p.roadPosition.position === "left" ? "⬅️ left" : p.roadPosition.position === "right" ? "➡️ right" : "↪️ side";
      block += `  ${i+1}. <b>${p.name}</b> [${side}] — ${p.km.toFixed(1)}km${openTag}${rating}\n`;
      if (p.vicinity) block += `     <i>${p.vicinity}</i>\n`;
    });
  } else {
    block += `     None found on sides\n`;
  }
  
  return block;
}

function handleCustomSearch(searchTerm, currentBearing) {
  const custom = {
    label: `🔍 "${searchTerm}"`,
    radius: 10000,
    road_filter: true
  };
  
  const typeMap = {
    hospital: "hospital", hotel: "lodging", mechanic: "car_repair", pharmacy: "pharmacy",
    school: "school", bank: "bank", shop: "store", cafe: "cafe",
    temple: "hindu_temple", mosque: "mosque", church: "church",
  };
  
  if (typeMap[searchTerm.toLowerCase()]) {
    custom.type = typeMap[searchTerm.toLowerCase()];
    custom.keyword = null;
  } else {
    custom.type = null;
    custom.keyword = searchTerm;
  }
  
  const places = fetchNearby(custom, currentBearing);
  return formatCategory(custom, places);
}

function main() {
  let route = loadRoute();
  let startPoint = null;
  let destination = null;
  let currentBearing = null;

  if (startStr && destStr) {
    const [sLat, sLng] = startStr.split(',').map(parseFloat);
    const [dLat, dLng] = destStr.split(',').map(parseFloat);
    startPoint = { lat: sLat, lng: sLng };
    destination = { lat: dLat, lng: dLng };
    saveRoute(startPoint, destination);
  } else if (route) {
    startPoint = route.start;
    destination = route.destination;
    currentBearing = getBearing(parseFloat(lat), parseFloat(lng), destination.lat, destination.lng);
  }

  if (startPoint && destination && !currentBearing) {
    currentBearing = getBearing(startPoint.lat, startPoint.lng, destination.lat, destination.lng);
  }

  let output = `📍 <b>Current:</b> ${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}\n`;
  if (currentBearing) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const dir = directions[Math.round(currentBearing / 45) % 8];
    output += `🧭 <b>Heading:</b> ${dir} (${currentBearing.toFixed(0)}°)\n`;
  }
  if (destination) {
    output += `🎯 <b>To:</b> ${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}\n`;
  }
  output += `\n<i>All places organized by road position:</i>\n`;

  DEFAULT_SEARCHES.forEach(search => {
    const places = fetchNearby(search, currentBearing);
    output += formatCategory(search, places);
  });

  if (customSearch.length > 0) {
    const searchTerm = customSearch.join(' ');
    output += `\n${'='.repeat(40)}\n`;
    output += handleCustomSearch(searchTerm, currentBearing);
  }

  output += `\n💡 <b>Road Position:</b> ⬆️=ahead | ➡️⬅️=exit | ↪️=U-turn\n`;
  if (!route && !startStr && !customSearch.length) {
    output += `\n<i>Options:</i>\n`;
    output += `• Add route: <code>node nearby.js ${lat} ${lng} start_lat,start_lng dest_lat,dest_lng</code>\n`;
    output += `• Custom search: <code>... hospital|hotel|mechanic|temple|pharmacy</code>\n`;
  }
  console.log(output);
}

main();
