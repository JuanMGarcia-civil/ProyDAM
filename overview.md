# Project Overview — PlotMe

## Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend<br/>(React/Ionic)
    participant FB as Firebase Auth
    participant API as Backend<br/>(Flask API)
    participant PL as Plotter<br/>(Python)
    participant FS as File System<br/>(uploads/)

    %% ── AUTENTICACIÓN ──
    rect rgb(230, 240, 255)
        Note over User,FB: Autenticación
        User->>FE: Login (email/password)
        FE->>FB: signInWithEmailAndPassword()
        FB-->>FE: User token
        FE-->>User: Redirige a /home
    end

    %% ── LISTADO DE PROYECTOS ──
    rect rgb(230, 255, 230)
        Note over FE,FS: Listado de proyectos
        FE->>API: GET /proyects
        API->>FS: os.listdir(uploads/)
        FS-->>API: [id1, id2, ...]
        API-->>FE: { proyects: [{id}, ...] }
        FE-->>User: Lista de proyectos
    end

    %% ── CREAR PROYECTO + SUBIR ARCHIVOS ──
    rect rgb(255, 245, 220)
        Note over User,FS: Crear proyecto y subir archivos
        User->>FE: Rellena modal (ID + ficheros)
        FE->>API: POST /proyects  { id }
        API->>FS: mkdir uploads/{id}/
        API-->>FE: { id }

        FE->>API: POST /proyects/{id}/upload  [files]
        Note right of API: plot_config.xlsx<br/>+ archivos de datos Excel
        API->>FS: Guarda ficheros en uploads/{id}/
        API-->>FE: { files, count }
    end

    %% ── GENERACIÓN DE PLOTS ──
    rect rgb(255, 230, 230)
        Note over FE,FS: Generación de gráficos (async fire-and-forget)
        FE->>API: POST /proyects/{id}/execute_plots
        API->>PL: Plotter(input_dir, output_dir).run()

        loop Por cada Sheet en plot_config.xlsx
            PL->>FS: Lee hoja del plot_config.xlsx
            loop Por cada fila (gráfico)
                PL->>FS: get_excel_data() → lee archivo Excel de datos
                Note right of PL: Lee rangos de filas/cols<br/>definidos en plot_config
                PL->>PL: plt.plot() curva envolvente (2 mitades, negro)
                PL->>PL: plt.scatter() hasta 6 datasets (colores)
                PL->>PL: Formato: título, ejes N-M, grid, leyenda
                PL->>FS: plt.savefig() → uploads/{id}/Plots/{sheet}_{title}.png
                PL->>PL: plt.close() limpia memoria
            end
        end

        PL->>FS: Guarda Summary_List.csv
        PL->>FS: Guarda Final_Report.docx (Word con imágenes)
        PL->>PL: docx2md convierte .docx → .md<br/>+ reescribe URLs de imágenes a absolutas
        PL->>FS: Guarda Final_Report.md
        PL-->>API: plot_registry [{ Sheet, File, Description }]
        API-->>FE: { id, plots }
        FE-->>User: Modal cerrado, lista refrescada
    end

    %% ── VER REPORTE ──
    rect rgb(240, 230, 255)
        Note over User,FS: Ver reporte del proyecto
        User->>FE: Click en proyecto → /proyects/{id}
        FE->>API: GET /uploads/{id}
        API->>FS: send_from_directory → Final_Report.md
        FS-->>API: Contenido Markdown con <img src="http://...">
        API-->>FE: Markdown como texto
        FE-->>User: dangerouslySetInnerHTML renderiza el reporte

        Note over FE,FS: Imágenes cargadas inline por el browser
        FE->>API: GET /uploads/{id}/Plots/media/{imagen}.png
        API->>FS: send_from_directory → media/
        FS-->>API: PNG
        API-->>FE: Imagen binaria
    end
```

## Flow Summary

| Phase | What happens |
|---|---|
| **Auth** | Firebase manages login/signup; token stays on the client |
| **Projects** | Flask lists folders inside `uploads/` as projects |
| **Upload** | Files (`plot_config.xlsx` + data Excel files) are saved to `uploads/{id}/` |
| **Plotter** | Reads `plot_config.xlsx` sheet by sheet → row by row defines what data to plot and how → matplotlib generates PNGs → packed into `.docx` → converted to `.md` |
| **Report** | Frontend fetches the `.md` and renders it with `innerHTML`; images are served directly by Flask |

## Plotter detail (`server/core/plotter.py`)

1. **Config file**: `uploads/{id}/plot_config.xlsx` — one sheet per group of graphs, one row per graph.
2. **Envelope curve**: two independent halves read from a diagram Excel file (`Diag_*` columns), plotted as black lines.
3. **Scatter datasets**: up to 6 additional Excel files (`File1_*` … `File6_*` columns), each plotted as colored scatter points.
4. **Output per graph**: PNG saved to `uploads/{id}/Plots/`.
5. **Final output**: `Summary_List.csv` + `Final_Report.docx` + `Final_Report.md` (image URLs rewritten to absolute Flask endpoints).
