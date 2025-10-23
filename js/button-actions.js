// This file contains key interactions that will occur after the player has clicked a button

// Array of questions
const questions = [
    { question: "A period of rapid growth in U.S. manufacturing in the late 1800s.", options: ["First Industrial Revolution", "Second Industrial Revolution", "Enlightenment", "Great Awakening"], answer: "Second Industrial Revolution" },
    { question: "The Bessemer Process was a way to cheaply and quickly make ________.", options: ["Iron", "Steel", "Metal", "Ore"], answer: "Steel" },
    { question: "Exclusive rights to make or sell things.", options: ["Patents", "Copyrights", "Trademarks"], answer: "Patents" },
    { question: "He/They created the electric lightbulb.", options: ["Thomas Edison", "Alexander Graham Bell", "Henry Ford", "Wilbur and Orville Wright"], answer: "Thomas Edison" },
    { question: "He/They created the telephone.", options: ["Thomas Edison", "Alexander Graham Bell", "Henry Ford", "Oliver and Wilbur Wright"], answer: "Alexander Graham Bell" },
    { question: "He/They created the Model T and moving assembly line.", options: ["Thomas Edison", "Alexander Graham Bell", "Henry Ford", "Oliver and Wilbur Wright"], answer: "Henry Ford" },
    { question: "He/They created a lightweight airplane.", options: ["Thomas Edison", "Alexander Graham Bell", "Henry Ford", "Oliver and Wilbur Wright"], answer: "Oliver and Wilbur Wright" },
    { question: "Stock shares sell portions of ownership called corporations.", options: ["True", "False"], answer: "True" },
    { question: "Ownership of business being involved in each step of a manufacturing process.", options: ["Vertical Integration", "Horizontal Integration", "Corporate Integration", "Diagonal Integration"], answer: "Vertical Integration" },
    { question: "A legal arrangement grouping together a number of companies under a single board of directors.", options: ["Trusts", "Corporations", "Partnerships"], answer: "Trusts" },
    { question: "Social Darwinism is the belief that only the strongest survive in society and in business.", options: ["True", "False"], answer: "True" },
    { question: "A monopoly is total ownership of a ______ or service.", options: ["Product", "Market", "Service"], answer: "Product" },
    { question: "A law that made it illegal to create monopolies or trusts that restrained trade.", options: ["Patriot Act", "Sherman Trust Act", "Sherman Anti-Trust Act"], answer: "Sherman Anti-Trust Act" },
    { question: "One of the most admired business people of the time; produced steel.", options: ["Andrew Carnegie", "John D. Rockefeller", "J.P. Morgan"], answer: "Andrew Carnegie" },
    { question: "John D. Rockefeller started a steel-making plant.", options: ["True", "False"], answer: "False" },
    { question: "Leland Stanford made a fortune selling _______ equipment.", options: ["Mining", "Agricultural", "Construction"], answer: "Mining" },
    { question: "Encouraged managers to view workers as interchangeable parts of the production process.", options: ["Samuel Gompers", "Mary Jones", "Frederick Taylor", "Mary Pullman"], answer: "Frederick Taylor" },
    { question: "The first national labor union.", options: ["Knights of Columbus", "Knights of Labor", "AFL"], answer: "Knights of Labor" },
    { question: "Who created the first true labor union in the United States?", options: ["Terence Powderly", "Samuel Gompers", "Frederick Taylor"], answer: "Terence Powderly" },
    { question: "The American Federation of Labor organized local unions.", options: ["True", "False"], answer: "True" },
    { question: "Who led the AFL?", options: ["Samuel Gompers", "Terence Powderly", "Eugene V. Debs"], answer: "Samuel Gompers" },
    { question: "What is collective bargaining?", options: ["Owners making changes via scientific management.", "The belief that workers are parts of the manufacturing process.", "Employees working together in strikes.", "Workers negotiating with their owners."], answer: "Workers negotiating with their owners." },
    { question: "Mary Harris Jones worked for better working conditions for oil refiners.", options: ["True", "False"], answer: "True" },
    { question: "At this event, someone threw a bomb and police opened fire, killing several.", options: ["Haymarket Riot", "Pullman Strike", "Homestead Strike"], answer: "Haymarket Riot" },
    { question: "Strikers protested a plan to buy new machinery and cut jobs.", options: ["Homestead Strike", "Pullman Strike", "Haymarket Riot"], answer: "Homestead Strike" },
    { question: "This stopped traffic, and President Cleveland had to send in federal troops to end the strike.", options: ["Pullman Strike", "Haymarket Riot", "Homestead Strike"], answer: "Pullman Strike" },
    { question: "What did advances in transportation and communications improve in the Second Industrial Revolution?", options: ["Sailing", "Manufacturing", "Transportation and Communication"], answer: "Transportation and Communication" }
];

// Function to pick 5 random questions
function getRandomQuestions() {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
}

