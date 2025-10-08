# Importing the libs
import requests
import colorama
import art
import random

# The API key / Token is an access code basically
token = "a2af25586bdde0c3263186c483372892c08c707a"

# Just the URL needed to access the API
url = "https://api.waqi.info/feed/"

heroStats = {
    "Name": "",
    "Health": 10,
    "Damage": 1
}

serpentStats = {
    "Name": "Smog Serpent",
    "Health": 4,
    "Damage": 2.5
}

moleStats = {
    "Name": "Filth Tunneler",
    "Health": 5,
    "Damage": 3.5
}

enemyStats = {
    "Name": "",
    "Health": 1,
    "Damage": 1
}

# ____________________________________________________________________________________________________________________________#
# ____________________________________________________________________________________________________________________________#
                                                    # ASCII STRINGS #
# ____________________________________________________________________________________________________________________________#
# ____________________________________________________________________________________________________________________________#

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

# statSheets = fr"""
# {heroStats['Name']}'s Stats
# HP: {heroStats['Health']}
# DG: {heroStats['Damage']}

# {enemyStats['Name']}'s Stats
# HP: {enemyStats['Health']}
# DG: {enemyStats['Damage']}
# """

# ____________________________________________________________________________________________________________________________#
# ____________________________________________________________________________________________________________________________#
                                                    # Functions #
# ____________________________________________________________________________________________________________________________#
# ____________________________________________________________________________________________________________________________#

def make_stat_sheet():
    print(fr"""
{heroStats['Name']}'s Stats
HP: {heroStats['Health']}
DG: {heroStats['Damage']}

{enemyStats['Name']}'s Stats
HP: {enemyStats['Health']}
DG: {enemyStats['Damage']}
""") 

def battleSelect():
    print("")
    city = input("What city would you like to travel to?: ")
    response = requests.get(f"{url}{city}/", params={"token": token})
    results = response.json()

    if results["status"] == "ok":
        if random.randint(1,2) == 1:
            enemyStats["Name"] = serpentStats["Name"]
            enemyStats["Health"] = serpentStats["Health"]
            enemyStats["Damage"] = serpentStats["Damage"]
    
        else:
            enemyStats["Name"] = moleStats["Name"]
            enemyStats["Health"] = moleStats["Health"]
            enemyStats["Damage"] = moleStats["Damage"]

        battleIntro(city)

    else:
        print("City not found, please try again!")
        battleSelect()

def battleIntro(city):
    print("")
    print(f"In {city} city, you encounter a {enemyStats['Name']}!")
    if enemyStats["Name"] == "Smog Serpent":
        print(heroSerpent)
    else:
        print(heroMole)
    make_stat_sheet()



# ____________________________________________________________________________________________________________________________#
# ____________________________________________________________________________________________________________________________#
                                                    # GAME STARTS HERE #
# ____________________________________________________________________________________________________________________________#
# ____________________________________________________________________________________________________________________________#

print(colorama.Style.BRIGHT + colorama.Back.WHITE + colorama.Fore.RED + art.text2art("   Weather   ", space=3))
print(bolt)
print(colorama.Style.BRIGHT + colorama.Back.WHITE + colorama.Fore.RED + art.text2art("      Warden      ", space=3))

print("___________________________________________________________________________________________")
print("")
heroStats["Name"] = input("Welcome, hero, what is thy name?: ")
print("")
print(fr"""Hero {heroStats["Name"]}, this world reels from the damage caused to its environment,
so much so that it is no longer able to contain the monsters it has held trapped below the earth.
It is now up to you to stop them. Please, visit the cities of the world and destroy them!""")

battleSelect()