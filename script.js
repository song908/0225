class PomodoroTimer {
    constructor() {
        this.modes = {
            focus: 25 * 60,
            short: 5 * 60,
            long: 15 * 60
        };
        this.currentMode = 'focus';
        this.timeLeft = this.modes[this.currentMode];
        this.timerId = null;
        this.isRunning = false;

        // Progress ring elements
        this.circle = document.querySelector('.progress-ring__circle');
        this.radius = this.circle.r.baseVal.value;
        this.circumference = 2 * Math.PI * this.radius;

        this.initProgressRing();
        this.initEventListeners();
        this.updateDisplay();
    }

    initProgressRing() {
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = 0;
    }

    setProgress(percent) {
        const offset = this.circumference - (percent / 100) * this.circumference;
        this.circle.style.strokeDashoffset = offset;
    }

    initEventListeners() {
        // Start/Pause button
        document.getElementById('start-btn').addEventListener('click', () => this.toggleTimer());
        
        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => this.resetTimer());

        // Mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.switchMode(mode);
            });
        });
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        if (this.isRunning) return;
        this.isRunning = true;
        document.getElementById('start-btn').textContent = 'PAUSE';
        
        this.timerId = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                this.pauseTimer();
                this.playAlarm();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        clearInterval(this.timerId);
        document.getElementById('start-btn').textContent = 'START';
    }

    resetTimer() {
        this.pauseTimer();
        this.timeLeft = this.modes[this.currentMode];
        this.updateDisplay();
    }

    switchMode(mode) {
        this.pauseTimer();
        this.currentMode = mode;
        this.timeLeft = this.modes[mode];
        
        // Update UI
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        // Update Theme
        document.body.className = mode;
        
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        document.getElementById('timer-text').textContent = display;
        document.title = `${display} - Pomodoro`;

        // Update Progress Ring
        const totalTime = this.modes[this.currentMode];
        const percent = (this.timeLeft / totalTime) * 100;
        this.setProgress(percent);
    }

    playAlarm() {
        // Simple notification sound or alert
        alert(`${this.currentMode.toUpperCase()} session finished!`);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.pomodoro = new PomodoroTimer();
    document.body.className = 'focus'; // Default theme
});
