// Replace this URL with your Google Apps Script Web App URL
// See README.md for setup instructions
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby8LQeRPaO6lS5Rnml9CsWIDmpjLckzTMNEndKDhqt1URntP-CtXBscVYFrRUmRe0Ay/exec';

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
  document.querySelectorAll('.privacy-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.level === level);
  });

  document.getElementById('privacyDesc').textContent = privacyDescriptions[level];
  document.getElementById('mockCaption').textContent = mockCaptions[level];

  document.querySelectorAll('.event-title[data-full]').forEach(el => {
    const val = el.dataset[level] || el.dataset.full;
    el.textContent = val;
    const isRedacted = val !== el.dataset.full;
    el.style.color = isRedacted ? 'var(--text-muted)' : '';
    el.style.fontStyle = isRedacted ? 'italic' : '';
  });
}

// Attach privacy tabs after DOM ready
document.addEventListener('DOMContentLoaded', function() {

  // Privacy tabs
  document.querySelectorAll('.privacy-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      setPrivacy(this.dataset.level);
    });
  });

  // CTA buttons focus email
  document.querySelectorAll('[data-focus-email]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const input = document.getElementById('emailInput');
      if (input) {
        setTimeout(() => {
          input.focus();
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    });
  });

  // Inline waitlist form
  const inlineForm = document.getElementById('inlineWaitlistForm');
  if (inlineForm) {
    inlineForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const email = document.getElementById('inlineEmailInput').value;
      const btn = this.querySelector('button');
      const success = document.getElementById('inlineFormSuccess');
      btn.disabled = true;
      btn.textContent = '...';
      try {
        const body = new URLSearchParams({ email, timestamp: new Date().toISOString() });
        await fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body });
        inlineForm.style.display = 'none';
        success.style.display = 'block';
      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Notify me';
      }
    });
  }

  // Waitlist form
  const form = document.getElementById('waitlistForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const email = document.getElementById('emailInput').value;
      const btn = this.querySelector('button');
      const success = document.getElementById('formSuccess');

      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        const body = new URLSearchParams({ email, timestamp: new Date().toISOString() });
        await fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body });
        form.style.display = 'none';
        success.style.display = 'block';
      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Notify me when it launches';
        alert('Something went wrong. Please try again or email us at hello@syncedcal.com');
      }
    });
  }
});
