# SyncedCal – Landing Page

Hosted on GitHub Pages at syncedcal.com.

## Setup: Email Capture via Google Apps Script

To activate the waitlist form, you need a Google Apps Script Web App that writes emails to a Google Sheet.

### Step 1: Create a Google Sheet

Create a new Google Sheet with two columns: `Email` and `Timestamp`.

### Step 2: Create the Apps Script

1. In the Sheet: Extensions > Apps Script
2. Paste this code:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.email, data.timestamp]);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Deploy: Deploy > New deployment > Web app
   - Execute as: Me
   - Who has access: Anyone
4. Copy the Web App URL

### Step 3: Add the URL to script.js

In `script.js`, replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web App URL.

## GitHub Pages Setup

1. Go to repo Settings > Pages
2. Source: Deploy from branch > main > / (root)
3. Add custom domain: syncedcal.com

## Privacy Policy

Remember to fill in `privacy.html` with your actual privacy policy before launching.
