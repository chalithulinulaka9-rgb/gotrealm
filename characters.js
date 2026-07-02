const searchInput = document.getElementById("characterSearch");
const cards = Array.from(document.querySelectorAll(".character-card"));
const noResults = document.getElementById("noResults");
const suggestions = document.getElementById("searchSuggestions");

let currentIndex = -1;
let suggestionResults = [];

// ================================
// LEVENSHTEIN DISTANCE
// ================================
function levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// ================================
// SMART SCORING
// ================================
function score(query, name) {
    query = query.toLowerCase().trim();
    name = name.toLowerCase();

    if (!query) return 1000;
    if (name === query) return 100;
    if (name.startsWith(query)) return 95;
    if (name.includes(query)) return 85;

    const words = name.split(" ");

    for (const word of words) {
        if (word === query) return 90;
        if (word.startsWith(query)) return 80;
        if (word.includes(query)) return 70;

        const dist = levenshtein(query, word);
        if (dist <= 2) return 60 - dist;
    }

    return 0;
}

// ================================
// MAIN SEARCH
// ================================
function searchCharacters() {
    const value = searchInput.value.toLowerCase().trim();

    if (value === "") {
        cards.forEach(card => card.style.display = "");
        if (noResults) noResults.style.display = "none";
        return [];
    }

    const results = [];

    cards.forEach(card => {
        const name = card.querySelector(".character-name").textContent;
        const rank = score(value, name);

        if (rank > 0) {
            results.push({ card, rank });
        }
    });

    results.sort((a, b) => b.rank - a.rank);

    cards.forEach(card => card.style.display = "none");

    results.forEach(r => {
        r.card.style.display = "";
    });

    if (noResults) {
        noResults.style.display = results.length ? "none" : "block";
    }

    return results;
}

// ================================
// SUGGESTIONS
// ================================
function updateSuggestions() {
    const value = searchInput.value.toLowerCase().trim();

    suggestions.innerHTML = "";
    currentIndex = -1;

    if (!value) {
        suggestions.style.display = "none";
        return;
    }

    suggestionResults = cards
        .map(card => ({
            card,
            name: card.querySelector(".character-name").textContent,
            image: card.querySelector("img").src
        }))
        .filter(c => c.name.toLowerCase().includes(value))
        .sort((a, b) => {
            const aStart = a.name.toLowerCase().startsWith(value);
            const bStart = b.name.toLowerCase().startsWith(value);

            if (aStart && !bStart) return -1;
            if (!aStart && bStart) return 1;

            return a.name.localeCompare(b.name);
        })
        .slice(0, 8);

    suggestionResults.forEach(char => {
        const item = document.createElement("div");
        item.className = "search-suggestion";

        item.innerHTML = `
            <img src="${char.image}">
            <div class="search-name">${char.name}</div>
        `;

        item.onclick = () => {
            searchInput.value = char.name;
            suggestions.style.display = "none";
            searchCharacters();

            char.card.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            char.card.classList.add("active-highlight");

            setTimeout(() => {
                char.card.classList.remove("active-highlight");
            }, 2000);
        };

        suggestions.appendChild(item);
    });

    suggestions.style.display = suggestionResults.length ? "block" : "none";
}

// ================================
// WINTER EASTER EGG
// ================================
let winterActive = false;

function activateWinterMode() {
    if (winterActive) return;

    winterActive = true;

    document.body.classList.add("winter-mode");

    const message = document.createElement("div");
    message.className = "winter-message";
    message.innerHTML = `
        <h2>❄ WINTER IS COMING ❄</h2>
        <p>The North Remembers...</p>
    `;
    document.body.appendChild(message);

    for (let i = 0; i < 150; i++) {
        const snow = document.createElement("div");
        snow.className = "snowflake";
        snow.innerHTML = "❄";

        snow.style.left = Math.random() * window.innerWidth + "px";
        snow.style.animationDuration = (Math.random() * 5 + 5) + "s";
        snow.style.animationDelay = (Math.random() * 5) + "s";
        snow.style.fontSize = (Math.random() * 12 + 10) + "px";

        document.body.appendChild(snow);
    }

    setTimeout(() => {
        document.body.classList.remove("winter-mode");

        document.querySelectorAll(".snowflake").forEach(s => s.remove());
        message.remove();

        winterActive = false;
    }, 12000);
}
let fireActive = false;

function activateFireMode() {
    if (fireActive) return;

    fireActive = true;

    // Screen flash
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.inset = "0";
    flash.style.background = "rgba(255,80,0,0.25)";
    flash.style.zIndex = "9998";
    flash.style.pointerEvents = "none";
    flash.style.animation = "fireFlash 0.6s ease-out";

    document.body.appendChild(flash);

    // Fire particles
    for (let i = 0; i < 120; i++) {
        const fire = document.createElement("div");
        fire.className = "fire-particle";
        fire.innerHTML = "🔥";

        fire.style.position = "fixed";
        fire.style.left = Math.random() * window.innerWidth + "px";
        fire.style.top = Math.random() * window.innerHeight + "px";
        fire.style.fontSize = (Math.random() * 20 + 10) + "px";
        fire.style.zIndex = "9999";
        fire.style.pointerEvents = "none";

        document.body.appendChild(fire);

        setTimeout(() => fire.remove(), 1500);
    }

    // Message popup
    const msg = document.createElement("div");
    msg.className = "winter-message";
    msg.innerHTML = `
        <h2>🔥 DRACARYS 🔥</h2>
        <p>Fire and Blood</p>
    `;
    document.body.appendChild(msg);

    // Cleanup
    setTimeout(() => {
        flash.remove();
        msg.remove();
        fireActive = false;
    }, 2000);
}

