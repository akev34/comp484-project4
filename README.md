# Comp484-Project4
# Timed Typing Test App
https://akev34.github.io/comp484-project4/

A web-based typing speed test built with HTML, CSS, and JavaScript for COMP-484 Project 4.


## What It Does

The user is given a random paragraph and types it into a textarea as fast and accurately as they can. The app tracks their time, words per minute, and errors in real-time, and saves their top 3 fastest scores between sessions.

## Features

- **Live timer** — Tracks minutes, seconds, and hundredths of a second (`00:00:00`)
- **Real-time validation** — Compares what you type against the target paragraph on every keystroke
- **Color-coded border feedback:**
  - Grey when empty
  - Blue while typing correctly
  - Orange when there's a typo
  - Green when the test is completed successfully
- **WPM calculator** — Updates live using the formula `(characters / 5) / (seconds / 60)`
- **Error counter** — Counts mismatched characters as you type
- **Random paragraphs** — Pulls from a pool of 6 different texts on each reset
- **Top 3 leaderboard** — Saves your fastest scores to `localStorage` so they persist after closing the browser
- **Auto-focus** — The cursor jumps into the textarea automatically when you reset

## How to Use

1. Read the paragraph at the top of the test area.
2. Click into the textarea and start typing — the timer starts on your first keystroke.
3. The border changes color to show whether you're matching correctly.
4. When your text matches the paragraph exactly, the timer stops and your score is saved.
5. Click **Start over** to reset the test with a new random paragraph.
