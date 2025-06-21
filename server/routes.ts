import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all parking locations
  app.get("/api/parking-locations", async (req, res) => {
    try {
      const locations = await storage.getAllParkingLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parking locations" });
    }
  });

  // Get parking location by ID
  app.get("/api/parking-locations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid parking location ID" });
      }

      const location = await storage.getParkingLocationById(id);
      if (!location) {
        return res.status(404).json({ message: "Parking location not found" });
      }

      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parking location" });
    }
  });

  // Search parking locations
  app.get("/api/parking-locations/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      if (!query || query.trim().length === 0) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const locations = await storage.searchParkingLocations(query);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to search parking locations" });
    }
  });

  // Get parking locations by district
  app.get("/api/parking-locations/district/:district", async (req, res) => {
    try {
      const district = req.params.district;
      const locations = await storage.getParkingLocationsByDistrict(district);
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parking locations by district" });
    }
  });

  // Update parking availability
  app.patch("/api/parking-locations/:id/availability", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid parking location ID" });
      }

      const schema = z.object({
        availableSpots: z.number().min(0),
      });

      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request body", errors: result.error.errors });
      }

      const updatedLocation = await storage.updateParkingAvailability(id, result.data.availableSpots);
      if (!updatedLocation) {
        return res.status(404).json({ message: "Parking location not found" });
      }

      res.json(updatedLocation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update parking availability" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
