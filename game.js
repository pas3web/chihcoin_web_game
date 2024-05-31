const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

let coins;
let score = 0;
let scoreText;
let timer;
let timeLeft = 30;
let timerText;

function preload() {
    this.load.image('coin', 'assets/chihcoin.png');
    this.load.image('background', 'assets/background.png');
}

function create() {
    this.add.image(400, 300, 'background');

    coins =
