import { pgTable, text, serial, timestamp, integer, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const films = pgTable("films", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameZh: text("name_zh").notNull(),
  type: text("type").notNull(), // B&W, Color, Slides
  iso: integer("iso").notNull(),
  manufacturer: text("manufacturer").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionZh: text("description_zh").notNull(),
  brand: text("brand").notNull(), // Ilford, Kodak, Fujifilm
});

export const chemicals = pgTable("chemicals", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameZh: text("name_zh").notNull(),
  type: text("type").notNull(), // Developer, Stop Bath, Fixer
  manufacturer: text("manufacturer").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionZh: text("description_zh").notNull(),
  dilutionRatio: text("dilution_ratio").notNull(),
  temperatureRange: text("temperature_range").notNull(),
  defaultTemperature: integer("default_temperature").notNull(),
  shelfLife: text("shelf_life").notNull(),
  storageConditions: text("storage_conditions").notNull(),
  safetyNotesEn: text("safety_notes_en").notNull(),
  safetyNotesZh: text("safety_notes_zh").notNull(),
});

export const developmentProcesses = pgTable("development_processes", {
  id: serial("id").primaryKey(),
  filmId: integer("film_id").notNull(),
  chemicalId: integer("chemical_id").notNull(),
  dilutionRatio: text("dilution_ratio").notNull(),
  duration: integer("duration").notNull(), // in minutes
  temperature: integer("temperature").notNull(), // in Celsius
  agitationPattern: text("agitation_pattern").notNull(),
  notesEn: text("notes_en"),
  notesZh: text("notes_zh"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Schema for inserting new films
export const insertFilmSchema = createInsertSchema(films);
export type InsertFilm = z.infer<typeof insertFilmSchema>;
export type Film = typeof films.$inferSelect;

// Schema for inserting new chemicals
export const insertChemicalSchema = createInsertSchema(chemicals);
export type InsertChemical = z.infer<typeof insertChemicalSchema>;
export type Chemical = typeof chemicals.$inferSelect;

// Schema for inserting new development processes
export const insertDevelopmentProcessSchema = createInsertSchema(developmentProcesses);
export type InsertDevelopmentProcess = z.infer<typeof insertDevelopmentProcessSchema>;
export type DevelopmentProcess = typeof developmentProcesses.$inferSelect;

// User related schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;