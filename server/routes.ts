import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnalyticsSchema, insertBrandSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Analytics routes
  app.get("/api/analytics", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const analytics = await storage.getAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.post("/api/analytics", async (req, res) => {
    try {
      const validatedData = insertAnalyticsSchema.parse(req.body);
      const newAnalytics = await storage.createAnalytics(validatedData);
      res.status(201).json(newAnalytics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid analytics data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create analytics entry" });
      }
    }
  });

  app.delete("/api/analytics/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAnalytics(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete analytics entry" });
    }
  });

  // Brand settings routes
  app.get("/api/brand-settings", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const settings = await storage.getBrandSettings(userId);
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brand settings" });
    }
  });

  app.post("/api/brand-settings", async (req, res) => {
    try {
      const validatedData = insertBrandSettingsSchema.parse(req.body);
      const existingSettings = await storage.getBrandSettings(validatedData.userId);
      
      let brandSettings;
      if (existingSettings) {
        brandSettings = await storage.updateBrandSettings(existingSettings.id, validatedData);
      } else {
        brandSettings = await storage.createBrandSettings(validatedData);
      }
      
      res.status(201).json(brandSettings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid brand settings data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save brand settings" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
