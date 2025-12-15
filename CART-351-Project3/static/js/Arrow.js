class Arrow extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture = "arrow") {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(false);
        this.setVisible(false);

        this.setDepth(5);
        this.body.setAllowGravity(false);

        this.body.onWorldBounds = true;

        this.body.setBounce(0);

        this.body.setSize(this.width * 0.5, this.height);
    }

    fire(x, y, angleRadians, speed = 800) {
        this.setPosition(x, y);
        this.setRotation(angleRadians + Math.PI);

        this.setActive(true);
        this.setVisible(true);

        this.scene.physics.velocityFromRotation(angleRadians, speed, this.body.velocity);
        return this;
    }

    impact() {
        this.destroy();
    }
}
