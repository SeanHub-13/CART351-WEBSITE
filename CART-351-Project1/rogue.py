# Importing the libs
import requests
# Colorama lets me use colors in text (duh.)
import colorama
# Art lets me make strings into ASCII art
import art
# This lets me use different forms of randomization
import random

# The API key / Token is an access code basically
token = "a2af25586bdde0c3263186c483372892c08c707a"

# Just the URL needed to access the API
url = "https://api.waqi.info/feed/"

# Stat dictionary for the hero
heroStats = {
    "Name": "",
    "Health": 17,
    "Damage": 3,
    "Starting Health": 17
}

# Stat dictionary for the snake monster
serpentStats = {
    "Name": "Smog Serpent",
    "Health": 3,
    "Damage": 2
}

# Stat dictionary for the mole monster
moleStats = {
    "Name": "Filth Tunneler",
    "Health": 4,
    "Damage": 2.5
}

# Stat dictionary for the current monster the hero is fighting
enemyStats = {
    "Name": "",
    "Health": 1,
    "Damage": 1
}

# A stat that just shows how many fights the hero has won - the score basically
battlesWon = 0

# ____________________________________________________________________________________________________________________________#
# ____________________________________________________________________________________________________________________________#
                                                    # ASCII STRINGS #
# ____________________________________________________________________________________________________________________________#
# ____________________________________________________________________________________________________________________________#

# These are all ASCII art I made for the project
# I made the strings raw to prevent the ASCII from breaking code and the triple quotes to allow for multiple lines
bowHero = r"""
  O  |\
 /|\_|_\
  |  | /
 / \ |/
"""

pollutionSerpent = r"""
      ___             ___
     /-_-\   _____   /-_-\
    /-_-_-\ /     \ /-_-_-\
   |-_-_-_-|   V   |-_-_-_-|
   |-_-_-_-|   O   |-_-_-_-|
    \-_-_-_| [VVV] |-_-_-_/
     \-_-_-| [VVV] |-_-_-/
      \___/ \_____/ \___/
"""

evilWorshippingMole = r"""
                        ___
     __          __\_ / ___ \ _/__          __
   /    \      /   0           0   \      /    \
   \     \ __ /                     \ __ /     /
    |                                         |
     \                                       /
      \ ----------------------------------- /
       \ _________________________________ /
"""

heroSerpent = r"""
                              ___             ___
                             /-_-\   _____   /-_-\
                            /-_-_-\ /     \ /-_-_-\
                           |-_-_-_-|   V   |-_-_-_-|
  O  |\                    |-_-_-_-|   O   |-_-_-_-|
 /|\_|_\                    \-_-_-_| [VVV] |-_-_-_/
  |  | /                     \-_-_-| [VVV] |-_-_-/
 / \ |/                       \___/ \_____/ \___/
"""

heroMole = r"""
                                               ___
                            __          __\_ / ___ \ _/__          __
                          /    \      /   0           0   \      /    \
                          \     \ __ /                     \ __ /     /
  O  |\                    |                                         |
 /|\_|_\                    \                                       /
  |  | /                     \ ----------------------------------- /
 / \ |/                       \ _________________________________ /
"""
                                         
bolt = r"""
                                                /|
                                               / /
                                              / /
                                             / /__
                                            /__  /
                                              / /
                                             / /
                                            / /
                                            |/
"""

# ____________________________________________________________________________________________________________________________#
# ____________________________________________________________________________________________________________________________#
                                                    # Functions #
# ____________________________________________________________________________________________________________________________#
# ____________________________________________________________________________________________________________________________#

# This function makes a stat sheet that shows the current stats of each character
# The plan used to be to make this a string ASCII art thingy but it was hard to format
# Also the way I was doing it didn't properly show the right stat values
def make_stat_sheet():
    print(fr"""
{heroStats['Name']}'s Stats
HP: {heroStats['Health']}
DG: {heroStats['Damage']}

{enemyStats['Name']}'s Stats
HP: {enemyStats['Health']}
DG: {enemyStats['Damage']}
""") 

