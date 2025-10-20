const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

/* ===== CORS =====
   Ponemos headers *antes* de cors() para cubrir
   redirecciones/OPTIONS donde Vercel podría responder
   antes que Express. Ajusta FRONTEND_URL si cambias dominio. */
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://dazzzshboard-ioi6.vercel.app", // <-- tu frontend en Vercel
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isAllowed =
    origin &&
    (ALLOWED_ORIGINS.includes(origin) || /\.vercel\.app$/.test(origin));

  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin"); // importante para caches/CDN
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  // Responder rápido a preflight
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// cors() adicional por si alguna lib lo requiere
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // requests same-origin / server-side
    if (ALLOWED_ORIGINS.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return cb(null, true);
    }
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

/* ===== PostgreSQL (Neon) ===== */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Probar conexión a la base
pool
  .query("SELECT NOW()")
  .then((r) =>
    console.log("Conexión exitosa a PostgreSQL (Neon):", r.rows[0].now)
  )
  .catch((err) => console.error("Error conectando a PostgreSQL:", err));

/* ===== Rutas ===== */
// Salud (evita 404/308 en '/')
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "dashboard-backend" });
});

// Obtener todos los datos
app.get("/api/datos", async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.datos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error("Error en la consulta:", err);
    res.status(500).json({ error: "Error al obtener datos" });
  }
});

// Obtener dato por id
app.get("/api/datos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM public.datos WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Dato no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener el dato:", err);
    res.status(500).json({ error: "Error al obtener el dato" });
  }
});

// Crear dato
app.post("/api/datos", async (req, res) => {
  try {
    const { nombre, valor } = req.body;
    const result = await pool.query(
      "INSERT INTO public.datos (nombre, valor) VALUES ($1, $2) RETURNING *",
      [nombre, valor]
    );
    res.status(201).json({ ...result.rows[0], message: "Dato creado exitosamente" });
  } catch (err) {
    console.error("Error al crear el dato:", err);
    res.status(500).json({ error: "Error al crear el dato" });
  }
});

// Actualizar dato
app.put("/api/datos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, valor } = req.body;
    const result = await pool.query(
      "UPDATE public.datos SET nombre = $1, valor = $2 WHERE id = $3 RETURNING *",
      [nombre, valor, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Dato no encontrado" });
    }
    res.json({ ...result.rows[0], message: "Dato actualizado exitosamente" });
  } catch (err) {
    console.error("Error al actualizar el dato:", err);
    res.status(500).json({ error: "Error al actualizar el dato" });
  }
});

// Eliminar dato
app.delete("/api/datos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM public.datos WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Dato no encontrado" });
    }
    res.json({ message: "Dato eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar el dato:", err);
    res.status(500).json({ error: "Error al eliminar el dato" });
  }
});

/* ===== Arranque local ===== */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}

// Export para Vercel (serverless)
module.exports = app;
