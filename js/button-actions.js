// This file contains key interactions that will occur after the player has clicked a button

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

// Assuming these variables are defined elsewhere in your script
let currentChipBalance = 0;
let currentWager = 0;

// Function to update the displayed chip balances.
// You will need to implement this part based on your HTML structure.
function updateVisibleChipBalances() {
  console.log(`Current Chip Balance: ${currentChipBalance}`);
  console.log(`Current Wager: ${currentWager}`);
  // Example for updating a specific HTML element:
  // document.getElementById('chipBalanceDisplay').textContent = currentChipBalance;
}

function resetGame() {
  const password = prompt("Please enter the admin password to reset the game:");
  const correctPassword = "admin123";

  if (password === correctPassword) {
    // If the password is correct, ask for the amount to update
    const amountToAdd = prompt("Enter the amount to update the chip balance:");

    // Check if the amount is a valid number
    const newAmount = Number(amountToAdd);
    if (!isNaN(newAmount) && newAmount !== null) {
      currentChipBalance += newAmount; // Update the balance
      currentWager = 0; // Reset the wager
      updateVisibleChipBalances(); // Update the visible balance on the page
      alert(`Chip balance updated. New balance is: ${currentChipBalance}`);
      location.reload(); // Reload the page to reset the game
    } else if (amountToAdd !== null) {
      alert("Invalid amount. Please enter a valid number.");
    }
  } else if (password !== null) {
    alert("Incorrect password. Access denied.");
  }
}

// Example usage of the function
// You would call this function from a button click or other event
// resetGame();
