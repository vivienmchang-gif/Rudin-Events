export interface RudinProperty {
  name: string;
  address: string;
  neighborhood: string;
  type: "Commercial" | "Residential";
  lat: number;
  lng: number;
  bids: string[];
}

export interface EventSource {
  name: string;
  url: string;
  neighborhood: string;
  type: "BID" | "City" | "Community" | "Arts" | "Events Platform";
}

export const RUDIN_PROPERTIES: RudinProperty[] = [
  // Commercial - Midtown
  { name: "3 Times Square", address: "3 Times Square, New York, NY 10036", neighborhood: "Midtown", type: "Commercial", lat: 40.7570, lng: -73.9862, bids: ["Times Square Alliance", "Hudson Yards Hell's Kitchen BID"] },
  { name: "345 Park Avenue", address: "345 Park Ave, New York, NY 10154", neighborhood: "Midtown", type: "Commercial", lat: 40.7580, lng: -73.9733, bids: ["Grand Central Partnership", "Park Avenue BID"] },
  { name: "355 Lexington Avenue", address: "355 Lexington Ave, New York, NY 10017", neighborhood: "Midtown", type: "Commercial", lat: 40.7537, lng: -73.9754, bids: ["Grand Central Partnership"] },
  { name: "415 Madison Avenue", address: "415 Madison Ave, New York, NY 10017", neighborhood: "Midtown", type: "Commercial", lat: 40.7548, lng: -73.9764, bids: ["Grand Central Partnership"] },
  { name: "560 Lexington Avenue", address: "560 Lexington Ave, New York, NY 10022", neighborhood: "Midtown", type: "Commercial", lat: 40.7578, lng: -73.9717, bids: ["Grand Central Partnership"] },
  { name: "641 Lexington Avenue", address: "641 Lexington Ave, New York, NY 10022", neighborhood: "Midtown", type: "Commercial", lat: 40.7602, lng: -73.9689, bids: ["Grand Central Partnership"] },
  { name: "136 East 55th Street", address: "136 E 55th St, New York, NY 10022", neighborhood: "Midtown", type: "Commercial", lat: 40.7590, lng: -73.9706, bids: ["Grand Central Partnership"] },
  { name: "1070 Second Avenue", address: "1070 2nd Ave, New York, NY 10022", neighborhood: "Midtown", type: "Commercial", lat: 40.7577, lng: -73.9646, bids: ["Grand Central Partnership"] },
  { name: "1675 Broadway", address: "1675 Broadway, New York, NY 10019", neighborhood: "Midtown", type: "Commercial", lat: 40.7638, lng: -73.9836, bids: ["Times Square Alliance", "Columbus Circle BID"] },
  { name: "41 Madison Avenue", address: "41 Madison Ave, New York, NY 10010", neighborhood: "Midtown South", type: "Commercial", lat: 40.7453, lng: -73.9881, bids: ["Flatiron NoMad Partnership", "Madison Square Park Conservancy"] },
  { name: "32 Avenue of the Americas", address: "32 Avenue of the Americas, New York, NY 10013", neighborhood: "Midtown South", type: "Commercial", lat: 40.7262, lng: -74.0063, bids: ["Downtown Alliance", "Hudson Square BID"] },
  { name: "One Battery Park Plaza", address: "1 Battery Park Plaza, New York, NY 10004", neighborhood: "Downtown", type: "Commercial", lat: 40.7074, lng: -74.0133, bids: ["Downtown Alliance", "Financial District"] },
  { name: "110 Wall Street", address: "110 Wall St, New York, NY 10005", neighborhood: "Downtown", type: "Commercial", lat: 40.7055, lng: -74.0090, bids: ["Downtown Alliance", "Financial District"] },
  // Residential - Upper East Side
  { name: "945 Fifth Avenue", address: "945 5th Ave, New York, NY 10021", neighborhood: "Upper East Side", type: "Residential", lat: 40.7760, lng: -73.9641, bids: ["Upper East Side BID", "Fifth Avenue BID"] },
  { name: "1085 Park Avenue", address: "1085 Park Ave, New York, NY 10128", neighborhood: "Upper East Side", type: "Residential", lat: 40.7849, lng: -73.9558, bids: ["Upper East Side BID"] },
  { name: "544 East 86th Street", address: "544 E 86th St, New York, NY 10028", neighborhood: "Upper East Side", type: "Residential", lat: 40.7779, lng: -73.9490, bids: ["Upper East Side BID"] },
  { name: "254 East 68th Street", address: "254 E 68th St, New York, NY 10065", neighborhood: "Upper East Side", type: "Residential", lat: 40.7674, lng: -73.9578, bids: ["Upper East Side BID"] },
  { name: "215 East 68th Street", address: "215 E 68th St, New York, NY 10065", neighborhood: "Upper East Side", type: "Residential", lat: 40.7672, lng: -73.9584, bids: ["Upper East Side BID"] },
  { name: "211 East 70th Street", address: "211 E 70th St, New York, NY 10021", neighborhood: "Upper East Side", type: "Residential", lat: 40.7686, lng: -73.9580, bids: ["Upper East Side BID"] },
  // Residential - Upper West Side
  { name: "20 West 86th Street", address: "20 W 86th St, New York, NY 10024", neighborhood: "Upper West Side", type: "Residential", lat: 40.7839, lng: -73.9707, bids: ["72nd Street BID", "Columbus Avenue BID"] },
  { name: "25 West 81st Street", address: "25 W 81st St, New York, NY 10024", neighborhood: "Upper West Side", type: "Residential", lat: 40.7815, lng: -73.9750, bids: ["72nd Street BID"] },
  { name: "27 West 86th Street", address: "27 W 86th St, New York, NY 10024", neighborhood: "Upper West Side", type: "Residential", lat: 40.7839, lng: -73.9713, bids: ["72nd Street BID"] },
  { name: "40 West 86th Street", address: "40 W 86th St, New York, NY 10024", neighborhood: "Upper West Side", type: "Residential", lat: 40.7840, lng: -73.9718, bids: ["72nd Street BID"] },
  { name: "115 West 86th Street", address: "115 W 86th St, New York, NY 10024", neighborhood: "Upper West Side", type: "Residential", lat: 40.7845, lng: -73.9744, bids: ["72nd Street BID"] },
  { name: "144 West 86th Street", address: "144 W 86th St, New York, NY 10024", neighborhood: "Upper West Side", type: "Residential", lat: 40.7847, lng: -73.9754, bids: ["72nd Street BID"] },
  { name: "241 Central Park West", address: "241 Central Park West, New York, NY 10024", neighborhood: "Upper West Side", type: "Residential", lat: 40.7838, lng: -73.9763, bids: ["72nd Street BID"] },
  { name: "295 Central Park West", address: "295 Central Park West, New York, NY 10024", neighborhood: "Upper West Side", type: "Residential", lat: 40.7864, lng: -73.9775, bids: ["72nd Street BID"] },
  // Residential - Midtown
  { name: "40 Park Avenue", address: "40 Park Ave, New York, NY 10016", neighborhood: "Midtown", type: "Residential", lat: 40.7505, lng: -73.9820, bids: ["Grand Central Partnership"] },
  { name: "300 East 57th Street", address: "300 E 57th St, New York, NY 10022", neighborhood: "Midtown", type: "Residential", lat: 40.7596, lng: -73.9637, bids: ["Grand Central Partnership"] },
  // Residential - Downtown/Greenwich Village
  { name: "The Greenwich Lane", address: "155 W 11th St, New York, NY 10011", neighborhood: "Greenwich Village", type: "Residential", lat: 40.7365, lng: -74.0003, bids: ["Village Alliance", "Greenwich Village BID"] },
  { name: "130 West 12th Street", address: "130 W 12th St, New York, NY 10011", neighborhood: "Greenwich Village", type: "Residential", lat: 40.7360, lng: -74.0003, bids: ["Village Alliance"] },
];

