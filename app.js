// Import the arrays from your constants file
import { WORDS, WORDSVOWEL, DEFINITIONS } from 'https://raw.githubusercontent.com/SargisYonan/Mamlal/refs/heads/main/src/constants/wordlist.ts';

let globoffset = 0;
let showVowel = false;

// Helper functions to replace AppLab's setText and setProperty
function setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.innerText = text;
}

function setHidden(id, isHidden) {
    const element = document.getElementById(id);
    if (element) element.style.display = isHidden ? 'none' : 'inline-block';
}

function isDST() {
    const today = new Date();
    const jan = new Date(today.getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(today.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== today.getTimezoneOffset();
}

function getWordOfDay() {
    // November 30, 2024 Game Epoch
    let epochMs = new Date('November 30, 2024 00:00:00').valueOf();
    if (isDST()) {
        epochMs = new Date('November 29, 2024 23:00:00').valueOf();
    }

    const now = Date.now();
    const msInDay = 86400000;
    const index = Math.floor((now - epochMs) / msInDay);
    const nextday = (index + 1) * msInDay + epochMs;

    return {
        solution: WORDS[index % WORDS.length].toUpperCase(),
        solutionIndex: index % WORDS.length,
        tomorrow: nextday,
    };
}

function render(offset) {
    let tblToUse = showVowel ? WORDSVOWEL : WORDS;
    let baseIndex = getWordOfDay().solutionIndex;
    
    // Using your exact AppLab math for yesterday/today/tomorrow
    let yesterdayIndex = Math.max(0, (baseIndex - 1) + offset);
    let todayIndex = baseIndex + offset;
    let tomorrowIndex = Math.min(baseIndex + 1 + offset, WORDS.length - 1);

    setText("yesterday", tblToUse[yesterdayIndex] || "");
    setText("today", tblToUse[todayIndex] || "");
    setText("tomorrow", tblToUse[tomorrowIndex] || "");
    
    let def = DEFINITIONS[todayIndex] || "No definition available.";
    setText("definitionLabel", def);

    // Date formatting
    let now = new Date();
    now.setDate(now.getDate() + offset);
    let dateStrArr = now.toDateString().split(" ");
    setText("date", `${dateStrArr[0]}\n${dateStrArr[1]}\n${dateStrArr[2]}`);

    // Hide/Show 'Today' button
    if (offset !== 0) {
        setHidden("todayButton", false);
    } else {
        setHidden("todayButton", true);
    }
}

// Event Listeners replacing AppLab's onEvent()
document.getElementById("todayButton").addEventListener("click", function() {
    globoffset = 0;
    render(0);
});

document.getElementById("Next").addEventListener("click", function() {
    globoffset += 1;
    render(globoffset);
});

document.getElementById("Previous").addEventListener("click", function() {
    globoffset -= 1;
    render(globoffset);
});

document.getElementById("vowel").addEventListener("click", function() {
    showVowel = !showVowel;
    if (showVowel) {
        setText("vowel", "X");
    } else {
        setText("vowel", "");
    }
    render(globoffset);
});

// Initialize the app
setTimeout(function() {
    render(globoffset);
}, 10);
