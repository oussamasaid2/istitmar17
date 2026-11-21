from flask import Flask, jsonify, request, send_from_directory
from pathlib import Path
import csv

BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__)


@app.get("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/<path:filename>")
def assets(filename):
    return send_from_directory(BASE_DIR, filename)


@app.post("/api/inquiry")
def inquiry():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()
    phone = str(data.get("phone", "")).strip()
    service = str(data.get("service", "")).strip()
    message = str(data.get("message", "")).strip()

    if not name or not phone:
        return jsonify(error="الاسم ورقم الهاتف مطلوبان"), 400

    with (BASE_DIR / "inquiries.csv").open("a", encoding="utf-8", newline="") as file:
        csv.writer(file).writerow([name, phone, service, message])
    print("New inquiry received")
    return jsonify(ok=True)


if __name__ == "__main__":
    app.run(debug=True)