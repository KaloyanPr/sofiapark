import { db } from "./db";
import { parkingLocations } from "@shared/schema";

const sofiaParking = [
  // NDK Area
  {
    name: "NDK Underground Parking",
    address: "Bulgaria Blvd 1, Sofia Center",
    latitude: "42.6886",
    longitude: "23.3188",
    totalSpots: 150,
    availableSpots: 23,
    pricePerHour: "2.00",
    currency: "лв",
    type: "underground",
    hours: "6:00-24:00",
    features: ["accessible", "secure", "ev_charging"],
    status: "available" as const,
    district: "Sofia Center",
    landmark: "NDK",
  },
  {
    name: "NDK Street Parking",
    address: "Bulgaria Blvd, Sofia Center",
    latitude: "42.6890",
    longitude: "23.3195",
    totalSpots: 30,
    availableSpots: 8,
    pricePerHour: "2.50",
    currency: "лв",
    type: "street",
    hours: "8:00-20:00",
    features: ["accessible"],
    status: "limited" as const,
    district: "Sofia Center",
    landmark: "NDK",
  },
  
  // Vitosha Boulevard Area
  {
    name: "Vitosha Boulevard Blue Zone",
    address: "Vitosha Blvd, Sofia Center",
    latitude: "42.6955",
    longitude: "23.3220",
    totalSpots: 50,
    availableSpots: 0,
    pricePerHour: "3.00",
    currency: "лв",
    type: "street",
    hours: "8:00-20:00",
    features: [],
    status: "full" as const,
    district: "Sofia Center",
    landmark: "Vitosha Blvd",
  },
  {
    name: "Vitosha Center Parking",
    address: "Vitosha Blvd 114, Sofia Center",
    latitude: "42.6962",
    longitude: "23.3235",
    totalSpots: 80,
    availableSpots: 15,
    pricePerHour: "2.80",
    currency: "лв",
    type: "underground",
    hours: "24/7",
    features: ["secure", "covered"],
    status: "available" as const,
    district: "Sofia Center",
    landmark: "Vitosha Blvd",
  },
  {
    name: "Mall of Sofia Parking",
    address: "Aleksandar Stamboliyski Blvd 101",
    latitude: "42.6611",
    longitude: "23.3056",
    totalSpots: 800,
    availableSpots: 156,
    pricePerHour: "0.00",
    currency: "лв",
    type: "mall",
    hours: "10:00-22:00",
    features: ["accessible", "secure", "covered", "ev_charging"],
    status: "available" as const,
    district: "Izgrev",
    landmark: "Mall of Sofia",
  },
  {
    name: "Alexander Nevsky Cathedral Parking",
    address: "Alexander Nevsky Square, Sofia Center",
    latitude: "42.6966",
    longitude: "23.3330",
    totalSpots: 40,
    availableSpots: 18,
    pricePerHour: "2.50",
    currency: "лв",
    type: "street",
    hours: "8:00-18:00",
    features: ["accessible"],
    status: "available" as const,
    district: "Sofia Center",
    landmark: "Alexander Nevsky",
  },
];

export async function seedDatabase() {
  try {
    console.log("Seeding database with Sofia parking data...");
    
    // Check if data already exists
    const existingLocations = await db.select().from(parkingLocations).limit(1);
    if (existingLocations.length > 0) {
      console.log("Database already has parking data, skipping seed.");
      return;
    }

    await db.insert(parkingLocations).values(sofiaParking);
    console.log(`Seeded ${sofiaParking.length} parking locations successfully.`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}