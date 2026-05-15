from flask import Flask, render_template, request
from flask_cors import CORS

from controllers import openapi_controller, proyects_controller

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return render_template("upload.html")


@app.route("/openapi.json")
def openapi_spec():
    return openapi_controller.get_spec()


@app.route("/docs")
def swagger_ui():
    return openapi_controller.get_docs()


@app.route("/proyects", methods=["POST"])
def create_proyect():
    return proyects_controller.create()


@app.route("/proyects/<proyect_id>/upload", methods=["POST"])
def upload_files(proyect_id):
    return proyects_controller.upload(proyect_id, request.files.getlist("files"))


@app.route("/proyects/<proyect_id>/execute_plots", methods=["POST"])
def execute_plots(proyect_id):
    return proyects_controller.execute_plots(proyect_id)


@app.route("/uploads/<path:filename>")
def serve_upload(filename):
    return proyects_controller.serve_upload(filename)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
