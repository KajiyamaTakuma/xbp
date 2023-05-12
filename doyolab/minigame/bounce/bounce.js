let balls = [];

class Ball {
  constructor(speed = Math.random() * 3 + 1) { // Speed is now randomized between 1 and 4
    this.speed = speed;
    this.directionX = Math.random() < 0.5 ? -1 : 1;
    this.directionY = Math.random() < 0.5 ? -1 : 1;
    this.element = document.createElement('div');
    this.element.className = 'ball';
    this.element.style.backgroundColor = this.getRandomColor();

    // Ensure the new ball does not overlap with existing balls
    let x, y;
    do {
      x = Math.random() * (window.innerWidth - 50);
      y = Math.random() * (window.innerHeight - 50);
    } while (this.isOverlapping(x, y));

    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;

    document.body.appendChild(this.element);
    this.interval = setInterval(() => this.update(), 20);
    balls.push(this);
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Check if the position overlaps with existing balls
  isOverlapping(x, y) {
    for (let ball of balls) {
      let ballX = parseInt(ball.element.style.left);
      let ballY = parseInt(ball.element.style.top);
      let distance = Math.sqrt(Math.pow(x - ballX, 2) + Math.pow(y - ballY, 2));
      if (distance <= 50) {
        return true;
      }
    }
    return false;
  }

  update() {
    let x = parseInt(this.element.style.left);
    let y = parseInt(this.element.style.top);
    if (x <= 0 || x >= window.innerWidth - 50) {
      this.directionX *= -1;
    }
    if (y <= 0 || y >= window.innerHeight - 50) {
      this.directionY *= -1;
    }
    for (let ball of balls) {
      if (ball !== this) {
        let ballX = parseInt(ball.element.style.left);
        let ballY = parseInt(ball.element.style.top);
        let distance = Math.sqrt(Math.pow(x - ballX, 2) + Math.pow(y - ballY, 2));
        if (distance <= 50) {
          this.directionX *= -1;
          this.directionY *= -1;
          break;
        }
      }
    }
    this.element.style.left = `${x + this.speed * this.directionX}px`;
    this.element.style.top = `${y + this.speed * this.directionY}px`;
  }
}

document.getElementById('add-ball-button').addEventListener('click', () => {
  new Ball();
  document.getElementById('ball-count').textContent = `Balls: ${balls.length}`;
});