export const EVENT_SOURCES: EventSource[] = [
  // Business Improvement Districts
  { name: "Times Square Alliance", url: "https://www.timessquarenyc.org/events", neighborhood: "Midtown", type: "BID" },
  { name: "Grand Central Partnership", url: "https://www.grandcentralnyc.com/events", neighborhood: "Midtown", type: "BID" },
  { name: "Downtown Alliance", url: "https://www.downtownny.com/events", neighborhood: "Downtown", type: "BID" },
  { name: "Flatiron NoMad Partnership", url: "https://flatirondistrict.nyc/events", neighborhood: "Midtown South", type: "BID" },
  { name: "Village Alliance", url: "https://www.villagealliance.org/events", neighborhood: "Greenwich Village", type: "BID" },
  { name: "Upper East Side BID", url: "https://www.uppereastsidenyc.org/events", neighborhood: "Upper East Side", type: "BID" },
  { name: "Hudson Square BID", url: "https://hudsonsquare.org/events", neighborhood: "Midtown South", type: "BID" },
  { name: "Fifth Avenue BID", url: "https://www.fifthavenuebid.com/events", neighborhood: "Midtown", type: "BID" },
  { name: "Madison Square Park", url: "https://www.madisonsquarepark.org/events", neighborhood: "Midtown South", type: "BID" },
  // City & Community
  { name: "NYC Parks Events", url: "https://www.nycgovparks.org/events", neighborhood: "Citywide", type: "City" },
  { name: "NYC311 Community Events", url: "https://www.nyc.gov/events", neighborhood: "Citywide", type: "City" },
  { name: "Eventbrite NYC", url: "https://www.eventbrite.com/d/ny--new-york/events", neighborhood: "Citywide", type: "Events Platform" },
  { name: "NYC Arts", url: "https://www.nycarts.com", neighborhood: "Citywide", type: "Arts" },
  { name: "Central Park Conservancy", url: "https://www.centralparknyc.org/events", neighborhood: "Central Park", type: "Community" },
  { name: "92NY", url: "https://www.92ny.org/events", neighborhood: "Upper East Side", type: "Community" },
];

export const EVENT_CATEGORIES = [
  "Arts & Culture",
  "Food & Drink",
  "Fitness & Wellness",
  "Family-Friendly",
  "Networking & Business",
  "Seasonal & Holiday",
  "Community & Civic",
  "Music & Entertainment",
];

export const NEIGHBORHOODS = [...new Set(RUDIN_PROPERTIES.map(p => p.neighborhood))].sort();
