import { User, InsertUser, Film, InsertFilm, Chemical, InsertChemical, DevelopmentProcess, InsertDevelopmentProcess } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Films
  getFilms(): Promise<Film[]>;
  getFilm(id: number): Promise<Film | undefined>;
  createFilm(film: InsertFilm): Promise<Film>;
  updateFilm(id: number, film: InsertFilm): Promise<Film | undefined>;
  deleteFilm(id: number): Promise<boolean>;

  // Chemicals
  getChemicals(): Promise<Chemical[]>;
  getChemical(id: number): Promise<Chemical | undefined>;
  createChemical(chemical: InsertChemical): Promise<Chemical>;
  updateChemical(id: number, chemical: InsertChemical): Promise<Chemical | undefined>;
  deleteChemical(id: number): Promise<boolean>;

  // Development Processes
  getDevelopmentProcesses(): Promise<DevelopmentProcess[]>;
  getDevelopmentProcess(id: number): Promise<DevelopmentProcess | undefined>;
  getDevelopmentProcessesForFilm(filmId: number): Promise<DevelopmentProcess[]>;
  createDevelopmentProcess(process: InsertDevelopmentProcess): Promise<DevelopmentProcess>;
  updateDevelopmentProcess(id: number, process: InsertDevelopmentProcess): Promise<DevelopmentProcess | undefined>;
  deleteDevelopmentProcess(id: number): Promise<boolean>;

  // Diary entries
  getDiaryEntries(userId: number): Promise<DiaryEntry[]>;
  getDiaryEntry(id: number): Promise<DiaryEntry | undefined>;
  createDiaryEntry(userId: number, entry: InsertDiaryEntry): Promise<DiaryEntry>;
  updateDiaryEntry(id: number, entry: UpdateDiaryEntry): Promise<DiaryEntry | undefined>;
  deleteDiaryEntry(id: number): Promise<boolean>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private films: Map<number, Film>;
  private chemicals: Map<number, Chemical>;
  private developmentProcesses: Map<number, DevelopmentProcess>;
  private diaryEntries: Map<number, DiaryEntry>;
  private currentUserId: number;
  private currentFilmId: number;
  private currentChemicalId: number;
  private currentProcessId: number;
  private currentEntryId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.films = new Map();
    this.chemicals = new Map();
    this.developmentProcesses = new Map();
    this.diaryEntries = new Map();
    this.currentUserId = 1;
    this.currentFilmId = 1;
    this.currentChemicalId = 1;
    this.currentProcessId = 1;
    this.currentEntryId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { ...user, id, isAdmin: false };
    this.users.set(id, newUser);
    return newUser;
  }

  // Film methods
  async getFilms(): Promise<Film[]> {
    return Array.from(this.films.values());
  }

  async getFilm(id: number): Promise<Film | undefined> {
    return this.films.get(id);
  }

  async createFilm(film: InsertFilm): Promise<Film> {
    const id = this.currentFilmId++;
    const newFilm: Film = { ...film, id };
    this.films.set(id, newFilm);
    return newFilm;
  }

  async updateFilm(id: number, film: InsertFilm): Promise<Film | undefined> {
    const existing = this.films.get(id);
    if (!existing) return undefined;
    const updated: Film = { ...film, id };
    this.films.set(id, updated);
    return updated;
  }

  async deleteFilm(id: number): Promise<boolean> {
    return this.films.delete(id);
  }

  // Chemical methods
  async getChemicals(): Promise<Chemical[]> {
    return Array.from(this.chemicals.values());
  }

  async getChemical(id: number): Promise<Chemical | undefined> {
    return this.chemicals.get(id);
  }

  async createChemical(chemical: InsertChemical): Promise<Chemical> {
    const id = this.currentChemicalId++;
    const newChemical: Chemical = { ...chemical, id };
    this.chemicals.set(id, newChemical);
    return newChemical;
  }

  async updateChemical(id: number, chemical: InsertChemical): Promise<Chemical | undefined> {
    const existing = this.chemicals.get(id);
    if (!existing) return undefined;
    const updated: Chemical = { ...chemical, id };
    this.chemicals.set(id, updated);
    return updated;
  }

  async deleteChemical(id: number): Promise<boolean> {
    return this.chemicals.delete(id);
  }

  // Development Process methods
  async getDevelopmentProcesses(): Promise<DevelopmentProcess[]> {
    return Array.from(this.developmentProcesses.values());
  }

  async getDevelopmentProcess(id: number): Promise<DevelopmentProcess | undefined> {
    return this.developmentProcesses.get(id);
  }

  async getDevelopmentProcessesForFilm(filmId: number): Promise<DevelopmentProcess[]> {
    return Array.from(this.developmentProcesses.values()).filter(
      (process) => process.filmId === filmId
    );
  }

  async createDevelopmentProcess(process: InsertDevelopmentProcess): Promise<DevelopmentProcess> {
    const id = this.currentProcessId++;
    const now = new Date();
    const newProcess: DevelopmentProcess = {
      ...process,
      id,
      createdAt: now,
      updatedAt: now,
      isVerified: false,
    };
    this.developmentProcesses.set(id, newProcess);
    return newProcess;
  }

  async updateDevelopmentProcess(id: number, process: InsertDevelopmentProcess): Promise<DevelopmentProcess | undefined> {
    const existing = this.developmentProcesses.get(id);
    if (!existing) return undefined;
    const updated: DevelopmentProcess = {
      ...process,
      id,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      isVerified: existing.isVerified,
    };
    this.developmentProcesses.set(id, updated);
    return updated;
  }

  async deleteDevelopmentProcess(id: number): Promise<boolean> {
    return this.developmentProcesses.delete(id);
  }

  // Diary entry methods
  async getDiaryEntries(userId: number): Promise<DiaryEntry[]> {
    return Array.from(this.diaryEntries.values()).filter(
      (entry) => entry.userId === userId,
    );
  }

  async getDiaryEntry(id: number): Promise<DiaryEntry | undefined> {
    return this.diaryEntries.get(id);
  }

  async createDiaryEntry(userId: number, entry: InsertDiaryEntry): Promise<DiaryEntry> {
    const id = this.currentEntryId++;
    const now = new Date();
    const diaryEntry: DiaryEntry = {
      id,
      userId,
      content: entry.content,
      date: now,
      lastModified: now,
    };
    this.diaryEntries.set(id, diaryEntry);
    return diaryEntry;
  }

  async updateDiaryEntry(id: number, entry: UpdateDiaryEntry): Promise<DiaryEntry | undefined> {
    const existing = this.diaryEntries.get(id);
    if (!existing) return undefined;

    const updated: DiaryEntry = {
      ...existing,
      content: entry.content,
      lastModified: new Date(),
    };
    this.diaryEntries.set(id, updated);
    return updated;
  }

  async deleteDiaryEntry(id: number): Promise<boolean> {
    return this.diaryEntries.delete(id);
  }
}

export const storage = new MemStorage();