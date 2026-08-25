document.addEventListener("DOMContentLoaded", async () => {
  const slidesContainer = document.getElementById("slides-container");
  const progressContainer = document.getElementById("progress-bars");
  const tapLeft = document.getElementById("tap-left");
  const tapRight = document.getElementById("tap-right");
  const audioToggle = document.getElementById("audio-toggle");
  const bgAudio = document.getElementById("bg-audio");

  let currentSlide = 0;
  let timer = null;
  const slideDuration = 6000;
  let startTime = 0;
  let isPaused = false;
  let slidesData = [];

  try {
    const response = await fetch("data.json");
    const data = await response.json();
    slidesData = buildSlides(data);
    renderApp();
  } catch (err) {
    slidesContainer.innerHTML = `<div class="slide active"><p>Error loading data.json</p></div>`;
  }

  function buildSlides(data) {
    const participants = Object.keys(data.participants);
    const p1 = participants[0] || "User 1";
    const p2 = participants[1] || "User 2";
    const p1Data = data.participants[p1] || {};
    const p2Data = data.participants[p2] || {};

    return [
      // Slide 1: 18-Year Friendship Intro
    {
      tag: "🤝 18 Years in the Making",
      title: "Since 3rd Grade",
      subtitle: `${p1} & ${p2} • 18 Years of Friendship`,
      body: `
        <div class="intro-badge-container">
          <div class="glow-avatar-badge">🎒 ➔ 🎮 ➔ 📱</div>
          <p class="intro-highlight-text">
            18 years of inside jokes, endless banter, and life updates — broken down into 
            <strong>${(data.summary?.total_messages || data.total_messages || 0).toLocaleString()}</strong> messages.
          </p>
          <div class="intro-sub-card">
            <span>📅 WhatsApp Archive: <strong>${data.summary?.start_date || "Start"}</strong> to <strong>${data.summary?.end_date || "Now"}</strong></span>
          </div>
        </div>
      `,
      footer: "Tap right to unwrap the stats →"
    },
      // Slide 2: General Stats with Full Date Span
      {
        tag: "✨ Wrapped Overview",
        title: "Every Message.<br>Every Memory.",
        subtitle: `${data.summary.start_date || "2018"} → ${data.summary.end_date || "Present"} • ${data.summary.total_days_active} active chat days`,
        body: `
          <div class="stat-card">
            <div>Total Messages Exchanged</div>
            <div class="stat-number">${data.summary.total_messages.toLocaleString()}</div>
            <div>Most active date: <b>${data.summary.top_chat_date[0]}</b> (${data.summary.top_chat_date[1]} texts)</div>
          </div>
        `,
        footer: "Tap right to continue →"
      },
      // Slide 3: Chat Dynamics
      {
        tag: "💬 Chat Dynamics",
        title: "Who Talked More?",
        subtitle: "Message volume and verbosity breakdown.",
        body: `
          <div class="stat-card">
            <div class="participant-bar">
              <div class="participant-meta"><span>${p1}</span> <span>${p1Data.percentage || 0}%</span></div>
              <div class="bar-bg"><div class="bar-fill" style="width: ${p1Data.percentage || 0}%"></div></div>
              <div style="font-size: 12px; margin-top: 4px; color: #94a3b8;">${(p1Data.messages || 0).toLocaleString()} texts • ~${p1Data.avg_words_per_msg || 0} words/msg</div>
            </div>
            <div class="participant-bar">
              <div class="participant-meta"><span>${p2}</span> <span>${p2Data.percentage || 0}%</span></div>
              <div class="bar-bg"><div class="bar-fill" style="width: ${p2Data.percentage || 0}%"></div></div>
              <div style="font-size: 12px; margin-top: 4px; color: #94a3b8;">${(p2Data.messages || 0).toLocaleString()} texts • ~${p2Data.avg_words_per_msg || 0} words/msg</div>
            </div>
          </div>
        `,
        footer: "Tap to continue • Hold to pause"
      },
      // Slide 4: Timing, Night Owls & Calls
      {
        tag: "🌙 Timing & Habits",
        title: "Peak Hour Vibes.",
        subtitle: `You both chatted most around ${data.summary.peak_hour}.`,
        body: `
          <div class="stat-card">
            <div style="margin-bottom: 16px;">
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">🦉 Late Night Texts (10PM - 5AM)</div>
              <div style="font-size: 13px; color: #cbd5e1;">${p1}: <b>${(p1Data.night_owl_msgs || 0).toLocaleString()}</b> msgs</div>
              <div style="font-size: 13px; color: #cbd5e1;">${p2}: <b>${(p2Data.night_owl_msgs || 0).toLocaleString()}</b> msgs</div>
            </div>
            <div>
              <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">📞 Calls Logged</div>
              <div class="stat-number" style="font-size: 32px; color: #a78bfa;">${data.summary.total_calls.toLocaleString()}</div>
            </div>
          </div>
        `,
        footer: "Tap to continue"
      },
      // Slide 5: Signature Emojis
      {
        tag: "👀 Signature Reactions",
        title: "Top Emojis.",
        subtitle: "The most frequent expressions used.",
        body: `
          <div class="stat-card">
            <div style="font-weight: 600; margin-bottom: 6px;">${p1}</div>
            <div class="emoji-grid">${(p1Data.top_emojis || []).join(" ") || "—"}</div>
            <div style="font-weight: 600; margin-top: 18px; margin-bottom: 6px;">${p2}</div>
            <div class="emoji-grid">${(p2Data.top_emojis || []).join(" ") || "—"}</div>
          </div>
        `,
        footer: "Tap to continue"
      },
      // Slide 6: Signature Vocabulary
      {
        tag: "🗣️ Signature Words",
        title: "Top Vocabulary.",
        subtitle: "Words that defined the conversation.",
        body: `
          <div class="stat-card">
            <div style="margin-bottom: 12px;">
              <div style="font-weight: 600; margin-bottom: 4px; color: #38bdf8;">${p1}'s Top Words</div>
              <div style="font-size: 14px; color: #e2e8f0;">${(p1Data.top_words || []).join(", ") || "—"}</div>
            </div>
            <div>
              <div style="font-weight: 600; margin-bottom: 4px; color: #ec4899;">${p2}'s Top Words</div>
              <div style="font-size: 14px; color: #e2e8f0;">${(p2Data.top_words || []).join(", ") || "—"}</div>
            </div>
          </div>
        `,
        footer: "Tap to replay ↺"
      }
    ];
  }

  function renderApp() {
    progressContainer.innerHTML = slidesData.map((_, i) => `
      <div class="progress-track"><div class="progress-fill" id="fill-${i}"></div></div>
    `).join("");

    slidesContainer.innerHTML = slidesData.map((s, i) => `
      <div class="slide ${i === 0 ? 'active' : ''}" id="slide-${i}">
        <div>
          <span class="tag">${s.tag}</span>
          <h1>${s.title}</h1>
          <p style="color: #94a3b8; font-size: 14px;">${s.subtitle}</p>
        </div>
        ${s.body}
        <div class="footer-tip">${s.footer}</div>
      </div>
    `).join("");

    startSlide(0);
  }

  function startSlide(index) {
    if (index < 0) return;
    if (index >= slidesData.length) {
      startSlide(0);
      return;
    }
    currentSlide = index;

    document.querySelectorAll(".slide").forEach((s, i) => {
      s.classList.toggle("active", i === index);
    });

    document.querySelectorAll(".progress-fill").forEach((fill, i) => {
      if (i < index) fill.style.width = "100%";
      else fill.style.width = "0%";
    });

    cancelAnimationFrame(timer);
    startTime = Date.now();
    animateProgress();
  }

  function animateProgress() {
    if (isPaused) return;
    const elapsed = Date.now() - startTime;
    const progress = Math.min((elapsed / slideDuration) * 100, 100);
    
    const fill = document.getElementById(`fill-${currentSlide}`);
    if (fill) fill.style.width = `${progress}%`;

    if (progress < 100) {
      timer = requestAnimationFrame(animateProgress);
    } else {
      if (currentSlide < slidesData.length - 1) {
        startSlide(currentSlide + 1);
      }
    }
  }

  tapRight.addEventListener("click", () => {
    if (currentSlide < slidesData.length - 1) startSlide(currentSlide + 1);
    else startSlide(0);
  });

  tapLeft.addEventListener("click", () => {
    if (currentSlide > 0) startSlide(currentSlide - 1);
  });

  audioToggle.addEventListener("click", () => {
    if (bgAudio.paused) {
      bgAudio.play().catch(() => {});
      audioToggle.textContent = "🔊";
    } else {
      bgAudio.pause();
      audioToggle.textContent = "🎵";
    }
  });
});