# This is the function that selects battles, its called right after the intro
def battleSelect():
    # I used these to make spaces between lines
    print("")
    city = input("What city would you like to travel to?: ")
    # In other examples we used the API's search feature. but the feed let me enter any city in the world which made more sense to me
    response = requests.get(f"{url}{city}/", params={"token": token})
    results = response.json()

    # Checks that the city was found
    if results["status"] == "ok":
        # I used my random library to randomize between picking 1 and 2 to choose an enemy
        if random.randint(1,2) == 1:
            # This transfers the stats of a specific monster to the "current enemy" statblock
            enemyStats["Name"] = serpentStats["Name"]
            # This is part of how I use the weather API, a worsening air condition means a stronger monster
            enemyStats["Health"] = serpentStats["Health"] + (results["data"]["aqi"] / 4)
            enemyStats["Damage"] = serpentStats["Damage"] + (results["data"]["iaqi"]["pm25"]["v"] / 4)
    
        else:
            enemyStats["Name"] = moleStats["Name"]
            enemyStats["Health"] = moleStats["Health"] + (results["data"]["aqi"] / 4)
            enemyStats["Damage"] = moleStats["Damage"] + (results["data"]["iaqi"]["pm25"]["v"] / 4)

        # Here I call the next function in my game, and I pass 2 variables into it
        battleIntro(city, results)

    # This is what happens if the city isn't found, since the output is "Error"
    else:
        print("City not found, please try again!")
        # I know this kind of recursion isn't ideal but unless someone is spamming deliberately for at least minutes it won't matter
        battleSelect()

# This function marks the beginning of a battle
# It uses city in its string, and it passes on results to the function ahead of it
def battleIntro(city, results):
    print("")
    print(f"In {city} city, you encounter a {enemyStats['Name']}!")
    # Depending on the randomly picked enemy it prints a different image
    if enemyStats["Name"] == "Smog Serpent":
        print(heroSerpent)
    else:
        print(heroMole)
    # Here turns start getting tracked / reset, mostly for the appeal of the player
    turnNumber = 0
    # The general battleLoop (most of the game basically) is called here, and I pass 2 variables into it
    battleLoop(turnNumber, results)

# This is the battleLoop in question, and it basically keeps looping until someone dies
def battleLoop(turnNumber, results):
    # I decided to go for a while loop here because hypothetically this game can actually drag on very long and I don't want a recursive overflow
    while heroStats["Health"] > 0 and enemyStats["Health"] > 0:
        # I decide to round the health stat for all characters here, since imperfect values can make long and annoying numbers
        heroStats["Health"] = round(heroStats["Health"], 2)
        enemyStats["Health"] = round(enemyStats["Health"], 2)
        # Here is where turns are added and displayed
        turnNumber = turnNumber + 1
        print("___________________________________________________________________________________________")
        print("")
        print(f"Turn: {turnNumber}")
        print("")
        make_stat_sheet()
        print("")
        print("You can:")
        print(" 1: Attack")
        print(" 2: Heal")
        print("")

        action = input("What do you do?: ")
        # I gave the player a lot of leniency here to pick their way of input, but just reads what they wrote and decides their action
        if action == "1" or action == "Attack" or action == "attack":
            # If the player attacks, they have a 1 in 5 chance to hit a critical for double damage
            if random.randint(1,5) == 1:
                enemyStats["Health"] -= heroStats["Damage"] * 2
                print(f"You hit a crit on the {enemyStats['Name']} for {heroStats['Damage'] * 2} damage!")
            else:
                enemyStats["Health"] -= heroStats["Damage"]
                print(f"You hit the {enemyStats['Name']} for {heroStats['Damage']} damage!")
        # The player can also heal for a constant value of 3
        elif action == "2" or action == "Heal" or action == "heal":
            heroStats["Health"] += 3
            print(f"You healed for 3 health!")
        # Fallback in-case the player can't spell
        else:
            print("Input not understood, try again!")
            # Asks again
            continue
        # Checks if you killed the enemy
        if enemyStats["Health"] <= 0:
            print("")
            print(f"You defeated the {enemyStats['Name']}!")
            # Trigger for the win / rewards function
            battleWin()
            # Stops the function early if this happens
            break
        # The enemies move if its still alive
        enemyMove()
        # One way the player can die is from the monsters attack, this is for that case
        if heroStats["Health"] <= 0:
            print("")
            print(f"The {enemyStats['Name']} crushed you. Game over, {heroStats['Name']}.")
            # Leads to the final score screen
            gameOver()
            break
        # This is a function call for the air quality effects on the battle
        environmentTurn(results)
        # The other way to die is to the filth in the air, so this checks for that
        if heroStats["Health"] <= 0:
            print("")
            print(f"The deadly smog in the air quells the last of the fires in your heart. Game over, {heroStats['Name']}.")
            gameOver()
            break

