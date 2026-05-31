"""Test unitario de Plotter.run() usando los archivos reales de core/inputs.

run() lee core/inputs/plot_config.xlsx, omite las hojas cuyo nombre contiene
una SKIP_KEYWORD ("skip", ...) y genera un PNG por fila + un CSV, un DOCX y un MD.
"""
import os
import sys
from pathlib import Path

import pytest

SERVER_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SERVER_DIR))

from core.plotter import Plotter  # noqa: E402

INPUTS = SERVER_DIR / "core" / "inputs"
HOST = "http://localhost:5000"

# Las 3 hojas de plot_config.xlsx sin SKIP_KEYWORD en el nombre.
EXPECTED_SHEETS = {
    "TypicalSection",
    "TypicalSection_Invert_sides",
    "TypicalSection_Invert_central",
}
EXPECTED_PLOTS = 18  # 3 hojas x 6 filas con Graph_Title


@pytest.fixture(scope="module")
def result(tmp_path_factory):
    """Ejecuta run() una sola vez (genera 18 graficos) y comparte el resultado."""
    # output_dir bajo 'uploads/.../Plots' para que se reescriban las URLs del MD.
    output_dir = tmp_path_factory.mktemp("run") / "uploads" / "1" / "Plots"
    plotter = Plotter(input_dir=str(INPUTS), output_dir=str(output_dir), host=HOST)
    registry = plotter.run()
    return registry, str(output_dir)


def test_run_returns_one_entry_per_plotted_row(result):
    registry, _ = result
    assert len(registry) == EXPECTED_PLOTS
    for entry in registry:
        assert set(entry.keys()) == {"Sheet", "File Name", "Description"}


def test_run_skips_sheets_with_skip_keyword(result):
    registry, _ = result
    assert {entry["Sheet"] for entry in registry} == EXPECTED_SHEETS


def test_run_writes_a_png_for_each_entry(result):
    registry, output_dir = result
    for entry in registry:
        png_path = os.path.join(output_dir, entry["File Name"])
        assert os.path.isfile(png_path)
    pngs = [f for f in os.listdir(output_dir) if f.endswith(".png")]
    assert len(pngs) == EXPECTED_PLOTS


def test_run_writes_report_files(result):
    _, output_dir = result
    for name in ("Summary_List.csv", "Final_Report.docx", "Final_Report.md"):
        assert os.path.isfile(os.path.join(output_dir, name))


def test_run_absolutizes_image_urls_in_markdown(result):
    _, output_dir = result
    md = Path(output_dir, "Final_Report.md").read_text(encoding="utf-8")
    assert f'src="{HOST}/uploads/1/Plots/media/' in md


def test_run_returns_empty_when_config_missing(tmp_path):
    empty_input = tmp_path / "empty"
    empty_input.mkdir()
    plotter = Plotter(input_dir=str(empty_input), output_dir=str(tmp_path / "out"))
    assert plotter.run() == []
