# 📊 Dazzzshboard - Dashboard Interactivo con React y MySQL

Dashboard interactivo desarrollado con React, TypeScript, Express y MySQL. Incluye visualizaciones de datos en tiempo real con gráficos de barras, líneas y circulares usando Recharts.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Dashboard+Preview)

---

## ✨ Características

- 📈 **Visualización de datos en tiempo real** desde MySQL
- 📊 **Múltiples tipos de gráficos**: Barras, Líneas, Circular
- ➕ **CRUD completo**: Crear, Leer, Actualizar, Eliminar datos
- 🎨 **Interfaz moderna** con Tailwind CSS
- 🚀 **Backend RESTful API** con Express
- ⚡ **Hot reload** en desarrollo
- 🌐 **Listo para producción** con Vercel

---

## 🛠️ Tecnologías

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Recharts (gráficos)
- Axios (HTTP client)

### Backend
- Node.js
- Express
- MySQL2
- CORS
- dotenv

---

## 📁 Estructura del Proyecto

```
dazzzshboard/
├── backend/
│   ├── server.js           # API REST
│   ├── package.json
│   ├── vercel.json         # Configuración para Vercel
│   ├── .env                # Variables de entorno (local)
│   └── .env.example        # Plantilla de variables
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── dashboard.tsx
│   │   ├── config/
│   │   │   └── api.ts      # Configuración del API
│   │   └── ...
│   ├── package.json
│   ├── .env.local          # Variables de entorno (desarrollo)
│   └── .env.example        # Plantilla de variables
├── database/
│   └── init.sql            # Script de inicialización de BD
├── DEPLOYMENT.md           # Guía completa de despliegue
└── README.md
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18.x
- MySQL >= 8.0 (o cuenta en PlanetScale/Railway)
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd dazzzshboard
```

### 2. Configurar la Base de Datos

**Opción A: MySQL Local**

```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar el script de inicialización
source database/init.sql
```

**Opción B: PlanetScale/Railway**

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas.

### 3. Configurar el Backend

```bash
cd backend
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL
```

**Archivo `.env`:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=dazzzshboard
DB_PORT=3306
PORT=5000
```

**Iniciar el backend:**
```bash
npm run dev
# El servidor estará en http://localhost:5000
```

### 4. Configurar el Frontend

```bash
cd frontend
npm install

# Copiar variables de entorno
cp .env.example .env.local
```

**Archivo `.env.local`:**
```env
REACT_APP_API_URL=http://localhost:5000
```

**Iniciar el frontend:**
```bash
npm start
# La app estará en http://localhost:3000
```

---

## 🌐 Despliegue en Producción

### Vercel (Recomendado)

Lee la **[Guía Completa de Despliegue](./DEPLOYMENT.md)** que incluye:

1. ✅ Configuración de base de datos en la nube (PlanetScale/Railway)
2. ✅ Despliegue del backend en Vercel
3. ✅ Despliegue del frontend en Vercel
4. ✅ Configuración de variables de entorno
5. ✅ Solución de problemas comunes

**Resumen rápido:**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar backend
cd backend
vercel

# Desplegar frontend
cd frontend
vercel
```

---

## 📊 API Endpoints

### Base URL
- Desarrollo: `http://localhost:5000`
- Producción: `https://tu-backend.vercel.app`

### Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/datos` | Obtener todos los datos |
| GET | `/api/datos/:id` | Obtener un dato específico |
| POST | `/api/datos` | Crear un nuevo dato |
| PUT | `/api/datos/:id` | Actualizar un dato |
| DELETE | `/api/datos/:id` | Eliminar un dato |

### Ejemplos de Uso

**Obtener todos los datos:**
```bash
curl http://localhost:5000/api/datos
```

**Crear un nuevo dato:**
```bash
curl -X POST http://localhost:5000/api/datos \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Usuarios", "valor": 500}'
```

**Actualizar un dato:**
```bash
curl -X PUT http://localhost:5000/api/datos/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Ventas", "valor": 250}'
```

**Eliminar un dato:**
```bash
curl -X DELETE http://localhost:5000/api/datos/1
```

---

## 🎨 Personalización

### Cambiar colores del tema

Edita `frontend/tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        // ... tus colores
      }
    }
  }
}
```

### Agregar nuevos gráficos

Consulta la [documentación de Recharts](https://recharts.org/) para más tipos de gráficos.

---

## 🐛 Solución de Problemas

### El frontend no se conecta al backend

1. Verifica que el backend esté corriendo en el puerto correcto
2. Revisa que `REACT_APP_API_URL` esté configurado correctamente
3. Verifica la consola del navegador para errores de CORS

### Error de conexión a MySQL

1. Verifica que MySQL esté corriendo: `mysql -u root -p`
2. Confirma las credenciales en `.env`
3. Asegúrate de que la base de datos `dazzzshboard` exista

### Error 404 en producción (Vercel)

1. Verifica que `vercel.json` esté configurado correctamente
2. Revisa los logs en el dashboard de Vercel
3. Asegúrate de que las variables de entorno estén configuradas

---

## 📝 Scripts Disponibles

### Backend

```bash
npm start       # Iniciar servidor (producción)
npm run dev     # Iniciar con nodemon (desarrollo)
```

### Frontend

```bash
npm start       # Iniciar en modo desarrollo
npm run build   # Compilar para producción
npm test        # Ejecutar tests
npm run dev     # Alias de npm start
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@EGarpxMaster](https://github.com/EGarpxMaster)

---

## 🙏 Agradecimientos

- [React](https://react.dev/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
- [PlanetScale](https://planetscale.com/)

---

## 📚 Recursos Adicionales

- [Documentación completa de despliegue](./DEPLOYMENT.md)
- [Script de base de datos](./database/init.sql)
- [Ejemplos de la API](#-api-endpoints)

---

**¿Necesitas ayuda?** Abre un [issue](https://github.com/EGarpxMaster/dazzzshboard/issues) 🚀
