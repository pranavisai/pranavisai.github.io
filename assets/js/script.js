function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function startPractice(mode) {
  let currentIndex = 0;
  let words = [];

  const flashcard = document.getElementById("flashcard");
  const progress = document.getElementById("progress");
  const flipBtn = document.getElementById("flip");
  const nextBtn = document.getElementById("next");

  try {
    const response = await fetch("assets/data/words.json");
    const data = await response.json();
    words = shuffleArray(data.words);
  } catch (error) {
    document.querySelector(".card-front").textContent = "Error loading words 😞";
    console.error(error);
    return;
  }

  function showWord() {
    const current = words[currentIndex];
    const frontText = mode === "germanToEnglish" ? current.german : current.english;
    const backText = mode === "germanToEnglish" ? current.english : current.german;

    document.querySelector(".card-front").textContent = frontText;
    document.querySelector(".card-back").textContent = backText;

    progress.textContent = `${currentIndex + 1} / ${words.length}`;
  }

  flashcard.addEventListener("click", () => {
    flashcard.classList.toggle("flipped");
  });

  flipBtn.addEventListener("click", () => {
    flashcard.classList.toggle("flipped");
  });

  nextBtn.addEventListener("click", () => {
  flashcard.classList.remove("flipped");  // reset flip
  currentIndex = (currentIndex + 1) % words.length;
  showWord();
  });

  showWord();
}