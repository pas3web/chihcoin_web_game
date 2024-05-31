const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
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
let gameOver = false;
let restartButton;

function preload() {
    this.load.image('coin', 'assets/chihcoin.png');
    this.load.image('background', 'assets/background.png');
}

function create() {
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'background').setDisplaySize(this.scale.width, this.scale.height);

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
    if (timeLeft <= 0 && !gameOver) {
        this.physics.pause();
        timer.remove(false);
        endGame.call(this);
        gameOver = true;
    }
}

function onEvent() {
    timeLeft -= 1;
    timerText.setText('Time: ' + timeLeft + 's');
}

function dropCoin() {
    if (timeLeft > 0) {
        let x = Phaser.Math.Between(0, this.scale.width);
        let y = Phaser.Math.Between(-50, -10);  // Начальная позиция немного выше экрана
        let coin = coins.create(x, y, 'coin');
        coin.setScale(0.3);  // Уменьшаем размер монеты
        coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        coin.setVelocity(0, 200);  // Убираем горизонтальное движение, оставляем только вертикальное
    }
}

function endGame() {
    // Полностью черный фон
    let bg = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 1.0);
    bg.setOrigin(0.5, 0.5);

    // Текст с результатом
    let resultText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, `Woooow!\nYour score - ${score}!\nCOOL!`, {
        fontSize: '32px',
        fill: '#fff',
        align: 'center'
    });
    resultText.setOrigin(0.5);

    // Кнопка перезапуска
    restartButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Restart', {
        fontSize: '32px',
        fill: '#fff',
        align: 'center'
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive();

    restartButton.on('pointerdown', () => {
        this.scene.restart();
        resetGame();
    });
}

function resetGame() {
    score = 0;
    timeLeft = 30;
    gameOver = false;
}
