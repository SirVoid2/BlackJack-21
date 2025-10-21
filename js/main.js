// Starting game board values
var cardsInDeck;

$(document).ready(function() {
  getCards();
  cardsInDeck = cards;
  updateVisibleChipBalances();

  // Initialize Materialize modal
  M.Modal.init(document.querySelectorAll('.modal'));

  // Setup event handlers
  setupAuthState();
  setupWagerHandlers();
  setupGameHandlers();
  setupRules();

  // Additional initializations if needed
});

// Your existing game logic:

var currentTurn = "player";
var currentWager = 0;
var currentChipBalance = localStorage.getItem('blackjackChips') || 500;
var gameWinner = "none"; // To be declared at end of game
var isGameOver = false;

// Dealer hand and starting totals
var dealerHand = [];
var dealerHandTotal = 0;
var dealerGameBoard = $("#dealer");
var dealerStatus = "start"; // Possible statuses: start, stand, hit

// Player hand and starting totals
var playerHand = [];
var playerHandTotal = 0;
var playerGameBoard = $("#user-hand");
var playerHandTotalDisplay = $(".hand-total");
var playerStatus = "start"; // Possible statuses: start, stand, hit

// Because aces can be 1 or 11, need to know if player has aces
var playerHasAce = false;  

// Player split game variables
var splitGame = false; // default false
var playerSplitHand = [];
var playerSplitHandTotal = 0;
var playerSplitGameBoard = $("#user-split-hand");
var playerSplitHandTotalDisplay = $(".split-hand-total");
var playerSplitStatus;

// Buttons from DOM
var startButton = $("#start-game-button");
var doubleDownButton = $("#double-down-button");
var hitButton = $("#hit-button");
var standButton = $("#stand-button");
var splitButton = $(".split-button");
var playAgainButton = $(".new-game-button"); 

// Deactivates a button (event listener + appearance)
function disableButton(buttonName) {
  $(buttonName).off();
  $(buttonName).addClass("disabled-button");
}

// Activates a button (event listener + appearance)
function enableButton(buttonName, event) {
  $(buttonName).click(event);
  $(buttonName).removeClass("disabled-button");
}

// Update chip balances displayed
function updateVisibleChipBalances() {
  $(".current-wager").text(currentWager);
  $(".current-chip-balance").text(currentChipBalance);
  localStorage.setItem('blackjackChips', currentChipBalance);
}

// Update hand totals displayed
function updateVisibleHandTotals() {
  $(playerHandTotalDisplay).text(playerHandTotal);
  $(playerSplitHandTotalDisplay).text(playerSplitHandTotal);

  // Show only 1st dealer card value if game not over
  if (dealerHand.length === 2 && isGameOver === false && dealerStatus === "start") {
    $(".dealer-hand-total").text(dealerHandTotal - dealerHand[1].value);
  } else {
    $(".dealer-hand-total").text(dealerHandTotal);
  }
}

// Called when player clicks on a wager chip
function selectWager(amount){
  currentWager = amount;
  updateVisibleChipBalances();
}

// Flip dealer's hidden card
function flipHiddenCard() {
  if (dealerHand.length === 2) {
    $("#dealer-card-1").addClass("flipped");
    setTimeout(function(){
      $("#dealer-card-1").attr("src", "img/" + dealerHand[1].src);
      updateVisibleHandTotals();
    }, 250);	
  } 
}

// In split mode, shrink inactive deck
function scaleDownDeck(deck, totalDisplay) {
  $(totalDisplay).addClass("splithand-scaledown");
  $(deck).addClass("splithand-scaledown");
}

// Enlarge deck in split mode
function enlargeDeck(deck, totalDisplay) {
  $(totalDisplay).removeClass("splithand-scaledown");
  $(deck).removeClass("splithand-scaledown");
}

// Toggle rules overlay
$(".rules-nav").click(function(){
  $("#rules").toggle("blind", 500);
});

$("#rules-close").click(function(){
  $("#rules").hide();
});

// Initialize Materialize modal
$(".modal").modal({ 
  dismissible: false, 
  opacity: .40, 
  inDuration: 300, 
  outDuration: 200, 
  startingTop: "10%", 
  endingTop: "10%", 
});

// Event listeners for wager chips
$("#chip-10").click(function(){selectWager(10)});
$("#chip-25").click(function(){selectWager(25)});
$("#chip-50").click(function(){selectWager(50)});
$("#chip-100").click(function(){selectWager(100)});

// Button handlers
$(startButton).click(startGame);
$(doubleDownButton).click(doubleDown); 
$(hitButton).click(hit);
$(standButton).click(stand);
$(playAgainButton).click(newGame);
$("#reset-game").click(resetGame);

$(".reduce-aces-button").click(function(){
  reduceAcesValue(playerHand);
  disableButton(splitButton);
});

// Setup game handlers (assuming these functions are defined elsewhere)
function setupGameHandlers() {
  // Implement your game event handlers or call existing functions here if needed
}

// Setup rules overlay
function setupRules() {
  // Already handled above
}