# 📊 Chat Wrapped — Interactive Analytics Platform

A containerized client-side web application and data parsing engine that transforms exported chat archives into an animated story recap.

🔗 **Live Production Demo:** [chatwrapped.netlify.app](https://chatwrapped.netlify.app)

---

## 🏗️ Architecture & Features

```
[ Chat Export (.txt) ] ──► [ Python Parser Engine ] ──► [ data.json ]
│
▼
[ Docker Container (Alpine) ] ◄── [ Static Web Dashboard (HTML5/ES6) ]

```
* **Data Extraction Engine:** Python parser utilizing regex tokenization to process over 41,000+ messages into structured metrics (message distributions, 24-hour heatmaps, word counts, and reaction data).
* **Storytelling UI:** Mobile-responsive slide deck featuring CSS progress bars, interactive background audio, dynamic stat counters, and confetti animations.
* **Portable Containerization:** Packaged using multi-stage Alpine Linux Docker containers for zero-dependency execution across environments.
* **Automated CI/CD:** Integrated automated continuous deployment via Netlify linked directly to the GitHub main branch.

---

## 🐳 Quick Start with Docker

Run the entire application locally with a single command:

```bash
# 1. Clone the repository
git clone https://github.com/hfq-98/Wrapped-Project.git
cd Wrapped-Project
# 2. Build and run container
docker compose up --build -d
```
Open your browser and navigate to http://localhost:8080.

## 🛠️ Tech Stack
* Backend & Automation: Python 3.11, Docker, Docker Compose

* Frontend: Vanilla JavaScript (ES6+), CSS3 Grid & Flexbox, HTML5

* Deployment & Version Control: Netlify, Git, GitHub