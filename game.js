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

    coins = this.physics.add.group();

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#00ff00' });
    timerText = this.add.text(16, 48, 'Time: 30s', { fontSize: '32px', fill: '#00ff00' });

    this.input.on('pointerdown', function (pointer) {
        let x = pointer.x;
        let y = pointer.y;
        coins.children.iterate(function (child) {
            if (child.getBounds().contains(x, y)) {
                child.disableBody(true, true);
                score += 1;
                scoreText.setText('Score: ' + score);
            }
        });
    });

    timer = this.time.addEvent({
        delay: 1000,
        callback: onEvent,
        callbackScope: this,
        loop: true
    });

    this.time.addEvent({
        delay: 500,  // Интервал появления новых монет
        callback: dropCoin,
        callbackScope: this,
        loop: true
    });
}

function update() {
    if (timeLeft <= 0) {
        this.physics.pause();
        timer.remove(false);
        scoreText.setText('Game Over! Final Score: ' + score);
    }
}

function onEvent() {
    timeLeft -= 1;
    timerText.setText('Time: ' + timeLeft + 's');
}

function dropCoin() {
    if (timeLeft > 0) {
        let x = Phaser.Math.Between(0, 800);
        let y = Phaser.Math.Between(-50, -10);  // Начальная позиция немного выше экрана
        let coin = coins.create(x, y, 'coin');
        coin.setScale(0.3);  // Уменьшаем размер монеты
        coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        coin.setVelocity(Phaser.Math.Between(-100, 100), 20
