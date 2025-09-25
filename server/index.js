import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { readFile, writeFile, mkdir, access } from "fs/promises";
import { constants as fsConstants } from "fs";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "items.json");

async function ensureDataFile() {
  try {
    await access(dataDir, fsConstants.F_OK);
  } catch {
    await mkdir(dataDir, { recursive: true });
  }
  try {
    await access(dataFile, fsConstants.F_OK);
  } catch {
    await writeFile(dataFile, "[]", "utf-8");
  }
}

async function readItems() {
  await ensureDataFile();
  const text = await readFile(dataFile, "utf-8");
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeItems(items) {
  await ensureDataFile();
  await writeFile(dataFile, JSON.stringify(items, null, 2), "utf-8");
}

const app = express();
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "http://127.0.0.1:5173",
  "https://shoping-cart-list-aj5wfxpfi-sandys-projects-e9cf1f4a.vercel.app", // vercel
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow no-origin requests like curl/postman
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Get all items
app.get("/api/items", async (_req, res) => {
  const items = await readItems();
  res.json(items);
});

// Add item
app.post("/api/items", async (req, res) => {
  const { name, quantity, category, note } = req.body || {};
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }
  const item = {
    id: nanoid(),
    name: name.trim(),
    quantity:
      Number.isFinite(Number(quantity)) && Number(quantity) > 0
        ? Number(quantity)
        : 1,
    category: typeof category === "string" ? category.trim() : "General",
    note: typeof note === "string" ? note.trim() : "",
  };
  const items = await readItems();
  items.push(item);
  await writeItems(items);
  res.status(201).json(item);
});

// Update item
app.put("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  const { name, quantity, category, note } = req.body || {};
  const items = await readItems();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Item not found" });
  }
  const existing = items[idx];
  const updated = {
    ...existing,
    ...(name !== undefined ? { name: String(name).trim() } : {}),
    ...(quantity !== undefined
      ? {
          quantity:
            Number.isFinite(Number(quantity)) && Number(quantity) > 0
              ? Number(quantity)
              : existing.quantity,
        }
      : {}),
    ...(category !== undefined ? { category: String(category).trim() } : {}),
    ...(note !== undefined ? { note: String(note).trim() } : {}),
  };
  items[idx] = updated;
  await writeItems(items);
  res.json(updated);
});

// Delete item
app.delete("/api/items/:id", async (req, res) => {
  const { id } = req.params;
  const items = await readItems();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Item not found" });
  }
  const [removed] = items.splice(idx, 1);
  await writeItems(items);
  res.json({ success: true, removed });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