// Show questions modal on page load
$(document).ready(function() {
    // Initialize all modals
    $('.modal').modal();

    // Open questions modal immediately
    $('#questions-modal').modal('open');

    // When user clicks the start button after questions
    $('#submit-questions').click(function() {
        // Get answers if needed
        const answers = {
            q1: $('#question1').val(),
            q2: $('#question2').val(),
            q3: $('#question3').val(),
            q4: $('#question4').val(),
            q5: $('#question5').val()
        };
        console.log('Questions Answers:', answers);

        // Proceed to start game
        startGame();
    });
});

// Your existing game functions...
// (Copy your startGame, hit, stand, split, etc. functions here)

// For example:
var startGame = function() {
    getCards();
    if (currentWager === 0) {
        Materialize.toast("You must select a bet to play", 1000);
    } else if (currentChipBalance < 10) {
        Materialize.toast("You're out of chips! Reset the game to continue" , 2000);
    } else if (currentChipBalance < currentWager) {
        Materialize.toast("Insufficient chip balance, please select a lower bet" , 1500);
    } else {
        currentChipBalance -= currentWager;
        updateVisibleChipBalances();
        $("#welcome").hide();
        $("#game-over").hide();
        $(".brand-logo").text("blackjack"); 
        $("#game-board").show("fade", 1000);
        cardsInDeck = cards;
        cardsInDeck.sort(function() {return 0.5 - Math.random()});
        for (let i = 0; i <= 1; i++) {
            setTimeout(function(){
                currentTurn = "player";
                dealCard(playerHand, playerGameBoard);
                currentTurn = "dealer";
                dealCard(dealerHand, dealerGameBoard);
            }, i*1500);
        }
        setTimeout(function(){
            currentTurn = "player";
            if (playerHand.length === 2 && playerHand[0].name === playerHand[1].name) {
                enableButton(splitButton, split);
            }
        }, 2500);
    }
}

// ... (Include all your other game functions: hit, stand, split, doubleDown, newGame, resetGame)	

var hit = function() {
	if (currentTurn === "player") {
		playerStatus = "hit";
		dealCard(playerHand, playerGameBoard);
	} else if (currentTurn === "playerSplit") {
		playerSplitStatus = "hit";
		dealCard(playerSplitHand, playerSplitGameBoard);
	}
}

var stand = function() {
	if (currentTurn === "player") {
		changeHand(playerStatus);
	} else if (currentTurn === "playerSplit") {
		changeHand(playerSplitStatus);
	}
}

var split = function() {
	splitGame = true; 
	playerHandTotal = playerHandTotal - playerHand[1].value;
	playerSplitHandTotal = playerHand[1].value;
	updateVisibleHandTotals();
	$(".split-hand-total").removeClass("inactive").show(); 
	$(playerSplitGameBoard).removeClass("inactive").show();	
	var splitCard = playerHand.pop();
	playerSplitHand.push(splitCard);
	var cardImage = $("#player-card-1").attr("id", "playerSplit-card-0");

	cardImage.hide(); // Hide it at first to allow for the transition to occur
	// This is the first card in the deck, so want to cancel out the previous offset/stacking and have it go to the initial normal spot
	cardImage.appendTo($(playerSplitGameBoard)).offset({left: 60}).css("margin-right", "auto").show();

	currentChipBalance -= currentWager; 
	currentWager = currentWager * 2;
	updateVisibleChipBalances();

	// Then, deal 1 new card for each newly split deck
	currentTurn = "player";
	dealCard(playerHand, playerGameBoard);
	currentTurn = "playerSplit";
	dealCard(playerSplitHand, playerSplitGameBoard);

	// Make split button no longer clickable as in this game you can only split once
	disableButton(splitButton);

	// Shrink the inactive deck to both signal what deck they are playing and to make room on the board
	setTimeout(function(){
		scaleDownDeck(playerSplitGameBoard, playerSplitHandTotalDisplay);
		currentTurn = "player"; 
	}, 1000);

}

function doubleDown() {
	if (currentChipBalance - currentWager <= 0) {
		Materialize.toast("Insufficient chip balance" , 1000);
	}
	else {
		currentChipBalance -= currentWager; //subtracts the same value again from current balance
		currentWager = currentWager * 2;
		updateVisibleChipBalances();
		disableButton(doubleDownButton);
	}
}

function newGame() {
	getCards();
	cardsInDeck = cards;
	gameWinner = "none";
	dealerHand = [];
	dealerHandTotal = 0;
	dealerStatus = "start";
	playerHand = [];
	playerHandTotal = 0;
	playerStatus = "start";  
	playerHasAce = false;  
	splitGame = false; 
	isGameOver = false;
	playerSplitHand = [];
	playerSplitHandTotal = 0;
	playerSplitStatus = "start";

	if (currentWager === 0) { 
		Materialize.toast("You must select a bet to play", 1000);
	} else {	
		$(playerSplitGameBoard).hide();
		$(".split-hand-total").hide();
		enableButton(standButton, stand);
		enableButton(hitButton, hit);
		enableButton(doubleDownButton, doubleDown);
		dealerGameBoard.empty();
		playerGameBoard.empty();
		playerSplitGameBoard.empty();
		updateVisibleHandTotals();
		startGame(); 		
	}
}

function resetGame() {
	currentChipBalance = 200;
	currentWager = 0;
	updateVisibleChipBalances();
	location.reload();
}