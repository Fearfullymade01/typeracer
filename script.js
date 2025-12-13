// Sample texts for the typing test
const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is perfect for typing practice.",
    "Practice makes perfect. The more you type, the faster and more accurate you will become. Keep practicing every day.",
    "Technology has transformed the way we communicate, work, and live. It continues to evolve at an unprecedented pace.",
    "Learning to type quickly and accurately is an essential skill in today's digital world. It can improve your productivity significantly.",
    "The art of programming requires patience, logic, and creativity. Every line of code brings you closer to solving complex problems."
];

// Game state
let currentText = '';
let currentIndex = 0;
let startTime = null;
let timerInterval = null;
let timeLimit = 60;
let timeRemaining = timeLimit;
let isTestActive = false;
let correctChars = 0;
let totalChars = 0;

// DOM elements
const textDisplay = document.getElementById('textDisplay');
const textInput = document.getElementById('textInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timerDisplay = document.getElementById('timer');
const resultsDiv = document.getElementById('results');
const finalWpmDisplay = document.getElementById('finalWpm');
const finalAccuracyDisplay = document.getElementById('finalAccuracy');
const finalCharsDisplay = document.getElementById('finalChars');

// Initialize the app
function init() {
    loadNewText();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startTest);
    resetBtn.addEventListener('click', resetTest);
    textInput.addEventListener('input', handleInput);
    textInput.addEventListener('paste', (e) => e.preventDefault());
}

// Load a new random text
function loadNewText() {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    currentText = sampleTexts[randomIndex];
    displayText();
}

// Display the text with character spans
function displayText() {
    textDisplay.innerHTML = currentText
        .split('')
        .map((char, index) => `<span class="char" data-index="${index}">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('');
}

// Start the typing test
function startTest() {
    if (isTestActive) return;
    
    isTestActive = true;
    startTime = new Date();
    timeRemaining = timeLimit;
    currentIndex = 0;
    correctChars = 0;
    totalChars = 0;
    
    textInput.disabled = false;
    textInput.value = '';
    textInput.focus();
    
    startBtn.disabled = true;
    resultsDiv.style.display = 'none';
    
    loadNewText();
    startTimer();
    updateCurrentChar();
}

// Start the countdown timer
function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            endTest();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    timerDisplay.textContent = `${timeRemaining}s`;
}

// Handle text input
function handleInput(e) {
    if (!isTestActive) return;
    
    const inputText = textInput.value;
    const inputLength = inputText.length;
    
    // Update current index
    currentIndex = inputLength;
    
    // Check each character
    totalChars = inputLength;
    correctChars = 0;
    
    const chars = textDisplay.querySelectorAll('.char');
    chars.forEach((char, index) => {
        char.classList.remove('correct', 'incorrect', 'current');
        
        if (index < inputLength) {
            if (inputText[index] === currentText[index]) {
                char.classList.add('correct');
                correctChars++;
            } else {
                char.classList.add('incorrect');
            }
        }
    });
    
    updateCurrentChar();
    updateStats();
    
    // Check if test is complete
    if (inputLength >= currentText.length) {
        endTest();
    }
}

// Update the current character highlight
function updateCurrentChar() {
    const chars = textDisplay.querySelectorAll('.char');
    if (currentIndex < chars.length) {
        chars[currentIndex].classList.add('current');
    }
}

// Update statistics during typing
function updateStats() {
    // Calculate WPM
    const elapsedTime = (new Date() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = correctChars / 5; // standard: 5 chars = 1 word
    const wpm = elapsedTime > 0 ? Math.round(wordsTyped / elapsedTime) : 0;
    wpmDisplay.textContent = wpm;
    
    // Calculate accuracy
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    accuracyDisplay.textContent = `${accuracy}%`;
}

// End the typing test
function endTest() {
    if (!isTestActive) return;
    
    isTestActive = false;
    clearInterval(timerInterval);
    
    textInput.disabled = true;
    startBtn.disabled = false;
    
    // Calculate final stats
    const elapsedTime = (timeLimit - timeRemaining) / 60; // in minutes
    const wordsTyped = correctChars / 5;
    const finalWpm = elapsedTime > 0 ? Math.round(wordsTyped / elapsedTime) : 0;
    const finalAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    
    // Display results
    finalWpmDisplay.textContent = finalWpm;
    finalAccuracyDisplay.textContent = `${finalAccuracy}%`;
    finalCharsDisplay.textContent = totalChars;
    resultsDiv.style.display = 'block';
    
    // Smooth scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Reset the test
function resetTest() {
    isTestActive = false;
    clearInterval(timerInterval);
    
    currentIndex = 0;
    startTime = null;
    timeRemaining = timeLimit;
    correctChars = 0;
    totalChars = 0;
    
    textInput.value = '';
    textInput.disabled = true;
    startBtn.disabled = false;
    
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
    timerDisplay.textContent = `${timeLimit}s`;
    resultsDiv.style.display = 'none';
    
    loadNewText();
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
