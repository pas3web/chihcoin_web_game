const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/new_background.png');
    this.load.image('dog1', 'assets/dog1.png');
    this.load.image('dog2', 'assets/dog2.png');
    this.load.image('dog3', 'assets/dog3.png');
    this.load.image('dog4', 'assets/dog4.png');
}

function create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
    this.coins = this.physics.add.group();

    const coinImages = ['dog1', 'dog2', 'dog3', 'dog4'];

    for (let i = 0; i < 10; i++) {
        const x = Phaser.Math.Between(0, this.sys.game.config.width);
        const y = Phaser.Math.Between(0, this.sys.game.config.height);
        const coinImage = Phaser.Math.RND.pick(coinImages);
        const coin = this.coins.create(x, y, coinImage);
        coin.setBounce(1);
        coin.setCollideWorldBounds(true);
        coin.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function update() {
    this.coins.children.iterate(function (coin) {
        if (coin.y > window.innerHeight) {
            coin.y = 0;
            coin.x = Phaser.Math.Between(0, window.innerWidth);
        }
    });
}
