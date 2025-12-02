import { Region } from '../types';

export interface CrisisTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  formDescription: string;
  regions?: Region[];
  category: 'natural-disaster' | 'emergency' | 'community' | 'health';
}

export const CRISIS_TEMPLATES: CrisisTemplate[] = [
  // Natural Disasters
  {
    id: 'fire',
    name: 'Building Fire Emergency',
    description: 'Rapid response for building fires - evacuation status, injuries, trapped persons',
    icon: '🔥',
    category: 'natural-disaster',
    formDescription: 'Report your location and immediate needs. Help is being coordinated. Stay calm and follow fire safety procedures.',
    regions: [
      { name: "Zone A (North)", districts: ["Floors 1-5", "Floors 6-10", "Floors 11-15", "Ground Floor"] },
      { name: "Zone B (South)", districts: ["Floors 1-5", "Floors 6-10", "Floors 11-15", "Ground Floor"] },
      { name: "Zone C (East)", districts: ["Floors 1-5", "Floors 6-10", "Floors 11-15", "Ground Floor"] },
      { name: "Zone D (West)", districts: ["Floors 1-5", "Floors 6-10", "Floors 11-15", "Ground Floor"] }
    ]
  },
  {
    id: 'flood',
    name: 'Flood Emergency',
    description: 'Track affected areas, evacuation needs, and rescue requests',
    icon: '🌊',
    category: 'natural-disaster',
    formDescription: 'Report your current location, water level, and immediate needs. Emergency services are coordinating rescue efforts.',
    regions: [
      { name: "Downtown", districts: ["Financial District", "Shopping Area", "Residential", "Industrial"] },
      { name: "Riverside", districts: ["North Bank", "South Bank", "Marina", "Port Area"] },
      { name: "Suburbs", districts: ["North Suburbs", "South Suburbs", "East Suburbs", "West Suburbs"] }
    ]
  },
  {
    id: 'earthquake',
    name: 'Earthquake Response',
    description: 'Assess building damage, injuries, and trapped persons',
    icon: '🏚️',
    category: 'natural-disaster',
    formDescription: 'Report structural damage, injuries, and whether you need evacuation. Stay in safe zones and await further instructions.',
    regions: [
      { name: "City Center", districts: ["Central Business District", "Old Town", "New Development", "Government Quarter"] },
      { name: "Residential Areas", districts: ["North District", "South District", "East District", "West District"] },
      { name: "Industrial Zone", districts: ["Light Industry", "Heavy Industry", "Warehouse District", "Port"] }
    ]
  },
  {
    id: 'typhoon',
    name: 'Typhoon/Hurricane Emergency',
    description: 'Coordinate shelter, power outages, and storm damage',
    icon: '🌪️',
    category: 'natural-disaster',
    formDescription: 'Report your shelter status, damage, and urgent needs. Stay indoors and away from windows until storm passes.',
    regions: [
      { name: "Coastal Areas", districts: ["North Coast", "South Coast", "Beach Communities", "Harbor District"] },
      { name: "Inland Areas", districts: ["Highlands", "Valley", "Rural Areas", "Mountain Region"] }
    ]
  },

  // Emergency Situations
  {
    id: 'power-outage',
    name: 'Major Power Outage',
    description: 'Track affected areas, medical emergencies, and critical needs',
    icon: '⚡',
    category: 'emergency',
    formDescription: 'Report your location and any urgent power-dependent medical needs. Restoration efforts are underway.',
    regions: [
      { name: "Grid Sector A", districts: ["Residential North", "Commercial North", "Industrial North"] },
      { name: "Grid Sector B", districts: ["Residential South", "Commercial South", "Industrial South"] },
      { name: "Grid Sector C", districts: ["Residential East", "Commercial East", "Industrial East"] },
      { name: "Grid Sector D", districts: ["Residential West", "Commercial West", "Industrial West"] }
    ]
  },
  {
    id: 'water-crisis',
    name: 'Water Contamination/Shortage',
    description: 'Coordinate water distribution and track health issues',
    icon: '💧',
    category: 'emergency',
    formDescription: 'Report your location, household size, and water needs. Distribution points will be announced shortly.',
    regions: [
      { name: "North District", districts: ["Neighborhood 1", "Neighborhood 2", "Neighborhood 3", "Neighborhood 4"] },
      { name: "South District", districts: ["Neighborhood 5", "Neighborhood 6", "Neighborhood 7", "Neighborhood 8"] },
      { name: "East District", districts: ["Neighborhood 9", "Neighborhood 10", "Neighborhood 11", "Neighborhood 12"] },
      { name: "West District", districts: ["Neighborhood 13", "Neighborhood 14", "Neighborhood 15", "Neighborhood 16"] }
    ]
  },
  {
    id: 'gas-leak',
    name: 'Gas Leak Emergency',
    description: 'Coordinate evacuation and track affected buildings',
    icon: '☠️',
    category: 'emergency',
    formDescription: 'Report your current location and evacuation status. DO NOT use electrical devices. Leave the area immediately if you smell gas.',
    regions: [
      { name: "Danger Zone (500m)", districts: ["Block A", "Block B", "Block C", "Block D"] },
      { name: "Caution Zone (1km)", districts: ["Block E", "Block F", "Block G", "Block H"] },
      { name: "Safe Zone", districts: ["Evacuation Center 1", "Evacuation Center 2", "Evacuation Center 3"] }
    ]
  },

  // Community Emergencies
  {
    id: 'evacuation',
    name: 'Mass Evacuation',
    description: 'Coordinate shelter, transportation, and special needs',
    icon: '🚨',
    category: 'community',
    formDescription: 'Report your household size, transportation needs, and any special requirements (medical, elderly, pets). Shelter information will be provided.',
    regions: [
      { name: "Evacuation Zone 1", districts: ["Sector A", "Sector B", "Sector C", "Sector D"] },
      { name: "Evacuation Zone 2", districts: ["Sector E", "Sector F", "Sector G", "Sector H"] },
      { name: "Evacuation Zone 3", districts: ["Sector I", "Sector J", "Sector K", "Sector L"] }
    ]
  },
  {
    id: 'shelter',
    name: 'Emergency Shelter Coordination',
    description: 'Manage shelter capacity, resources, and special needs',
    icon: '🏠',
    category: 'community',
    formDescription: 'Report your family size, special needs, and duration of stay. Shelter managers will coordinate space and resources.',
    regions: [
      { name: "Shelter Site A", districts: ["Main Hall", "Annex Building", "Overflow Area", "Special Needs Wing"] },
      { name: "Shelter Site B", districts: ["Main Hall", "Annex Building", "Overflow Area", "Special Needs Wing"] },
      { name: "Shelter Site C", districts: ["Main Hall", "Annex Building", "Overflow Area", "Special Needs Wing"] }
    ]
  },

  // Health Emergencies
  {
    id: 'epidemic',
    name: 'Disease Outbreak Response',
    description: 'Track symptoms, testing needs, and quarantine status',
    icon: '🦠',
    category: 'health',
    formDescription: 'Report symptoms, exposure history, and urgent medical needs. Follow public health guidelines and self-isolate if symptomatic.',
    regions: [
      { name: "North District", districts: ["Testing Site 1", "Testing Site 2", "Testing Site 3", "Home Isolation"] },
      { name: "South District", districts: ["Testing Site 4", "Testing Site 5", "Testing Site 6", "Home Isolation"] },
      { name: "Central District", districts: ["Testing Site 7", "Testing Site 8", "Testing Site 9", "Home Isolation"] }
    ]
  },
  {
    id: 'food-shortage',
    name: 'Food Distribution Emergency',
    description: 'Coordinate food distribution and track vulnerable households',
    icon: '🍞',
    category: 'community',
    formDescription: 'Report your household size, dietary restrictions, and mobility limitations. Food distribution schedules will be announced.',
    regions: [
      { name: "Distribution Zone 1", districts: ["Pickup Point A", "Pickup Point B", "Pickup Point C", "Home Delivery Area"] },
      { name: "Distribution Zone 2", districts: ["Pickup Point D", "Pickup Point E", "Pickup Point F", "Home Delivery Area"] },
      { name: "Distribution Zone 3", districts: ["Pickup Point G", "Pickup Point H", "Pickup Point I", "Home Delivery Area"] }
    ]
  },

  // Generic Template
  {
    id: 'custom',
    name: 'Custom Emergency',
    description: 'Create a custom incident form for any emergency situation',
    icon: '📋',
    category: 'community',
    formDescription: 'Describe your situation and immediate needs. Volunteer teams are coordinating responses.',
    regions: []
  }
];

export function getTemplateById(id: string): CrisisTemplate | undefined {
  return CRISIS_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: CrisisTemplate['category']): CrisisTemplate[] {
  return CRISIS_TEMPLATES.filter(t => t.category === category);
}

export const TEMPLATE_CATEGORIES = [
  { id: 'natural-disaster', name: 'Natural Disasters', icon: '🌪️' },
  { id: 'emergency', name: 'Infrastructure Emergencies', icon: '⚡' },
  { id: 'community', name: 'Community Emergencies', icon: '🏘️' },
  { id: 'health', name: 'Health Emergencies', icon: '🏥' }
] as const;
