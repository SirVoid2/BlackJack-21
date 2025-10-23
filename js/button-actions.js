// Quiz questions array
const questions = [
    { question: 'A period of rapid growth in U.S. manufacturing in the late 1800s.', options: ['First Industrial Revolution', 'Second Industrial Revolution', 'Enlightenment', 'Great Awakening'], answer: 'Second Industrial Revolution' },
    { question: 'The Bessemer Process was a way to cheaply and quickly make ________.', options: ['Iron', 'Steel', 'Metal', 'Ore'], answer: 'Steel' },
    { question: 'Exclusive rights to make or sell things.', options: ['Patents', 'Copyrights', 'Trademarks'], answer: 'Patents' },
    { question: 'He/They created the electric lightbulb.', options: ['Thomas Edison', 'Alexander Graham Bell', 'Henry Ford', 'Wilbur and Orville Wright'], answer: 'Thomas Edison' },
    { question: 'He/They created the telephone.', options: ['Thomas Edison', 'Alexander Graham Bell', 'Henry Ford', 'Oliver and Wilbur Wright'], answer: 'Alexander Graham Bell' },
    { question: 'He/They created the Model T and moving assembly line.', options: ['Thomas Edison', 'Alexander Graham Bell', 'Henry Ford', 'Oliver and Wilbur Wright'], answer: 'Henry Ford' },
    { question: 'He/They created a lightweight airplane.', options: ['Thomas Edison', 'Alexander Graham Bell', 'Henry Ford', 'Oliver and Wilbur Wright'], answer: 'Oliver and Wilbur Wright' },
    { question: 'Stock shares sell portions of ownership called corporations.', options: ['True', 'False'], answer: 'True' },
    { question: 'Ownership of business being involved in each step of a manufacturing process.', options: ['Vertical Integration', 'Horizontal Integration', 'Corporate Integration', 'Diagonal Integration'], answer: 'Vertical Integration' },
    { question: 'A legal arrangement grouping together a number of companies under a single board of directors.', options: ['Trusts', 'Corporations', 'Partnerships'], answer: 'Trusts' },
    { question: 'Social Darwinism is the belief that only the strongest survive in society and in business.', options: ['True', 'False'], answer: 'True' },
    { question: 'A monopoly is total ownership of a ______ or service.', options: ['Product', 'Market', 'Service'], answer: 'Product' },
    { question: 'A law that made it illegal to create monopolies or trusts that restrained trade.', options: ['Patriot Act', 'Sherman Trust Act', 'Sherman Anti-Trust Act'], answer: 'Sherman Anti-Trust Act' },
    { question: 'One of the most admired business people of the time; produced steel.', options: ['Andrew Carnegie', 'John D. Rockefeller', 'J.P. Morgan'], answer: 'Andrew Carnegie' },
    { question: 'John D. Rockefeller started a steel-making plant.', options: ['True', 'False'], answer: 'False' },
    { question: 'Leland Stanford made a fortune selling _______ equipment.', options: ['Mining', 'Agricultural', 'Construction'], answer: 'Mining' },
    { question: 'Encouraged managers to view workers as interchangeable parts of the production process.', options: ['Samuel Gompers', 'Mary Jones', 'Frederick Taylor', 'Mary Pullman'], answer: 'Frederick Taylor' },
    { question: 'The first national labor union.', options: ['Knights of Columbus', 'Knights of Labor', 'AFL'], answer: 'Knights of Labor' },
    { question: 'Who created the first true labor union in the United States?', options: ['Terence Powderly', 'Samuel Gompers', 'Frederick Taylor'], answer: 'Terence Powderly' },
    { question: 'The American Federation of Labor organized local unions.', options: ['True', 'False'], answer: 'True' },
    { question: 'Who led the AFL?', options: ['Samuel Gompers', 'Terence Powderly', 'Eugene V. Debs'], answer: 'Samuel Gompers' },
    { question: 'What is collective bargaining?', options: ['Owners making changes via scientific management.', 'The belief that workers are parts of the manufacturing process.', 'Employees working together in strikes.', 'Workers negotiating with their owners.'], answer: 'Workers negotiating with their owners.' },
    { question: 'Mary Harris Jones worked for better working conditions for oil refiners.', options: ['True', 'False'], answer: 'True' },
    { question: 'At this event, someone threw a bomb and police opened fire, killing several.', options: ['Haymarket Riot', 'Pullman Strike', 'Homestead Strike'], answer: 'Haymarket Riot' },
    { question: 'Strikers protested a plan to buy new machinery and cut jobs.', options: ['Homestead Strike', 'Pullman Strike', 'Haymarket Riot'], answer: 'Homestead Strike' },
    { question: 'This stopped traffic, and President Cleveland had to send in federal troops to end the strike.', options: ['Pullman Strike', 'Haymarket Riot', 'Homestead Strike'], answer: 'Pullman Strike' },
    { question: 'What did advances in transportation and communications improve in the Second Industrial Revolution?', options: ['Sailing', 'Manufacturing', 'Transportation and Communication'], answer: 'Transportation and Communication' }
];

