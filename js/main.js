// --- User Data and Initialization ---
var usersData = {};
var currentUser = null;
var currentCoins = 0;

$.getJSON('users.json', function(data) {
  usersData = data;

  // Prompt user until valid or canceled
  var username = null;
  while (true) {
    username = prompt("Please enter your username:");
    if (username === null || username.trim() === "") {
      alert("Username not found. Please try again.");
    }
    if (usersData[username]) {
      // Valid user
      break;
    } else {
      alert("Username not found. Please try again.");
    }
  }

  // Load user's coins
  currentUser = username;
  currentCoins = usersData[currentUser].coins;

  // Update UI
  $(".current-chip-balance").text(currentCoins);

  // Continue with game setup
  getCards();
  cardsInDeck = cards;
  updateVisibleChipBalances();
});

// Function to update coins during gameplay
function updateCoins(newAmount) {
  currentCoins = newAmount;
  usersData[currentUser].coins = currentCoins;
  localStorage.setItem('usersData', JSON.stringify(usersData));
  $(".current-chip-balance").text(currentCoins);
}

// --- Your existing game code ---

var currentTurn = "player";
var currentWager = 0;
var currentChipBalance = localStorage.getItem('blackjackChips') || 500;
var gameWinner = "none"; // To be declared at end of game
var isGameOver = false;

// Dealer hand and starting totals
var dealerHand = [];
var dealerHandTotal = 0;
var dealerGameBoard = $("#dealer");
var dealerStatus = "start"; // Possible statuses are start, stand, hit

// Player hand and starting totals
var playerHand = [];
var playerHandTotal = 0;
var playerGameBoard = $("#user-hand");
var playerHandTotalDisplay = $(".hand-total");
var playerStatus = "start";  // Possible statuses are start, stand, hit

// Handling aces
var playerHasAce = false;

// Split mode variables
var splitGame = false;
var playerSplitHand = [];
var playerSplitHandTotal = 0;
var playerSplitGameBoard = $("#user-split-hand");
var playerSplitHandTotalDisplay = $(".split-hand-total");
var playerSplitStatus;

// Buttons
var startButton = $("#start-game-button");
var doubleDownButton = $("#double-down-button");
var hitButton = $("#hit-button");
var standButton = $("#stand-button");
var splitButton = $(".split-button");
var playAgainButton = $(".new-game-button");

// Helper functions
function disableButton(btn) {
  $(btn).off();
  $(btn).addClass("disabled-button");
}

function enableButton(btn, handler) {
  $(btn).off().click(handler);
  $(btn).removeClass("disabled-button");
}

function updateVisibleChipBalances() {
  $(".current-wager").text(currentWager);
  $(".current-chip-balance").text(currentChipBalance);
  localStorage.setItem('blackjackChips', currentChipBalance);
}

function updateVisibleHandTotals() {
  $(playerHandTotalDisplay).text(playerHandTotal);
  $(playerSplitHandTotalDisplay).text(playerSplitHandTotal);
  if (dealerHand.length === 2 && !isGameOver && dealerStatus === "start") {
    $(".dealer-hand-total").text(dealerHandTotal - dealerHand[1].value);
  } else {
    $(".dealer-hand-total").text(dealerHandTotal);
  }
}

function selectWager(amount) {
  currentWager = amount;
  updateVisibleChipBalances();
}

function flipHiddenCard() {
  if (dealerHand.length === 2) {
    $("#dealer-card-1").addClass("flipped");
    setTimeout(function() {
      $("#dealer-card-1").attr("src", "img/" + dealerHand[1].src);
      updateVisibleHandTotals();
    }, 250);
  }
}

function scaleDownDeck(deck, totalDisplay) {
  $(totalDisplay).addClass("splithand-scaledown");
  $(deck).addClass("splithand-scaledown");
}

function enlargeDeck(deck, totalDisplay) {
  $(totalDisplay).removeClass("splithand-scaledown");
  $(deck).removeClass("splithand-scaledown");
}

// UI toggles
$(".rules-nav").click(function() {
  $("#rules").toggle("blind", 500);
});
$("#rules-close").click(function() {
  $("#rules").hide();
});

// Modal setup
$(".modal").modal({
  dismissible: false,
  opacity: 0.40,
  inDuration: 300,
  outDuration: 200,
  startingTop: "10%",
  endingTop: "10%"
});

// Event handlers for chips
$("#chip-10").click(function() { selectWager(10); });
$("#chip-25").click(function() { selectWager(25); });
$("#chip-50").click(function() { selectWager(50); });
$("#chip-100").click(function() { selectWager(100); });

// Buttons
$(startButton).click(startGame);
$(doubleDownButton).click(doubleDown);
$(hitButton).click(hit);
$(standButton).click(stand);
$(playAgainButton).click(newGame);
$("#reset-game").click(resetGame);

$(".reduce-aces-button").click(function() {
  reduceAcesValue(playerHand);
  disableButton(splitButton);
});