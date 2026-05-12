from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import sum

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({
        "message": "API funcionando 🚀"
    })

@app.route("/sumar", methods=["POST"])
def sumar():
    data = request.get_json()

    a = data.get("a", 0)
    b = data.get("b", 0)

    resultado = sum(a, b)

    return jsonify({
        "resultado": resultado
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
