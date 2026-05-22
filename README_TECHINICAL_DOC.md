# PlotMe — Technical Documentation

Aplicación web para generar diagramas de interacción N-M a partir de archivos Excel.
Frontend React/Ionic + Backend Flask + autenticación Firebase.

---

## Tech Stack

### Frontend — `client/`

| Technology | Version |
|---|---|
| Node.js | 20 (LTS) |
| npm | 10.x |
| TypeScript | ~5.9 |
| React | 19.0.0 |
| Ionic React | ^8.5.0 |
| Ionic React Router | ^8.5.0 |
| React Router DOM | ^5.3.4 |
| Capacitor Core | 8.3.4 |
| Axios | ^1.16.1 |
| Firebase SDK | ^12.13.0 |
| Vite | ^5.0.0 |
| Vitest | ^0.34.6 |
| Cypress | ^13.5.0 |

### Backend — `server/`

| Technology | Version |
|---|---|
| Python | 3.11 |
| Flask | 3.0.3 |
| flask-cors | 4.0.1 |
| Gunicorn | latest |
| matplotlib | latest |
| pandas | latest |
| openpyxl | latest |
| numpy | latest |
| python-docx | latest |
| docx2md | latest |

### Infrastructure

| Tool | Version / Image |
|---|---|
| Docker | — |
| Docker Compose | — |
| Backend image | `python:3.11-slim` |
| Frontend image | `node:20-slim` → `nginx:alpine` |
| System dep. | `pandoc` (conversión .docx → .md) |

### External Services

| Service | Purpose |
|---|---|
| Firebase Auth | Login / Signup de usuarios |

---

## Project Structure

```
ProyectoFinal/
├── client/                  # Frontend React/Ionic
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   ├── Home.tsx        # Lista de proyectos
│   │   │   └── Proyect.tsx     # Vista del reporte
│   │   ├── components/
│   │   │   └── CreateProyectModal.tsx
│   │   ├── services/
│   │   │   └── auth.ts         # Wrapper Firebase Auth
│   │   └── firebase.ts         # Inicialización Firebase
│   ├── package.json
│   └── Dockerfile
├── server/                  # Backend Flask
│   ├── app.py               # Rutas Flask
│   ├── controllers/
│   │   └── proyects_controller.py
│   ├── core/
│   │   └── plotter.py       # Motor de generación de gráficos
│   ├── uploads/             # Proyectos y outputs (volumen Docker)
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/proyects` | Lista todos los proyectos |
| `POST` | `/proyects` | Crea un proyecto (`{ id }`) |
| `DELETE` | `/proyects/:id` | Elimina un proyecto |
| `POST` | `/proyects/:id/upload` | Sube ficheros al proyecto (multipart) |
| `POST` | `/proyects/:id/execute_plots` | Ejecuta el Plotter y genera el reporte |
| `GET` | `/uploads/:id` | Devuelve `Final_Report.md` |
| `GET` | `/uploads/:id/Plots/media/:file` | Sirve imágenes PNG del reporte |
| `GET` | `/openapi.json` | Especificación OpenAPI |
| `GET` | `/docs` | Swagger UI |

---

## Input file: `plot_config.xlsx`

El archivo de configuración debe subirse junto con los Excel de datos. Define un gráfico por fila:

| Column | Description |
|---|---|
| `Graph_Title` | Título del gráfico |
| `Diag_File` | Path al Excel con la curva envolvente |
| `Diag_Sheet` | Hoja del Excel envolvente |
| `Diag_1RowStart/End` | Rango de filas — primera mitad de la curva |
| `Diag_2RowStart/End` | Rango de filas — segunda mitad de la curva |
| `Diag_ColM / Diag_ColP` | Columnas X (Momento) e Y (Normal) |
| `Diag_Label` | Etiqueta de leyenda de la curva |
| `File1_Path … File6_Path` | Hasta 6 datasets de scatter |
| `File{N}_Sheet/Start/End/ColX/ColY/Label` | Config de cada dataset |

Sheets con palabras `skip`, `template`, `notes` o `archive` en el nombre son ignoradas.

---

## Running the project

### With Docker (recommended)

```bash
docker compose up
```

- Frontend: http://localhost:8080
- Backend:  http://localhost:5000
- API docs: http://localhost:5000/docs

### Without Docker

**Backend**

```bash
# Ubuntu/Debian
sudo apt install pandoc

cd server
pip install -r requirements.txt
python app.py          # http://localhost:5000
```

**Frontend**

```bash
cd client
npm ci
npm run dev            # http://localhost:5173
```

---

## Testing

```bash
# Unit tests (Vitest)
cd client && npm run test.unit

# E2E tests (Cypress)
cd client && npm run test.e2e
```

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PLOTTER_HOST` | `http://localhost:5000` | Base URL usada para reescribir las URLs de imágenes en el Markdown generado |
