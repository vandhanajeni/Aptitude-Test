// Global variables
let userName = prompt("Please enter your name:");

if (!userName || userName.trim() === "") {
  userName = "Guest";
}

document.getElementById("user-name").textContent = `Hello, ${userName}!`;

const categories = {
  python: [
    { question: "What is Python?", hint: "It's a programming language.", answer: "Programming language" },
    { question: "What does 'len()' do?", hint: "It gets the size of something.", answer: "Length" },
  ],
  java: [
    { question: "What is the extension of a Java file?", hint: "It starts with '.j'.", answer: ".java" },
  ],
  c: [
    { question: "What is C primarily used for?", hint: "Think system-level programming.", answer: "System programming" },
  ],
  cpp: [
    { question: "What does OOP stand for?", hint: "A programming paradigm.", answer: "Object-Oriented Programming" },
  ],
  database: [
    { question: "What does SQL stand for?", hint: "Structured Query Language.", answer: "Structured Query Language" },
  ],
  cloud: [
    { question: "What is AWS?", hint: "A cloud service provider.", answer: "Amazon Web Services" },
  ],
};

let selectedCategory = [];
let currentQuestionIndex = 0;
let timerInterval;
let timeLeft = 25;
let isPaused = false;
let score = 0;

// Event listeners for category selection
document.querySelectorAll(".category-btn").forEach((button) =>
  button.addEventListener("click", () => {
    document.getElementById("home-screen").classList.add("hidden");
    document.getElementById("chatbot-container").classList.remove("hidden");
    startQuiz(button.dataset.category);
  })
);

function startQuiz(category) {
  selectedCategory = categories[category];
  document.getElementById("category-title").textContent = `Category: ${category}`;
  document.getElementById("quiz-screen").classList.remove("hidden");
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestionIndex >= selectedCategory.length) {
    endQuiz();
    return;
  }

  const question = selectedCategory[currentQuestionIndex];
  document.getElementById("question").textContent = question.question;
  document.getElementById("hint").textContent = question.hint;
  document.getElementById("hint").classList.add("hidden");
  document.getElementById("answer-input").value = "";
  timeLeft = 25;
  document.getElementById("timer").textContent = timeLeft;
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      document.getElementById("timer").textContent = timeLeft;

      if (timeLeft === 17) document.getElementById("hint").classList.remove("hidden");
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        currentQuestionIndex++;
        loadQuestion();
      }
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timerInterval);
  document.getElementById("quiz-screen").classList.add("hidden");
  document.getElementById("summary-screen").classList.remove("hidden");
  document.getElementById("final-score").textContent = `Your final score is: ${score}`;
}

// Submit answer and load next question
document.getElementById("submit-btn").addEventListener("click", () => {
  const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
  const correctAnswer = selectedCategory[currentQuestionIndex].answer.toLowerCase();
  document.getElementById("feedback").classList.remove("hidden");

  if (userAnswer === correctAnswer) {
    document.getElementById("feedback").textContent = "Correct!";
    score++;
  } else {
    document.getElementById("feedback").textContent = "Incorrect!";
  }

  document.getElementById("score").textContent = `Score: ${score}`;
  clearInterval(timerInterval);
  setTimeout(() => {
    currentQuestionIndex++;
    loadQuestion();
  }, 2000);
});

// Pause and Resume Quiz
document.getElementById("pause-btn").addEventListener("click", () => {
  isPaused = true;
  document.getElementById("pause-btn").classList.add("hidden");
  document.getElementById("resume-btn").classList.remove("hidden");
});

document.getElementById("resume-btn").addEventListener("click", () => {
  isPaused = false;
  document.getElementById("resume-btn").classList.add("hidden");
  document.getElementById("pause-btn").classList.remove("hidden");
});

// Restart Quiz
document.getElementById("restart-btn").addEventListener("click", () => {
  location.reload();
});

// Chatbot logic
document.getElementById("chat-send").addEventListener("click", () => {
  const chatInput = document.getElementById("chat-input").value;
  const chatDisplay = document.getElementById("chat-display");

  if (chatInput.trim() !== "") {
    const userMessage = `<p><strong>You:</strong> ${chatInput}</p>`;
    chatDisplay.innerHTML += userMessage;

    // Simple chatbot responses
    let botResponse;
    if (chatInput.toLowerCase().includes("hint")) {
      botResponse = "Hints will appear when 8 seconds have passed!";
    } else if (chatInput.toLowerCase().includes("score")) {
      botResponse = `Your current score is ${score}.`;
    } else if (chatInput.toLowerCase().includes("time")) {
      botResponse = `You have ${timeLeft} seconds left for this question.`;
    } else if (chatInput.toLowerCase().includes("end")) {
      botResponse = "You can end the quiz anytime by refreshing the page.";
    } else {
      botResponse = "I’m here to help! Try asking about hints, score, or time.";
    }

    const botMessage = `<p><strong>Chatbot:</strong> ${botResponse}</p>`;
    chatDisplay.innerHTML += botMessage;
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
    document.getElementById("chat-input").value = "";
  }
});
