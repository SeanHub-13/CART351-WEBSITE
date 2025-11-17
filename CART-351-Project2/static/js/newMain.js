// ---------------- GLOBAL STATE ---------------- //

// Most of this stuff is initiated here so that its always available and isn't seen as undefined

// Name arrays
let maleNames = [];
let femaleNames = [];

// Login data
let loginData = [];

// Weighted stat values used for random generation
const statWeights = [1, 2, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 12, 12, 12, 13, 13, 13, 14, 14, 14, 15, 15, 16, 16, 17, 17, 18, 19, 20];

// Array that features data of current entities spawned
let currentEntities = [];

// ---------------- INIT ---------------- //

// Upon load of the window
window.addEventListener("load", async () => {

    // Gets the names through the flask route
    const responseNames = await fetch('/names');
    const nameData = await responseNames.json();
    console.log(nameData);

    // Stores them globally
    maleNames = nameData.masculine;
    femaleNames = nameData.feminine;

    // Gets previously saved players
    const responseLogins = await fetch('/playerSaves');
    loginData = await responseLogins.json();
    console.log(loginData);

    // Builds UI
    initGameUI();
    console.log("Boot Complete");
});

// ---------------- ENTITY CREATION ---------------- //

// Creates a randomized entity
function createEntity() {
    const gender = randomGender();
    const name = randomName(gender);
    const species = randomSpecies();

    return {
        gender,
        name,
        species,
        stats: randomStats()
    };
}

// Picks a random gender
function randomGender() {
    const genders = ["Male", "Female", "Non-Binary", "Genderfluid", "Agender"];
    return genders[Math.floor(Math.random() * genders.length)];
}

// Picks a random name based on gender
function randomName(gender) {
    let pool = [];

    if (gender === "Male") {
        pool = maleNames;
    } else if (gender === "Female") {
        pool = femaleNames;
    } else {
        // Nonbinary characters take names from either list
        pool = [...maleNames, ...femaleNames];
    }

    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
}

// Picks a random species
function randomSpecies() {
    const species = ["Human", "Elf", "Dwarf", "Gnome", "Orc"];
    return species[Math.floor(Math.random() * species.length)];
}

// Randomizes stats
function randomStats() {
    return {
        strength: rand20(),
        dexterity: rand20(),
        intelligence: rand20(),
        charisma: rand20(),
        constitution: rand20(),
        wisdom: rand20()
    };
}

// Weighted randomizer
function rand20() {
    return statWeights[Math.floor(Math.random() * statWeights.length)];
}

// ---------------- UI SETUP ---------------- //

