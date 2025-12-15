class Button extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, callback, options = {}) {
        super(scene, x, y, texture);

        this.scene = scene;

        // Stores the function to call when the button is pressed
        this.callback = callback;

        this.isPressed = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Pretty important for a fake tile
        this.body.setImmovable(true);

        this.body.setAllowGravity(false);

        // Makes the hitbox fit the button perfectly
        this.body.setSize(this.width * 0.7, this.height * 0.7);
    }

    // If pressed by a player
    press(player) {
        // Stops the button from being pressed many times
        if (this.isPressed) return;

        this.isPressed = true;

        // Makes it darker
        this.setTint(0xaaaaaa);

        // If a callback function was provided, call it with context
        if (this.callback) {
            this.callback(player, this);
        }
    }
}
