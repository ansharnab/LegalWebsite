import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "..");
const DATA_DIR = path.join(__dirname, "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const UPLOADS_DIR = path.join(ROOT_DIR, "public", "uploads");
const CONTACT_FILE = path.join(DATA_DIR, "contacts.json");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const isProd = process.env.NODE_ENV === "production" || process.argv.includes("--prod");

function loadEnvFile() {
  const envPath = path.join(ROOT_DIR, ".env");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile();

const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "legaladvisor2026").trim();

[DATA_DIR, UPLOADS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

if (!fs.existsSync(CONTENT_FILE)) {
  const seed = path.join(__dirname, "data", "content.seed.json");
  if (fs.existsSync(seed)) {
    fs.copyFileSync(seed, CONTENT_FILE);
  } else {
    writeJson(CONTENT_FILE, { pages: {}, settings: {} });
  }
}
if (!fs.existsSync(CONTACT_FILE)) {
  writeJson(CONTACT_FILE, []);
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uuid().slice(0, 8)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = /\.(jpe?g|png|gif|webp|svg|pdf)$/i;
    cb(null, allowed.test(file.originalname));
  },
});

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(UPLOADS_DIR));

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get("/api/health", (_, res) => {
  res.json({ ok: true, service: "legal-advisor-api", mode: isProd ? "production" : "development" });
});

app.post("/api/auth/login", (req, res) => {
  const password = String(req.body?.password ?? "").trim();
  if (password && password === ADMIN_PASSWORD) {
    return res.json({ token: ADMIN_PASSWORD, ok: true });
  }
  res.status(401).json({ error: "Invalid password" });
});

app.get("/api/content", (_, res) => {
  res.json(readJson(CONTENT_FILE, { pages: {}, settings: {} }));
});

function mergeContent(existing, incoming) {
  const base = existing && typeof existing === "object" ? existing : { pages: {}, settings: {}, site: {} };
  const body = incoming && typeof incoming === "object" ? incoming : {};
  return {
    pages: body.pages ? { ...base.pages, ...body.pages } : base.pages,
    settings: body.settings ? { ...base.settings, ...body.settings } : base.settings,
    site: body.site
      ? {
          practiceAreas: body.site.practiceAreas ?? base.site?.practiceAreas,
          testimonials: body.site.testimonials ?? base.site?.testimonials,
          features: body.site.features ?? base.site?.features,
        }
      : base.site,
  };
}

app.put("/api/content", requireAuth, (req, res) => {
  const existing = readJson(CONTENT_FILE, { pages: {}, settings: {}, site: {} });
  const merged = mergeContent(existing, req.body);
  writeJson(CONTENT_FILE, merged);
  res.json({ ok: true, content: merged });
});

app.get("/api/media", (_, res) => {
  const files = fs.existsSync(UPLOADS_DIR) ? fs.readdirSync(UPLOADS_DIR) : [];
  res.json(
    files.map((name) => ({
      id: name,
      name,
      url: `/uploads/${name}`,
      type: "image",
    }))
  );
});

app.post("/api/media/upload", requireAuth, upload.array("files", 20), (req, res) => {
  const items = (req.files || []).map((f) => ({
    id: f.filename,
    name: f.originalname,
    url: `/uploads/${f.filename}`,
    type: "image",
  }));
  res.json({ items });
});

app.delete("/api/media/:id", requireAuth, (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.id);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  res.json({ ok: true });
});

app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body || {};
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  const contacts = readJson(CONTACT_FILE, []);
  const entry = {
    id: uuid(),
    name: name.trim(),
    email: email.trim(),
    phone: phone?.trim() || "",
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };
  contacts.unshift(entry);
  writeJson(CONTACT_FILE, contacts);
  res.json({ ok: true, message: "Thank you! We will get back to you shortly." });
});

app.get("/api/contact", requireAuth, (_, res) => {
  res.json(readJson(CONTACT_FILE, []));
});

async function attachFrontend() {
  if (isProd) {
    if (!fs.existsSync(DIST_DIR)) {
      console.error("\nNo production build found. Run: npm run build\n");
      process.exit(1);
    }
    app.use(express.static(path.join(ROOT_DIR, "public"), { index: false }));
    app.use(express.static(DIST_DIR, { index: false }));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) return next();
      if (path.extname(req.path)) {
        return res.status(404).type("text/plain").send("Not found");
      }
      res.sendFile(path.join(DIST_DIR, "index.html"));
    });
    return;
  }

  app.use(express.static(path.join(ROOT_DIR, "public"), { index: false }));

  const { createServer } = await import("vite");
  const vite = await createServer({
    configFile: path.join(ROOT_DIR, "vite.config.js"),
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith("/api") || url.startsWith("/uploads")) {
      return next();
    }
    try {
      const templatePath = path.join(ROOT_DIR, "index.html");
      let html = fs.readFileSync(templatePath, "utf-8");
      html = await vite.transformIndexHtml(url, html);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      vite.ssrFixStacktrace(err);
      next(err);
    }
  });
}

const PORT = Number(process.env.PORT) || 3001;

async function start() {
  await attachFrontend();

  const server = app.listen(PORT, () => {
    const mode = isProd ? "production" : "development (Vite HMR)";
    console.log(`\nLegal Advisor — http://localhost:${PORT}`);
    console.log(`  Mode: ${mode}`);
    console.log(`  Admin: http://localhost:${PORT}/admin\n`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `\nPort ${PORT} is already in use.\n` +
          `  • Run: npm run stop\n` +
          `  • Or use another port:  $env:PORT=3002; npm run dev\n`
      );
      process.exit(1);
    }
    throw err;
  });
}

start();
