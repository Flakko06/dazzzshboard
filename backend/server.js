const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión a PostgreSQL (Neon)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Probar conexión a la base de datos
pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Error conectando a PostgreSQL:", err);
        return;
    }
    console.log("Conexión exitosa a PostgreSQL (Neon):", res.rows[0].now);
});

// Endpoint para obtener todos los datos
app.get("/api/datos", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM datos ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ error: "Error al obtener datos" });
    }
});

// Endpoint para obtener un dato específico
app.get("/api/datos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM datos WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Dato no encontrado" });
            return;
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error al obtener el dato:", err);
        res.status(500).json({ error: "Error al obtener el dato" });
    }
});

// Endpoint para crear un nuevo dato
app.post("/api/datos", async (req, res) => {
    try {
        const { nombre, valor } = req.body;
        const result = await pool.query(
            "INSERT INTO datos (nombre, valor) VALUES ($1, $2) RETURNING *",
            [nombre, valor]
        );
        res.status(201).json({
            ...result.rows[0],
            message: "Dato creado exitosamente"
        });
    } catch (err) {
        console.error("Error al crear el dato:", err);
        res.status(500).json({ error: "Error al crear el dato" });
    }
});

// Endpoint para actualizar un dato
app.put("/api/datos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, valor } = req.body;
        const result = await pool.query(
            "UPDATE datos SET nombre = $1, valor = $2 WHERE id = $3 RETURNING *",
            [nombre, valor, id]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Dato no encontrado" });
            return;
        }
        res.json({ 
            ...result.rows[0],
            message: "Dato actualizado exitosamente" 
        });
    } catch (err) {
        console.error("Error al actualizar el dato:", err);
        res.status(500).json({ error: "Error al actualizar el dato" });
    }
});

// Endpoint para eliminar un dato
app.delete("/api/datos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM datos WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Dato no encontrado" });
            return;
        }
        res.json({ message: "Dato eliminado exitosamente" });
    } catch (err) {
        console.error("Error al eliminar el dato:", err);
        res.status(500).json({ error: "Error al eliminar el dato" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});