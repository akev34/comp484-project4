// Grab references to the DOM elements we'll be working with
const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originTextEl = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const wpmDisplay = document.querySelector("#wpm");
const errorDisplay = document.querySelector("#errors");
const scoresList = document.querySelector("#top-scores");

// Pool of paragraphs — one is picked at random each reset
const paragraphs = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once, which is why it has been used for decades to test typewriters, fonts, and keyboards.",
    "Space exploration has captivated humanity for generations. From the first satellite launches to landing rovers on distant worlds, each mission expands our understanding of the cosmos and our place within it.",
    "A black hole forms when a massive star collapses under its own gravity. The result is a region of spacetime where the pull is so strong that not even light, the fastest thing in the universe, can escape.",
    "Programming is less about typing code than it is about thinking clearly. The hard part is not the syntax. It is breaking a fuzzy problem into pieces small enough that a machine can follow them step by step.",
    "Coffee, when brewed properly, is a small daily ritual. The grind has to be even, the water hot but not boiling, and the timing patient. Rush any single step and the cup tells on you immediately.",
    "The ocean covers more than seventy percent of our planet, yet most of its depths remain unmapped. Beneath the waves lives a strange world of glowing creatures, hidden mountains, and silent canyons."
];

// State variables — track everything about the current test
let timer = [0, 0, 0];      // [minutes, seconds, hundredths]
let interval = null;
let timerRunning = false;
let testComplete = false;
let errorCount = 0;
let prevInputLength = 0;
let originText = "";

// Adds a leading zero to numbers 9 or below so the clock looks like 00:00:00
function leadingZero(n) {
    return n <= 9 ? "0" + n : "" + n;
}

// Runs every 10ms — updates the clock display and rolls over the units
function runTimer() {
    theTimer.innerHTML = leadingZero(timer[0]) + ":" + leadingZero(timer[1]) + ":" + leadingZero(timer[2]);
    timer[2]++;
    if (timer[2] >= 100) { timer[2] = 0; timer[1]++; }
    if (timer[1] >= 60) { timer[1] = 0; timer[0]++; }
    updateWPM();
}

function getTotalSeconds() {
    return timer[0] * 60 + timer[1] + timer[2] / 100;
}

// WPM formula: (characters / 5) / (seconds / 60)
function calcWPM() {
    const totalSeconds = getTotalSeconds();
    if (totalSeconds === 0) return 0;
    const chars = testArea.value.length;
    return Math.round((chars / 5) / (totalSeconds / 60));
}

function updateWPM() {
    wpmDisplay.textContent = calcWPM();
}

function setBorder(color) {
    testWrapper.style.borderColor = color;
}

// Compares typed text against the origin and updates border + completion state
function spellCheck() {
    if (testComplete) return;

    const typed = testArea.value;
    const originSub = originText.substring(0, typed.length);

    // Count an error only when a new wrong character is typed
    if (typed.length > prevInputLength && typed.length > 0) {
        const lastChar = typed[typed.length - 1];
        const expectedChar = originText[typed.length - 1];
        if (lastChar !== expectedChar) {
            errorCount++;
            errorDisplay.textContent = errorCount;
        }
    }
    prevInputLength = typed.length;

    // Decide what color the border should be based on current state
    if (typed.length === 0) {
        setBorder("grey");
    } else if (typed === originText) {
        // Test finished — stop timer, lock state, save score
        clearInterval(interval);
        timerRunning = false;
        testComplete = true;
        setBorder("#4CAF50");
        updateWPM();
        saveScore();
    } else if (typed === originSub) {
        setBorder("#2196F3");
    } else {
        setBorder("#E95D0F");
    }
}

// Fires on every keystroke — starts the timer on first input, then spell-checks
function handleInput() {
    if (!timerRunning && !testComplete && testArea.value.length > 0) {
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
    spellCheck();
}

function pickRandomParagraph() {
    const idx = Math.floor(Math.random() * paragraphs.length);
    originText = paragraphs[idx];
    originTextEl.textContent = originText;
}

// Cleanup function — wipes everything back to starting state
function reset() {
    clearInterval(interval);
    interval = null;
    timer = [0, 0, 0];
    timerRunning = false;
    testComplete = false;
    errorCount = 0;
    prevInputLength = 0;
    testArea.value = "";
    theTimer.innerHTML = "00:00:00";
    wpmDisplay.textContent = "0";
    errorDisplay.textContent = "0";
    setBorder("grey");
    pickRandomParagraph();
    testArea.focus(); // Drops the cursor in the textarea so user can type immediately
}

// Saves the run to localStorage and keeps only the top 3 fastest WPMs
function saveScore() {
    const wpm = calcWPM();
    if (wpm <= 0 || !isFinite(wpm)) return;

    const scores = JSON.parse(localStorage.getItem("typingScores") || "[]");
    scores.push({
        wpm: wpm,
        time: theTimer.innerHTML,
        errors: errorCount,
        date: new Date().toLocaleDateString()
    });
    scores.sort((a, b) => b.wpm - a.wpm);
    const top3 = scores.slice(0, 3);
    localStorage.setItem("typingScores", JSON.stringify(top3));
    renderScores();
}

// Builds the leaderboard list from whatever's in localStorage
function renderScores() {
    const scores = JSON.parse(localStorage.getItem("typingScores") || "[]");
    scoresList.innerHTML = "";
    if (scores.length === 0) {
        scoresList.innerHTML = '<li class="no-scores">No scores yet — finish a test to set your first record.</li>';
        return;
    }
    scores.forEach((s, i) => {
        const li = document.createElement("li");
        li.innerHTML =
            '<span class="rank">#' + (i + 1) + '</span>' +
            '<span class="wpm-big">' + s.wpm + ' <small>WPM</small></span>' +
            '<span class="score-meta">' + s.time + ' &middot; ' + s.errors + ' errors &middot; ' + s.date + '</span>';
        scoresList.appendChild(li);
    });
}

// Event listeners
testArea.addEventListener("input", handleInput);
resetButton.addEventListener("click", reset);

// Initial setup on page load
pickRandomParagraph();
renderScores();
