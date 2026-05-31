from flask import Flask, render_template, request
from flask_cors import CORS

from controllers import openapi_controller, proyects_controller

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers="*",
    expose_headers="*",
    supports_credentials=False,
)


@app.route("/")
def home():
    return render_template("upload.html")


@app.route("/openapi.json")
def openapi_spec():
    return openapi_controller.get_spec()


@app.route("/docs")
def swagger_ui():
    return openapi_controller.get_docs()


@app.route("/proyects/<proyect_id>", methods=["DELETE"])
def delete_proyect(proyect_id):
    return proyects_controller.delete(proyect_id)


@app.route("/proyects/<proyect_id>/upload", methods=["POST"])
def upload_files(proyect_id):
    return proyects_controller.upload(proyect_id, request.files.getlist("files"))


@app.route("/proyects/<proyect_id>/execute_plots", methods=["POST"])
def execute_plots(proyect_id):
    return proyects_controller.execute_plots(proyect_id)


@app.route("/uploads/<project_id>", methods=["GET"])
def serve_upload(project_id):
    return proyects_controller.serve_upload(project_id)


@app.route("/uploads/<project_id>/Plots/media/<path:filename>", methods=["GET"])
def serve_plot_media(project_id, filename):
    return proyects_controller.serve_plot_media(project_id, filename)


@app.route("/uploads/<project_id>/Plots/Final_Report.docx", methods=["GET"])
def serve_final_report(project_id):
    return proyects_controller.serve_final_report(project_id)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
