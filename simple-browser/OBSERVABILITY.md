# Simple Browser - Observability Guide

## 📊 Dashboard Features

### Session Overview
- **Duration**: Total browsing session time
- **Total Loads**: Number of pages loaded

### Performance Metrics
- **Avg Load Time**: Average page load duration
- **Success Rate**: Percentage of successful loads
- **Success/Failed Counters**: Detailed breakdown

### Navigation Stats
- **Unique Domains**: Number of distinct websites visited
- **Pages/Min**: Browsing velocity

### Recent History
- Last 5 visited sites with load times
- Success/failure indicators

## 🚀 Starting with Dashboard

```bash
cd /home/dell/.openclaw/workspace/simple-browser

# Install additional dependency (if needed)
npm install

# Start with web mode
npx expo start --web

# Dashboard is integrated in App.tsx
```

## 📈 Metrics Tracked

| Metric | Description | Unit |
|--------|-------------|------|
| Total Loads | Pages loaded in session | count |
| Avg Load Time | Mean page load duration | seconds |
| Success Rate | Successful loads / Total | percentage |
| Unique Domains | Distinct hostnames visited | count |
| Session Duration | Time since browser opened | minutes |

## 🔧 Integration

The dashboard is integrated into `App.tsx` and can be toggled with the 📊 button in the header.

## 🛠️ Browser Commands

```bash
# Development
npx expo start

# Web mode
npx expo start --web

# Android
npx expo start --android

# iOS
npx expo start --ios
```

## 📁 File Structure

```
simple-browser/
├── App.tsx              # Main browser with dashboard
├── package.json         # Dependencies
├── src/
│   └── components/
│       └── Dashboard.tsx    # Observability dashboard
└── README.md
```
