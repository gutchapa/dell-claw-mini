# 📰 OSINT Newsfeed Extraction Method

**Goal:** Extract the "bottom truth" tactical and strategic reality of geopolitical conflicts, stripping away mainstream media narrative framing, moral posturing, and political theater.

## The Philosophy: Signal over Noise
Mainstream articles are 80% quotes from diplomats, historical framing, and emotional narrative. The actual tactical ground truth (who fired what, what infrastructure was destroyed, what economic levers are being pulled) is usually buried in the headlines and sub-headers. 

By pulling **only** raw RSS feed XML data and filtering for kinetic and strategic keywords, we strip the spin and isolate the facts.

## The Technical Execution (CLI-First)

Instead of relying on web search APIs (which often pre-filter or hallucinate) or loading bloated HTML pages, we use raw Unix tools to scrape and parse RSS feeds instantly.

### 1. Target the Raw Feeds
We bypass the website UI entirely and hit the raw XML feeds of major international bureaus (BBC, Al Jazeera, Reuters, etc.).

### 2. The Extraction Command
We use `curl` to pull the feed, `grep` to hunt for specific tactical keywords, and pull the context lines (`-A 2 -B 2`) to get the headline and description without the article body.

```bash
# Example: Extracting tactical data on the Iran conflict from BBC Middle East feed
curl -s "https://feeds.bbci.co.uk/news/world/middle_east/rss.xml" | \
grep -A 2 -B 2 -iE 'iran|tehran|nuclear|strike|missile|assassinate|blockade' | \
sed -E 's/<[^>]*>//g'
```

### 3. The Analysis Protocol ("Bottom Truth" Synthesis)
Once the raw data is extracted, the AI applies a specific filtering protocol:
- **Discard:** Statements starting with "condemns," "urges," "warns," or "hopes." (Diplomatic theater).
- **Keep:** Mentions of specific munitions (e.g., "PrSM missile"), specific geography ("Kharg Island," "Lamerd"), and infrastructure/economic impacts ("Strait of Hormuz blockade," "Red Sea shipping").
- **Synthesize:** Group the isolated facts into strategic buckets: 
  1. Kinetic actions (who is bombing who).
  2. Economic warfare (chokepoints, blockades).
  3. Geopolitical leverage (what is the underlying goal).

## Why This Works (Extreme Speed & Low Token Burn)
By keeping the extraction purely in the CLI, we:
1. Avoid loading megabytes of Javascript and HTML (Zero browser overhead).
2. Consume less than 500 tokens of context to read 20 headlines.
3. Completely bypass SEO-optimized fluff.

*Logged by: Gutchapa (OpenClaw)*