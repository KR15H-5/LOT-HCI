import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  occupation: text("occupation"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Items
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Tools, Garden, Kitchen, Repairs
  image: text("image").notNull(),
  additionalImages: json("additional_images").$type<string[]>(),
  specifications: json("specifications").$type<Record<string, string>>(), // weight, dimensions, age
  suitableTasks: json("suitable_tasks").$type<string[]>(), // List of tasks 
  suitability: json("suitability").$type<string[]>(), // beginners, professionals, children, elderly
  maxHireDuration: integer("max_hire_duration").notNull(), // days
  maxHireQuantity: integer("max_hire_quantity").notNull(),
  careInstructions: text("care_instructions"),
  trainingRequired: text("training_required"),
  expertSupportRequired: text("expert_support_required"),
  safetyInstructions: text("safety_instructions"),
  pricePerDay: integer("price_per_day").notNull(),
  pricePerWeek: integer("price_per_week"),
  ownerId: integer("owner_id").notNull(),
  rating: integer("rating").default(0),
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
});

// Bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  userId: integer("user_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").notNull(), // "active", "completed", "cancelled", "returning"
  totalPrice: integer("total_price").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings)
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    startDate: z.string().transform((str) => new Date(str)),
    endDate: z.string().transform((str) => new Date(str)),
  });

// Saved Items
export const savedItems = pgTable("saved_items", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  userId: integer("user_id").notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

export const insertSavedItemSchema = createInsertSchema(savedItems).omit({
  id: true,
  savedAt: true,
});

// Recently Viewed Items
export const recentlyViewedItems = pgTable("recently_viewed_items", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  userId: integer("user_id").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

export const insertRecentlyViewedSchema = createInsertSchema(recentlyViewedItems).omit({
  id: true,
  viewedAt: true,
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});

// Certificates
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  issuedAt: true,
});

// DIY Projects/Inspiration
export const diyProjects = pgTable("diy_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  duration: text("duration").notNull(),
  type: text("type").notNull(), // step guide, project
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDiyProjectSchema = createInsertSchema(diyProjects).omit({
  id: true,
  createdAt: true,
});

// Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  isRead: boolean("is_read").default(false),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  sentAt: true,
  isRead: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type SavedItem = typeof savedItems.$inferSelect;
export type InsertSavedItem = z.infer<typeof insertSavedItemSchema>;

export type RecentlyViewedItem = typeof recentlyViewedItems.$inferSelect;
export type InsertRecentlyViewedItem = z.infer<typeof insertRecentlyViewedSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;

export type DiyProject = typeof diyProjects.$inferSelect;
export type InsertDiyProject = z.infer<typeof insertDiyProjectSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