# This function calculates the enemies move
def enemyMove():
    if enemyStats["Health"] > 0:
        # I found that the enemy healing too much was annoying, so I made them mostly try to hit you
        if random.randint(1,4) != 1:
            heroStats["Health"] = heroStats["Health"] - enemyStats["Damage"]
            print(f"The {enemyStats['Name']} strikes back at you, dealing {enemyStats['Damage']} damage!")
        else:
            enemyStats["Health"] = enemyStats["Health"] + 3
            print(f"The {enemyStats['Name']} roars, healing itself for 3 health!")

# This function is where the environment steps in to shake up the battle a little
def environmentTurn(results):
    # Checks if the average PM10 amount for today is over 0
    # For some reason the 3rd value in the array is for the current day so I put 2 since arrays start at 0
    if results["data"]["forecast"]["daily"]["pm10"][2]["avg"] > 0:
        # The smog hurts the hero and heals the enemy by the same amount, but I diluted the amount by dividing it by 6
        # I could set up a maximum value but I want to force players to get stronger to challenge more dangerous cities
        heroStats["Health"] = heroStats["Health"] - results["data"]["forecast"]["daily"]["pm10"][2]["avg"] / 6
        enemyStats["Health"] = enemyStats["Health"] + results["data"]["forecast"]["daily"]["pm10"][2]["avg"] / 6
        print("")
        print(f"The harsh particulate in the air hurt you for and empowered the {enemyStats['Name']} by {results['data']['forecast']['daily']['pm10'][2]['avg'] / 4}!")

# This is the function that concludes a victorious battle for the player, and gives them a nice reward to keep up progression
def battleWin():
    # Had to use this keyword since I was editing a global value
    global battlesWon
    battlesWon = battlesWon + 1
    print("")
    print("Congratulations!")
    print("")
    print("1. +3 Starting Health")
    print("2. +0.25 Attack")
    print("")
    reward = input("Pick a reward!: ")
    if reward == "1" or reward == "Health":
        heroStats["Starting Health"] = heroStats["Starting Health"] + 3
    else:
        heroStats["Damage"] = heroStats["Damage"] + 0.25
    heroStats["Health"] = heroStats["Starting Health"]
    # Rewinds back to city selection for the players next target
    battleSelect()

# Death function, the end of the game, score display
def gameOver():
    print(art.text2art("   You Died   ", space=3))
    print(art.text2art(f"   {battlesWon} kills!   ", space=3))
    
# ____________________________________________________________________________________________________________________________#
# ____________________________________________________________________________________________________________________________#
                                                    # GAME STARTS HERE #
# ____________________________________________________________________________________________________________________________#
# ____________________________________________________________________________________________________________________________#

# This starting print sets the style for the rest of the game
print(colorama.Style.BRIGHT + colorama.Back.WHITE + colorama.Fore.RED + art.text2art("   Weather   ", space=3))
print(bolt)
print(art.text2art("      Warden      ", space=3))

print("___________________________________________________________________________________________")
print("")
heroStats["Name"] = input("Welcome, hero, what is thy name?: ")
print("")
print(fr"""Hero {heroStats["Name"]}, this world reels from the damage caused to its environment,
so much so that it is no longer able to contain the monsters it has held trapped below the earth.
It is now up to you to stop them. Please, visit the cities of the world and destroy them!
But be careful, the dirtier the air in the cities you visit, the deadlier the foe...""")

# The function call that starts the game off
battleSelect()