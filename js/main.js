// auth.js - Handles Supabase auth and user coin management

const supabaseUrl = 'https://hnhimobegnykeplmetmf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuaGltb2JlZ255a2VwbG1ldG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTIwMDAsImV4cCI6MjA3NjE4ODAwMH0.QFgGMnlkw0-Kn4uELrM9kPYZQFpUUkbmuHHL-2AK4d0';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

let currentUser = null;

// Initialize auth state
$(document).ready(function() {
  checkAuthState();

  // Auth event handlers
  $('#login-btn').click(handleLogin);
  $('#register-btn').click(handleRegister);
  $('#logout-btn').click(handleLogout);
});

async function checkAuthState() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    currentUser = user;
    showUserInfo(user);
    fetchUserCoins(user.id);
  } else {
    // Show login modal
    M.Modal.getInstance(document.getElementById('auth-modal')).open();
  }
}

function handleLogin() {
  const email = $('#auth-email').val();
  const password = $('#auth-password').val();
  supabase.auth.signIn({ email, password }).then(({ user, error }) => {
    if (error) {
      alert(error.message);
    } else {
      currentUser = user;
      showUserInfo(user);
      fetchUserCoins(user.id);
      M.Modal.getInstance(document.getElementById('auth-modal')).close();
    }
  });
}

function handleRegister() {
  const email = $('#auth-email').val();
  const password = $('#auth-password').val();
  supabase.auth.signUp({ email, password }).then(async ({ user, error }) => {
    if (error) {
      alert(error.message);
    } else {
      // Add user to 'users' table with default coins
      await addUserToDatabase(user.id, email);
      currentUser = user;
      showUserInfo(user);
      fetchUserCoins(user.id);
      M.Modal.getInstance(document.getElementById('auth-modal')).close();
    }
  });
}

function handleLogout() {
  supabase.auth.signOut().then(() => {
    currentUser = null;
    $('#user-info').hide();
    M.Modal.getInstance(document.getElementById('auth-modal')).open();
  });
}

function showUserInfo(user) {
  $('#user-email').text(user.email);
  $('#user-info').show();
}

async function addUserToDatabase(userId, email) {
  await fetch('https://hnhimobegnykeplmetmf.supabase.co/rest/v1/users', {
    method: 'POST',
    headers: {
      'apikey': 'YOUR_API_KEY',
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ id: userId, email: email, coins: 500 })
  });
}

async function fetchUserCoins(userId) {
  const response = await fetch(`https://hnhimobegnykeplmetmf.supabase.co/rest/v1/users?id=eq.${userId}`, {
    headers: {
      'apikey': 'YOUR_API_KEY',
      'Authorization': 'Bearer YOUR_API_KEY'
    }
  });
  const data = await response.json();
  if (data.length > 0) {
    $('.current-chip-balance').text(data[0].coins);
  } else {
    $('.current-chip-balance').text('0');
  }
}

async function updateUserCoins(userId, newCoins) {
  await fetch(`https://hnhimobegnykeplmetmf.supabase.co/rest/v1/users?id=eq.${userId}`, {
    method: 'PATCH',
    headers: {
      'apikey': 'YOUR_API_KEY',
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ coins: newCoins })
  });
  $('.current-chip-balance').text(newCoins);
}