-- Script de inicialización para PostgreSQL (Neon)
-- =====================================================

-- Crear tabla de datos
CREATE TABLE IF NOT EXISTS datos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    valor INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_datos_nombre ON datos(nombre);
CREATE INDEX IF NOT EXISTS idx_datos_created_at ON datos(created_at);

-- Insertar datos de prueba
INSERT INTO datos (nombre, valor) VALUES 
    ('Ventas', 200),
    ('Clientes', 150),
    ('Productos', 75),
    ('Ingresos', 320),
    ('Pedidos', 185)
ON CONFLICT DO NOTHING;

-- Verificar los datos
SELECT * FROM datos ORDER BY id;
