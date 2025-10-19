document.addEventListener("DOMContentLoaded", () => {
  let words = [];
  let currentIndex = 0;
  let score = 0;
  const TOTAL_QUESTIONS = 10;

  const sentenceBox = document.getElementById("sentence");
  const answerInput = document.getElementById("answer");
  const feedback = document.getElementById("feedback");
  const checkBtn = document.getElementById("check");
  const nextBtn = document.getElementById("next");
  const scoreEl = document.getElementById("score");

  async function loadWords() {
    try {
      const res = await fetch("assets/data/words.json");
      const data = await res.json();
      words = data.words.sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
      currentIndex = 0;
      score = 0;
      updateScore();
      showQuestion();
    } catch (err) {
      sentenceBox.textContent = "⚠️ Couldn't load words.";
      console.error(err);
    }
  }

  function showQuestion() {
    feedback.textContent = "";
    feedback.classList.remove("show");
    answerInput.value = "";
    answerInput.focus();

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

    if (parts.length > 1 && Math.random() < 0.5) {
      missingPart = parts[0];
      blankSentence = german.replace(missingPart, "_____");
    } else {
      missingPart = parts[parts.length - 1];
      blankSentence = german.replace(missingPart, "_____");
    }

    sentenceBox.dataset.answer = missingPart;
    sentenceBox.textContent = `Translate: ${english} → ${blankSentence}`;
    updateScore();
  }

  function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = (sentenceBox.dataset.answer || "").toLowerCase();

    if (!userAnswer) {
      feedback.textContent = "⚠️ Please enter your answer!";
      feedback.style.color = "orange";
      feedback.classList.add("show");
      return;
    }

    answerInput.blur();

    if (userAnswer === correctAnswer) {
      feedback.textContent = "✅ Correct!";
      feedback.style.color = "green";
      score++;
    } else {
      feedback.textContent = `❌ Correct answer: ${correctAnswer}`;
      feedback.style.color = "red";
    }

    feedback.classList.add("show");
    updateScore();
  }

  function nextQuestion() {
    currentIndex++;
    showQuestion();
  }

  function updateScore() {
    scoreEl.textContent = `Score: ${score} / ${TOTAL_QUESTIONS}`;
  }

  function finishQuiz() {
    sessionStorage.setItem("dasWort_finalScore", score);
    sessionStorage.setItem("dasWort_totalQuestions", words.length);
    window.location.href = "result.html";
  }

  // Event listeners
  checkBtn.addEventListener("click", checkAnswer);
  nextBtn.addEventListener("click", nextQuestion);

  // Enter key triggers check
  answerInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      checkAnswer();
    }
  });

  loadWords();
});