# WhatsApp Contact Extractor

A Chrome extension that exports your WhatsApp Web contacts with names, phone numbers, and country codes. Built for personal backup and contact management (Specially if your phone is lost/Stolen) — everything runs locally in your browser.

**Author:** Azib Pasha

---

## Features

- Extract contacts from WhatsApp Web (IndexedDB first, DOM fallback)
- Split numbers into **country code** and **phone number**
- Filter by saved contacts, groups, and numbers-only
- Export **CSV** (`Group`, `Label`, `Name`, `Whatsapp Name`, `Country Code`, `Phone Number`)
- Export **vCard 3.0 (`.vcf`)** for import on phones
- Live status and counts in the popup
- No backend — contacts never leave your machine

---

## Screenshots

Load the extension, open [WhatsApp Web](https://web.whatsapp.com), then use the popup to extract and download.

---

## Install (unpacked)

This is a **Manifest V3** Chrome extension. It is not published on the Chrome Web Store; you load it yourself.

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked**.
5. Select this project folder.

Optional icons: if you want custom toolbar icons, install [Pillow](https://pypi.org/project/Pillow/) and run:

```bash
pip install pillow
python generate_icons.py
```

Then add `icon16.png`, `icon48.png`, and `icon128.png` to `manifest.json` under `action.default_icon` / `icons` if you wish.

---

## How to use

1. Open [https://web.whatsapp.com](https://web.whatsapp.com) and wait until chats are fully loaded.
2. Click the extension icon.
3. Choose filters:
   - **Only saved contacts** — contacts stored in your phone (recommended)
   - **Include group chats** — off by default
   - **Only contacts with phone numbers** — on by default
4. Click **Extract Contacts**.
5. Download **CSV** and/or **VCF**.

CSV files open in Excel, Google Sheets, or any spreadsheet app. VCF files can be imported into iOS, Android, Google Contacts, and Outlook.

---

## How it works

The content script runs on `web.whatsapp.com` and tries WhatsApp Web’s local `model-storage` IndexedDB (`contact` store). That is the reliable path for names and numbers. If the database is unavailable, it falls back to visible chat titles in the DOM (names only — no phone numbers).

Phone strings are parsed against a large set of international country codes so exports keep country code and national number in separate columns.

---

## Project structure

```
├── manifest.json      # Manifest V3, host permission for WhatsApp Web
├── popup.html         # Extension popup UI
├── popup.js           # Extract + CSV/VCF download
├── content.js         # IndexedDB / DOM extraction
└── generate_icons.py  # Optional PNG icon generator
```

**Permissions:** `activeTab`, `scripting`, `storage`, and host access to `https://web.whatsapp.com/*`.

---

## Privacy

- Extraction happens in your browser only.
- No analytics, no remote APIs, no uploaded contact lists.
- Use this only on **your own** WhatsApp account.

WhatsApp Web’s UI and storage format can change. If extraction fails, refresh WhatsApp Web and try again.

---

## Disclaimer

This project is for personal, lawful use (backing up your own contacts). It is not affiliated with WhatsApp or Meta. WhatsApp’s terms of service may restrict automated access; use at your own risk.

---

## License

Personal project by Azib Pasha. Add a license file (for example MIT) if you want others to reuse the code.
