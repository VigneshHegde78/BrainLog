<div align="center">

  <h1>Brain.log 🧠</h1>
  
  <p>
    <strong>Your Personal Second Brain.</strong>
  </p>

  <p>
    A minimalist, distraction-free app designed to capture your thoughts, lists, and big ideas instantly. 
    <b>No cloud, no logins, no lag.</b>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a>
  </p>

  <img src="https://img.shields.io/badge/status-stable-green?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/platform-android%20%7C%20ios-blue?style=flat-square" alt="Platform" />

</div>

---

## 🧐 About The Project

Most note-taking apps are too complicated. They ask you to sign up, sync to a cloud, and navigate cluttered menus just to write down a grocery list or a brilliant idea.

**Brain.log** returns to basics. It is a digital pocket notebook that respects your privacy.

- **Writers:** Draft chapters or character ideas.
- **Students:** Take quick class notes without Wi-Fi.
- **Everyone:** Keep track of to-do lists, journals, and daily reminders.

It uses **Markdown**, so your notes are clean, readable, and future-proof.

## ⚡ Features

- **Notes:** Create, edit, tag with `#hashtags`, and search.
- **Lists:** Lightweight checklists with add/edit/reorder and completion.
- **Tasks:** Quick tasks with tap-to-complete.
- **Private:** Secure area for sensitive notes (lock toggle or `#private`).
- **Recently Deleted:** Recover items within 30 days or delete permanently.
- **Backup & Restore:** Export/import your data as a JSON file.
- **Guides & Help:** In‑app, concise how‑to screens for every feature.
- **Dark/Light Theme:** Toggle from Settings.
- **Offline & Private:** No accounts, no cloud, all local.

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) (via [Expo](https://expo.dev/))
- **Language:** TypeScript
- **Navigation:** Expo Router
- **Local Storage:** AsyncStorage (local JSON persistence)
- **File System:** expo‑file‑system v17 (Paths + File API)

## 🚀 Getting Started

To run this project locally on your machine:

### Prerequisites

- Node.js installed
- Expo Go app on your phone (or an Android/iOS Simulator)

### Installation

1.  **Clone the repo**

    ```bash
    git clone [https://github.com/VigneshHegde78/BrainLog.git](https://github.com/VigneshHegde78/BrainLog.git)
    cd BrainLog
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Start the server**

    ```bash
    npx expo start
    ```

4.  **Run on device**
    - Scan the QR code with your Android/iOS camera (or the Expo Go app).

### Build (Android)

```bash
eas build --platform android --profile preview
```

Requires an Expo account and EAS CLI.

## 📚 Usage Guide

- **Notes:** Open the Notes tab → tap + → add title & content → save. Use `#tags` to organize. Long‑press to multi‑select; use search to find.
- **Lists:** Open Lists → tap + → set title → add items; check off when done; long‑press items to reorder (if available).
- **Tasks:** Open Tasks → tap + → enter title → tap checkmark to toggle complete.
- **Private:** Open Private tab → authenticate (if enabled) → tap + to create a private note. Or mark any note private from its editor or by using `#private` / `#secret`.
- **Deleted:** Open Deleted → restore items (within 30 days) or delete permanently.

## 🔐 Backup & Restore

- **Backup:** Settings → Backup Data. Shares a `brainlog_backup.json` via the OS share sheet (Files/Drive/Email). Includes Notes, Lists, and Tasks.
- **Restore:** Settings → Restore Backup. Pick a previously exported JSON file to rehydrate Notes, Lists, and Tasks.
- If the share sheet is unavailable, the file is still written to a temporary app directory.

## 🧭 In‑App Guides

- Go to Settings → Guides & Help.
- Tap a topic (Notes, Lists, Tasks, Private, Deleted, Backup & Restore, Theme, Security) to see short, step‑by‑step instructions.

## 🧩 Development Notes

- **TypeScript:** The project excludes `node_modules` and uses `skipLibCheck` to avoid noisy diagnostics from dependencies. See [tsconfig.json](tsconfig.json) and [.vscode/settings.json](.vscode/settings.json).
- **File System API:** Backup uses the new `Paths`/`File` API. See [src/utils/backup.ts](src/utils/backup.ts).
- **Contexts:** Notes, Lists, and Tasks support `replaceAll()` for restore. See [context/NoteContext.tsx](context/NoteContext.tsx), [context/ListContext.tsx](context/ListContext.tsx), and [context/TaskContext.tsx](context/TaskContext.tsx).

## 🤝 Contributing

Contributions are welcome! If you have an idea to make this better for everyone, feel free to fork the repo and submit a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by Vignesh</p>
</div>
