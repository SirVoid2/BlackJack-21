// --- Your existing game variables ---
var cardsInDeck;

$(document).ready(function() {
  // Initialize Materialize modal
  M.Modal.init(document.querySelectorAll('.modal'));

  // Check if user is logged in and fetch coins
  checkAuth();

  // Fetch cards and initialize
  getCards();
  cardsInDeck = cards;
  updateVisibleChipBalances();

  // Setup event handlers for wager selection
  $('#chip-10').click(() => { selectWager(10); });
  $('#chip-25').click(() => { selectWager(25); });
  $('#chip-50').click(() => { selectWager(50); });
  $('#chip-100').click(() => { selectWager(100); });

  // Setup game control buttons
  $(startButton).click(startGame);
  $(doubleDownButton).click(doubleDown);
  $(hitButton).click(hit);
  $(standButton).click(stand);
  $(playAgainButton).click(newGame);
  $('#reset-game').click(resetGame);

  // Auth buttons
  $('#login-btn').click(async () => {
    const email = $('#auth-email').val();
    const password = $('#auth-password').val();
    const { user, error } = await auth.signIn(email, password);
    if (error) alert(error.message);
    else {
      const coins = await auth.fetchCoins();
      $('.current-chip-balance').text(coins);
      $('#user-info').show();
      $('#auth-modal').modal('close');
    }
  });
  $('#register-btn').click(async () => {
    const email = $('#auth-email').val();
    const password = $('#auth-password').val();
    const { user, error } = await auth.signUp(email, password);
    if (error) alert(error.message);
    else {
      const coins = await auth.fetchCoins();
      $('.current-chip-balance').text(coins);
      $('#user-info').show();
      $('#auth-modal').modal('close');
    }
  });
  $('#logout-btn').click(async () => {
    await auth.signOut();
    $('#user-info').hide();
    $('#auth-modal').modal('open');
  });

  // Additional UI interactions
  $(".rules-nav").click(function() {
    $("#rules").toggle("blind", 500);
  });
  $("#rules-close").click(function() {
    $("#rules").hide();
  });
});

// --- Auth check on page load ---
async function checkAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    window.currentUser = user;
    const coins = await auth.fetchCoins();
    $('.current-chip-balance').text(coins);
    $('#user-info').show();
  } else {
    $('#auth-modal').modal('open');
  }
}

// --- Functions to update coins after game ---
async function updateAccountCoins(delta) {
  if (!window.currentUser) return;
  const currentCoins = await auth.fetchCoins();
  const newBalance = currentCoins + delta;
  await auth.updateCoins(newBalance);
  $('.current-chip-balance').text(newBalance);
}

// --- Your existing game functions (assuming they are in your files) ---
// Example: startGame, hit, stand, etc.
// You should already have these in your other scripts.
// When you finish a game, call updateAccountCoins() with the delta.