// ================================
// EVENTS
// ================================
searchInput.addEventListener("input", () => {

    const value = searchInput.value.toLowerCase().trim();

    if (value === "winter is coming") {
        activateWinterMode();
    }

    if (value === "dracarys") {
        activateFireMode();
    }

    searchCharacters();
    updateSuggestions();
});

searchInput.addEventListener("keydown", e => {
    const items = document.querySelectorAll(".search-suggestion");

    if (e.key === "ArrowDown") {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % items.length;
    }

    if (e.key === "ArrowUp") {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
    }

    items.forEach(i => i.classList.remove("selected"));

    if (currentIndex >= 0) {
        items[currentIndex].classList.add("selected");
    }

    if (e.key === "Enter" && currentIndex >= 0) {
        items[currentIndex].click();
    }

    if (e.key === "Escape") {
        searchInput.value = "";
        suggestions.style.display = "none";
        searchCharacters();
    }
});

// close suggestions when clicking outside
document.addEventListener("click", e => {
    if (!e.target.closest(".search-box") && !e.target.closest("#searchSuggestions")) {
        suggestions.style.display = "none";
    }
});
// ================================
// QUIZ DATA
// ================================
const quizData = [
    {
        question: "Who leads the Night's Watch during Jon Snow's early time there?",
        answers: ["Jeor Mormont", "Alliser Thorne", "Benjen Stark", "Maester Aemon"],
        correct: "Jeor Mormont"
    },
    {
        question: "What is the real name of the King Beyond the Wall?",
        answers: ["Tormund Giantsbane", "Mance Rayder", "Styr", "Rattleshirt"],
        correct: "Mance Rayder"
    },
    {
        question: "Who is the torturer of House Bolton?",
        answers: ["Bronn", "Ramsay Snow", "Locke", "Qyburn"],
        correct: "Ramsay Snow"
    },
    {
        question: "Who creates wildfire for Cersei?",
        answers: ["Qyburn", "Tyrion Lannister", "Varys", "Pycelle"],
        correct: "Qyburn"
    },
    {
        question: "Who said 'Chaos is a ladder'?",
        answers: ["Varys", "Petyr Baelish", "Tyrion Lannister", "Littlefinger spy"],
        correct: "Petyr Baelish"
    },
    {
        question: "Who trains Arya Stark in Braavos?",
        answers: ["Jaqen H'ghar", "The Waif", "Rorge", "Thoros"],
        correct: "Jaqen H'ghar"
    },
    {
        question: "Which wildling woman is a warrior?",
        answers: ["Osha", "Ygritte", "Gilly", "Meera Reed"],
        correct: "Ygritte"
    },
    {
        question: "Who is Bran Stark’s loyal giant companion?",
        answers: ["Hodor", "Wun Wun", "The Mountain", "Grenn"],
        correct: "Hodor"
    }
];

// ================================
// VARIABLES
// ================================
let currentQ = 0;
let quizScore = 0;

const quizBox = document.getElementById("quizBox");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const startBtn = document.getElementById("startQuizBtn");

// ================================
// START QUIZ
// ================================
startBtn.addEventListener("click", startQuiz);

function startQuiz() {
    currentQ = 0;
    quizScore = 0;
    quizBox.style.display = "block";
    loadQuestion();
}

// ================================
// LOAD QUESTION
// ================================
function loadQuestion() {
    const q = quizData[currentQ];

    questionEl.textContent = q.question;
    answersEl.innerHTML = "";

    q.answers.forEach(ans => {
        const btn = document.createElement("button");
        btn.textContent = ans;

        btn.onclick = () => {
            if (ans === q.correct) {
                btn.classList.add("correct");
                quizScore++;
            } else {
                btn.classList.add("wrong");
            }

            // lock all buttons
            document.querySelectorAll("#answers button").forEach(b => {
                b.disabled = true;

                if (b.textContent === q.correct) {
                    b.classList.add("correct");
                }
            });
        };

        answersEl.appendChild(btn);
    });
}

// ================================
// NEXT QUESTION
// ================================
function nextQuestion() {
    currentQ++;

    if (currentQ >= quizData.length) {
        showResult();
        return;
    }

    loadQuestion();
}

// make it global for HTML onclick
window.nextQuestion = nextQuestion;

// ================================
// RESULT SCREEN
// ================================
function showResult() {
    quizBox.innerHTML = `
        <h2>⚔ Quiz Finished</h2>
        <p>Your Score: ${quizScore} / ${quizData.length}</p>
        <button onclick="location.reload()">Restart</button>
    `;
}



// start
searchCharacters();