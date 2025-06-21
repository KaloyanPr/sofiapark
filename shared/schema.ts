import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const parkingLocations = pgTable("parking_locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  totalSpots: integer("total_spots").notNull(),
  availableSpots: integer("available_spots").notNull(),
  pricePerHour: decimal("price_per_hour", { precision: 5, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("лв"),
  type: text("type").notNull(), // "street", "underground", "mall", "private"
  hours: text("hours").notNull(),
  features: text("features").array(), // ["accessible", "secure", "ev_charging", "covered"]
  status: text("status").notNull(), // "available", "limited", "full"
  district: text("district").notNull(),
  landmark: text("landmark"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertParkingLocationSchema = createInsertSchema(parkingLocations).omit({
  id: true,
  lastUpdated: true,
}).extend({
  currency: z.string().default("лв"),
  status: z.enum(["available", "limited", "full"]).default("available"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ParkingLocation = typeof parkingLocations.$inferSelect;
export type InsertParkingLocation = z.infer<typeof insertParkingLocationSchema>;
