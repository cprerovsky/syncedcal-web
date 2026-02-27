// Replace this URL with your Google Apps Script Web App URL
// See README.md for setup instructions
const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

document.getElementById('waitlistForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('emailInput').value;
  const btn = this.querySelector('button');
  const success = document.getElementById('formSuccess');

  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, timestamp: new Date().toISOString() })
    });

    this.style.display = 'none';
    success.style.display = 'block';
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Notify Me';
    alert('Something went wrong. Please try again or email us directly.');
  }
});
