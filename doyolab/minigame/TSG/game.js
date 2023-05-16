var gauge = document.getElementById("gauge-fill");
var gaugeValue = 800; // Start at max
var score = 0;
var enemies = [];
var maxEnemies = 10;
var timeStop = false;
var gameOver = false;
var spacePressed = false;
var spawnRate = 1000; // start spawn rate
var speedMultiplier = 1; // start speed multiplier

// Spawn an enemy at random intervals
setInterval(function() {
  if (!gameOver && enemies.length < maxEnemies) {
    var enemy = { div: null, x: 800, y: Math.random() * 350, speed: 2 * speedMultiplier };
    enemy.div = document.createElement("div");
    enemy.div.className = "enemy";
    enemy.div.addEventListener("click", function() {
      if (timeStop) {
        score++;
        document.getElementById("score").textContent = "Score: " + score;
        enemy.div.remove();
        enemies = enemies.filter(e => e !== enemy);
      }
    });
    document.getElementById("game").appendChild(enemy.div);
    enemies.push(enemy);
  }
}, spawnRate); 

// Update spawn rate and speed multiplier over time
setInterval(function() {
  spawnRate = Math.max(10, spawnRate - 1000); // decrease spawn rate, minimum is 0.2 seconds
  speedMultiplier += 0.01; // increase speed multiplier
}, 1000);

function updateGame() {
  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    // Move the enemy
    if (!timeStop) {
      enemy.x -= enemy.speed;
    }
    enemy.div.style.left = enemy.x + "px";
    enemy.div.style.top = enemy.y + "px";
    if (enemy.x < 0) {
      enemy.div.remove();
      enemies = enemies.filter(e => e !== enemy);
      if (!timeStop) {
        gameOver = true;
        document.getElementById("score").textContent += " Game Over!";
        return;
      }
    }
  }

  if (!timeStop || !spacePressed) {
    // Increase the gauge value faster
    gaugeValue += 1;
    if (gaugeValue > 800) {
      gaugeValue = 800;
    }
  } else if (spacePressed) {
    // Decrease the gauge value while space is pressed
    gaugeValue -= 5;
    if (gaugeValue < 0) {
      gaugeValue = 0;
      timeStop = false;
    }
  }
  gauge.style.width = gaugeValue + "px";

  // Schedule the next update
  setTimeout(updateGame, 20);
}

// Listen for the space key
window.addEventListener("keydown", function (event) {
  if (event.code === "Space" && gaugeValue > 0 && !gameOver) {
    timeStop = true;
    spacePressed = true;
  }
});

window.addEventListener("keyup", function (event) {
  if (event.code === "Space") {
    spacePressed = false;
    timeStop = false; // Time resumes when space key is released
  }
});

// Start the game
updateGame();
