from dotenv import load_dotenv
import os
from flask import Flask, render_template, request
from flask_pymongo import PyMongo
import json

# Loads .env file stuff
load_dotenv()

# Reads MongoDB environment variables
db_user = os.getenv("MONGODB_USER")
db_pass = os.getenv("DATABASE_PASSWORD")
db_name = os.getenv("DATABASE_NAME")

# Makes the whole connection line
uri = f"mongodb+srv://{db_user}:{db_pass}@chimaeracluster1.tkgkvjk.mongodb.net/{db_name}?retryWrites=true&w=majority"


app = Flask(__name__)

# It's a secret key.
app.secret_key = "BAD_SECRET_KEY"

# Stores the uri in Flask config
app.config["MONGO_URI"] = uri

# Initializes MongoDB
mongo = PyMongo(app)

# Home Page Route
@app.route("/")
def index():
    return render_template("index.html")

# Route for fetching JS game events
@app.route("/gameEvent", methods=["POST"])
def gameEvent():
    # Converts incoming data into a Python compatible dialogue
    data = request.form.to_dict(flat=True)

    # MongoDB stores as strings, tries to turn them into floats (because there could be decimals)
    for k in ("x", "y", "headAngle"):
        if k in data:
            try:
                data[k] = float(data[k])
            except ValueError:
                pass

    # Sends the data to the MongoDB storage
    result = mongo.db.gameStorage.insert_one(data)
    return {"result": "ok", "id": str(result.inserted_id)}

# Route for fetching stored variables from MongoDB
@app.route("/getGameEvents", methods=["GET"])
def getGameEvents():
    # Queries MongoDB for data, excludes the _id field because I don't need it and it looks nicer like this
    cursor = mongo.db.gameStorage.find({}, {"_id": 0})

    events = list(cursor)

    print("GAME EVENTS:")
    for e in events:
        print(e)

    # Returns the events as JSON
    return json.dumps(events), {"Content-Type": "application/json"}
    

app.run(debug=True)