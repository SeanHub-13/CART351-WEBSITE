# Importing libraries
from flask import Flask, render_template, request
import json

# Makes an instance of flask
app = Flask(__name__)

# Opens and reads the masculine names, saving them to a variable
masculineNamesFile = open("static/resources/text/m_names.json", "r")
masculineNames = json.load(masculineNamesFile)
masculineNamesFile.close()

# Opens and reads the feminine names, saving them to a variable
feminineNamesFile = open("static/resources/text/f_names.json", "r")
feminineNames = json.load(feminineNamesFile)
feminineNamesFile.close()

# Route to the index page, returning the template assigned to it
@app.route('/')
def index():
    return render_template("index.html")

# Route that dumps all of the names as JSON
@app.route('/names')
def names():
    # Fits all the names into a single object to send over
    nameData = {
        "masculine": masculineNames,
        "feminine": feminineNames
    }
    
    # Returns JSON and specifies its content type
    return json.dumps(nameData), {'Content-Type': 'application/json'}

# Route that fetches players save data
@app.route('/playerSaves')
def playerSaves():
    # Opens the player save file and loads all existing players
    playersFile = open("static/saves/players.json", "r")
    currentData = json.load(playersFile)
    playersFile.close()

    # Returns the list of players as JSON
    return json.dumps(currentData), {'Content-Type': 'application/json'}

# Route that works out all of the submitted form data
@app.route('/playerData', methods=['POST'])
def playerData():
    # Logs the form data for debugging
    app.logger.info(dict(request.form))
    
    # Makes an object that holds all of the player data from the POST type form
    player = {
        "name": request.form.get("name"),
        "password": request.form.get("password"),
        "gender": request.form.get("gender"),
        "species": request.form.get("species"),
        "strength": request.form.get("strength"),
        "dexterity": request.form.get("dexterity"),
        "intelligence": request.form.get("intelligence"),
        "charisma": request.form.get("charisma"),
        "constitution": request.form.get("constitution"),
        "wisdom": request.form.get("wisdom")
    }
    
    # Loads all currently saved player data
    playersFile = open("static/saves/players.json", "r")
    currentData = json.load(playersFile)
    
    # Check if a new player's chosen name is already used, makes all name data lowercase to compare
    for currentPlayer in currentData:
        if currentPlayer["name"].lower() == player["name"].lower():
            # Logs duplicate name detection, all of this is mostly useless debug now but its a useful fall-back just in case javascript lets something stupid slide
            app.logger.info(f"Duplicate name: {player['name']}")
            return {'result': 'name taken'}
        print(currentPlayer["name"])

    # Appends the new player data to the list
    currentData.append(player)

    # Saves the updated list back to the file
    playersFile = open("static/saves/players.json", "w")
    json.dump(currentData, playersFile, indent=4)
    playersFile.close()

    return ({'result': 'data recieved'})

# Runs flask app in debug mode
app.run(debug=True)