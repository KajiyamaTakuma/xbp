// ゲームオブジェクト
var game = {
  score: 0,
  highScores: [], // スコアランキングを管理するための配列
  obstacles: [],
  intervalId: null, // setIntervalの戻り値を格納するための変数
  start: function() {
    // キャンバスを取得
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    // プレイヤーオブジェクトを作成
    this.player = new Player();

    // スコアランキングを取得
    this.highScores = JSON.parse(localStorage.getItem("highScores")) || [];

    // ゲームループを開始
    this.intervalId = setInterval(updateGameArea, 20);
  },
  stop: function() {
    // ゲームループを停止
    clearInterval(this.intervalId);
    this.intervalId = null;
  },
  addScore: function() {
    // スコアを加算
    this.score++;
  },
  drawScore: function() {
    // スコアを描画
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("Score: " + this.score, 10, 30);
  },
  gameOver: function() {
    // ゲームオーバー処理
    // ゲームを停止
    this.stop();

    // スコアをランキングに追加
    this.highScores.push(this.score);
    this.highScores.sort(function(a, b) {
      return b - a;
    });
    this.highScores = this.highScores.slice(0, 5);

    // ランキングを表示
    var ranking = document.getElementById("ranking");
    ranking.innerHTML = "<h2>High Scores</h2><ol>";
    for (var i = 0; i < this.highScores.length; i++) {
      ranking.innerHTML += "<li>" + this.highScores[i] + "</li>";
    }
    ranking.innerHTML += "</ol>";

    // ゲームオーバーを表示
    var gameOver = document.getElementById("game-over");
    gameOver.style.display = "block";

    // スコアを表示
    var score = document.getElementById("score");
    score.innerHTML = this.score.toString();

    // ランキングをlocalStorageに保存
    localStorage.setItem("highScores", JSON.stringify(this.highScores));

    // リトライボタンをクリックした時にページを再読み
    var retryButton = document.getElementById("retry");
retryButton.addEventListener("click", function() {
  location.reload();});
}
};

// プレイヤーオブジェクト
function Player() {
this.x = 50;
this.y = 240;
this.speedY = 0;
this.width = 20;
this.height = 20;
this.gravity = 0.5;
this.jumpHeight = -10;
this.jumpsLeft = 3; // 制限されたジャンプ回数
this.color = "red";
}

Player.prototype.update = function() {
// 重力を加速度としてプレイ
this.speedY += this.gravity;
this.y += this.speedY;

// 画面外に出ないように調整
if (this.y > 240) {
this.y = 240;
this.jumpsLeft = 3; // 着地したらジャンプ回数をリセット
}

// プレイヤーを描画
game.ctx.fillStyle = this.color;
game.ctx.fillRect(this.x, this.y, this.width, this.height);
};

Player.prototype.jump = function() {
// ジャンプ処理
if (this.jumpsLeft > 0) { // 制限されたジャンプ回数内であればジャンプできる
this.speedY = this.jumpHeight;
this.jumpsLeft--;
}
};

// 障害物オブジェクト
function Obstacle() {
this.x = 400;
this.y = 250;
this.width = 20;
this.height = 20;
this.speedX = -2;
this.color = "green";
}

Obstacle.prototype.update = function() {
// 障害物を移動
this.x += this.speedX;

// 障害物が画面外に出たら削除
if (this.x < -20) {
game.obstacles.shift();
}

// 障害物を描画
game.ctx.fillStyle = this.color;
game.ctx.fillRect(this.x, this.y, this.width, this.height);

// プレイヤーとの衝突判定
if (this.x < game.player.x + game.player.width &&
this.x + this.width > game.player.x &&
this.y < game.player.y + game.player.height &&
this.y + this.height > game.player.y) {
game.gameOver();
}
};

// ゲームループ処理
function updateGameArea() {
// キャンバスをクリア
game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

// プレイヤーを更新
game.player.update();

// 新しい障害物を追加
if (game.obstacles.length === 0 || game.obstacles[game.obstacles.length - 1].x < 300) {
game.obstacles.push(new Obstacle());
}

// 障害物を更新
for (var i = 0; i < game.obstacles.length; i++) {
game.obstacles[i].update();
}

// スコアを描画
game.drawScore();

// スコアを加算
game.addScore();

// ジャンプ回数を表示
var jumpsLeft = document.getElementById("jumps-left");
jumpsLeft.innerHTML = "Jumps Left: " + game.player.jumpsLeft.toString();
}

// キーボード入力処理
document.addEventListener("keydown", function(event) {
if (event.code === "Space") {
game.player.jump();
}
});

// ゲーム開始
game.start();
