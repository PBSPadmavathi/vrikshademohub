from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend Working ✅"

@app.route("/api/ringg/agents")
def agents():
    return jsonify([
        {"id": 1, "name": "Agent 1", "agent_id": "agent-1"},
        {"id": 2, "name": "Agent 2", "agent_id": "agent-2"}
    ])

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)