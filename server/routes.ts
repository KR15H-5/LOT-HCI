import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertBookingSchema, 
  insertSavedItemSchema, 
  insertRecentlyViewedSchema,
  insertTestimonialSchema,
  insertMessageSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
  
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // Items routes
  app.get("/api/items", async (_req: Request, res: Response) => {
    const items = await storage.getItems();
    res.json(items);
  });
  
  app.get("/api/items/:id", async (req: Request, res: Response) => {
    const itemId = parseInt(req.params.id);
    const item = await storage.getItemById(itemId);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json(item);
  });
  
  app.get("/api/items/category/:category", async (req: Request, res: Response) => {
    const { category } = req.params;
    const items = await storage.getItemsByCategory(category);
    res.json(items);
  });
  
  // Bookings routes
  app.get("/api/bookings/user/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const bookings = await storage.getBookingsByUserId(userId);
    
    // Fetch item details for each booking
    const bookingsWithItems = await Promise.all(
      bookings.map(async (booking) => {
        const item = await storage.getItemById(booking.itemId);
        return { ...booking, item };
      })
    );
    
    res.json(bookingsWithItems);
  });
  
  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Check if item exists
      const item = await storage.getItemById(bookingData.itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      // Check if user exists
      const user = await storage.getUser(bookingData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });
  
  app.patch("/api/bookings/:id/status", async (req: Request, res: Response) => {
    try {
      const bookingId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(bookingId, status);
      
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });
  
  // Saved Items routes
  app.get("/api/saved-items/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const savedItems = await storage.getSavedItemsWithDetails(userId);
    res.json(savedItems);
  });
  
  app.post("/api/saved-items", async (req: Request, res: Response) => {
    try {
      const savedItemData = insertSavedItemSchema.parse(req.body);
      const savedItem = await storage.saveItem(savedItemData);
      res.status(201).json(savedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to save item" });
    }
  });
  
  app.delete("/api/saved-items/:userId/:itemId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const itemId = parseInt(req.params.itemId);
    
    await storage.removeSavedItem(userId, itemId);
    res.status(204).send();
  });
  
  // Recently Viewed Items routes
  app.get("/api/recently-viewed/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const recentItems = await storage.getRecentlyViewedItemsWithDetails(userId);
    res.json(recentItems);
  });
  
  app.post("/api/recently-viewed", async (req: Request, res: Response) => {
    try {
      const recentlyViewedData = insertRecentlyViewedSchema.parse(req.body);
      const recentlyViewed = await storage.addRecentlyViewedItem(recentlyViewedData);
      res.status(201).json(recentlyViewed);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to add recently viewed item" });
    }
  });
  
  // Testimonials routes
  app.get("/api/testimonials/:itemId", async (req: Request, res: Response) => {
    const itemId = parseInt(req.params.itemId);
    const testimonials = await storage.getTestimonialsByItemId(itemId);
    res.json(testimonials);
  });
  
  app.post("/api/testimonials", async (req: Request, res: Response) => {
    try {
      const testimonialData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.addTestimonial(testimonialData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to add testimonial" });
    }
  });
  
  // Certificates routes
  app.get("/api/certificates/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const certificates = await storage.getCertificatesByUserId(userId);
    res.json(certificates);
  });
  
  // DIY Projects routes
  app.get("/api/diy-projects", async (_req: Request, res: Response) => {
    const projects = await storage.getDiyProjects();
    res.json(projects);
  });
  
  app.get("/api/diy-projects/:id", async (req: Request, res: Response) => {
    const projectId = parseInt(req.params.id);
    const project = await storage.getDiyProjectById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: "DIY project not found" });
    }
    
    res.json(project);
  });
  
  // Messages routes
  app.get("/api/messages/:user1Id/:user2Id", async (req: Request, res: Response) => {
    const user1Id = parseInt(req.params.user1Id);
    const user2Id = parseInt(req.params.user2Id);
    const messages = await storage.getMessagesBetweenUsers(user1Id, user2Id);
    res.json(messages);
  });
  
  app.post("/api/messages", async (req: Request, res: Response) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.sendMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  app.patch("/api/messages/read/:senderId/:receiverId", async (req: Request, res: Response) => {
    const senderId = parseInt(req.params.senderId);
    const receiverId = parseInt(req.params.receiverId);
    
    await storage.markMessagesAsRead(senderId, receiverId);
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
