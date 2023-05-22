var gauge = document.getElementById("gauge-fill");
var gaugeMax = 800; // 追加
var gaugeValue = gaugeMax; // Start at max
var score = 0;
var enemies = [];
var maxEnemies = 20;
var timeStop = false;
var gameOver = false;
var spacePressed = false;
var spawnRate = 1000; // start spawn rate
var speedMultiplier = 1; // start speed multiplier
var retryButton = document.getElementById("retry-button");


// Check if the local storage has leaderboard data
var leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

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
  spawnRate = Math.max(200, spawnRate - 300); // decrease spawn rate, minimum is 0.2 seconds
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
        retryButton.style.display = "block";  // Show the retry button
        // When game over, save the score to the leaderboard
        leaderboard.push(score);
        // Sort the leaderboard in descending order and keep only the top 10 scores
        leaderboard.sort(function(a, b) { return b - a; });
        leaderboard = leaderboard.slice(0, 10);
        // Save the leaderboard back to the local storage
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        // Update the leaderboard display
        var leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';
        for (var i = 0; i < leaderboard.length; i++) {
          var listItem = document.createElement('li');
          listItem.textContent = leaderboard[i];
          leaderboardList.appendChild(listItem);
        }
        return;
      }
    }
  }

  if (!timeStop || !spacePressed) {
    // Increase the gauge value faster
    gaugeValue += 5;
    if (gaugeValue > 800) {
      gaugeValue = 800;
    }
  } else if (spacePressed) {
    // Decrease the gauge value while space is pressed
    gaugeValue -= 10;
    if (gaugeValue < 0) {
      gaugeValue = 0;
      timeStop = false;
    }
  }
  gauge.style.width = gaugeValue +"px";
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

// Add event listener to the retry button
retryButton.addEventListener("click", function() {
  // Reset game state
  enemies.forEach(enemy => enemy.div.remove());
  enemies = [];
  score = 0;
  document.getElementById("score").textContent = "スコア: " + score;
  gaugeValue = gaugeMax;
  document.getElementById("gauge-fill").style.width = gaugeValue + "px";
  gameOver = false;
  retryButton.style.display = "none";  // Hide the retry button

  // Restart the game loop
  updateGame();
});

// Start the game
updateGame();