(() => {
    const startBtn = document.getElementById("start-btn");
    const stopBtn = document.getElementById("stop-btn");
    const retryBtn = document.getElementById("retry-btn");
    const input = document.getElementById("test-input");
    const wpmEl = document.getElementById("wpm");
    const resultLevelEl = document.getElementById("result-level");
    const resultTimeEl = document.getElementById("result-time");
    const quoteEl = document.getElementById("quote-display");
    const difficultySelect = document.getElementById("difficulty-select");

    const quotes = {
        easy: [
            "The cat sat on the mat.",
            "A bird in the hand is worth two in the bush.",
            "The sun is shining bright today.",
            "I love to read books every day.",
            "Dogs are loyal and friendly pets.",
        ],
        medium: [
            "Practice makes perfect when learning new skills.",
            "The quick brown fox jumps over the lazy dog.",
            "Success comes to those who persevere and work hard.",
            "Technology has transformed the way we communicate.",
            "Reading expands your knowledge and imagination.",
        ],
        hard: [
            "Perseverance and determination are essential qualities for achieving long-term success in any endeavor.",
            "The complexity of modern software development requires collaboration, continuous learning, and adaptability.",
            "Philosophical contemplation often leads to profound insights about the nature of existence and consciousness.",
            "Interdisciplinary approaches frequently yield innovative solutions to complex, multifaceted problems.",
            "Technological advancement accelerates exponentially, fundamentally reshaping societal structures and human interactions.",
        ],
    };

    let timerInterval = null;
    let startTime = null;

    const getRandomQuote = (difficulty) => {
        const quoteList = quotes[difficulty] || quotes.easy;
        return quoteList[Math.floor(Math.random() * quoteList.length)];
    };

    const setNewQuote = () => {
        const difficulty = difficultySelect.value;
        const newQuote = getRandomQuote(difficulty);
        quoteEl.textContent = `"${newQuote}"`;
    };

    const updateStats = (elapsedMs) => {
        const typed = input.value;
        const expected = quoteEl.textContent.replace(/^["']|["']$/g, "");

        // Count correctly typed words
        const expectedWords = expected.trim().split(/\s+/);
        const typedWords = typed.trim().split(/\s+/);
        let correctWords = 0;

        for (
            let i = 0;
            i < Math.min(expectedWords.length, typedWords.length);
            i++
        ) {
            if (expectedWords[i] === typedWords[i]) {
                correctWords++;
            }
        }

        const minutes = Math.max(elapsedMs / 60000, 0.0167); // minimum 1 second
        const wpm = Math.round(correctWords / minutes);
        const seconds = Math.floor(elapsedMs / 1000);

        wpmEl.textContent = Number.isFinite(wpm) && wpm >= 0 ? wpm : 0;
        resultTimeEl.textContent = `${seconds}s`;
        resultLevelEl.textContent =
            difficultySelect.value.charAt(0).toUpperCase() +
            difficultySelect.value.slice(1);
    };

    const start = () => {
        if (timerInterval) return;
        startTime = Date.now();
        timerInterval = setInterval(() => {
            if (!startTime) return;
            const elapsed = Date.now() - startTime;
            updateStats(elapsed);
        }, 250);
        input.removeAttribute("disabled");
        input.focus();
    };

    const stop = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        if (startTime) {
            const elapsed = Date.now() - startTime;
            updateStats(elapsed);
        }
    };

    const retry = () => {
        stop();
        input.value = "";
        wpmEl.textContent = "0";
        resultTimeEl.textContent = "0s";
        resultLevelEl.textContent =
            difficultySelect.value.charAt(0).toUpperCase() +
            difficultySelect.value.slice(1);
        startTime = null;
        setNewQuote();
        input.focus();
    };

    startBtn?.addEventListener("click", start);
    stopBtn?.addEventListener("click", stop);
    retryBtn?.addEventListener("click", retry);
    difficultySelect?.addEventListener("change", setNewQuote);

    // Set initial random quote
    setNewQuote();
})();
