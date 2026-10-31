(function () {
  "use strict";
  const topics = window.BRIGHTLANE_TOPICS;
  const main = document.getElementById("main");
  const key = "brightlane-progress-v1";
  let state = { studied: [], scores: {} };
  let persistent = true;
  let quiz = null;
  function storageWarning() {
    persistent = false;
    document.getElementById("storage-note").textContent = "Browser storage is unavailable. Progress works for this visit only; it will not survive a reload.";
  }
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed || !Array.isArray(parsed.studied) || !parsed.scores || typeof parsed.scores !== "object" || Array.isArray(parsed.scores)) throw new Error("Invalid saved progress");
      state.studied = topics.filter(t => parsed.studied.includes(t.id)).map(t => t.id);
      topics.forEach(t => {
        const score = parsed.scores[t.id];
        if (Number.isInteger(score) && score >= 0 && score <= t.questions.length) state.scores[t.id] = score;
      });
    }
  } catch (error) {
    console.warn("Brightlane could not restore progress:", error);
    storageWarning();
  }
  function save() {
    if (persistent) {
      try { localStorage.setItem(key, JSON.stringify(state)); }
      catch (error) { console.warn("Brightlane could not save progress:", error); storageWarning(); }
    }
    updateProgress();
  }
  function updateProgress() {
    document.getElementById("progress-count").textContent = state.studied.length + " of " + topics.length + " lessons studied";
    document.getElementById("study-progress").value = state.studied.length;
  }
  function esc(value) {
    return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  const label = subject => subject === "maths" ? "Maths" : "English";
  const totalQuestions = topics.reduce((sum, t) => sum + t.questions.length, 0);
  const coverage = "A broad UK 11+ foundation, not a guarantee of every school's exam content. Schools and providers vary in topic depth, format and writing requirements. Check your target school's current guidance. Verbal and non-verbal reasoning are not separate subjects here.";
  function home() {
    main.innerHTML = `
      <section class="hero" aria-labelledby="welcome">
        <div><p class="eyebrow">A LITTLE LEARNING. A BRIGHTER FUTURE.</p><h1 id="welcome">Big ideas.<br>Small steps.<br><em>Your 11+ journey.</em></h1>
        <p class="intro">Build confidence in Maths and English, one topic at a time. Clear explanations, worked examples and practice that helps it all click.</p><a class="cta" href="#maths">Explore your topics <span aria-hidden="true">&#8594;</span></a></div>
        <div class="hero-illustration" aria-hidden="true"><div class="art-circle"></div><span class="art-spark">&#10022;</span><div class="book">Aa</div><div class="math-tile">x +</div></div>
      </section>
      <div class="stats" aria-label="Site contents"><div class="stat"><strong>${topics.length}</strong><span>topic lessons<br>to explore</span></div><div class="stat"><strong>${totalQuestions}</strong><span>practice questions<br>with explanations</span></div><div class="stat"><strong>100%</strong><span>offline-ready<br>no sign-in needed</span></div></div>
      <section aria-labelledby="subjects"><div class="section-heading"><h2 id="subjects">What will you discover today?</h2><p>Pick a subject. Find your next small win.</p></div>
      <div class="subject-grid">${["maths", "english"].map(subject => {
        const count = topics.filter(t => t.subject === subject).length;
        return `<a class="subject-card ${subject}" href="#${subject}"><div class="subject-art" aria-hidden="true"><span class="subject-symbol">${subject === "maths" ? "123" : "Aa"}</span><span class="mini-grid">${subject === "maths" ? "&#9651; &nbsp; +<br>1/2 &nbsp; =" : "a story<br>starts here."}</span></div><div class="subject-body"><span class="tag">THINK ${subject === "maths" ? "LOGICALLY" : "CREATIVELY"}</span><h3>${label(subject)}</h3><p>${subject === "maths" ? "From fractions to shapes, discover the patterns and methods behind the numbers." : "Explore words, understand stories and find confidence in your own voice."}</p><div class="card-bottom"><span>${count} topics &middot; ${count * 3} questions</span><span class="card-arrow" aria-hidden="true">&#8594;</span></div></div></a>`;
      }).join("")}</div></section>
      <section class="practice-banner"><span class="badge" aria-hidden="true">&#10022;</span><div><h3>A little practice goes a long way.</h3><p>Try a short mixed set. No timer, no pressure, just progress.</p></div><a class="cta" href="#practice">Let's practise <span aria-hidden="true">&#8594;</span></a></section>
      <p class="coverage-note">${coverage}</p>
      <p class="coverage-note">${persistent ? `${state.studied.length} of ${topics.length} lessons marked studied. Progress is saved on this device.` : "Browser storage is unavailable. Progress is kept only for this visit."} Studied means you chose to mark a lesson; it is not a mastery assessment.</p>
      <button class="text-button" id="home-reset" type="button">Reset saved progress</button><p class="status-line" id="home-reset-note" role="status"></p>`;
    document.getElementById("home-reset").addEventListener("click", () => {
      const note = document.getElementById("home-reset-note");
      note.innerHTML = `Clear studied lessons and scores? <button class="small-button" id="home-confirm" type="button">Yes, clear</button> <button class="text-button" id="home-cancel" type="button">Cancel</button>`;
      document.getElementById("home-confirm").addEventListener("click", () => { state = { studied: [], scores: {} }; save(); home(); document.getElementById("home-reset-note").textContent = "Progress cleared."; });
      document.getElementById("home-cancel").addEventListener("click", () => { note.textContent = ""; document.getElementById("home-reset").focus(); });
      document.getElementById("home-confirm").focus();
    });
  }
  function topicCards(list) {
    return list.map(t => {
      const index = topics.filter(item => item.subject === t.subject).indexOf(t) + 1;
      const studied = state.studied.includes(t.id);
      const score = state.scores[t.id];
      return `<a class="topic-card ${t.subject}" href="#topic/${t.id}"><span class="topic-number">${String(index).padStart(2, "0")}</span><div><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p><span class="topic-meta">${studied ? "Studied" : "Lesson + worked example"} &middot; ${score === undefined ? "3 practice questions" : "Best practice: " + score + "/3"}</span></div></a>`;
    }).join("");
  }
  function subjectPage(subject) {
    const list = topics.filter(t => t.subject === subject);
    main.innerHTML = `<div class="page-header"><p class="eyebrow">YOUR ${label(subject).toUpperCase()} TOOLKIT</p><h1>${label(subject)}, one idea at a time.</h1><p>${subject === "maths" ? "Build solid methods, spot useful patterns and make sense of the numbers." : "Read closely, choose words thoughtfully and write with clarity."} Start anywhere or follow the topics in order.</p></div><div class="search-row"><input id="topic-search" type="search" placeholder="Find a topic or skill..." aria-label="Search ${label(subject)} topics"><span class="result-count" id="result-count" aria-live="polite">${list.length} topics</span></div><div class="topic-grid" id="topic-results">${topicCards(list)}</div><p class="coverage-note">${coverage}</p>`;
    document.getElementById("topic-search").addEventListener("input", event => {
      const query = event.target.value.trim().toLocaleLowerCase("en-GB");
      const matches = list.filter(t => [t.title, t.summary, ...t.learn].join(" ").toLocaleLowerCase("en-GB").includes(query));
      document.getElementById("topic-results").innerHTML = matches.length ? topicCards(matches) : `<p class="empty">No topics match. Try a broader word, such as "fraction", "verb" or "angle".</p>`;
      document.getElementById("result-count").textContent = matches.length + (matches.length === 1 ? " topic" : " topics");
    });
  }
  function lesson(t) {
    const list = topics.filter(item => item.subject === t.subject);
    const index = list.indexOf(t);
    main.innerHTML = `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="#home">Overview</a><span aria-hidden="true">/</span><a href="#${t.subject}">${label(t.subject)}</a><span aria-hidden="true">/</span><span>${esc(t.title)}</span></nav>
      <div class="lesson-layout"><article><header class="lesson-header"><p class="eyebrow">${label(t.subject)} &middot; TOPIC ${index + 1} OF ${list.length}</p><h1>${esc(t.title)}</h1><p>${esc(t.summary)}</p></header>
      <section class="lesson-block"><h2>The key ideas</h2><ul>${t.learn.map(p => `<li>${esc(p)}</li>`).join("")}</ul></section>
      ${t.passage ? `<section class="lesson-block"><h2>Read &amp; explore</h2><p class="eyebrow">AN ORIGINAL BRIGHTLANE PASSAGE</p><div class="passage">${esc(t.passage)}</div></section>` : ""}
      <section class="lesson-block worked-example"><p class="eyebrow">LET'S WORK IT THROUGH</p><h2>${t.subject === "maths" ? "Worked example" : "Example in action"}</h2><p><strong>${esc(t.example[0])}</strong></p><p>${esc(t.example[1])}</p></section>
      <section class="lesson-block pitfall"><h2>Watch out for...</h2><p>${esc(t.pitfall)}</p></section>
      <section class="practice-panel" id="lesson-practice" aria-label="Topic practice"></section>
      <div class="lesson-actions"><button class="secondary-button" id="mark-studied" type="button">${state.studied.includes(t.id) ? "Studied - undo" : "Mark lesson as studied"}</button>${index + 1 < list.length ? `<a class="cta" href="#topic/${list[index + 1].id}">Next topic <span aria-hidden="true">&#8594;</span></a>` : `<a class="cta" href="#${t.subject}">Back to ${label(t.subject)} topics</a>`}</div><p class="status-line" id="lesson-status" role="status"></p>
      </article><aside class="lesson-side" aria-label="Study steps"><p class="eyebrow">YOUR NEXT SMALL WIN</p><h2>Make it stick.</h2><ol><li>Read the key ideas.</li><li>Follow the example.</li><li>Try three questions.</li><li>Explain it in your own words.</li></ol><p>Use paper for working. Mistakes are useful clues about what to revisit.</p><a class="secondary-button" href="#practice">Try mixed practice</a></aside></div>`;
    document.getElementById("mark-studied").addEventListener("click", event => {
      const studied = state.studied.includes(t.id);
      state.studied = studied ? state.studied.filter(id => id !== t.id) : [...state.studied, t.id];
      save();
      event.target.textContent = studied ? "Mark lesson as studied" : "Studied - undo";
      document.getElementById("lesson-status").textContent = studied ? "Lesson removed from studied list." : "Lesson marked studied." + (persistent ? "" : " This will last for this visit only.");
    });
    startQuiz(t.questions.map(q => ({ ...q, topic: t })), "lesson-practice", t.id);
  }
  function practicePage() {
    quiz = null;
    main.innerHTML = `<div class="page-header"><p class="eyebrow">CONFIDENCE COMES WITH PRACTICE</p><h1>A fresh mix. A small challenge.</h1><p>Choose a subject and a set size. Questions are shuffled from the same lesson bank, with feedback after every answer. No timer: take your time and use paper for working.</p></div><div class="filters"><label>Subject<select id="practice-subject"><option value="all">Maths &amp; English</option><option value="maths">Maths only</option><option value="english">English only</option></select></label><label>Set size<select id="practice-size"><option value="5">5 questions</option><option value="10">10 questions</option><option value="15">15 questions</option></select></label></div><p class="start-row"><button class="cta" id="start-mixed" type="button">Start a practice set <span aria-hidden="true">&#8594;</span></button></p><section class="practice-panel" id="mixed-quiz" hidden aria-label="Mixed practice"></section><p class="coverage-note">English questions include their original passage where needed. Mixed scores are for this set only; completing a topic set records your best score for that lesson.</p>`;
    document.getElementById("start-mixed").addEventListener("click", () => {
      const subject = document.getElementById("practice-subject").value;
      const count = Number(document.getElementById("practice-size").value);
      const bank = topics.filter(t => subject === "all" || t.subject === subject).flatMap(t => t.questions.map(q => ({ ...q, topic: t })));
      for (let i = bank.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bank[i], bank[j]] = [bank[j], bank[i]];
      }
      document.getElementById("mixed-quiz").hidden = false;
      document.getElementById("start-mixed").textContent = "Start a new set";
      startQuiz(bank.slice(0, count), "mixed-quiz", null);
      document.getElementById("mixed-quiz").scrollIntoView({ block: "start", behavior: "auto" });
      focusQuiz();
    });
  }
  function startQuiz(items, target, topicId) {
    quiz = { items, target, topicId, index: 0, correct: 0, checked: false };
    renderQuiz();
  }
  function focusQuiz() {
    const heading = document.querySelector("#" + quiz.target + " h2");
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  }
  function renderQuiz() {
    const panel = document.getElementById(quiz.target);
    if (quiz.index === quiz.items.length) {
      if (quiz.topicId) {
        state.scores[quiz.topicId] = Math.max(state.scores[quiz.topicId] || 0, quiz.correct);
        save();
      }
      panel.innerHTML = `<div class="quiz-complete"><p class="eyebrow">SET COMPLETE</p><h2>You got ${quiz.correct} of ${quiz.items.length} correct.</h2><h3>${quiz.correct === quiz.items.length ? "A lovely little win." : "Every answer is a chance to learn."}</h3><p>${quiz.correct === quiz.items.length ? "Try explaining one answer aloud. Understanding the reason matters more than remembering the option." : "Revisit the key ideas and examples, then try again. Your first attempt does not define your ability."}</p>${quiz.topicId ? `<p>Best topic score: ${state.scores[quiz.topicId]}/${quiz.items.length}.${persistent ? "" : " Saved for this visit only."}</p>` : ""}<button class="cta" id="retry-quiz" type="button">Try this set again</button></div>`;
      document.getElementById("retry-quiz").addEventListener("click", () => { quiz.index = 0; quiz.correct = 0; quiz.checked = false; renderQuiz(); focusQuiz(); });
      return;
    }
    const item = quiz.items[quiz.index];
    panel.innerHTML = `<div class="quiz-meta"><span>Question ${quiz.index + 1} of ${quiz.items.length}</span><span>${label(item.topic.subject)} &middot; ${esc(item.topic.title)}</span></div><h2>Check your understanding</h2>
      ${!quiz.topicId && item.topic.passage ? `<details open><summary>Passage for this question</summary><div class="passage">${esc(item.topic.passage)}</div></details>` : ""}
      <form id="answer-form"><fieldset class="choices"><legend class="question">${esc(item.q)}</legend>${item.options.map((option, i) => `<label class="choice"><input type="radio" name="answer" value="${i}"><span>${esc(option)}</span></label>`).join("")}</fieldset><div class="quiz-controls"><button class="cta" id="check-answer" type="submit">Check answer</button><span class="quiz-message" id="quiz-message" role="status"></span></div></form><div id="answer-feedback" aria-live="polite"></div>`;
    document.getElementById("answer-form").addEventListener("submit", event => {
      event.preventDefault();
      if (quiz.checked) return;
      const selected = panel.querySelector('input[name="answer"]:checked');
      if (!selected) { document.getElementById("quiz-message").textContent = "Choose an answer first."; return; }
      quiz.checked = true;
      const correct = Number(selected.value) === item.answer;
      if (correct) quiz.correct++;
      panel.querySelectorAll('input[name="answer"]').forEach(input => { input.disabled = true; });
      document.getElementById("check-answer").disabled = true;
      document.getElementById("quiz-message").textContent = "";
      document.getElementById("answer-feedback").innerHTML = `<div class="feedback ${correct ? "" : "incorrect"}"><strong>${correct ? "That's right." : "Not quite - let's work it through."}</strong><p>Answer: <strong>${esc(item.options[item.answer])}</strong></p><p>${esc(item.why)}</p></div><div class="quiz-controls"><button class="cta" id="next-question" type="button">${quiz.index + 1 === quiz.items.length ? "See your result" : "Next question"} <span aria-hidden="true">&#8594;</span></button>${!quiz.topicId ? `<a href="#topic/${item.topic.id}" class="text-button">Review this lesson (leaves set)</a>` : ""}</div>`;
      document.getElementById("next-question").addEventListener("click", () => { quiz.index++; quiz.checked = false; renderQuiz(); focusQuiz(); });
      document.getElementById("next-question").focus({ preventScroll: true });
    });
  }
  function route(initial) {
    const path = location.hash.slice(1) || "home";
    let page = path;
    quiz = null;
    if (path === "home") home();
    else if (path === "maths" || path === "english") subjectPage(path);
    else if (path === "practice") practicePage();
    else if (path.startsWith("topic/")) {
      const t = topics.find(item => item.id === path.slice(6));
      if (t) { page = t.subject; lesson(t); }
      else { page = "home"; main.innerHTML = `<div class="page-header"><h1>Topic not found.</h1><p>This link does not match a bundled lesson.</p></div><a class="cta" href="#home">Back to overview</a>`; }
    } else {
      page = "home";
      main.innerHTML = `<div class="page-header"><h1>Page not found.</h1><p>Choose a subject from the navigation to continue.</p></div><a class="cta" href="#home">Back to overview</a>`;
    }
    document.querySelectorAll("[data-page]").forEach(a => {
      if (a.dataset.page === page) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    const heading = main.querySelector("h1");
    document.title = (heading ? heading.textContent : "Study") + " | Brightlane 11+";
    if (!initial) { window.scrollTo(0, 0); main.focus({ preventScroll: true }); }
  }
  document.getElementById("reset-progress").addEventListener("click", () => {
    document.getElementById("reset-confirm").hidden = false;
    document.getElementById("confirm-reset").focus();
  });
  document.getElementById("cancel-reset").addEventListener("click", () => {
    document.getElementById("reset-confirm").hidden = true;
    document.getElementById("reset-progress").focus();
  });
  document.getElementById("confirm-reset").addEventListener("click", () => {
    state = { studied: [], scores: {} }; save();
    document.getElementById("reset-confirm").hidden = true;
    route(false);
  });
  document.querySelector(".skip-link").addEventListener("click", event => {
    event.preventDefault();
    main.focus();
    main.scrollIntoView({ block: "start" });
  });
  window.addEventListener("hashchange", () => route(false));
  updateProgress();
  route(true);
})();
