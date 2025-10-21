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

function resetGame() {
	currentWager = 0;
	currentChipBalance = 500;
	updateVisibleChipBalances();
	location.reload();
}
/**
 * Prompts for an admin password to reset the wager and update the chip balance.
 *
 * @param {string} correctPassword The correct password for authentication.
 * @param {function} updateVisibleChipBalances A callback function to update the UI chip balances.
 */
function adminReset(correctPassword, updateVisibleChipBalances) {
  // Use prompt() to ask the user for the password.
  const passwordEntered = prompt("Please enter the admin password:");

  if (passwordEntered === correctPassword) {
    // If the password is correct, proceed with the admin actions.
    alert("Password correct. Resetting wager and updating chip balance.");
    
    // 1. Reset currentWager to 0. You must have this variable declared globally or in a accessible scope.
    if (typeof currentWager !== 'undefined') {
      currentWager = 0;
    } else {
      console.error('The variable currentWager is not defined.');
    }

    // 2. Call the updateVisibleChipBalances() function.
    updateVisibleChipBalances();

    // 3. Prompt for the new chip balance.
    let newBalanceInput = prompt("Enter the new chip balance:");
    
    // 4. Update the currentChipBalance, ensuring the input is a valid number.
    const newBalance = parseFloat(newBalanceInput);
    if (!isNaN(newBalance) && typeof currentChipBalance !== 'undefined') {
      currentChipBalance = newBalance;
      alert(`Chip balance updated to: ${currentChipBalance}`);
    } else {
      alert("Invalid number entered for chip balance.");
    }

    // 5. Reload the page.
    location.reload();

  } else {
    alert("Incorrect password. Access denied.");
  }
}

// Example usage:
// For this to work, you would need to define the variables and function globally first.
// Example global variables (place these outside the function in your script)
// let currentWager = 100;
// let currentChipBalance = 500;
// function updateVisibleChipBalances() {
//   console.log('UI chip balances updated.');
// }

// To call the function, you might link it to a button like this:
// document.getElementById('admin-button').addEventListener('click', () => {
//   adminReset('admin', updateVisibleChipBalances);
// });