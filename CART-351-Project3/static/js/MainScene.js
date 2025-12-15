class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");

    }

    // ! -------------------------------------------------------------------------------------------------------- ! \\
    // ! ----------------------------------------------- PRELOAD ------------------------------------------------ ! \\
    // ! -------------------------------------------------------------------------------------------------------- ! \\

    // Preloads stuff
    preload() {
        // Loading all my images and tilemap data
        this.load.tilemapTiledJSON("map", "static/resources/text/tilemap.json");

        this.load.image("tiles", "static/resources/images/dark_spritesheet.png");

        this.load.image("player_body", "static/resources/images/knight_body.png");

        this.load.image("player_head", "static/resources/images/knight_head.png");

        this.load.image("dead_head", "static/resources/images/knight_dead_head.png");

        this.load.image("player_dead", "static/resources/images/knight_dead.png");

        this.load.image('mask', 'static/resources/images/vignette.png');

        this.load.image('button', 'static/resources/images/button_on.png');

        this.load.image('button_pressed', 'static/resources/images/button_off.png');

        this.load.image("arrow", "static/resources/images/knight_arrow.png");
    }

    // ! -------------------------------------------------------------------------------------------------------- ! \\
    // ! ------------------------------------------------ CREATE ------------------------------------------------ ! \\
    // ! -------------------------------------------------------------------------------------------------------- ! \\

    // Runs once at the start, perfect for setup
    create() {

        // Creates a Tilemap object using the loaded Tilemap data
        this.map = this.make.tilemap({ key: "map" });

        // This is the tileset I made, which tiles to use where is explained in the Tilemap JSON data
        this.tileset = this.map.addTilesetImage("dark_spritesheet", "tiles");

        // All the different layers
        this.pitsLayer = this.map.createLayer("Pits", this.tileset, 0, 0);
        this.floorLayer = this.map.createLayer("Floor", this.tileset, 0, 0);
        this.wallsLayer = this.map.createLayer("Walls", this.tileset, 0, 0);

        // Handy way of creating collisions for a whole layer from Phaser
        this.wallsLayer.setCollisionByExclusion([-1, 0]);

        // Restricts the main camera to bounds of the map
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Restricts the physics bodies to bounds of the map
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Calling helper functions
        this.vignetteSetup();
        this.playerSetup();
        this.buttonSetup();
        this.arrowSetup();
        this.deathScreen();
        this.fetchDeaths();
    }

    // ! -------------------------------------------------------------------------------------------------------- ! \\
    // ! --------------------------------------- CREATE HELPER FUNCTIONS ---------------------------------------- ! \\
    // ! -------------------------------------------------------------------------------------------------------- ! \\

    // Sends data to Python
    sendGameEvent(type, payload = {}) {
        // Creates a new FormData object for sending key–value pairs
        const form = new FormData();

        // Adds the event type, though theres only one right now
        form.append("type", type);

        // For every key–value pair, append it individually to the FormData
        for (const [k, v] of Object.entries(payload)) {
            form.append(k, v);
        }

        // Sends the FormData to the backend using fetch
        return fetch("/gameEvent", {
            // Post Method
            method: "POST",
            body: form
        })
            // Parses the response
            .then(r => r.json())
    }

    // Fetch's & visualizes deaths for now
    fetchDeaths() {
        // Sends a request to this Flask route
        fetch("/getGameEvents")
            .then(r => r.json())
            // Receives the array of objects
            .then(events => {
                // For each one
                events.forEach(e => {
                    // Makes a dead knight head image in the right location, with the right properties
                    this.add.image(e.x, e.y, "dead_head")
                        .setDepth(40)
                        .setRotation(e.headAngle + Math.PI / -2);
                });
            });
    }

    // Controls the visual part of death
    deathScreen() {
        // A few different death messages, ideally many more
        this.deathMessages = ["Your Death May Yet Bring Hope.", "May Your Allies Honor Your Sacrifice.", "Did You Accomplish Your Goals?"]

        // Picks a death message from 1 - 3 basically
        this.randomDeathMsg = Math.floor(Math.random(this.deathMessages) * 3)

        // Big red rectangle
        this.deathOverlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0xff0000)
            .setOrigin(0, 0)
            .setScrollFactor(0, 0)
            .setDepth(999)
            .setAlpha(0);

        // Is the player dead, duh
        this.isDead = false;

        // Displays the death text
        this.displayDeathText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.deathMessages[this.randomDeathMsg],
            { fontFamily: "Palatino Linotype", fontSize: 46, color: "#171717ff", stroke: "#000000", strokeThickness: 4, align: "center" }
        )
            .setOrigin(0.5)
            .setDepth(1000)
            .setScrollFactor(0)
            .setAlpha(0);
    }

    // Brings the main functionalities of death
    playerDeath() {
        // Checks so that this doesn't run more than once
        if (this.isDead) return;

        // Player is now dead :(
        this.isDead = true;

        // Sends the dead players data to Python before we destroy them
        this.sendGameEvent("death", {
            x: this.player.x,
            y: this.player.y,
            headAngle: this.headAngle
        });

        // Resets velocity
        this.player.body.setVelocityX(0);
        this.player.body.setVelocityY(0);

        // Destroy's the player body and makes them into a dead_head
        this.playerHead = this.add.image(this.player.x, this.player.y, "dead_head");
        this.player.destroy();
        this.player = null;

        // These next few bits control the opacity animations for death visuals

        this.tweens.add({
            targets: this.deathOverlay,
            alpha: 0.35,
            duration: 600,
            ease: "Linear"
        });

        this.displayDeathText.setAlpha(0);

        this.tweens.add({
            targets: this.displayDeathText,
            alpha: 1,
            duration: 300,
            ease: "Linear"
        });
    }

    // Sets up my vignette
    vignetteSetup() {
        this.vignette = this.add.renderTexture(0, 0, this.scale.width, this.scale.height);
        this.vignette.setOrigin(0, 0);
        this.vignette.setScrollFactor(0, 0);
        this.vignette.setDepth(30)
    };

    // Gives the player life
    playerSetup() {
        // The player consists of two parts - the body
        this.player = this.physics.add.sprite(1875, 1000, "player_body");
        // And the head, which tracks the body
        this.playerHead = this.add.image(this.player.x, this.player.y, "player_head");

        // Mostly unnecessary now but previously the players hitbox forced an offset
        this.headOffset = new Phaser.Math.Vector2(0, 0);

        // Angles and turn speeds
        this.headAngle = 0;
        this.bodyAngle = 0;
        this.bodyTurnSpeed = 0.05;
        this.headTurnSpeed = 0.18;

        // Collision between the player and wall colliders
        this.physics.add.collider(this.player, this.wallsLayer);

        // The camera follows the player
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

        // The player cannot leave the world
        this.player.setCollideWorldBounds(true);

        // Controls
        this.Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.Skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.Wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        // Player head is above the body
        this.playerHead.setDepth(21);
        this.player.setDepth(20);

        // This changes the collider's size a bit
        this.player.body.setSize(
            this.player.width * 0.4,
            this.player.height * 0.4
        );

        // Since it's changed, we need to change the offset
        this.player.body.setOffset(
            this.player.width * 0.3,
            this.player.height * 0.3
        );
    };

    // Adds a button group as well as all the buttons
    buttonSetup() {
        // Groups like these are useful for physics
        this.buttons = this.physics.add.group({
            classType: Button,
            immovable: true,
            allowGravity: false
        });

        // Buttons.
        this.buttons.add(
            new Button(this, 1875, 900, "button", () => {
                console.log("Arrow Shot!");
                this.arrowTrap();
            })
        );

        this.buttons.add(
            new Button(this, 1872, 3365, "button", () => {
                this.playerDeath();
            })
        );

        this.buttons.add(
            new Button(this, 2160, 3365, "button", () => {

            })
        );

        this.buttons.add(
            new Button(this, 1584, 3365, "button", () => {
                this.playerDeath();
            })
        );

        // Overlap physics enabling
        this.physics.add.overlap(
            this.player,
            this.buttons,
            (player, button) => {
                button.press(player);
            }
        );
    };

    // Mostly physics setup for arrows, also make some arrows
    arrowSetup() {
        this.arrows = this.physics.add.group({
            classType: Arrow,
            runChildUpdate: false,
            maxSize: 200
        });

        // Colliders and events for arrow interactions
        this.physics.add.collider(this.arrows, this.wallsLayer, (arrow) => {
            arrow.impact();
        });

        this.physics.add.collider(this.player, this.arrows, (player, arrow) => {
            arrow.impact();
            this.playerDeath();
        });

        this.mainArrowTraps();
    };

    // The main arrow traps
    mainArrowTraps() {
        // A looping 1 second timer
        this.arrowTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                // Creates an arrow at 0, 0 with image "arrow"
                this.arrow1 = this.arrows.get(0, 0, "arrow");
                // Teleports it to 2000, 1400, then shoots it at a -Math.PI angle, at a speed of 200
                this.arrow1.fire(2000, 1400, -Math.PI, 200);
                this.arrow2 = this.arrows.get(0, 0, "arrow");
                this.arrow2.fire(1725, 1800, Math.PI * 2, 200);
            },
            loop: true,
        });
    }

    // ! -------------------------------------------------------------------------------------------------------- ! \\
    // ! ------------------------------------------------ UPDATE ------------------------------------------------ ! \\
    // ! -------------------------------------------------------------------------------------------------------- ! \\

    // Updates
    update() {
        // Stop if dead
        if (this.isDead) return;

        this.playerControls();

        this.maskUpdate();

        this.playerRotate();

        // Mostly for testing but you can press K to die
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey("K"))) {
            this.playerDeath();
        }
    }

    // ! -------------------------------------------------------------------------------------------------------- ! \\
    // ! --------------------------------------- UPDATE HELPER FUNCTIONS ---------------------------------------- ! \\
    // ! -------------------------------------------------------------------------------------------------------- ! \\

    // Watches for player controls
    playerControls() {
        this.speed = 250;
        // console.log(this.player.x + ", " + this.player.y);

        // No sliding!
        this.player.body.setVelocity(0);

        // If I press this key, go this way
        if (this.Akey.isDown) this.player.body.setVelocityX(-this.speed);
        else if (this.Dkey.isDown) this.player.body.setVelocityX(this.speed);

        if (this.Wkey.isDown) this.player.body.setVelocityY(-this.speed);
        else if (this.Skey.isDown) this.player.body.setVelocityY(this.speed);

        // Phaser has a handy function to normalize speed
        this.player.body.velocity.normalize().scale(this.speed);
    }

    // The one arrow trap button
    arrowTrap() {
        this.newArrow = this.arrows.get(0, 0, "arrow");
        this.newArrow.fire(1875, 825, Math.PI / 2, 200);
    }

    // Updates the vignette by erasing it and making it follow the player
    maskUpdate() {
        this.vignette.clear();

        this.vignette.fill(0x000000);

        this.vignette.erase('mask', (this.player.x - 166) - this.cameras.main.scrollX, (this.player.y - 166) - this.cameras.main.scrollY);
    }

    // This controls the seperate body and head turning of the player
    playerRotate() {
        // Gets the mouse location
        this.pointer = this.input.activePointer;
        // Basically makes said pointer account for camera and game shenanigans
        this.worldPoint = this.pointer.positionToCamera(this.cameras.main);

        // Calculates the angle from the player to the mouse position
        this.targetAngle = Phaser.Math.Angle.Between(
            this.player.x,
            this.player.y,
            this.worldPoint.x,
            this.worldPoint.y
        );

        // Slowly rotates the heads current angle to the target angle based on turn speed
        this.headAngle = Phaser.Math.Angle.RotateTo(
            this.headAngle,
            this.targetAngle,
            this.headTurnSpeed
        );

        // Makes sure to account for offsets when positioning the head sprite
        this.playerHead.setPosition(
            this.player.x + this.headOffset.x,
            this.player.y + this.headOffset.y
        );

        // Basically aligns it forward towards the mouse
        this.playerHead.setRotation(this.headAngle + Math.PI / -2);


        this.vel = this.player.body.velocity;
        this.isMoving = this.vel.lengthSq() > 1;

        // If the body and head angles differ too much, the body rotates towards the head angle
        if (this.bodyAngle - this.headAngle >= 0.45 || this.bodyAngle - this.headAngle <= -0.45) {
            this.bodyAngle = Phaser.Math.Angle.RotateTo(
                this.bodyAngle,
                this.targetAngle,
                this.bodyTurnSpeed
            );
        }

        this.player.setRotation(this.bodyAngle + Math.PI / 2);

        // Retrieves the center of the player's physics body
        this.cx = this.player.body.center.x;
        this.cy = this.player.body.center.y;

        this.playerHead.setPosition(this.cx + this.headOffset.x, this.cy + this.headOffset.y);

    }
}

// ! -------------------------------------------------------------------------------------------------------- ! \\
// ! -------------------------------------------- CONFIG AND END -------------------------------------------- ! \\
// ! -------------------------------------------------------------------------------------------------------- ! \\

this.config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    backgroundColor: "#1b1b1b",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MainScene]
};

new Phaser.Game(config);
