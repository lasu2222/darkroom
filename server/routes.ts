import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import {
  insertFilmSchema,
  insertChemicalSchema,
  insertDevelopmentProcessSchema
} from "@shared/schema";

// Middleware to check if user is admin
function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated() || !req.user?.isAdmin) {
    res.sendStatus(403);
    return;
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Initialize some data
  const initializeData = async () => {
    // Check if data already exists
    const existingFilms = await storage.getFilms();
    if (existingFilms.length > 0) {
      console.log("Data already initialized, skipping...");
      return;
    }

    console.log("Initializing data...");

    try {
      // Add chemicals (developers)
      const ddx = await storage.createChemical({
        nameEn: "DD-X",
        nameZh: "DD-X显影液",
        type: "Developer",
        manufacturer: "Ilford",
        descriptionEn: "Professional developer for maximum sharpness",
        descriptionZh: "专业显影液，提供最大锐度",
        dilutionRatio: "1:4",
        temperatureRange: "20°C - 24°C",
        defaultTemperature: 20,
        shelfLife: "6 months",
        storageConditions: "Store in a cool, dark place",
        safetyNotesEn: "Avoid contact with skin and eyes",
        safetyNotesZh: "避免接触皮肤和眼睛"
      });

      const d76 = await storage.createChemical({
        nameEn: "D-76",
        nameZh: "D-76显影液",
        type: "Developer",
        manufacturer: "Kodak",
        descriptionEn: "Classic developer for fine grain",
        descriptionZh: "经典显影液，提供细腻颗粒",
        dilutionRatio: "1:1",
        temperatureRange: "20°C - 24°C",
        defaultTemperature: 20,
        shelfLife: "6 months",
        storageConditions: "Store in a cool, dark place",
        safetyNotesEn: "Avoid contact with skin and eyes",
        safetyNotesZh: "避免接触皮肤和眼睛"
      });

      const neopan100dev = await storage.createChemical({
        nameEn: "Neopan 100 Developer",
        nameZh: "Neopan 100显影液",
        type: "Developer",
        manufacturer: "Fujifilm",
        descriptionEn: "Dedicated developer for Neopan films",
        descriptionZh: "Neopan专用显影液",
        dilutionRatio: "Stock",
        temperatureRange: "20°C - 24°C",
        defaultTemperature: 20,
        shelfLife: "6 months",
        storageConditions: "Store in a cool, dark place",
        safetyNotesEn: "Avoid contact with skin and eyes",
        safetyNotesZh: "避免接触皮肤和眼睛"
      });

      // Add films - Ilford
      const delta100 = await storage.createFilm({
        nameEn: "Delta 100",
        nameZh: "Delta 100",
        type: "B&W",
        iso: 100,
        manufacturer: "Ilford",
        descriptionEn: "Professional black and white film with very fine grain",
        descriptionZh: "专业黑白胶片，极细颗粒",
        brand: "Ilford"
      });

      const delta400 = await storage.createFilm({
        nameEn: "Delta 400",
        nameZh: "Delta 400",
        type: "B&W",
        iso: 400,
        manufacturer: "Ilford",
        descriptionEn: "High-speed professional black and white film",
        descriptionZh: "高速专业黑白胶片",
        brand: "Ilford"
      });

      const fp4 = await storage.createFilm({
        nameEn: "FP4+",
        nameZh: "FP4+",
        type: "B&W",
        iso: 125,
        manufacturer: "Ilford",
        descriptionEn: "Classic medium-speed black and white film",
        descriptionZh: "经典中速黑白胶片",
        brand: "Ilford"
      });

      const hp5 = await storage.createFilm({
        nameEn: "HP5+",
        nameZh: "HP5+",
        type: "B&W",
        iso: 400,
        manufacturer: "Ilford",
        descriptionEn: "Versatile high-speed black and white film",
        descriptionZh: "通用高速黑白胶片",
        brand: "Ilford"
      });

      // Add films - Kodak
      const trix400 = await storage.createFilm({
        nameEn: "Tri-X 400",
        nameZh: "Tri-X 400",
        type: "B&W",
        iso: 400,
        manufacturer: "Kodak",
        descriptionEn: "Classic high-speed black and white film",
        descriptionZh: "经典高速黑白胶片",
        brand: "Kodak"
      });

      const tmax100 = await storage.createFilm({
        nameEn: "T-Max 100",
        nameZh: "T-Max 100",
        type: "B&W",
        iso: 100,
        manufacturer: "Kodak",
        descriptionEn: "Professional fine-grain black and white film",
        descriptionZh: "专业细颗粒黑白胶片",
        brand: "Kodak"
      });

      const tmax400 = await storage.createFilm({
        nameEn: "T-Max 400",
        nameZh: "T-Max 400",
        type: "B&W",
        iso: 400,
        manufacturer: "Kodak",
        descriptionEn: "High-speed professional black and white film",
        descriptionZh: "高速专业黑白胶片",
        brand: "Kodak"
      });

      // Add films - Fujifilm
      const neopan100 = await storage.createFilm({
        nameEn: "Neopan 100",
        nameZh: "Neopan 100",
        type: "B&W",
        iso: 100,
        manufacturer: "Fujifilm",
        descriptionEn: "Fine-grain black and white film",
        descriptionZh: "细颗粒黑白胶片",
        brand: "Fujifilm"
      });

      const neopan400 = await storage.createFilm({
        nameEn: "Neopan 400",
        nameZh: "Neopan 400",
        type: "B&W",
        iso: 400,
        manufacturer: "Fujifilm",
        descriptionEn: "High-speed black and white film",
        descriptionZh: "高速黑白胶片",
        brand: "Fujifilm"
      });

      // Add color negative films (C-41)
      const gold200 = await storage.createFilm({
        nameEn: "Gold 200",
        nameZh: "柯达金200",
        type: "Color",
        iso: 200,
        manufacturer: "Kodak",
        descriptionEn: "Versatile color negative film ideal for sunny conditions, offering saturated colors and fine grain. Perfect for everyday photography including landscapes and portraits.",
        descriptionZh: "通用彩色负片，适合阳光明媚的环境，提供饱和的色彩和细腻的颗粒感，适合日常摄影。",
        brand: "Kodak"
      });

      const portra400 = await storage.createFilm({
        nameEn: "Portra 400",
        nameZh: "柯达炮塔400",
        type: "Color",
        iso: 400,
        manufacturer: "Kodak",
        descriptionEn: "Professional color negative film with exceptional exposure latitude and natural skin tones. Ideal for portraits and versatile enough for various lighting conditions.",
        descriptionZh: "专业彩色负片，具有极高的宽容度和自然的肤色表现。适合人像摄影，在各种光线条件下都能表现出色。",
        brand: "Kodak"
      });

      const superia400 = await storage.createFilm({
        nameEn: "Superia X-TRA 400",
        nameZh: "Superia X-TRA 400",
        type: "Color",
        iso: 400,
        manufacturer: "Fujifilm",
        descriptionEn: "Versatile color negative film for everyday shooting",
        descriptionZh: "多用途彩色负片，适合日常拍摄",
        brand: "Fujifilm"
      });

      const cinestill800t = await storage.createFilm({
        nameEn: "CineStill 800T",
        nameZh: "CineStill 800T",
        type: "Color",
        iso: 800,
        manufacturer: "CineStill",
        descriptionEn: "Tungsten-balanced color negative film, perfect for night photography",
        descriptionZh: "钨丝平衡彩色负片，适合夜景拍摄",
        brand: "CineStill"
      });

      // Add slide films (E-6)
      const velvia50 = await storage.createFilm({
        nameEn: "Velvia 50",
        nameZh: "Velvia 50",
        type: "Slide",
        iso: 50,
        manufacturer: "Fujifilm",
        descriptionEn: "Professional slide film known for vivid colors",
        descriptionZh: "专业反转片，以鲜艳的色彩著称",
        brand: "Fujifilm"
      });

      const ektachrome100 = await storage.createFilm({
        nameEn: "Ektachrome E100",
        nameZh: "Ektachrome E100",
        type: "Slide",
        iso: 100,
        manufacturer: "Kodak",
        descriptionEn: "Professional slide film with natural color reproduction",
        descriptionZh: "专业反转片，具有自然的色彩还原",
        brand: "Kodak"
      });

      // Add C-41 chemical
      const c41kit = await storage.createChemical({
        nameEn: "C-41 Process Kit",
        nameZh: "C-41套药",
        type: "Color Developer",
        manufacturer: "Various",
        descriptionEn: "Standard C-41 process chemistry for color negative films",
        descriptionZh: "标准C-41工艺药水，用于彩色负片冲洗",
        dilutionRatio: "As per kit instructions",
        temperatureRange: "37.8°C - 38.2°C",
        defaultTemperature: 38,
        shelfLife: "6 weeks after mixing",
        storageConditions: "Store in a cool, dark place",
        safetyNotesEn: "Use in well-ventilated area, wear protective gear",
        safetyNotesZh: "在通风处使用，穿戴防护装备"
      });

      // Add E-6 chemical
      const e6kit = await storage.createChemical({
        nameEn: "E-6 Process Kit",
        nameZh: "E-6套药",
        type: "Slide Developer",
        manufacturer: "Various",
        descriptionEn: "Standard E-6 process chemistry for color slide films",
        descriptionZh: "标准E-6工艺药水，用于彩色反转片冲洗",
        dilutionRatio: "As per kit instructions",
        temperatureRange: "37.8°C - 38.2°C",
        defaultTemperature: 38,
        shelfLife: "6 weeks after mixing",
        storageConditions: "Store in a cool, dark place",
        safetyNotesEn: "Use in well-ventilated area, wear protective gear",
        safetyNotesZh: "在通风处使用，穿戴防护装备"
      });

      // Add development processes - Ilford
      await storage.createDevelopmentProcess({
        filmId: delta100.id,
        chemicalId: ddx.id,
        dilutionRatio: "1:4",
        duration: 7,
        temperature: 20,
        agitationPattern: "Initial 60s, then 10s every minute",
        notesEn: "For normal contrast",
        notesZh: "标准显影"
      });

      await storage.createDevelopmentProcess({
        filmId: delta400.id,
        chemicalId: ddx.id,
        dilutionRatio: "1:4",
        duration: 9,
        temperature: 20,
        agitationPattern: "Initial 60s, then 10s every minute",
        notesEn: "For normal contrast",
        notesZh: "标准显影"
      });

      await storage.createDevelopmentProcess({
        filmId: fp4.id,
        chemicalId: ddx.id,
        dilutionRatio: "1:4",
        duration: 9,
        temperature: 20,
        agitationPattern: "Initial 60s, then 10s every minute",
        notesEn: "For normal contrast",
        notesZh: "标准显影"
      });

      await storage.createDevelopmentProcess({
        filmId: hp5.id,
        chemicalId: ddx.id,
        dilutionRatio: "1:4",
        duration: 9,
        temperature: 20,
        agitationPattern: "Initial 60s, then 10s every minute",
        notesEn: "For normal contrast",
        notesZh: "标准显影"
      });

      // Add development processes - Kodak
      await storage.createDevelopmentProcess({
        filmId: trix400.id,
        chemicalId: d76.id,
        dilutionRatio: "1:1",
        duration: 9,
        temperature: 20,
        agitationPattern: "Initial 60s, then 10s every minute",
        notesEn: "Classic combination",
        notesZh: "经典配合"
      });

      await storage.createDevelopmentProcess({
        filmId: tmax100.id,
        chemicalId: d76.id,
        dilutionRatio: "1:1",
        duration: 7,
        temperature: 20,
        agitationPattern: "Initial 60s, then 10s every minute",
        notesEn: "For fine grain",
        notesZh: "细腻颗粒"
      });

      await storage.createDevelopmentProcess({
        filmId: tmax400.id,
        chemicalId: d76.id,
        dilutionRatio: "1:1",
        duration: 7,
        temperature: 20,
        agitationPattern: "Initial 60s, then 10s every minute",
        notesEn: "For fine grain",
        notesZh: "细腻颗粒"
      });

      // Add development processes - Fujifilm
      await storage.createDevelopmentProcess({
        filmId: neopan100.id,
        chemicalId: neopan100dev.id,
        dilutionRatio: "Stock",
        duration: 6,
        temperature: 20,
        agitationPattern: "Initial 60s, then 10s every minute",
        notesEn: "Manufacturer recommended",
        notesZh: "厂商推荐"
      });

      await storage.createDevelopmentProcess({
        filmId: neopan400.id,
        chemicalId: neopan100dev.id,
        dilutionRatio: "Stock",
        duration: 7,
        temperature: 20,
        agitationPattern: "Initial 60s, then 10s every minute",
        notesEn: "Manufacturer recommended",
        notesZh: "厂商推荐"
      });

      // Add C-41 processes for Gold 200 and updated Portra 400
      await storage.createDevelopmentProcess({
        filmId: gold200.id,
        chemicalId: c41kit.id,
        dilutionRatio: "Stock",
        duration: 3.25, // 3 minutes 15 seconds
        temperature: 38,
        agitationPattern: "Continuous first 30s, then 5s every 30s",
        notesEn: "Best results between 2 hours after sunrise and 2 hours before sunset. Bleach: 6:30, Fix: 4:20, Stabilize: 1:00",
        notesZh: "在日出后两小时至日落前两小时拍摄效果最佳。漂白: 6分30秒, 定影: 4分20秒, 稳定: 1分钟"
      });

      await storage.createDevelopmentProcess({
        filmId: portra400.id,
        chemicalId: c41kit.id,
        dilutionRatio: "Stock",
        duration: 3.25, // 3 minutes 15 seconds
        temperature: 38,
        agitationPattern: "Continuous first 30s, then 5s every 30s",
        notesEn: "High exposure latitude allows for over/underexposure while maintaining detail. Bleach: 6:30, Fix: 4:20, Stabilize: 1:00",
        notesZh: "高宽容度允许过度或欠曝光时仍能保持细节。漂白: 6分30秒, 定影: 4分20秒, 稳定: 1分钟"
      });


      await storage.createDevelopmentProcess({
        filmId: superia400.id,
        chemicalId: c41kit.id,
        dilutionRatio: "Stock",
        duration: 3.25,
        temperature: 38,
        agitationPattern: "Continuous first 30s, then 5s every 30s",
        notesEn: "Bleach: 6:30, Fix: 4:20, Stabilize: 1:00. Temperature critical: ±0.3°C",
        notesZh: "漂白: 6分30秒, 定影: 4分20秒, 稳定: 1分钟。温度控制关键: ±0.3°C"
      });

      await storage.createDevelopmentProcess({
        filmId: cinestill800t.id,
        chemicalId: c41kit.id,
        dilutionRatio: "Stock",
        duration: 3.25,
        temperature: 38,
        agitationPattern: "Continuous first 30s, then 5s every 30s",
        notesEn: "Bleach: 6:30, Fix: 4:20, Stabilize: 1:00. Temperature critical: ±0.3°C",
        notesZh: "漂白: 6分30秒, 定影: 4分20秒, 稳定: 1分钟。温度控制关键: ±0.3°C"
      });

      // Add E-6 processes
      await storage.createDevelopmentProcess({
        filmId: velvia50.id,
        chemicalId: e6kit.id,
        dilutionRatio: "Stock",
        duration: 6,
        temperature: 38,
        agitationPattern: "Continuous first 30s, then 5s every 30s",
        notesEn: "First Dev: 6:00, Reversal: 30s white light, Color Dev: 6:00, Bleach: 7:00, Fix: 4:00",
        notesZh: "首显: 6分钟, 反转: 白光30秒, 彩显: 6分钟, 漂白: 7分钟, 定影: 4分钟"
      });

      await storage.createDevelopmentProcess({
        filmId: ektachrome100.id,
        chemicalId: e6kit.id,
        dilutionRatio: "Stock",
        duration: 6.5,
        temperature: 38,
        agitationPattern: "Continuous first 30s, then 5s every 30s",
        notesEn: "First Dev: 6:30, Reversal: 30s white light, Color Dev: 6:00, Bleach: 7:00, Fix: 4:00",
        notesZh: "首显: 6分30秒, 反转: 白光30秒, 彩显: 6分钟, 漂白: 7分钟, 定影: 4分钟"
      });

      console.log("Data initialization completed successfully");
    } catch (error) {
      console.error("Error initializing data:", error);
      throw error;
    }
  };

  // Call initializeData when the server starts
  await initializeData();

  // Film Routes
  app.get("/api/films", async (req, res) => {
    const films = await storage.getFilms();
    res.json(films);
  });

  app.get("/api/films/:id", async (req, res) => {
    const film = await storage.getFilm(parseInt(req.params.id));
    if (!film) {
      res.sendStatus(404);
      return;
    }
    res.json(film);
  });

  app.post("/api/films", requireAdmin, async (req, res) => {
    const parsed = insertFilmSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(parsed.error);
      return;
    }

    const film = await storage.createFilm(parsed.data);
    res.status(201).json(film);
  });

  app.patch("/api/films/:id", requireAdmin, async (req, res) => {
    const parsed = insertFilmSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(parsed.error);
      return;
    }

    const updated = await storage.updateFilm(parseInt(req.params.id), parsed.data);
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.json(updated);
  });

  app.delete("/api/films/:id", requireAdmin, async (req, res) => {
    const success = await storage.deleteFilm(parseInt(req.params.id));
    if (!success) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  });

  // Chemical Routes
  app.get("/api/chemicals", async (req, res) => {
    const chemicals = await storage.getChemicals();
    res.json(chemicals);
  });

  app.get("/api/chemicals/:id", async (req, res) => {
    const chemical = await storage.getChemical(parseInt(req.params.id));
    if (!chemical) {
      res.sendStatus(404);
      return;
    }
    res.json(chemical);
  });

  app.post("/api/chemicals", requireAdmin, async (req, res) => {
    const parsed = insertChemicalSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(parsed.error);
      return;
    }

    const chemical = await storage.createChemical(parsed.data);
    res.status(201).json(chemical);
  });

  app.patch("/api/chemicals/:id", requireAdmin, async (req, res) => {
    const parsed = insertChemicalSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(parsed.error);
      return;
    }

    const updated = await storage.updateChemical(parseInt(req.params.id), parsed.data);
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.json(updated);
  });

  app.delete("/api/chemicals/:id", requireAdmin, async (req, res) => {
    const success = await storage.deleteChemical(parseInt(req.params.id));
    if (!success) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  });

  // Development Process Routes
  app.get("/api/processes", async (req, res) => {
    const processes = await storage.getDevelopmentProcesses();
    res.json(processes);
  });

  app.get("/api/processes/:id", async (req, res) => {
    const process = await storage.getDevelopmentProcess(parseInt(req.params.id));
    if (!process) {
      res.sendStatus(404);
      return;
    }
    res.json(process);
  });

  app.get("/api/films/:id/processes", async (req, res) => {
    const processes = await storage.getDevelopmentProcessesForFilm(parseInt(req.params.id));
    res.json(processes);
  });

  app.post("/api/processes", requireAdmin, async (req, res) => {
    const parsed = insertDevelopmentProcessSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(parsed.error);
      return;
    }

    const process = await storage.createDevelopmentProcess(parsed.data);
    res.status(201).json(process);
  });

  app.patch("/api/processes/:id", requireAdmin, async (req, res) => {
    const parsed = insertDevelopmentProcessSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(parsed.error);
      return;
    }

    const updated = await storage.updateDevelopmentProcess(parseInt(req.params.id), parsed.data);
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.json(updated);
  });

  app.delete("/api/processes/:id", requireAdmin, async (req, res) => {
    const success = await storage.deleteDevelopmentProcess(parseInt(req.params.id));
    if (!success) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}