function initGameUI() {

    // ---------------- BASIC LAYOUT ---------------- //

    // Creates the base W2UI layout, making the left sidebar and the main screen

    new w2layout({
        box: "#layout",
        name: "innerGameLayout",
        panels: [
            { type: "left", size: "16.6%", style: "background-color:#1b1b1b; color:#ddd;", content: "Left Panel" },
            { type: "main", style: "background-color:#222;", content: w2ui.centralLayout },
        ]
    });

    // Replaces main panel content with a customized divider to hold content
    w2ui["innerGameLayout"].html(
        "main",
        `<div id="centralLayout" style="width: 100%; height: 100%;"></div>`
    );

    // ---------------- CHOICE BAR / MAIN VIEW ---------------- //

    // Seperates the main panel into the main panel + bottom panel
    new w2layout({
        box: "#centralLayout",
        name: "centralLayout",
        panels: [
            { type: "main", style: "background-color:#222; color:#eee; padding-top:5vh; padding-bottom:5vh; padding-left:10vh; padding-right:10vh;", content: "Main Panel" },
            { type: "bottom", size: "25%", style: "background-color:#181818; color:#ccc;", content: "Bottom Panel" }
        ]
    });

    // Spits out a character creation form in the main box
    w2ui["centralLayout"].html(
        "main",
        `
        <div id="main-div">
            <div>
                <p class="main-text" id="welcome-text">
                    Create new character here, otherwise look to the left to enter name & password!
                </p>
            </div>
            <div class="standard-layout">
                <form>
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name">
                    <br><br>
                    <label for="password">Password:</label>
                    <input type="text" id="password" name="password">
                    <br><br>
                    <label for="gender">Gender:</label>
                    <select name="gender" id="gender">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-Binary</option>
                        <option value="genderfluid">Genderfluid</option>
                        <option value="agender">Agender</option>
                    </select>
                    <br><br>
                    <label for="species">Species:</label>
                    <select name="species" id="species">
                        <option value="human">Human</option>
                        <option value="elf">Elf</option>
                        <option value="dwarf">Dwarf</option>
                        <option value="gnome">Gnome</option>
                        <option value="orc">Orc</option>
                    </select>
                    <br><br>
                    <label>Starting Stats:</label>
                    <br><br>
                    <label for="strength">Strength:</label>
                    <select class="stat-pick" id="strength">
                        <option value="unchosen">Choose one</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                    </select>
                    <br><br>
                    <label for="dexterity">Dexterity:</label>
                    <select class="stat-pick" id="dexterity">
                        <option value="unchosen">Choose one</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                    </select>
                    <br><br>
                    <label for="intelligence">Intelligence:</label>
                    <select class="stat-pick" id="intelligence">
                        <option value="unchosen">Choose one</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                    </select>
                    <br><br>
                    <label for="charisma">Charisma:</label>
                    <select class="stat-pick" id="charisma">
                        <option value="unchosen">Choose one</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                    </select>
                    <br><br>
                    <label for="constitution">Constitution:</label>
                    <select class="stat-pick" id="constitution">
                        <option value="unchosen">Choose one</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                    </select>
                    <br><br>
                    <label for="wisdom">Wisdom:</label>
                    <select class="stat-pick" id="wisdom">
                        <option value="unchosen">Choose one</option>
                        <option value="8">8</option>
                        <option value="10">10</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                    </select>
                    <br><br>
                    <button id="submit-character" class="button" type="button">Submit</button>
                </form>
            </div>
        </div>
        `
    );

    // Gets all stat dropdown menus
    const selects = document.querySelectorAll('.stat-pick');

    // Function to update options based on what has already been picked
    function updateOptions() {

        // Array that holds chosen values
        const chosen = [];

        // Collect chosen values
        selects.forEach(selection => {
            if (selection.value) chosen.push(selection.value);
        });

        // Hides said options in other places if already picked
        selects.forEach(selection => {
            const current = selection.value;
            selection.querySelectorAll('option').forEach(option => {
                // Checks if option.value exists
                if (!option.value) return;

                let hide = false;

                // checks if the option value matches a chosen value and hides it if so
                for (let i = 0; i < chosen.length; i++) {
                    if (chosen[i] === option.value && option.value !== current) {
                        hide = true;
                        break;
                    }
                }
                option.hidden = hide;
            });
        });
    }

    // Attach's change listeners
    selects.forEach(selection => {
        selection.addEventListener('change', updateOptions);
    });

    updateOptions();

    // Function that grabs submitted character values
    function characterSubmit() {
        const characterButton = document.querySelector("#submit-character");
        let welcomeText = document.querySelector("#welcome-text");

        // On-click of submit button record all player data
        characterButton.addEventListener("click", function () {
            playerNameInput = document.querySelector("#name").value;
            playerPassInput = document.querySelector("#password").value;
            playerGenderInput = document.querySelector("#gender").value;
            playerSpeciesInput = document.querySelector("#species").value;
            playerStrInput = document.querySelector("#strength").value;
            playerDexInput = document.querySelector("#dexterity").value;
            playerIntInput = document.querySelector("#intelligence").value;
            playerChaInput = document.querySelector("#charisma").value;
            playerConInput = document.querySelector("#constitution").value;
            playerWisInput = document.querySelector("#wisdom").value;

            // Validates name
            if (playerNameInput.length != 0) {
                // Validates password exists
                if (playerPassInput.length != 0) {
                    // Validates stat inputs
                    if (
                        playerStrInput != "unchosen" &&
                        playerDexInput != "unchosen" &&
                        playerIntInput != "unchosen" &&
                        playerChaInput != "unchosen" &&
                        playerConInput != "unchosen" &&
                        playerWisInput != "unchosen") {

                        // This is why the python validation is a backup now
                        for (let i = 0; i < loginData.length; i++) {
                            if (loginData[i].name === playerNameInput) {
                                welcomeText.innerText = "Name already taken!";
                                return;
                            };
                        };

                        // FormData for POST request
                        let playerData = new FormData();
                        playerData.append("name", playerNameInput);
                        playerData.append("password", playerPassInput);
                        playerData.append("gender", playerGenderInput);
                        playerData.append("species", playerSpeciesInput);
                        playerData.append("strength", playerStrInput);
                        playerData.append("dexterity", playerDexInput);
                        playerData.append("intelligence", playerIntInput);
                        playerData.append("charisma", playerChaInput);
                        playerData.append("constitution", playerConInput);
                        playerData.append("wisdom", playerWisInput);

                        // Sends to backend
                        fetch("/playerData", {
                            method: "POST",
                            body: playerData,
                        })

                        // Updates client-side database to make sure player can log in immediately
                        loginData.push({
                            "name": playerNameInput,
                            "password": playerPassInput,
                            "gender": playerGenderInput,
                            "species": playerSpeciesInput,
                            "strength": playerStrInput,
                            "dexterity": playerDexInput,
                            "intelligence": playerIntInput,
                            "charisma": playerChaInput,
                            "constitution": playerConInput,
                            "wisdom": playerWisInput
                        })

                        console.log(loginData)

                        // Changes the main box to show a welcome message to the player and their character
                        let mainDiv = document.querySelector("#main-div");
                        mainDiv.innerHTML = `
                        <div class="standard-layout">
                        <p class="main-text">
                        <span style="color: rgba(194, 173, 41, 1);">${playerNameInput}</span> has been welcomed.
                        <br>
                        Login on the left.
                        </p>
                        </div>
                        `

                    }
                    else {
                        welcomeText.innerText = "You have unchosen stats!"
                    }
                }
                else {
                    welcomeText.innerText = "Must have a password!"
                }
            }
            else {
                welcomeText.innerText = "Must have a name!"
            }

            // console.log(`
            //     Name: ${playerNameInput},
            //     Password: ${playerPassInput},
            //     Gender: ${playerGenderInput},
            //     Species: ${playerSpeciesInput},
            //     Strength: ${playerStrInput},
            //     Dexterity: ${playerDexInput},
            //     Intelligence: ${playerIntInput},
            //     Charisma: ${playerChaInput},
            //     Constitution: ${playerConInput},
            //     Wisdom: ${playerWisInput}
            //     `);
        });
    }

    characterSubmit();

    // Creates a custom divider in the left sublayout
    w2ui["innerGameLayout"].html(
        "left",
        `<div id="leftSubLayout" style="width:100%; height:100%;"></div>`
    );

    // ---------------- LEFT SUB-PANELS ---------------- //

    // Seperates the top and main layouts in the left section
    new w2layout({
        box: "#leftSubLayout",
        name: "leftSubLayout",
        panels: [
            { type: "top", size: "10%", style: "background-color:#292929ff; color:#eee; border-color:transparent;", content: "Top Sub-panel" },
            { type: "main", style: "background-color:#1b1b1b; color:#fff; border-color:transparent;", content: "Bottom Sub-panel" }
        ]
    });

    // Meant to be the title of current page basically, starts with the name of the game
    w2ui["leftSubLayout"].html(
        "top",
        `<div class="standard-layout" style="padding: 0; margin: 1em">
            <p class="main-text" id="title-text">The Grand Corridor of Infinite Encounters</p>
        </div>`
    );

    // Creates the login section in the left sidebar
    w2ui["leftSubLayout"].html(
        "main",
        `<div id="left-layout" class="standard-layout">
            <p>Stats</p>
            <br><br>
            <p>Have a Character? Login here!</p>
            <br>
            <form>
            <label for="name">Name:</label>
            <input type="text" id="name-login" name="name">
            <br><br>
            <label for="password">Password:</label>
            <input type="text" id="password-login" name="password">
            <br><br>
            <button id="submit-login" class="button" type="button">Login</button>
            </form>
        </div>
        `
    );

    // Function that checks login information
    function checkLogin() {
        const loginButton = document.querySelector("#submit-login");

        // On-click of login button compare submitted login data & respond respectively
        loginButton.addEventListener("click", function () {
            let loginName = document.querySelector("#name-login").value;
            let loginPassword = document.querySelector("#password-login").value;
            let found = false;

            // For every stored login
            loginData.forEach(playerLogin => {
                // Check if the name matches one thats known
                if (playerLogin.name === loginName) {
                    found = true;
                    // Check if the password is correct
                    if (playerLogin.password === loginPassword) {
                        console.log("Login successful!");
                        // Pass the players data into the loading function
                        playerLoad(playerLogin);
                    } else {
                        console.log("Wrong Password!");
                    }
                }
            })
            // In-case theres no matching login data
            if (!found) {
                console.log("No Matching Name!");
            }
        });
    };

    checkLogin();

    // Displays the players data and brings them to the starting loop
    function playerLoad(loggedPlayer) {
        let titleText = document.querySelector("#title-text");
        let leftDiv = document.querySelector("#left-layout");
        let mainDiv = document.querySelector("#main-div");

        // Display the player's name in place of the title area
        titleText.innerText = loggedPlayer.name;

        // Display the players stat panel
        leftDiv.innerHTML = `
            <p class="main-text">
                Your stats
                <br><br>
                Gender: ${loggedPlayer.gender}
                <br>
                Species: ${loggedPlayer.species}
                <br><br>
                Strength: ${loggedPlayer.strength}
                <br>
                Dexterity: ${loggedPlayer.dexterity}
                <br>
                Intelligence: ${loggedPlayer.intelligence}
                <br>
                Charisma: ${loggedPlayer.charisma}
                <br>
                Constitution: ${loggedPlayer.constitution}
                <br>
                Wisdom: ${loggedPlayer.wisdom}
            </p>
        `;

        // Loop room text
        mainDiv.innerHTML = `
        <div class="standard-layout">
            <p class="main-text" id="welcome-text">
                A lightbulb <span style="color: rgb(193, 43, 73);">flickers</span>, then clicks <span style="color: rgba(82, 59, 72, 1);">off</span>, before turning back <span style="color: rgba(249, 106, 106, 1);">on</span> with a sudden <span style="font-style: italic; color: rgba(89, 215, 168, 1);">ZAP</span>.
                <br>
                You find yourself in a cramped, dark, hallway. Others surround you.
                <br>
                A sense of <span style="color: rgba(119, 176, 106, 1);">Deja Vu</span> flows through you.
            </p>
            <div class="standard-layout" id="room-div" style="flex-direction: row;">
            </div>
        </div>
        `;

        let roomDiv = document.querySelector("#room-div");

        // Creates 1 - 3 entities and displays them for the player
        for (let j = 0; j < Math.ceil(Math.random() * 3); j++) {

            // Creates the new entity
            let newEntity = createEntity();

            // Pushes its data into the entity array
            currentEntities.push(newEntity);

            // Displays the data of current entity inside its own little div
            roomDiv.innerHTML = roomDiv.innerHTML + `
            <div class="encounter">
                <p class="main-text">
                Name: ${currentEntities[j].name}
                <br>
                Gender: ${currentEntities[j].gender}
                <br>
                Species: ${currentEntities[j].species}
                <br><br>
                Strength: ${currentEntities[j].stats.strength}
                <br>
                Dexterity: ${currentEntities[j].stats.dexterity}
                <br>
                Intelligence: ${currentEntities[j].stats.intelligence}
                <br>
                Charisma: ${currentEntities[j].stats.charisma}
                <br>
                Constitution: ${currentEntities[j].stats.constitution}
                <br>
                Wisdom: ${currentEntities[j].stats.wisdom}
                </p>
            </div>
            `
        }
    };

    // document.querySelector("#options-button").addEventListener("click", () => {
    //     w2popup.open({
    //         title: "Options & Settings",
    //         body: "<div class='menu-center'><div class='choice'><p>Dark Theme</p><input type='checkbox' class='check-input'></div></div>",
    //         width: 500,
    //         height: 300,
    //         actions: {
    //             "Accept Changes": () => w2popup.close(),
    //             "Cancel Changes": () => w2popup.close()
    //         }
    //     });
    // });

}