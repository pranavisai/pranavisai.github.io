// assets/js/result.js
document.addEventListener("DOMContentLoaded", () => {
  const score = sessionStorage.getItem("dasWort_finalScore");
  const total = sessionStorage.getItem("dasWort_totalQuestions");

  const finalScoreEl = document.getElementById("final-score");
  const finalMessageEl = document.getElementById("final-message");

  if (score === null || total === null) {
    finalScoreEl.textContent = "No quiz data found. Try playing the quiz first.";
    finalMessageEl.textContent = "Oops!";
  } else {
    finalScoreEl.innerHTML = `Your score: <strong>${score} / ${total}</strong>`;

    // friendly message based on performance
    const pct = (Number(score) / Number(total)) * 100;
    if (pct === 100) finalMessageEl.textContent = "Perfect! 🌟";
    else if (pct >= 80) finalMessageEl.textContent = "Great job! ✅";
    else if (pct >= 50) finalMessageEl.textContent = "Nice effort — keep practicing! 💪";
    else finalMessageEl.textContent = "Good start — try again to improve! ✨";
  }

  // Play again: clear stored score and go back to fill.html
  document.getElementById("play-again").addEventListener("click", () => {
    sessionStorage.removeItem("dasWort_finalScore");
    sessionStorage.removeItem("dasWort_totalQuestions");
    // send user back to fill page (it will pick a new set)
    window.location.href = "fill_in_the_blanks.html";
  });
});