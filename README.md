# Rudin Events Discovery

AI-powered local event discovery for Rudin Management Company properties. Automatically searches Business Improvement Districts (BIDs) and trusted community sources to surface relevant neighborhood events, then exports results to a property-organized Excel file for Marketing review.

---

## What It Does

- **Searches** BID websites, city event pages, and community sources for upcoming events near Rudin properties
- **Categorizes** events by type: Arts & Culture, Food & Drink, Fitness & Wellness, Family-Friendly, Networking, Seasonal, and more
- **Maps events** to the nearest Rudin commercial and residential properties
- **Exports** a structured Excel file with one tab for all events and individual tabs per property
- **Filters** by neighborhood, category, date range, and property type

---

## Trusted Event Sources

| Source | Type | Neighborhoods Covered |
|--------|------|----------------------|
| Times Square Alliance | BID | Midtown |
| Grand Central Partnership | BID | Midtown |
| Downtown Alliance | BID | Downtown / Financial District |
| Flatiron NoMad Partnership | BID | Midtown South |
| Village Alliance | BID | Greenwich Village |
| Upper East Side BID | BID | Upper East Side |
| Hudson Square BID | BID | Midtown South |
| Fifth Avenue BID | BID | Midtown |
| Madison Square Park Conservancy | BID | Midtown South |
| NYC Parks Events | City | Citywide |
| Central Park Conservancy | Community | Upper West Side |
| 92NY | Community | Upper East Side |
| Eventbrite NYC | Platform | Citywide |

---

## Excel Output Format

The exported file contains:

**Tab 1 – All Events**
| Column | Description |
|--------|-------------|
| Event Title | Name of the event |
| Description | 2–3 sentence AI-generated summary |
| Date | Formatted date |
| Time | Start time |
| Location / Venue | Full address |
| Neighborhood | NYC neighborhood |
| Category | Event type |
| Source Website | BID or platform name |
| Source URL | Direct link to event listing |
| Nearest Rudin Properties | Semicolon-separated list of nearby properties |

**Tabs 2+ – Per Property**
One tab per Rudin property that has nearby events, with the same columns minus the property column.

---

## Rudin Properties Covered

### Commercial Office (15 properties)
- Midtown: 3 Times Square, 345 Park Ave, 355 Lexington, 415 Madison, 560 Lexington, 641 Lexington, 136 E 55th St, 1070 Second Ave, 1675 Broadway
- Midtown South: 41 Madison Ave, 32 Avenue of the Americas
- Downtown: One Battery Park Plaza, 110 Wall Street

### Residential (21 properties)
- Upper East Side: 945 Fifth Ave, 1085 Park Ave, and 4 more
- Upper West Side: 20–144 W 86th St, 241 & 295 Central Park West
- Midtown: 40 Park Ave, 136 E 55th St, 300 E 57th St, 1070 Second Ave
- Greenwich Village: The Greenwich Lane, 130 W 12th St

---

## Setup

### Prerequisites
- Node.js 18+
- An Anthropic API key with web search enabled (get one at [console.anthropic.com](https://console.anthropic.com))

### Local Development

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_ORG/rudin-events-discovery.git
cd rudin-events-discovery

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# 4. Run the dev server
npm run dev
# Open http://localhost:3000
```

---

## Deploy to Vercel

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel
# Follow prompts — Vercel auto-detects Next.js
```

### Option B: GitHub Integration (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Under **Environment Variables**, add:
   - `ANTHROPIC_API_KEY` = your key from console.anthropic.com
5. Click **Deploy**

> The API route has a 60-second timeout set in `vercel.json` to allow for web search + AI processing time.

---

## How It Works

1. **User selects** filters: date range, neighborhoods, categories, property type
2. **Frontend** sends a POST request to `/api/search-events`
3. **API route** calls Claude claude-sonnet-4-6 with the `web_search` tool enabled, instructing it to search BID and community sites
4. **Claude** uses web search to find real events, then extracts structured data (title, date, time, location, source, nearest properties)
5. **Results** render as event cards in the UI
6. **Export** generates a multi-tab Excel file via the `xlsx` library

---

## Data Governance

- **Data Sensitivity:** Public information only
- **Sources:** Limited to approved BID and community websites
- **Human Review:** Marketing team approves events before publishing
- **Source Citation:** Every event includes a source URL
- **No PII:** Only public event information is collected

---

## Customization

To add new properties, edit `app/data/properties.ts` and add entries to the `RUDIN_PROPERTIES` array.

To add new BID or event sources, add entries to the `EVENT_SOURCES` array in the same file.

---

## Key Stakeholders
- Marketing & Communications
- Property Management  
- Tenant Experience Team
