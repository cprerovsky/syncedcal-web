// Replace this URL with your Google Apps Script Web App URL
// See README.md for setup instructions
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby8LQeRPaO6lS5Rnml9CsWIDmpjLckzTMNEndKDhqt1URntP-CtXBscVYFrRUmRe0Ay/exec';

// Focus email input when CTA buttons are clicked
function focusEmail(e) {
  const input = document.getElementById('emailInput');
  if (input) {
    setTimeout(() => input.focus(), 400); // slight delay to let scroll finish
  }
}

// Privacy level toggle
const privacyDescriptions = {
  full: 'Event titles and times are synced as-is. Your family sees exactly what\'s in your calendar.',
  private: 'Events marked as private in your calendar sync as "Private". Everything else syncs with full details.',
  busy: 'All work events sync as "Busy". Your family sees when you\'re unavailable, nothing more.'
};

const mockCaptions = {
  full: 'All event titles visible',
  private: 'Private events shown as "Private"',
  busy: 'All work events shown as "Busy"'
};

function setPrivacy(level) {
  // Update tabs
  document.querySelectorAll('.privacy-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.level === level);
  });

  // Update description
  document.getElementById('privacyDesc').textContent = privacyDescriptions[level];
  document.getElementById('mockCaption').textContent = mockCaptions[level];

  // Update event titles in mock calendar
  document.querySelectorAll('.event-title[data-full]').forEach(el => {
    el.textContent = el.dataset[level] || el.dataset.full;
    const isRedacted = (level === 'busy' || level === 'private') && el.dataset[level] !== el.dataset.full;
    el.style.color = isRedacted ? 'var(--text-muted)' : '';
    el.style.fontStyle = isRedacted ? 'italic' : '';
  });
}

// Waitlist form
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
    btn.textContent = 'Notify me when it launches';
    alert('Something went wrong. Please try again or email us at hello@syncedcal.com');
  }
});
