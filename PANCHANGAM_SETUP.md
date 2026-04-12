# Chennai Panchangam Daily Setup Guide

## Step 1: Get Free Prokerala API Key

1. Visit: https://api.prokerala.com/
2. Click "Sign Up" (free forever plan)
3. Verify email
4. Go to Dashboard → API Keys
5. Copy your key

## Step 2: Configure the Script

```bash
# Option A: Set environment variable (recommended)
export PROKERALA_API_KEY="your-key-here"

# Option B: Edit the script
nano /home/dell/panchangam.py
# Change: API_KEY = "YOUR_PROKERALA_API_KEY_HERE"
# To: API_KEY = "your-actual-key"
```

## Step 3: Install Dependencies

```bash
sudo apt-get update
sudo apt-get install -y python3-pip
pip3 install requests
```

## Step 4: Test Run

```bash
# Python version (recommended)
python3 /home/dell/panchangam.py

# Or bash version
chmod +x /home/dell/fetch-panchangam.sh
PROKERALA_API_KEY="your-key" /home/dell/fetch-panchangam.sh
```

## Step 5: Daily Automation (Cron)

```bash
# Open crontab
crontab -e

# Add this line for daily 6 AM update:
0 6 * * * cd /home/dell && PROKERALA_API_KEY="your-key" python3 panchangam.py >> /home/dell/panchangam.log 2>&1

# Or save output to Telegram (if you want daily messages)
0 6 * * * cd /home/dell && PROKERALA_API_KEY="your-key" python3 panchangam.py | telegram-send --stdin
```

## Features

✅ Accurate Tithi, Nakshatra, Yoga, Karana  
✅ Sunrise/Sunset/Moonrise/Moonset for Chennai  
✅ Shubha/Amrita/Dur Muhurtas  
✅ Rahu Kalam, Yamagandam, Gulikai  
✅ Saved to ~/panchangam/ folder daily  

## API Limits

- Free tier: 5,000 requests/month
- Rate limit: 5 requests/minute
- One daily fetch = ~30 requests/month (well within limit)

## Files Created

- `/home/dell/panchangam.py` - Main Python script
- `/home/dell/fetch-panchangam.sh` - Bash alternative
- `~/panchangam/panchangam-YYYYMMDD.json` - Raw data
- `~/panchangam/panchangam-YYYYMMDD.txt` - Formatted output
