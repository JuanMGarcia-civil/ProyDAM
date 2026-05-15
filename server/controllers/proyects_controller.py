import os
from datetime import datetime
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
from flask import jsonify, send_from_directory, url_for
from werkzeug.security import safe_join

from core.plotter import Plotter

UPLOAD_ROOT = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads"
)
os.makedirs(UPLOAD_ROOT, exist_ok=True)


def create():
    proyect_id = "1"
    os.makedirs(os.path.join(UPLOAD_ROOT, proyect_id), exist_ok=True)
    return jsonify({"id": proyect_id})


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

    timestamp = datetime.now().strftime("%Y-%m-%d_%H%M")
    output_dir = os.path.join(target_dir, f"Plots_{timestamp}")

    registry = Plotter(input_dir=target_dir, output_dir=output_dir).run()

    return jsonify({"id": proyect_id, "output_dir": output_dir, "plots": registry})


def serve_upload(filename):
    return send_from_directory(UPLOAD_ROOT, filename)
