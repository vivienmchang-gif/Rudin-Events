import { NextRequest, NextResponse } from "next/server";
import { RUDIN_PROPERTIES, EVENT_SOURCES, EVENT_CATEGORIES } from "../../data/properties";

export interface DiscoveredEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  sourceWebsite: string;
  sourceUrl: string;
  category: string;
  nearestProperties: string[];
  neighborhood: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      selectedNeighborhoods = [],
      selectedCategories = EVENT_CATEGORIES,
      dateRangeDays = 30,
      propertyType = "Both",
    } = body;

    let properties = RUDIN_PROPERTIES;
    if (propertyType === "Commercial") properties = properties.filter(p => p.type === "Commercial");
    if (propertyType === "Residential") properties = properties.filter(p => p.type === "Residential");
    if (selectedNeighborhoods.length > 0) {
      properties = properties.filter(p => selectedNeighborhoods.includes(p.neighborhood));
    }

    const neighborhoodList = [...new Set(properties.map(p => p.neighborhood))];

    const prompt = `You are an AI assistant helping Rudin Management Company's Marketing team discover local community events near their NYC properties.

Search the web for upcoming community events in the next ${dateRangeDays} days near these NYC neighborhoods: ${neighborhoodList.join(", ")}.

Focus on these event categories: ${selectedCategories.join(", ")}

Priority sources to search (Business Improvement Districts and trusted community sites):
${EVENT_SOURCES.map(s => `- ${s.name}: ${s.url}`).join("\n")}

Rudin properties in these neighborhoods:
${properties.map(p => `- ${p.name} (${p.address}) — ${p.neighborhood}`).join("\n")}

Instructions:
1. Search for real upcoming events from the BID websites and trusted community sources listed above
2. Find 15-25 events across the neighborhoods
3. For each event, identify which Rudin properties are closest (within ~1 mile)
4. Return ONLY a valid JSON array. No markdown, no explanation, no backticks. Just the raw JSON array.

Return this exact JSON structure:
[
  {
    "title": "Event name",
    "description": "2-3 sentence summary of the event",
    "date": "Month Day, Year (e.g. July 20, 2025)",
    "time": "Start time (e.g. 6:00 PM) or TBD",
    "location": "Full venue name and address",
    "sourceWebsite": "Name of the website/BID where this was found",
    "sourceUrl": "Direct URL to the event page",
    "category": "One of: Arts & Culture, Food & Drink, Fitness & Wellness, Family-Friendly, Networking & Business, Seasonal & Holiday, Community & Civic, Music & Entertainment",
    "nearestProperties": ["Property Name 1", "Property Name 2"],
    "neighborhood": "Neighborhood name"
  }
]`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${response.status} — ${errText}`);
    }

    const data = await response.json();

    // Extract text from Gemini response
    const rawText = data.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text || "")
      .join("") || "";

    // Parse JSON
    let events: DiscoveredEvent[] = [];
    try {
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        events = JSON.parse(jsonMatch[0]);
      }
    } catch {
      const clean = rawText.replace(/```json|```/g, "").trim();
      const jsonMatch2 = clean.match(/\[[\s\S]*\]/);
      if (jsonMatch2) {
        events = JSON.parse(jsonMatch2[0]);
      }
    }

    return NextResponse.json({ events, total: events.length });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search events" },
      { status: 500 }
    );
  }
}
