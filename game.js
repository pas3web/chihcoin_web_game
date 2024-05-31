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
let gameOver = false;
let restartButton;

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
        let x = Phaser.Math.Between(0, 800);
        let y = Phaser.Math.Between(-50, -10);  // Начальная позиция немного выше экрана
        let coin = coins.create(x, y, 'coin');
        coin.setScale(0.3);  // Уменьшаем размер монеты
        coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        coin.setVelocity(0, 200);  // Убираем горизонтальное движение, оставляем только вертикальное
    }
}

function endGame() {
    // Полностью черный фон
    this.add.rectangle(400, 300, 800, 600, 0x000000, 1.0);

    // Белая рамка вокруг текста с результатом
    this.add.rectangle(400, 275, 400, 100).setStrokeStyle(4, 0xffffff);

    // Текст с результатом
    this.add.text(400, 275, `Woooow!\nYour score - ${score}!\nCOOL!`, {
        fontSize: '32px',
        fill: '#fff',
        align: 'center',
        wordWrap: { width: 380 }
    }).setOrigin(0.5);

    // Белая рамка вокруг кнопки перезапуска
    this.add.rectangle(400, 350, 150, 50).setStrokeStyle(4, 0xffffff);

    // Кнопка перезапуска
    restartButton = this.add.text(400, 350, 'Restart', {
        fontSize: '32px',
        fill: '#fff',
        backgroundColor: '#000',
        padding: { left: 20, right: 20, top: 10, bottom: 10 }
    }).setOrigin(0.5).setInteractive();
    
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
