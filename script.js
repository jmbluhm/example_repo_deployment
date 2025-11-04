// Game state
let clickTimes = [];
let totalClicks = 0;
let peakSpeed = 0;
let lastResetTime = Date.now();

// DOM elements
const pumpButton = document.getElementById('pumpButton');
const resetButton = document.getElementById('resetButton');
const thermometerFill = document.getElementById('thermometerFill');
const mercury = document.getElementById('mercury');
const temperatureDisplay = document.getElementById('temperature');
const speedDisplay = document.getElementById('clicksPerSecond');
const totalClicksDisplay = document.getElementById('totalClicks');
const peakSpeedDisplay = document.getElementById('peakSpeed');

// Configuration
const CLICK_WINDOW_MS = 1000; // Calculate speed over last 1 second
const MAX_TEMPERATURE = 100; // Maximum temperature (100°C)
const DECAY_RATE = 0.98; // Speed decay per frame
let currentSpeed = 0;

// Initialize
updateDisplay();

// Click handler
pumpButton.addEventListener('click', () => {
    const now = Date.now();
    clickTimes.push(now);
    totalClicks++;
    
    // Remove clicks older than 1 second
    clickTimes = clickTimes.filter(time => now - time < CLICK_WINDOW_MS);
    
    // Calculate current speed (clicks per second)
    currentSpeed = clickTimes.length;
    
    // Update peak speed
    if (currentSpeed > peakSpeed) {
        peakSpeed = currentSpeed;
    }
    
    updateDisplay();
    animateClick();
});

// Reset handler
resetButton.addEventListener('click', () => {
    clickTimes = [];
    totalClicks = 0;
    peakSpeed = 0;
    currentSpeed = 0;
    lastResetTime = Date.now();
    updateDisplay();
});

// Update display elements
function updateDisplay() {
    // Calculate temperature based on current speed
    // Temperature is a function of current click speed
    const temperature = Math.min(currentSpeed * (MAX_TEMPERATURE / 20), MAX_TEMPERATURE);
    
    // Update thermometer fill (percentage)
    const fillPercentage = (temperature / MAX_TEMPERATURE) * 100;
    thermometerFill.style.height = `${fillPercentage}%`;
    
    // Update mercury bulb size based on temperature
    const mercurySize = 50 + (fillPercentage / 100) * 30;
    mercury.style.width = `${mercurySize}px`;
    mercury.style.height = `${mercurySize}px`;
    
    // Update displays
    temperatureDisplay.textContent = Math.round(temperature);
    speedDisplay.textContent = currentSpeed.toFixed(1);
    totalClicksDisplay.textContent = totalClicks;
    peakSpeedDisplay.textContent = peakSpeed.toFixed(1);
}

// Animate button click
function animateClick() {
    pumpButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        pumpButton.style.transform = '';
    }, 100);
}

// Decay speed over time
function decaySpeed() {
    const now = Date.now();
    
    // Remove old clicks
    clickTimes = clickTimes.filter(time => now - time < CLICK_WINDOW_MS);
    
    // Recalculate speed
    currentSpeed = clickTimes.length;
    
    updateDisplay();
}

// Update speed decay every frame
setInterval(decaySpeed, 100);

// Keyboard support (spacebar to click)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target !== pumpButton) {
        e.preventDefault();
        pumpButton.click();
    }
});