let currentQuestions;
let currentQuestionIndex = 0;
let score = 0;

const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const endScreen = document.getElementById('end-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const finalScore = document.getElementById('final-score');
const totalQuestionsSpan = document.getElementById('total-questions');
const feedback = document.getElementById('feedback');
const questionCount = document.getElementById('question-count');

// Add a new modal popup to the HTML dynamically for the 5-question pre-quiz
const modalHtml = `
    <div id="popup-modal" class="modal-overlay hidden">
        <div class="modal-content">
            <h3>Quick Quiz to Start</h3>
            <p>Answer these 5 random questions to begin the full quiz.</p>
            <div id="popup-questions"></div>
            <button id="submit-popup" class="submit-btn">Submit Answers</button>
        </div>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHtml);

const popupModal = document.getElementById('popup-modal');
const popupQuestionsContainer = document.getElementById('popup-questions');
const submitPopupBtn = document.getElementById('submit-popup');

// Function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to show the popup with 5 random questions
function showPopupQuiz() {
    // Hide the start screen
    startScreen.classList.add('hidden');
    
    // Select 5 random questions
    const randomQuestions = shuffle([...questions]).slice(0, 5);
    popupQuestionsContainer.innerHTML = ''; // Clear previous questions
    
    randomQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('popup-question');
        questionDiv.innerHTML = `
            <p><strong>${q.question}</strong></p>
            ${q.options.map(option => `
                <label>
                    <input type="radio" name="popup-q${index}" value="${option}">
                    ${option}
                </label>
            `).join('')}
        `;
        popupQuestionsContainer.appendChild(questionDiv);
    });

    popupModal.classList.remove('hidden');
}

// Function to handle the quiz submission from the popup
submitPopupBtn.addEventListener('click', () => {
    let allCorrect = true;
    const popupQuestions = popupQuestionsContainer.querySelectorAll('.popup-question');
    
    popupQuestions.forEach((q, index) => {
        const selectedOption = q.querySelector(`input[name="popup-q${index}"]:checked`);
        const correspondingQuestion = questions.find(item => item.question === q.querySelector('strong').textContent);
        
        if (!selectedOption || selectedOption.value !== correspondingQuestion.answer) {
            allCorrect = false;
        }
    });

    if (allCorrect) {
        alert('All 5 questions correct! You can now proceed to the main quiz.');
        popupModal.classList.add('hidden');
        startMainQuiz();
    } else {
        alert('Some answers were incorrect. Please try again.');
        showPopupQuiz(); // Re-show with new random questions
    }
});

// Function to start the main quiz
function startMainQuiz() {
    currentQuestions = shuffle([...questions]);
    currentQuestionIndex = 0;
    score = 0;
    quizScreen.classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex < currentQuestions.length) {
        const question = currentQuestions[currentQuestionIndex];
        questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
        questionText.textContent = question.question;
        optionsContainer.innerHTML = '';
        feedback.textContent = '';
        nextBtn.classList.add('hidden');

        shuffle(question.options).forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-btn');
            button.addEventListener('click', () => checkAnswer(button, option, question.answer));
            optionsContainer.appendChild(button);
        });
    } else {
        showEndScreen();
    }
}

function checkAnswer(button, selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        feedback.textContent = 'Correct!';
        feedback.style.color = 'green';
        score++;
    } else {
        feedback.textContent = `Incorrect. The correct answer was: ${correctAnswer}`;
        feedback.style.color = 'red';
        button.style.backgroundColor = '#f8d7da'; // Highlight incorrect choice
    }

    // Disable all options after an answer is selected
    Array.from(optionsContainer.children).forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.style.backgroundColor = 'lightgreen'; // Highlight correct answer
        }
    });

    nextBtn.classList.remove('hidden');
}

function showEndScreen() {
    quizScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    finalScore.textContent = score;
    totalQuestionsSpan.textContent = currentQuestions.length;
}

startBtn.addEventListener('click', showPopupQuiz);
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    showQuestion();
});
document.getElementById('restart-btn').addEventListener('click', () => {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});
