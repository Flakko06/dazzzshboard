const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initDatabase() {
    try {
        console.log("🔄 Conectando a Neon...");
        
        // Crear tabla
        await pool.query(`
            CREATE TABLE IF NOT EXISTS datos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                valor INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Tabla 'datos' creada");

        // Crear índices
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_datos_nombre ON datos(nombre)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_datos_created_at ON datos(created_at)`);
        console.log("✅ Índices creados");

        // Verificar si ya hay datos
        const checkResult = await pool.query("SELECT COUNT(*) FROM datos");
        const count = parseInt(checkResult.rows[0].count);

        if (count === 0) {
            // Insertar datos de prueba
            await pool.query(`
                INSERT INTO datos (nombre, valor) VALUES 
                    ('Ventas', 200),
                    ('Clientes', 150),
                    ('Productos', 75),
                    ('Ingresos', 320),
                    ('Pedidos', 185)
            `);
            console.log("✅ Datos de prueba insertados");
        } else {
            console.log(`ℹ️  Ya existen ${count} registros en la tabla`);
        }

        // Mostrar datos
        const result = await pool.query("SELECT * FROM datos ORDER BY id");
        console.log("\n📊 Datos en la tabla:");
        console.table(result.rows);

        await pool.end();
        console.log("\n✅ Base de datos inicializada correctamente");
    } catch (err) {
        console.error("❌ Error al inicializar la base de datos:", err);
        process.exit(1);
    }
}

initDatabase();
