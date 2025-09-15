class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // 游戏状态
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        
        // 速度控制
        this.speedLevel = 5; // 1-10，默认5
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        
        // 蛇的初始状态
        this.snake = [
            {x: 10, y: 10}
        ];
        this.dx = 0;
        this.dy = 0;
        
        // 食物位置
        this.food = this.generateFood();
        
        // 绑定事件
        this.bindEvents();
        this.updateDisplay();
        this.updateSpeedDisplay();
        this.draw();
    }
    
    bindEvents() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            // 允许在游戏开始前设置方向，或者游戏运行时控制方向
            if (!this.gameRunning && e.code !== 'Space' && !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) return;
            
            switch(e.code) {
                case 'ArrowUp':
                    if (this.dy !== 1) {
                        this.dx = 0;
                        this.dy = -1;
                    }
                    break;
                case 'ArrowDown':
                    if (this.dy !== -1) {
                        this.dx = 0;
                        this.dy = 1;
                    }
                    break;
                case 'ArrowLeft':
                    if (this.dx !== 1) {
                        this.dx = -1;
                        this.dy = 0;
                    }
                    break;
                case 'ArrowRight':
                    if (this.dx !== -1) {
                        this.dx = 1;
                        this.dy = 0;
                    }
                    break;
                case 'Space':
                    e.preventDefault();
                    if (this.gameRunning) {
                        this.togglePause();
                    } else {
                        this.startGame();
                    }
                    break;
            }
        });
        
        // 按钮控制
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('restartBtn2').addEventListener('click', () => this.restartGame());
        
        // 速度控制
        this.speedSlider.addEventListener('input', (e) => {
            this.speedLevel = parseInt(e.target.value);
            this.updateSpeedDisplay();
        });
        
        // 速度预设按钮
        document.querySelectorAll('.speed-preset').forEach(button => {
            button.addEventListener('click', (e) => {
                this.speedLevel = parseInt(e.target.dataset.speed);
                this.updateSpeedDisplay();
                this.updatePresetButtons();
            });
        });
    }
    
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            
            // 如果蛇还没有移动方向，设置默认向右移动
            if (this.dx === 0 && this.dy === 0) {
                this.dx = 1;
                this.dy = 0;
            }
            
            this.gameLoop();
            document.getElementById('startBtn').textContent = 'Playing...';
            document.getElementById('startBtn').disabled = true;
        }
    }
    
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Resume' : 'Pause';
            
            if (!this.gamePaused) {
                this.gameLoop();
            }
        }
    }
    
    restartGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.snake = [{x: 10, y: 10}];
        this.dx = 0;
        this.dy = 0;
        this.food = this.generateFood();
        
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = 'Pause';
        
        this.updateDisplay();
        this.draw();
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        // 根据速度等级计算延迟时间 (1-10 对应 300ms-50ms)
        const delay = 350 - (this.speedLevel * 30);
        
        setTimeout(() => {
            this.update();
            this.draw();
            this.gameLoop();
        }, delay);
    }
    
    update() {
        if (!this.gameRunning || this.gamePaused) return;
        
        // 移动蛇头
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // 检查边界碰撞
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // 检查自身碰撞
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            this.updateDisplay();
        } else {
            this.snake.pop();
        }
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#2d3748';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制蛇
        this.ctx.fillStyle = '#48bb78';
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
            
            // 蛇头特殊样式
            if (i === 0) {
                this.ctx.fillStyle = '#38a169';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 3,
                    segment.y * this.gridSize + 3,
                    this.gridSize - 6,
                    this.gridSize - 6
                );
                this.ctx.fillStyle = '#48bb78';
            }
        }
        
        // 绘制食物
        this.ctx.fillStyle = '#e53e3e';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 4,
            this.gridSize - 4
        );
        
        // 绘制网格线（可选）
        this.ctx.strokeStyle = '#4a5568';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        
        return food;
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gamePaused = false;
        
        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        
        // 显示游戏结束界面
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = 'Pause';
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('high-score').textContent = this.highScore;
    }
    
    updateSpeedDisplay() {
        this.speedValue.textContent = this.speedLevel;
        this.speedSlider.value = this.speedLevel;
        this.updatePresetButtons();
    }
    
    updatePresetButtons() {
        document.querySelectorAll('.speed-preset').forEach(button => {
            button.classList.remove('active');
            if (parseInt(button.dataset.speed) === this.speedLevel) {
                button.classList.add('active');
            }
        });
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
