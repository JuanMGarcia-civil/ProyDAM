### With docker

```
docker compose up
```

Open app in: http://localhost:8080


## 1 Start server

Linux
```
sudo apt install pandoc
\\SOLO UNA VEZ
```

```
cd server
pip install -r requirement.txt
\\SOLO UNA VEZ
python app.py
```

## 1 Start Ionic app

```
cd client
npm ci
\\SOLO UNA VEZ, abrir terminal nueva
npm run dev

http://localhost:5173/home
```

## Tests unitarios

Los tests viven en `server/tests/` y usan **pytest** (incluido en `requirements.txt`).

```
cd server
pip install -r requirements.txt
pytest
```

### Resumen de los tests

`tests/test_plotter.py` prueba el método `Plotter.run()` usando los archivos
reales de `core/inputs/`. `run()` lee `plot_config.xlsx`, omite las hojas cuyo
nombre contiene una `SKIP_KEYWORD` y genera un PNG por cada fila más un CSV, un
DOCX y un MD. Las 3 hojas válidas con 6 filas cada una producen 18 gráficos.

| Test | Qué verifica |
|------|--------------|
| `test_run_returns_one_entry_per_plotted_row` | Devuelve una entrada por fila graficada (18) con las claves esperadas |
| `test_run_skips_sheets_with_skip_keyword` | Solo procesa las hojas sin `SKIP_KEYWORD` en el nombre |
| `test_run_writes_a_png_for_each_entry` | Escribe un PNG en disco por cada entrada del registro |
| `test_run_writes_report_files` | Genera `Summary_List.csv`, `Final_Report.docx` y `Final_Report.md` |
| `test_run_absolutizes_image_urls_in_markdown` | Convierte las URLs de las imágenes del MD en URLs absolutas con el host |
| `test_run_returns_empty_when_config_missing` | Devuelve una lista vacía cuando no existe el archivo de configuración |



