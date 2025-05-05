class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.scoreElement = document.getElementById('score');
        
        // Set initial canvas size
        this.resizeCanvas();
        
        // Player properties
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            size: Math.min(this.canvas.width, this.canvas.height) * 0.05, // Responsive size
            speed: Math.min(this.canvas.width, this.canvas.height) * 0.008, // Responsive speed
            dx: 0,
            dy: 0,
            color: '#333', // Default color
            rotation: 0, // Current rotation in radians
            rotationSpeed: 0.1 // Base rotation speed
        };
        
        // Squares array
        this.squares = [];
        this.squareSize = this.player.size; // Match player size
        this.maxSquares = Math.floor((this.canvas.width * this.canvas.height) / (this.squareSize * this.squareSize * 10)); // Responsive number of squares
        
        // Colors for squares
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
        
        // Joystick properties
        this.joystick = {
            container: document.querySelector('.joystick-container'),
            knob: document.querySelector('.joystick-knob'),
            isDragging: false,
            centerX: 0,
            centerY: 0,
            knobX: 0,
            knobY: 0,
            maxDistance: 30
        };
        
        // Initialize game
        this.init();
    }
    
    resizeCanvas() {
        // Set canvas size to window size
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            // Regenerate squares for new size
            this.squares = [];
            this.generateSquares();
        });
        
        // Generate initial squares
        this.generateSquares();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize joystick position
        const rect = this.joystick.container.getBoundingClientRect();
        this.joystick.centerX = rect.width / 2;
        this.joystick.centerY = rect.height / 2;
        this.joystick.knobX = this.joystick.centerX;
        this.joystick.knobY = this.joystick.centerY;
        
        // Start game loop
        this.gameLoop();
    }
    
    generateSquares() {
        while (this.squares.length < this.maxSquares) {
            this.squares.push({
                x: Math.random() * (this.canvas.width - this.squareSize),
                y: Math.random() * (this.canvas.height - this.squareSize),
                color: this.colors[Math.floor(Math.random() * this.colors.length)]
            });
        }
    }
    
    setupEventListeners() {
        // Joystick events
        this.joystick.knob.addEventListener('mousedown', (e) => this.startJoystickDrag(e));
        document.addEventListener('mousemove', (e) => this.updateJoystickPosition(e));
        document.addEventListener('mouseup', () => this.endJoystickDrag());
        
        // Touch events for mobile
        this.joystick.knob.addEventListener('touchstart', (e) => this.startJoystickDrag(e));
        document.addEventListener('touchmove', (e) => this.updateJoystickPosition(e));
        document.addEventListener('touchend', () => this.endJoystickDrag());
    }
    
    startJoystickDrag(e) {
        this.joystick.isDragging = true;
        this.updateJoystickPosition(e);
    }
    
    updateJoystickPosition(e) {
        if (!this.joystick.isDragging) return;
        
        const rect = this.joystick.container.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        // Calculate position relative to joystick container
        let x = clientX - rect.left - this.joystick.centerX;
        let y = clientY - rect.top - this.joystick.centerY;
        
        // Calculate distance from center
        const distance = Math.sqrt(x * x + y * y);
        
        // Limit distance to maxDistance
        if (distance > this.joystick.maxDistance) {
            x = (x / distance) * this.joystick.maxDistance;
            y = (y / distance) * this.joystick.maxDistance;
        }
        
        // Update knob position
        this.joystick.knobX = this.joystick.centerX + x;
        this.joystick.knobY = this.joystick.centerY + y;
        this.joystick.knob.style.transform = `translate(${x}px, ${y}px)`;
        
        // Update player movement
        this.player.dx = (x / this.joystick.maxDistance) * this.player.speed;
        this.player.dy = (y / this.joystick.maxDistance) * this.player.speed;
    }
    
    endJoystickDrag() {
        this.joystick.isDragging = false;
        this.joystick.knobX = this.joystick.centerX;
        this.joystick.knobY = this.joystick.centerY;
        this.joystick.knob.style.transform = 'translate(-50%, -50%)';
        this.player.dx = 0;
        this.player.dy = 0;
    }
    
    update() {
        // Update player position
        this.player.x += this.player.dx;
        this.player.y += this.player.dy;
        
        // Update player rotation based on movement
        if (this.player.dx !== 0 || this.player.dy !== 0) {
            // Calculate rotation speed based on movement speed
            const speed = Math.sqrt(this.player.dx * this.player.dx + this.player.dy * this.player.dy);
            const rotationAmount = this.player.rotationSpeed * (speed / this.player.speed);
            this.player.rotation += rotationAmount;
        }
        
        // Keep player within canvas bounds
        this.player.x = Math.max(this.player.size / 2, Math.min(this.canvas.width - this.player.size / 2, this.player.x));
        this.player.y = Math.max(this.player.size / 2, Math.min(this.canvas.height - this.player.size / 2, this.player.y));
        
        // Check for collisions with squares
        this.squares = this.squares.filter(square => {
            const dx = this.player.x - (square.x + this.squareSize / 2);
            const dy = this.player.y - (square.y + this.squareSize / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < (this.player.size / 2) + (this.squareSize / 2)) {
                this.score++;
                this.scoreElement.textContent = this.score;
                // Update player color to match collected square
                this.player.color = square.color;
                return false;
            }
            return true;
        });
        
        // Generate new squares if needed
        if (this.squares.length < this.maxSquares) {
            this.generateSquares();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw uncollected squares
        this.squares.forEach(square => {
            this.ctx.fillStyle = square.color;
            this.ctx.fillRect(square.x, square.y, this.squareSize, this.squareSize);
        });
        
        // Draw player (square)
        this.ctx.save();
        this.ctx.translate(this.player.x, this.player.y);
        this.ctx.rotate(this.player.rotation);
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(
            -this.player.size / 2,
            -this.player.size / 2,
            this.player.size,
            this.player.size
        );
        this.ctx.restore();
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 