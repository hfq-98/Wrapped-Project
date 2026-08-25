# 💬 WhatsApp Wrapped — Interactive Story Engine

An automated, full-stack data visualization engine that transforms raw WhatsApp chat exports into an interactive, mobile-responsive "Wrapped" story experience.

🔗 **Live Demo:** [https://chatwrappedstory.netlify.app](https://chatwrappedstory.netlify.app)

---

## 🌟 Key Features

* **Multi-Format Regex Chat Parser:** Robust Python engine capable of parsing iOS, Android, 12-hour, and 24-hour timestamp formats, handling multi-line messages and dropped attachments seamlessly.
* **Granular Analytics & NLP Filtering:**
  * Total message counts and active conversation day frequency.
  * Individual participation dynamics and average word counts per message.
  * **Night Owl Metrics:** Quantifies late-night activity between 12:00 AM and 5:00 AM.
  * **Reaction Analysis:** Extracts top individual and shared emoji reactions.
  * **Smart Vocabulary Filter:** Stop-word filtering across conversational text to isolate signature vocabulary.
* **Interactive Story-Style Front-End:**
  * Instagram / Spotify Wrapped-inspired UI with timed progress bars.
  * Full touch and tap navigation (Left: previous, Right: next, Hold: pause).
  * Smooth CSS glassmorphism cards and pulsing micro-animations.
* **Privacy-First Architecture:** Local regex parsing decouples sensitive chat logs from the web client; `.gitignore` rules prevent raw personal chat data from ever touching version control.

---

## 🛠️ Architecture & Tech Stack

```text
Wrapped Project/
├── Parser/
│   └── parser.py          # Python parsing engine & data aggregation
├── Web/
│   ├── index.html         # Responsive story container
│   ├── style.css          # Glassmorphism, animations & mobile layouts
│   ├── web.js             # Story state machine & touch handlers
│   └── data.json          # Sanitized aggregate JSON payload
├── .gitignore             # Shields raw chat archives (*.txt, *.zip)
└── README.md
```
* **Backend / Data Pipeline:** Python 3 (Regex, Datetime, JSON serialization, NLP stop-word filtering)
* **Frontend:** Vanilla JavaScript (ES6+), HTML5, Modern CSS (Flexbox, CSS Variables, Keyframe Animations)
* **Deployment & CI/CD:** Netlify, Git, GitHub Desktop

---

## 🚀 Getting Started

### 1. Prerequisites
* Python 3.8+
* A modern web browser

### 2. Export Chat Data
1. Export any WhatsApp chat (without media) as a `.txt` file.
2. Place the file in the project root directory and name it `Sample_chat.txt`.

### 3. Run the Analytics Engine
Execute the parser to generate the structured front-end payload:

```bash
python Parser/parser.py
```
This generates `Web/data.json` with aggregate metrics while keeping raw texts completely local.

### 4. Run the Web App
Open `Web/index.html` in your browser or run a local development server:

```bash
# Using Python built-in server:
cd Web
python -m http.server 8000

```
Visit `http://localhost:8000` to interact with your story.

---

## 🔒 Security & Privacy

Raw WhatsApp chat exports contain sensitive personal data. This repository includes strict `.gitignore` patterns ensuring that:
* No raw `.txt`, `.zip`, or temporary chat logs are tracked or committed.
* Only aggregated, numerical summary metadata in `data.json` is served to the frontend.

---

## 📄 License

Distributed under the MIT License. Feel free to fork, adapt, and build your own custom stories.