class Button extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, callback, options = {}) {
        super(scene, x, y, texture);

        this.scene = scene;
        this.callback = callback;
        this.isPressed = false;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.body.setSize(this.width * 0.7, this.height * 0.7);
    }

    press(player) {
        if (this.isPressed) return;

        this.isPressed = true;

        this.setTint(0xaaaaaa);

        if (this.callback) {
            this.callback(player, this);
        }

    }

}