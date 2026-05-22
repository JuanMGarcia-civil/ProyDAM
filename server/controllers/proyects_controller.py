import os
from datetime import datetime
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
from flask import jsonify, request, send_from_directory, url_for
from werkzeug.security import safe_join

from core.plotter import Plotter

UPLOAD_ROOT = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads"
)
os.makedirs(UPLOAD_ROOT, exist_ok=True)

HOST = os.environ.get("PLOTTER_HOST", "http://localhost:5000")


def create():
    payload = request.get_json(silent=True) or {}
    proyect_id = str(payload.get("id") or "1").strip()
    os.makedirs(os.path.join(UPLOAD_ROOT, proyect_id), exist_ok=True)
    return jsonify({"id": proyect_id})

def delete(proyect_id):
    # TODO: Implementar eliminación segura de proyectos
    return jsonify({"id": proyect_id})


def index():
    entries = sorted(os.listdir(UPLOAD_ROOT))
    proyects = [
        {"id": name}
        for name in entries
        if os.path.isdir(os.path.join(UPLOAD_ROOT, name))
    ]
    return jsonify({"proyects": proyects})


def upload(proyect_id, files):
    target_dir = Path(UPLOAD_ROOT) / proyect_id
    saved = []
    for f in files:
        dest = Path(safe_join(str(target_dir), f.filename))
        dest.parent.mkdir(parents=True, exist_ok=True)
        f.save(dest)
        saved.append(str(dest.relative_to(target_dir)))
    return jsonify({"id": proyect_id, "files": saved, "count": len(saved)})


def execute_plots(proyect_id):
    target_dir = os.path.join(UPLOAD_ROOT, proyect_id)
    os.makedirs(target_dir, exist_ok=True)

    output_dir = os.path.join(target_dir, f"Plots")
    print(f"Creating output directory at {output_dir}...")

    registry = Plotter(input_dir=target_dir, output_dir=output_dir, host=HOST).run()

    return jsonify({"id": proyect_id, "output_dir": output_dir, "plots": registry})

def serve_upload(project_id):
    return send_from_directory(UPLOAD_ROOT, f"{project_id}/Plots/Final_Report.md")


def serve_plot_media(project_id, filename):
    media_dir = os.path.join(UPLOAD_ROOT, project_id, "Plots", "media")
    return send_from_directory(media_dir, filename)
