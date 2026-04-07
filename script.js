// Cache all DOM elements once so the app can update them efficiently later.
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startButton = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answer-container');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const scoreSpan = document.getElementById('score');
const finalScoreSpan = document.getElementById('final-score');
const maxScoreSpan = document.getElementById('max-score');
const resultMessage = document.getElementById('result-message');
const restartButton = document.getElementById('restart-btn');
const progressBar = document.getElementById('progress');

// Static quiz data used to build each question screen.
const quizQuestions = [
    {
        question: "What is the capital of France?",
        answers: [
            { text: "London", correct: false },
            { text: "Berlin", correct: false },
            { text: "Paris", correct: true },
            { text: "Madrid", correct: false },
        ],
    },
    {
        question: "Which planet is known as the Red Planet?",
        answers: [
            { text: "Venus", correct: false },
            { text: "Mars", correct: true },
            { text: "Jupiter", correct: false },
            { text: "Saturn", correct: false },
        ],
    },
    {
        question: "What is the largest ocean on Earth?",
        answers: [
            { text: "Atlantic Ocean", correct: false },
            { text: "Indian Ocean", correct: false },
            { text: "Arctic Ocean", correct: false },
            { text: "Pacific Ocean", correct: true },
        ],
    },
    {
        question: "Which of these is NOT a programming language?",
        answers: [
            { text: "Java", correct: false },
            { text: "Python", correct: false },
            { text: "Banana", correct: true },
            { text: "JavaScript", correct: false },
        ],
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: [
            { text: "Go", correct: false },
            { text: "Gd", correct: false },
            { text: "Au", correct: true },
            { text: "Ag", correct: false },
        ],
    },
];

// Track the user's progress and current app state.
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

// Show the total number of questions anywhere it is needed in the UI.
totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// Start and restart buttons drive the main app flow.
startButton.addEventListener('click', startQuiz);
restartButton.addEventListener('click', restartQuiz);

function startQuiz() {
    // Reset the quiz so every new run starts from a clean state.
    currentQuestionIndex = 0;
    score = 0;
    scoreSpan.textContent = 0;
    progressBar.style.width = '0%';

    // Hide non-quiz screens and show the active question view.
    startScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    quizScreen.classList.add('active');

    // Render the first question.
    showQuestion();
}

function showQuestion() {
    // Allow the user to answer the next question.
    answersDisabled = false;

    // Get the current question object from the quiz data.
    const currentQuestion = quizQuestions[currentQuestionIndex];

    // Update the progress text at the top of the quiz.
    currentQuestionSpan.textContent = currentQuestionIndex + 1;

    // Fill the progress bar based on how many questions have been reached.
    const progressPercent = ((currentQuestionIndex) / quizQuestions.length) * 100;
    progressBar.style.width = progressPercent + '%';

    // Replace the placeholder heading with the actual question.
    questionText.textContent = currentQuestion.question;

    // Clear old answer buttons before rendering the next set.
    answersContainer.innerHTML = '';

    // Create one button for each answer choice in the current question.
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.classList.add('answer-btn');

        // Store whether this answer is correct so it can be checked on click.
        button.dataset.correct = answer.correct;

        // Each answer button uses the same selection handler.
        button.addEventListener('click', selectAnswer);

        answersContainer.appendChild(button);
    })
}

function selectAnswer(event) {
    // Ignore extra clicks after the user has already chosen an answer.
    if (answersDisabled) return

    answersDisabled = true

    // Determine which answer was clicked and whether it is correct.
    const selectedButton = event.target;
    const isCorrect = selectedButton.dataset.correct === 'true'

    // Reveal the correct answer and mark the chosen wrong answer if needed.
    Array.from(answersContainer.children).forEach((button) => {
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        } else if(button === selectedButton){
            button.classList.add('incorrect')
        }
    });

    // Increase the score only when the selected answer is correct.
    if (isCorrect) {
        score++;
        scoreSpan.textContent = score
    }

    // Pause briefly so the user can see the result before moving on.
    setTimeout(() => {
        currentQuestionIndex++;

        // Move to the next question, or finish the quiz if none remain.
        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        }
        else {
            showResults()
        }
    }, 1000)
}

function showResults() {
    // Hide the quiz and reveal the final summary screen.
    quizScreen.classList.remove("active")
    resultScreen.classList.add("active")

    // Display the final score.
    finalScoreSpan.textContent = score;

    // Convert the score to a percentage to choose a matching message.
    const percentage = (score / quizQuestions.length) * 100

    if (percentage === 100) {
        resultMessage.textContent = "Perfect! You're a genius!";
    } else if (percentage >= 80) {
        resultMessage.textContent = "Great job! You know your stuff!";
    } else if (percentage >= 60) {
        resultMessage.textContent = "Good effort! Keep learning!";
    } else if (percentage >= 40) {
        resultMessage.textContent = "Not bad! Try again to improve!";
    } else {
        resultMessage.textContent = "Keep studying! You'll get better!";
    }

}



function restartQuiz() {
    // Remove the result screen before starting over.
    resultScreen.classList.remove("active")

    startQuiz()
}
