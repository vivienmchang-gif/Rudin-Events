"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Search,
  Download,
  MapPin,
  Calendar,
  ExternalLink,
  Filter,
  Loader2,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { NEIGHBORHOODS, EVENT_CATEGORIES, RUDIN_PROPERTIES } from "./data/properties";
import type { DiscoveredEvent } from "./api/search-events/route";

const CATEGORY_COLORS: Record<string, string> = {
  "Arts & Culture":        "bg-green-100 text-green-900",
  "Food & Drink":          "bg-green-200 text-green-900",
  "Fitness & Wellness":    "bg-emerald-100 text-emerald-900",
  "Family-Friendly":       "bg-teal-100 text-teal-900",
  "Networking & Business": "bg-green-50 text-green-800 border border-green-300",
  "Seasonal & Holiday":    "bg-emerald-200 text-emerald-900",
  "Community & Civic":     "bg-teal-200 text-teal-900",
  "Music & Entertainment": "bg-green-300 text-green-950",
};

export default function Home() {
  const [events, setEvents] = useState<DiscoveredEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(EVENT_CATEGORIES);
  const [dateRangeDays, setDateRangeDays] = useState(30);
  const [propertyType, setPropertyType] = useState<"Both" | "Commercial" | "Residential">("Both");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [groupByProperty, setGroupByProperty] = useState(false);

  const toggleNeighborhood = (n: string) =>
    setSelectedNeighborhoods(prev =>
      prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]
    );

  const toggleCategory = (c: string) =>
    setSelectedCategories(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );

  const searchEvents = async () => {
    setLoading(true);
    setError("");
    setEvents([]);
    try {
      const res = await fetch("/api/search-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedNeighborhoods, selectedCategories, dateRangeDays, propertyType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setEvents(data.events || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!events.length) return;
    const rows = events.map(e => ({
      "Event Title": e.title,
      "Description": e.description,
      "Date": e.date,
      "Time": e.time,
      "Location / Venue": e.location,
      "Neighborhood": e.neighborhood,
      "Category": e.category,
      "Source Website": e.sourceWebsite,
      "Source URL": e.sourceUrl,
      "Nearest Rudin Properties": e.nearestProperties.join("; "),
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 40 }, { wch: 60 }, { wch: 18 }, { wch: 12 }, { wch: 35 },
      { wch: 20 }, { wch: 22 }, { wch: 30 }, { wch: 45 }, { wch: 50 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, "All Events");
    const propertyMap: Record<string, DiscoveredEvent[]> = {};
    events.forEach(e => {
      e.nearestProperties.forEach(prop => {
        if (!propertyMap[prop]) propertyMap[prop] = [];
        propertyMap[prop].push(e);
      });
    });
    Object.entries(propertyMap).forEach(([prop, propEvents]) => {
      const propRows = propEvents.map(e => ({
        "Event Title": e.title, "Description": e.description, "Date": e.date,
        "Time": e.time, "Location / Venue": e.location, "Category": e.category,
        "Source Website": e.sourceWebsite, "Source URL": e.sourceUrl,
      }));
      const propWs = XLSX.utils.json_to_sheet(propRows);
      propWs["!cols"] = [{ wch: 40 }, { wch: 60 }, { wch: 18 }, { wch: 12 }, { wch: 35 }, { wch: 22 }, { wch: 30 }, { wch: 45 }];
      XLSX.utils.book_append_sheet(wb, propWs, prop.substring(0, 31));
    });
    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Rudin_Events_${today}.xlsx`);
  };

  const groupedEvents: Record<string, DiscoveredEvent[]> = {};
  if (groupByProperty && events.length) {
    events.forEach(e => {
      e.nearestProperties.forEach(prop => {
        if (!groupedEvents[prop]) groupedEvents[prop] = [];
        groupedEvents[prop].push(e);
      });
    });
  }

  const hasResults = events.length > 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8faf8" }}>

      {/* Header */}
      <header style={{ backgroundColor: "#006F52" }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <img src="/logo.svg" alt="Rudin" style={{ height: "36px" }} />
          <div className="hidden md:flex gap-6 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
            <div className="text-center">
              <div className="text-xl font-semibold text-white">{RUDIN_PROPERTIES.length}</div>
              <div>Properties</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-white">15+</div>
              <div>BID Sources</div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-4">
          <p className="text-white text-lg font-light" style={{ opacity: 0.9 }}>Local Events Discovery</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>AI-powered event curation from BIDs and trusted community sources</p>
        </div>
      </header>

      {/* Sticky toolbar */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm" style={{ borderColor: "#e0ede9" }}>
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={dateRangeDays}
              onChange={e => setDateRangeDays(Number(e.target.value))}
              className="border rounded px-3 py-1.5 text-sm bg-white focus:outline-none"
              style={{ borderColor: "#b0d0c8", color: "#006F52" }}
            >
              <option value={7}>Next 7 days</option>
              <option value={14}>Next 14 days</option>
              <option value={30}>Next 30 days</option>
              <option value={60}>Next 60 days</option>
              <option value={90}>Next 90 days</option>
            </select>

            <select
              value={propertyType}
              onChange={e => setPropertyType(e.target.value as any)}
              className="border rounded px-3 py-1.5 text-sm bg-white focus:outline-none"
              style={{ borderColor: "#b0d0c8", color: "#006F52" }}
            >
              <option value="Both">All Properties</option>
              <option value="Commercial">Commercial</option>
              <option value="Residential">Residential</option>
            </select>

            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 border rounded text-sm transition-colors bg-white"
              style={{ borderColor: "#b0d0c8", color: "#006F52" }}
            >
              <Filter size={13} />
              Filters
              {(selectedNeighborhoods.length > 0 || selectedCategories.length < EVENT_CATEGORIES.length) && (
                <span className="text-white text-xs rounded-full w-4 h-4 flex items-center justify-center" style={{ backgroundColor: "#006F52" }}>
                  {selectedNeighborhoods.length + (EVENT_CATEGORIES.length - selectedCategories.length)}
                </span>
              )}
              {filtersOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            <button
              onClick={searchEvents}
              disabled={loading}
              className="flex items-center gap-2 text-white px-5 py-1.5 rounded font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#006F52" }}
            >
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /> Searching…</>
              ) : (
                <><Search size={14} /> Search Events</>
              )}
            </button>

            {hasResults && (
              <button
                onClick={exportToExcel}
                className="flex items-center gap-1.5 text-sm transition-colors ml-auto"
                style={{ color: "#006F52" }}
              >
                <Download size={13} />
                Export to Excel
              </button>
            )}
          </div>

          {filtersOpen && (
            <div className="pt-4 mt-3 border-t grid grid-cols-1 md:grid-cols-2 gap-6" style={{ borderColor: "#e0ede9" }}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#006F52" }}>Neighborhoods</span>
                  <button
                    onClick={() => setSelectedNeighborhoods(selectedNeighborhoods.length ? [] : [...NEIGHBORHOODS])}
                    className="text-xs hover:underline"
                    style={{ color: "#006F52" }}
                  >
                    {selectedNeighborhoods.length ? "Clear all" : "Select all"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {NEIGHBORHOODS.map(n => (
                    <button key={n} onClick={() => toggleNeighborhood(n)}
                      className="flex items-center gap-2 text-sm py-1 text-left" style={{ color: "#444" }}>
                      {selectedNeighborhoods.includes(n)
                        ? <CheckSquare size={13} style={{ color: "#006F52" }} className="shrink-0" />
                        : <Square size={13} className="shrink-0" style={{ color: "#aaa" }} />}
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "#006F52" }}>Categories</span>
                  <button
                    onClick={() => setSelectedCategories(selectedCategories.length === EVENT_CATEGORIES.length ? [] : [...EVENT_CATEGORIES])}
                    className="text-xs hover:underline"
                    style={{ color: "#006F52" }}
                  >
                    {selectedCategories.length === EVENT_CATEGORIES.length ? "Clear all" : "Select all"}
                  </button>
                </div>
                <div className="space-y-1">
                  {EVENT_CATEGORIES.map(c => (
                    <button key={c} onClick={() => toggleCategory(c)}
                      className="flex items-center gap-2 text-sm py-1 w-full text-left" style={{ color: "#444" }}>
                      {selectedCategories.includes(c)
                        ? <CheckSquare size={13} style={{ color: "#006F52" }} className="shrink-0" />
                        : <Square size={13} className="shrink-0" style={{ color: "#aaa" }} />}
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {error && (
          <div className="border rounded-lg px-4 py-3 mb-5 text-sm" style={{ backgroundColor: "#fff0f0", borderColor: "#fca5a5", color: "#b91c1c" }}>
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <Loader2 size={36} className="mx-auto mb-4 animate-spin" style={{ color: "#006F52", opacity: 0.5 }} />
            <p className="text-lg mb-1 font-light" style={{ color: "#006F52" }}>Searching BIDs and community sources…</p>
            <p className="text-sm text-gray-500">This may take up to 30 seconds</p>
          </div>
        )}

        {hasResults && !loading && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold" style={{ color: "#006F52" }}>{events.length} events</span> found
            </p>
            <button
              onClick={() => setGroupByProperty(!groupByProperty)}
              className="text-xs border rounded px-3 py-1 transition-colors bg-white"
              style={{ borderColor: "#b0d0c8", color: "#006F52" }}
            >
              {groupByProperty ? "View: All Events" : "View: By Property"}
            </button>
          </div>
        )}

        {!groupByProperty && hasResults && !loading && (
          <div className="grid gap-4">
            {events.map((event, i) => <EventCard key={i} event={event} />)}
          </div>
        )}

        {groupByProperty && Object.keys(groupedEvents).length > 0 && !loading && (
          <div className="space-y-8">
            {Object.entries(groupedEvents).sort().map(([prop, propEvents]) => (
              <div key={prop}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1" style={{ backgroundColor: "#c8e0d8" }} />
                  <div className="flex items-center gap-2 text-white px-4 py-1.5 rounded-full text-sm" style={{ backgroundColor: "#006F52" }}>
                    <span className="font-medium">{prop}</span>
                    <span className="text-xs" style={{ opacity: 0.7 }}>({propEvents.length})</span>
                  </div>
                  <div className="h-px flex-1" style={{ backgroundColor: "#c8e0d8" }} />
                </div>
                <div className="grid gap-3">
                  {propEvents.map((event, i) => <EventCard key={i} event={event} compact />)}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !hasResults && !error && (
          <div className="text-center py-24 text-gray-400">
            <Search size={40} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg mb-1 font-light" style={{ color: "#006F52" }}>Ready to discover events</p>
            <p className="text-sm">Use the filters above and click Search Events</p>
          </div>
        )}
      </main>
    </div>
  );
}

function EventCard({ event, compact = false }: { event: DiscoveredEvent; compact?: boolean }) {
  const colorClass = CATEGORY_COLORS[event.category] || "bg-green-50 text-green-900";
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5" style={{ border: "1px solid #d4e8e0" }}>
      <div className="flex flex-wrap items-center gap-2 mb-1.5">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
          {event.category}
        </span>
        <span className="text-xs text-gray-400">{event.neighborhood}</span>
      </div>
      <h3 className="font-semibold text-base mb-1 leading-snug" style={{ color: "#1a1a1a" }}>
        {event.title}
      </h3>
      {!compact && (
        <p className="text-sm text-gray-500 mb-3 leading-relaxed">{event.description}</p>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
        <span className="flex items-center gap-1">
          <Calendar size={11} className="shrink-0" />
          {event.date}{event.time && event.time !== "TBD" ? ` · ${event.time}` : ""}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={11} className="shrink-0" />
          {event.location}
        </span>
      </div>
      <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-2" style={{ borderColor: "#e8f2ee" }}>
        <div className="flex flex-wrap gap-1">
          {event.nearestProperties.map((prop, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "#f0f9f5", color: "#006F52", border: "1px solid #c8e0d8" }}>
              {prop}
            </span>
          ))}
        </div>
        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-medium transition-colors"
          style={{ color: "#006F52" }}
        >
          <ExternalLink size={11} />
          {event.sourceWebsite}
        </a>
      </div>
    </div>
  );
}
