// js/auth.js
const supabaseUrl = 'https://hnhimobegnykeplmetmf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuaGltb2JlZ255a2VwbG1ldG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTIwMDAsImV4cCI6MjA3NjE4ODAwMH0.QFgGMnlkw0-Kn4uELrM9kPYZQFpUUkbmuHHL-2AK4d0';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

window.currentUser = null;

async function signUp(email, password) {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (!error && user) {
    await fetch('https://hnhimobegnykeplmetmf.supabase.co/rest/v1/users', {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': 'Bearer ' + supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: user.id, email: email, coins: 1000 }),
    });
    window.currentUser = user;
  }
  return { user, error };
}

async function signIn(email, password) {
  const { user, error } = await supabase.auth.signIn({ email, password });
  if (!error && user) {
    window.currentUser = user;
  }
  return { user, error };
}

async function signOut() {
  await supabase.auth.signOut();
  window.currentUser = null;
}

async function fetchCoins() {
  if (!window.currentUser) return 0;
  const res = await fetch(`https://hnhimobegnykeplmetmf.supabase.co/rest/v1/users?id=eq.${window.currentUser.id}`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': 'Bearer ' + supabaseKey,
    }
  });
  const data = await res.json();
  if (data.length > 0) return data[0].coins;
  return 0;
}

async function updateCoins(newCoins) {
  if (!window.currentUser) return;
  await fetch(`https://hnhimobegnykeplmetmf.supabase.co/rest/v1/users?id=eq.${window.currentUser.id}`, {
    method: 'PATCH',
    headers: {
      'apikey': supabaseKey,
      'Authorization': 'Bearer ' + supabaseKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ coins: newCoins }),
  });
}

// Expose globally
window.auth = {
  signUp,
  signIn,
  signOut,
  fetchCoins,
  updateCoins
};