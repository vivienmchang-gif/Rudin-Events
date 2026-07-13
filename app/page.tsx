"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Search,
  Download,
  MapPin,
  Calendar,
  ExternalLink,
  Building2,
  Home as HomeIcon,
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
  "Arts & Culture": "bg-purple-100 text-purple-800",
  "Food & Drink": "bg-orange-100 text-orange-800",
  "Fitness & Wellness": "bg-green-100 text-green-800",
  "Family-Friendly": "bg-yellow-100 text-yellow-800",
  "Networking & Business": "bg-blue-100 text-blue-800",
  "Seasonal & Holiday": "bg-red-100 text-red-800",
  "Community & Civic": "bg-teal-100 text-teal-800",
  "Music & Entertainment": "bg-pink-100 text-pink-800",
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
        "Event Title": e.title,
        "Description": e.description,
        "Date": e.date,
        "Time": e.time,
        "Location / Venue": e.location,
        "Category": e.category,
        "Source Website": e.sourceWebsite,
        "Source URL": e.sourceUrl,
      }));
      const propWs = XLSX.utils.json_to_sheet(propRows);
      propWs["!cols"] = [
        { wch: 40 }, { wch: 60 }, { wch: 18 }, { wch: 12 },
        { wch: 35 }, { wch: 22 }, { wch: 30 }, { wch: 45 },
      ];
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
    <div className="min-h-screen bg-rudin-cream">
      {/* Header */}
      <header className="bg-rudin-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rudin-gold text-xs font-medium tracking-widest uppercase mb-0.5">
                Rudin Management Company
              </p>
              <h1 className="font-display text-2xl font-normal">Local Events Discovery</h1>
            </div>
            <div className="hidden md:flex gap-6 text-sm text-blue-200">
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
        </div>
      </header>
      <div className="h-1 bg-rudin-gold" />

      {/* Sticky search bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-rudin-light shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Date range */}
            <select
              value={dateRangeDays}
              onChange={e => setDateRangeDays(Number(e.target.value))}
              className="border border-rudin-light rounded px-3 py-1.5 text-sm text-rudin-navy bg-white focus:outline-none focus:ring-2 focus:ring-rudin-navy"
            >
              <option value={7}>Next 7 days</option>
              <option value={14}>Next 14 days</option>
              <option value={30}>Next 30 days</option>
              <option value={60}>Next 60 days</option>
              <option value={90}>Next 90 days</option>
            </select>

            {/* Property type */}
            <select
              value={propertyType}
              onChange={e => setPropertyType(e.target.value as any)}
              className="border border-rudin-light rounded px-3 py-1.5 text-sm text-rudin-navy bg-white focus:outline-none focus:ring-2 focus:ring-rudin-navy"
            >
              <option value="Both">All Properties</option>
              <option value="Commercial">Commercial</option>
              <option value="Residential">Residential</option>
            </select>

            {/* Filters toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-rudin-light rounded text-sm text-rudin-slate hover:bg-rudin-cream transition-colors"
            >
              <Filter size={13} />
              Filters
              {(selectedNeighborhoods.length > 0 || selectedCategories.length < EVENT_CATEGORIES.length) && (
                <span className="bg-rudin-navy text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {selectedNeighborhoods.length + (EVENT_CATEGORIES.length - selectedCategories.length)}
                </span>
              )}
              {filtersOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {/* Search */}
            <button
              onClick={searchEvents}
              disabled={loading}
              className="flex items-center gap-2 bg-rudin-navy text-white px-5 py-1.5 rounded font-medium text-sm hover:bg-blue-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <><Loader2 size={14} className="animate-spin" /> Searching…</>
              ) : (
                <><Search size={14} /> Search Events</>
              )}
            </button>

            {/* Export — secondary, only when results exist */}
            {hasResults && (
              <button
                onClick={exportToExcel}
                className="flex items-center gap-1.5 text-sm text-rudin-slate hover:text-rudin-navy transition-colors ml-auto"
              >
                <Download size={13} />
                Export to Excel
              </button>
            )}
          </div>

          {/* Expandable filters */}
          {filtersOpen && (
            <div className="pt-4 mt-3 border-t border-rudin-light grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-rudin-slate uppercase tracking-wide">Neighborhoods</span>
                  <button
                    onClick={() => setSelectedNeighborhoods(selectedNeighborhoods.length ? [] : [...NEIGHBORHOODS])}
                    className="text-xs text-rudin-navy hover:underline"
                  >
                    {selectedNeighborhoods.length ? "Clear all" : "Select all"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {NEIGHBORHOODS.map(n => (
                    <button
                      key={n}
                      onClick={() => toggleNeighborhood(n)}
                      className="flex items-center gap-2 text-sm text-rudin-slate hover:text-rudin-navy py-1 text-left"
                    >
                      {selectedNeighborhoods.includes(n)
                        ? <CheckSquare size={13} className="text-rudin-navy shrink-0" />
                        : <Square size={13} className="shrink-0" />}
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-rudin-slate uppercase tracking-wide">Categories</span>
                  <button
                    onClick={() => setSelectedCategories(selectedCategories.length === EVENT_CATEGORIES.length ? [] : [...EVENT_CATEGORIES])}
                    className="text-xs text-rudin-navy hover:underline"
                  >
                    {selectedCategories.length === EVENT_CATEGORIES.length ? "Clear all" : "Select all"}
                  </button>
                </div>
                <div className="space-y-1">
                  {EVENT_CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => toggleCategory(c)}
                      className="flex items-center gap-2 text-sm text-rudin-slate hover:text-rudin-navy py-1 w-full text-left"
                    >
                      {selectedCategories.includes(c)
                        ? <CheckSquare size={13} className="text-rudin-navy shrink-0" />
                        : <Square size={13} className="shrink-0" />}
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
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20 text-rudin-slate">
            <Loader2 size={36} className="mx-auto mb-4 animate-spin opacity-40" />
            <p className="font-display text-lg mb-1 text-rudin-navy">Searching BIDs and community sources…</p>
            <p className="text-sm">This may take up to 30 seconds</p>
          </div>
        )}

        {/* Results bar */}
        {hasResults && !loading && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-rudin-slate">
              <span className="font-semibold text-rudin-navy">{events.length} events</span> found
            </p>
            <button
              onClick={() => setGroupByProperty(!groupByProperty)}
              className="text-xs border border-rudin-light rounded px-3 py-1 text-rudin-slate hover:bg-white transition-colors"
            >
              {groupByProperty ? "View: All Events" : "View: By Property"}
            </button>
          </div>
        )}

        {/* All events list */}
        {!groupByProperty && hasResults && !loading && (
          <div className="grid gap-4">
            {events.map((event, i) => (
              <EventCard key={i} event={event} />
            ))}
          </div>
        )}

        {/* Grouped by property */}
        {groupByProperty && Object.keys(groupedEvents).length > 0 && !loading && (
          <div className="space-y-8">
            {Object.entries(groupedEvents).sort().map(([prop, propEvents]) => {
              const propData = RUDIN_PROPERTIES.find(p => p.name === prop);
              return (
                <div key={prop}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-rudin-light" />
                    <div className="flex items-center gap-2 bg-rudin-navy text-white px-4 py-1.5 rounded-full text-sm">
                      {propData?.type === "Commercial" ? <Building2 size={13} /> : <Home size={13} />}
                      <span className="font-medium">{prop}</span>
                      <span className="text-blue-300 text-xs">({propEvents.length})</span>
                    </div>
                    <div className="h-px flex-1 bg-rudin-light" />
                  </div>
                  <div className="grid gap-3">
                    {propEvents.map((event, i) => (
                      <EventCard key={i} event={event} compact />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !hasResults && !error && (
          <div className="text-center py-24 text-rudin-slate">
            <Search size={40} className="mx-auto mb-4 opacity-20" />
            <p className="font-display text-lg mb-1 text-rudin-navy">Ready to discover events</p>
            <p className="text-sm">Use the filters above and click Search Events</p>
          </div>
        )}
      </main>
    </div>
  );
}

function EventCard({ event, compact = false }: { event: DiscoveredEvent; compact?: boolean }) {
  const colorClass = CATEGORY_COLORS[event.category] || "bg-gray-100 text-gray-700";
  return (
    <div className={`bg-white rounded-lg border border-rudin-light shadow-sm hover:shadow-md transition-shadow ${compact ? "p-4" : "p-5"}`}>
      <div className="flex flex-wrap items-center gap-2 mb-1.5">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
          {event.category}
        </span>
        <span className="text-xs text-rudin-slate">{event.neighborhood}</span>
      </div>
      <h3 className="font-semibold text-rudin-navy text-base mb-1 leading-snug">
        {event.title}
      </h3>
      {!compact && (
        <p className="text-sm text-rudin-slate mb-3 leading-relaxed">{event.description}</p>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-rudin-slate mb-3">
        <span className="flex items-center gap-1">
          <Calendar size={11} className="shrink-0" />
          {event.date}{event.time && event.time !== "TBD" ? ` · ${event.time}` : ""}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={11} className="shrink-0" />
          {event.location}
        </span>
      </div>
      <div className="pt-3 border-t border-rudin-light flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {event.nearestProperties.map((prop, i) => (
            <span key={i} className="text-xs bg-rudin-cream text-rudin-navy px-2 py-0.5 rounded border border-rudin-light">
              {prop}
            </span>
          ))}
        </div>
        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-rudin-navy hover:text-rudin-gold transition-colors font-medium"
        >
          <ExternalLink size={11} />
          {event.sourceWebsite}
        </a>
      </div>
    </div>
  );
}
