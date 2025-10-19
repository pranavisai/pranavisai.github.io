// assets/js/fill.js
let words = [];
let currentIndex = 0;
let score = 0;
const TOTAL_QUESTIONS = 10;

async function loadWords() {
  try {
    const res = await fetch("assets/data/words.json");
    const data = await res.json();

    // Shuffle and pick exactly TOTAL_QUESTIONS unique words
    const shuffled = data.words.sort(() => Math.random() - 0.5);
    words = shuffled.slice(0, Math.min(TOTAL_QUESTIONS, shuffled.length));

    // reset state
    currentIndex = 0;
    score = 0;
    updateScore();
    prepareUI();
    showQuestion();
  } catch (err) {
    console.error("Error loading words:", err);
    document.getElementById("sentence").textContent = "⚠️ Couldn't load words.";
  }
}

function prepareUI() {
  const checkBtn = document.getElementById("check");
  const nextBtn = document.getElementById("next");
  checkBtn.disabled = false;
  nextBtn.disabled = false;
  document.getElementById("feedback").textContent = "";
  document.getElementById("answer").value = "";
}

function showQuestion() {
  const feedback = document.getElementById("feedback");
  const answerInput = document.getElementById("answer");
  const sentenceBox = document.getElementById("sentence");

  feedback.textContent = "";
  answerInput.value = "";

  // End condition (also handles case when words < TOTAL_QUESTIONS)
  if (currentIndex >= words.length) {
    finishQuiz();
    return;
  }

  const current = words[currentIndex];
  const german = current.german;
  const english = current.english;

  const parts = german.split(" ");
  let blankSentence = "";
  let missingPart = "";

  // Randomly hide article or main word (if article exists)
  if (parts.length > 1 && Math.random() < 0.5) {
    missingPart = parts[0]; // article
    blankSentence = german.replace(missingPart, "_____");
  } else {
    missingPart = parts[parts.length - 1]; // main word
    blankSentence = german.replace(missingPart, "_____");
  }

  sentenceBox.dataset.answer = missingPart;
  sentenceBox.textContent = `Translate: ${english} → ${blankSentence}`;
  updateScore();
}

function checkAnswer() {
  const feedback = document.getElementById("feedback");
  const answerInput = document.getElementById("answer");
  const sentenceBox = document.getElementById("sentence");
  const checkBtn = document.getElementById("check");

  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = (sentenceBox.dataset.answer || "").toLowerCase();

  if (!userAnswer) {
    feedback.textContent = "⚠️ Please enter your answer!";
    feedback.style.color = "orange";
    return;
  }

  // disable check to avoid double-submissions until user clicks Next
  checkBtn.disabled = true;

  if (userAnswer === correctAnswer) {
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "green";
    feedback.classList.add("show");
    score++;
  } else {
    feedback.textContent = `❌ Correct answer: ${correctAnswer}`;
    feedback.style.color = "red";
  }

  updateScore();
}

function nextQuestion() {
  // increment index and either show next or finish
  currentIndex++;
  if (currentIndex >= words.length) {
    // done
    finishQuiz();
  } else {
    // make sure check button is enabled for the next question
    document.getElementById("check").disabled = false;
    showQuestion();
  }
}

function updateScore() {
  document.getElementById("score").textContent = `Score: ${score} / ${TOTAL_QUESTIONS}`;
}

function finishQuiz() {
  // save final results in sessionStorage and redirect to result page
  const finalScore = score;
  // save both score and total actually used (in case words < TOTAL_QUESTIONS)
  sessionStorage.setItem("dasWort_finalScore", finalScore);
  sessionStorage.setItem("dasWort_totalQuestions", words.length);
  window.location.href = "result.html";
}

// Event listeners
document.getElementById("check").addEventListener("click", checkAnswer);
document.getElementById("next").addEventListener("click", nextQuestion);

// Start
loadWords();

// Allow pressing "Enter" to check the answer
document.getElementById("answer").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // prevent accidental form submission or reload
    document.getElementById("check").click(); // trigger the same as clicking "Check"
  }
});