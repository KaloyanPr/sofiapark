import { users, parkingLocations, type User, type InsertUser, type ParkingLocation, type InsertParkingLocation } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Parking methods
  getAllParkingLocations(): Promise<ParkingLocation[]>;
  getParkingLocationById(id: number): Promise<ParkingLocation | undefined>;
  getParkingLocationsByDistrict(district: string): Promise<ParkingLocation[]>;
  searchParkingLocations(query: string): Promise<ParkingLocation[]>;
  updateParkingAvailability(id: number, availableSpots: number): Promise<ParkingLocation | undefined>;
  createParkingLocation(location: InsertParkingLocation): Promise<ParkingLocation>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllParkingLocations(): Promise<ParkingLocation[]> {
    return await db.select().from(parkingLocations);
  }

  async getParkingLocationById(id: number): Promise<ParkingLocation | undefined> {
    const [location] = await db.select().from(parkingLocations).where(eq(parkingLocations.id, id));
    return location || undefined;
  }

  async getParkingLocationsByDistrict(district: string): Promise<ParkingLocation[]> {
    return await db.select().from(parkingLocations).where(ilike(parkingLocations.district, `%${district}%`));
  }

  async searchParkingLocations(query: string): Promise<ParkingLocation[]> {
    return await db.select().from(parkingLocations).where(
      or(
        ilike(parkingLocations.name, `%${query}%`),
        ilike(parkingLocations.address, `%${query}%`),
        ilike(parkingLocations.district, `%${query}%`),
        ilike(parkingLocations.landmark, `%${query}%`)
      )
    );
  }

  async updateParkingAvailability(id: number, availableSpots: number): Promise<ParkingLocation | undefined> {
    const [location] = await db.select().from(parkingLocations).where(eq(parkingLocations.id, id));
    if (!location) return undefined;

    const status = availableSpots === 0 ? "full" as const : 
                  availableSpots < location.totalSpots * 0.2 ? "limited" as const : 
                  "available" as const;

    const [updatedLocation] = await db
      .update(parkingLocations)
      .set({ 
        availableSpots,
        status,
        lastUpdated: new Date()
      })
      .where(eq(parkingLocations.id, id))
      .returning();

    return updatedLocation;
  }

  async createParkingLocation(location: InsertParkingLocation): Promise<ParkingLocation> {
    const [newLocation] = await db
      .insert(parkingLocations)
      .values(location)
      .returning();
    return newLocation;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private parkingLocations: Map<number, ParkingLocation>;
  private currentUserId: number;
  private currentParkingId: number;

  constructor() {
    this.users = new Map();
    this.parkingLocations = new Map();
    this.currentUserId = 1;
    this.currentParkingId = 1;
    this.initializeParkingData();
  }

  private initializeParkingData() {
    const sofiaParking: Omit<ParkingLocation, 'id'>[] = [
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
        status: "available",
        district: "Sofia Center",
        landmark: "NDK",
        lastUpdated: new Date(),
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
        status: "limited",
        district: "Sofia Center",
        landmark: "NDK",
        lastUpdated: new Date(),
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
        status: "full",
        district: "Sofia Center",
        landmark: "Vitosha Blvd",
        lastUpdated: new Date(),
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
        status: "available",
        district: "Sofia Center",
        landmark: "Vitosha Blvd",
        lastUpdated: new Date(),
      },
      {
        name: "Vitosha Mall Parking",
        address: "Vitosha Blvd 89, Sofia Center",
        latitude: "42.6948",
        longitude: "23.3242",
        totalSpots: 60,
        availableSpots: 12,
        pricePerHour: "2.20",
        currency: "лв",
        type: "private",
        hours: "10:00-22:00",
        features: ["covered", "secure"],
        status: "limited",
        district: "Sofia Center",
        landmark: "Vitosha Blvd",
        lastUpdated: new Date(),
      },

      // Alexander Nevsky Area
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
        status: "available",
        district: "Sofia Center",
        landmark: "Alexander Nevsky",
        lastUpdated: new Date(),
      },
      {
        name: "Sofia University Parking",
        address: "Tsar Osvoboditel Blvd 15, Sofia Center",
        latitude: "42.6951",
        longitude: "23.3312",
        totalSpots: 70,
        availableSpots: 25,
        pricePerHour: "1.80",
        currency: "лв",
        type: "private",
        hours: "7:00-22:00",
        features: ["accessible", "secure"],
        status: "available",
        district: "Sofia Center",
        landmark: "Alexander Nevsky",
        lastUpdated: new Date(),
      },

      // Mall of Sofia Area
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
        status: "available",
        district: "Izgrev",
        landmark: "Mall of Sofia",
        lastUpdated: new Date(),
      },
      {
        name: "Mall of Sofia Outdoor",
        address: "Aleksandar Stamboliyski Blvd 101",
        latitude: "42.6615",
        longitude: "23.3068",
        totalSpots: 200,
        availableSpots: 45,
        pricePerHour: "0.00",
        currency: "лв",
        type: "mall",
        hours: "10:00-22:00",
        features: ["accessible"],
        status: "limited",
        district: "Izgrev",
        landmark: "Mall of Sofia",
        lastUpdated: new Date(),
      },

      // City Center Blue Zone
      {
        name: "City Center Blue Zone A",
        address: "Graf Ignatiev Str, Sofia Center",
        latitude: "42.6977",
        longitude: "23.3189",
        totalSpots: 25,
        availableSpots: 0,
        pricePerHour: "2.50",
        currency: "лв",
        type: "street",
        hours: "8:00-20:00",
        features: [],
        status: "full",
        district: "Sofia Center",
        landmark: "City Center",
        lastUpdated: new Date(),
      },
      {
        name: "City Center Blue Zone B",
        address: "Rakovski Str, Sofia Center",
        latitude: "42.6985",
        longitude: "23.3210",
        totalSpots: 30,
        availableSpots: 7,
        pricePerHour: "2.50",
        currency: "лв",
        type: "street",
        hours: "8:00-20:00",
        features: [],
        status: "limited",
        district: "Sofia Center",
        landmark: "City Center",
        lastUpdated: new Date(),
      },
      {
        name: "Central Department Store Parking",
        address: "Maria Luiza Blvd 2, Sofia Center",
        latitude: "42.6973",
        longitude: "23.3225",
        totalSpots: 120,
        availableSpots: 42,
        pricePerHour: "2.00",
        currency: "лв",
        type: "underground",
        hours: "9:00-21:00",
        features: ["secure", "covered"],
        status: "available",
        district: "Sofia Center",
        landmark: "City Center",
        lastUpdated: new Date(),
      },

      // Outer Districts
      {
        name: "Studentski Grad Parking",
        address: "8-mi Dekemvri Blvd, Studentski Grad",
        latitude: "42.6462",
        longitude: "23.2742",
        totalSpots: 200,
        availableSpots: 120,
        pricePerHour: "1.00",
        currency: "лв",
        type: "street",
        hours: "24/7",
        features: ["accessible"],
        status: "available",
        district: "Studentski Grad",
        landmark: null,
        lastUpdated: new Date(),
      },
      {
        name: "Mladost Metro Parking",
        address: "Aleksandar Malinov Blvd, Mladost",
        latitude: "42.6319",
        longitude: "23.3734",
        totalSpots: 150,
        availableSpots: 98,
        pricePerHour: "1.50",
        currency: "лв",
        type: "private",
        hours: "5:00-24:00",
        features: ["accessible", "secure"],
        status: "available",
        district: "Mladost",
        landmark: "Metro Station",
        lastUpdated: new Date(),
      },
    ];

    sofiaParking.forEach(parking => {
      const id = this.currentParkingId++;
      this.parkingLocations.set(id, { ...parking, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllParkingLocations(): Promise<ParkingLocation[]> {
    return Array.from(this.parkingLocations.values());
  }

  async getParkingLocationById(id: number): Promise<ParkingLocation | undefined> {
    return this.parkingLocations.get(id);
  }

  async getParkingLocationsByDistrict(district: string): Promise<ParkingLocation[]> {
    return Array.from(this.parkingLocations.values()).filter(
      location => location.district.toLowerCase().includes(district.toLowerCase())
    );
  }

  async searchParkingLocations(query: string): Promise<ParkingLocation[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.parkingLocations.values()).filter(location =>
      location.name.toLowerCase().includes(lowerQuery) ||
      location.address.toLowerCase().includes(lowerQuery) ||
      location.district.toLowerCase().includes(lowerQuery) ||
      (location.landmark && location.landmark.toLowerCase().includes(lowerQuery))
    );
  }

  async updateParkingAvailability(id: number, availableSpots: number): Promise<ParkingLocation | undefined> {
    const location = this.parkingLocations.get(id);
    if (!location) return undefined;

    const updatedLocation = {
      ...location,
      availableSpots,
      status: availableSpots === 0 ? "full" as const : 
             availableSpots < location.totalSpots * 0.2 ? "limited" as const : 
             "available" as const,
      lastUpdated: new Date(),
    };

    this.parkingLocations.set(id, updatedLocation);
    return updatedLocation;
  }

  async createParkingLocation(insertLocation: InsertParkingLocation): Promise<ParkingLocation> {
    const id = this.currentParkingId++;
    const location: ParkingLocation = { 
      ...insertLocation, 
      id,
      currency: insertLocation.currency || "лв",
      features: insertLocation.features || [],
      landmark: insertLocation.landmark || null,
      latitude: insertLocation.latitude || null,
      longitude: insertLocation.longitude || null,
      lastUpdated: new Date()
    };
    this.parkingLocations.set(id, location);
    return location;
  }
}

export const storage = new DatabaseStorage();
