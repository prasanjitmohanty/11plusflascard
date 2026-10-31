(function () {
  "use strict";
  const topics = window.BRIGHTLANE_TOPICS;
  const main = document.getElementById("main");
  const key = "brightlane-progress-v1";
  const progress = window.BRIGHTLANE_PROGRESS;
  let state = progress.empty();
  let persistent = true;
  let quiz = null;
  let exam = null;
  let deck = null;
  let cardFilters = { subject: "all", topic: "all" };
  let timer = null;
  let pendingImport = null;
  let importRevision = 0;
  function notice(message) {
    const element = document.getElementById("global-notice");
    element.textContent = message;
    element.hidden = false;
  }
  function storageWarning() {
    persistent = false;
    document.getElementById("storage-note").textContent = "Browser storage is unavailable. Progress works for this visit only; it will not survive a reload.";
    notice("Progress cannot be saved in this browser. Use Progress > Export backup to keep a copy before leaving.");
  }
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      state = progress.migrate(JSON.parse(saved));
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
  function resetState() {
    stopTimer();
    ++importRevision;
    state = progress.empty(); exam = null; deck = null; quiz = null; pendingImport = null;
    cardFilters = { subject: "all", topic: "all" };
    save();
  }
  function recordAttempt(items, answers, mode, kind, seconds = 0, expired = false) {
    const attempt = { id: "result-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10), at: new Date().toISOString(), mode, kind, seconds, expired, questionIds: items.map(q => q.id), answers: answers.slice() };
    state.attempts.push(attempt);
    state.attempts = state.attempts.slice(-100);
    save();
    return attempt;
  }
  function updateProgress() {
    document.getElementById("progress-count").textContent = state.studied.length + " of " + topics.length + " lessons studied";
    document.getElementById("study-progress").value = state.studied.length;
  }
  function esc(value) {
    return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  const label = subject => subject === "maths" ? "Maths" : "English";
  const testLabel = mode => mode === "mixed" ? "Mixed" : label(mode);
  const totalQuestions = topics.reduce((sum, t) => sum + t.questions.length, 0);
  const studyMaterials = window.BRIGHTLANE_STUDY_MATERIALS;
  const allQuestionCount = totalQuestions + window.BRIGHTLANE_TEST_BANK.length + studyMaterials.readings.reduce((sum, reading) => sum + reading.questions.length, 0);
  const coverage = "2027 preparation edition: for UK 11+ exams taken in 2027, not a universal school entry year. This is a broad foundation, not an official 2027 syllabus or a guarantee of every school's exam content. Schools and providers vary in topic depth, format and writing requirements. Check their current guidance for requirements, exam dates and the relevant school entry year. Verbal and non-verbal reasoning are not separate subjects here.";
  function home() {
    main.innerHTML = `
      <section class="hero" aria-labelledby="welcome">
        <div><p class="eyebrow">2027 PREPARATION EDITION</p><h1 id="welcome">Big ideas.<br>Small steps.<br><em>Your 11+ journey.</em></h1>
        <p class="intro">Build confidence in Maths and English, one topic at a time. Clear explanations, worked examples and practice that helps it all click.</p><a class="cta" href="#maths">Explore your topics <span aria-hidden="true">&#8594;</span></a></div>
        <div class="hero-illustration" aria-hidden="true"><div class="art-circle"></div><span class="art-spark">&#10022;</span><div class="book">Aa</div><div class="math-tile">x +</div></div>
      </section>
      <div class="stats" aria-label="Site contents"><div class="stat"><strong>${topics.length}</strong><span>topic lessons<br>to explore</span></div><div class="stat"><strong>${allQuestionCount}</strong><span>unique practice questions<br>with explanations</span></div><div class="stat"><strong>100%</strong><span>offline-ready<br>no sign-in needed</span></div></div>
      <section aria-labelledby="subjects"><div class="section-heading"><h2 id="subjects">What will you discover today?</h2><p>Pick a subject. Find your next small win.</p></div>
      <div class="subject-grid">${["maths", "english"].map(subject => {
        const count = topics.filter(t => t.subject === subject).length;
        return `<a class="subject-card ${subject}" href="#${subject}"><div class="subject-art" aria-hidden="true"><span class="subject-symbol">${subject === "maths" ? "123" : "Aa"}</span><span class="mini-grid">${subject === "maths" ? "&#9651; &nbsp; +<br>1/2 &nbsp; =" : "a story<br>starts here."}</span></div><div class="subject-body"><span class="tag">THINK ${subject === "maths" ? "LOGICALLY" : "CREATIVELY"}</span><h3>${label(subject)}</h3><p>${subject === "maths" ? "From fractions to shapes, discover the patterns and methods behind the numbers." : "Explore words, understand stories and find confidence in your own voice."}</p><div class="card-bottom"><span>${count} topics &middot; ${count * 3} questions</span><span class="card-arrow" aria-hidden="true">&#8594;</span></div></div></a>`;
      }).join("")}</div></section>
      <section class="practice-banner"><span class="badge" aria-hidden="true">&#10022;</span><div><h3>A little practice goes a long way.</h3><p>Try a short mixed set. No timer, no pressure, just progress.</p></div><a class="cta" href="#practice">Let's practise <span aria-hidden="true">&#8594;</span></a></section>
      <section class="test-banner"><div><p class="eyebrow">READY FOR A BIGGER STEP?</p><h2>Put your learning together.</h2><p>Maths, English and mixed tests, untimed or with an optional timer. Submit for your score and explained review.</p></div><a class="secondary-button" href="#tests">${exam ? "Return to your test" : "Explore practice tests"} <span aria-hidden="true">&#8594;</span></a></section>
      <section class="test-banner flashcard-banner"><div><p class="eyebrow">RECALL A LITTLE, REMEMBER MORE</p><h2>Turn an idea into a small win.</h2><p>${window.BRIGHTLANE_FLASHCARDS.length} flashcards across Maths and English. Try recalling the answer, then reveal and choose what to revisit.</p></div><a class="secondary-button" href="#flashcards">${deck ? "Return to flashcards" : "Explore flashcards"} <span aria-hidden="true">&#8594;</span></a></section>
      <section class="test-banner"><div><p class="eyebrow">YOUR PREPARATION TOOLKIT</p><h2>Plan, practise, review.</h2><p>See accuracy from real answers, revisit mistakes, save a backup and build a plan around your own confirmed 2027 exam date.</p></div><div class="quiz-controls"><a class="secondary-button" href="#dashboard">Your progress</a><a class="secondary-button" href="#planner">Study planner</a></div></section>
      <p class="coverage-note">${coverage}</p>
      <p class="coverage-note">${persistent ? `${state.studied.length} of ${topics.length} lessons marked studied. Progress is saved on this device.` : "Browser storage is unavailable. Progress is kept only for this visit."} Studied means you chose to mark a lesson; it is not a mastery assessment.</p>
      <button class="text-button" id="home-reset" type="button">Reset saved progress</button><p class="status-line" id="home-reset-note" role="status"></p>`;
    document.getElementById("home-reset").addEventListener("click", () => {
      const note = document.getElementById("home-reset-note");
      note.innerHTML = `Clear all lessons, results, flashcard ratings and planner data? Export a backup from Progress first if needed. <button class="small-button" id="home-confirm" type="button">Yes, clear</button> <button class="text-button" id="home-cancel" type="button">Cancel</button>`;
      document.getElementById("home-confirm").addEventListener("click", () => { resetState(); home(); document.getElementById("home-reset-note").textContent = "Progress cleared."; });
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
    startQuiz(progress.questions.filter(q => q.topicId === t.id && q.id.includes("-lesson-")), "lesson-practice", t.id);
  }
  function practicePage() {
    quiz = null;
    main.innerHTML = `<div class="page-header"><p class="eyebrow">CONFIDENCE COMES WITH PRACTICE</p><h1>A fresh mix. A small challenge.</h1><p>Choose a subject and a set size. Questions are shuffled from the same lesson bank, with feedback after every answer. No timer: take your time and use paper for working.</p></div><div class="filters"><label>Subject<select id="practice-subject"><option value="all">Maths &amp; English</option><option value="maths">Maths only</option><option value="english">English only</option></select></label><label>Set size<select id="practice-size"><option value="5">5 questions</option><option value="10">10 questions</option><option value="15">15 questions</option></select></label></div><p class="start-row"><button class="cta" id="start-mixed" type="button">Start a practice set <span aria-hidden="true">&#8594;</span></button></p><section class="practice-panel" id="mixed-quiz" hidden aria-label="Mixed practice"></section><p class="coverage-note">English questions include their original passage where needed. Mixed scores are for this set only; completing a topic set records your best score for that lesson.</p>`;
    document.getElementById("start-mixed").addEventListener("click", () => {
      const subject = document.getElementById("practice-subject").value;
      const count = Number(document.getElementById("practice-size").value);
      const bank = progress.questions.filter(q => q.id.includes("-lesson-") && (subject === "all" || q.topic.subject === subject));
      shuffle(bank);
      document.getElementById("mixed-quiz").hidden = false;
      document.getElementById("start-mixed").textContent = "Start a new set";
      startQuiz(bank.slice(0, count), "mixed-quiz", null);
      document.getElementById("mixed-quiz").scrollIntoView({ block: "start", behavior: "auto" });
      focusQuiz();
    });
  }
  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }
  function answerChoices(item, selected = null) {
    return `<fieldset class="choices"><legend class="question">${esc(item.q)}</legend>${item.options.map((option, i) => `<label class="choice"><input type="radio" name="answer" value="${i}"${selected === i ? " checked" : ""}><span>${esc(option)}</span></label>`).join("")}</fieldset>`;
  }
  function startRevision(items) {
    if (!items.length) { notice("No incorrect or unanswered questions need revision yet."); return; }
    const subjects = new Set(items.map(q => q.topic.subject));
    const mode = subjects.size > 1 ? "mixed" : items[0].topic.subject;
    location.hash = "tests";
    startTest(mode, shuffle(items.slice()).slice(0, 60), 0, "revision");
  }
  function dashboardPage() {
    const evidence = progress.evidence(state);
    const tested = evidence.filter(item => item.total > 0);
    const answered = tested.reduce((sum, item) => sum + item.total, 0);
    const correct = tested.reduce((sum, item) => sum + item.correct, 0);
    const missed = progress.missed(state);
    const again = Object.values(state.cardRatings).filter(value => value === "again").length;
    main.innerHTML = `<div class="page-header"><p class="eyebrow">YOUR PREPARATION TOOLKIT</p><h1>Progress with evidence.</h1><p>Use real answers to choose your next topic, not a made-up mastery score. ${persistent ? "Results, ratings and planner data save in this browser." : "Storage is unavailable: export a backup before leaving."}</p></div>
      <div class="stats"><div class="stat"><strong>${state.studied.length}/30</strong><span>lessons studied<br>self-reported</span></div><div class="stat"><strong>${answered ? Math.round(correct / answered * 100) + "%" : "No data"}</strong><span>${correct}/${answered} correct<br>completed question attempts</span></div><div class="stat"><strong>${Object.values(state.cardRatings).filter(value => value === "known").length}/60</strong><span>flashcards known<br>self-assessed</span></div></div>
      <section class="lesson-block"><h2>Target your next revision</h2><p>Questions are included when their latest recorded answer is incorrect or blank. A later correct answer removes them from this list. Repeats are practice, not fresh exam evidence. Revision sets contain up to 60 questions; complete another round if more remain.</p><p class="coverage-note">Starting revision or opening a saved result replaces any unfinished test without recording it. A running timer otherwise continues while you visit these pages.</p><div class="quiz-controls"><button id="revise-mistakes" class="cta" type="button"${missed.length ? "" : " disabled"}>Revise mistakes (${missed.length})</button><button id="revise-cards" class="secondary-button" type="button"${again ? "" : " disabled"}>Practise-again flashcards (${again})</button><a class="secondary-button" href="#planner">Your study planner</a></div></section>
      <section class="lesson-block"><h2>Topic accuracy &amp; revision priorities</h2><p class="coverage-note">Based only on completed practice, tests and revision results retained here. Blank answers count as zero. Repeated questions count again. Small samples are uncertain; no answers means no accuracy evidence. Historical best lesson scores alone do not establish accuracy.</p><div class="evidence-list">${evidence.slice().sort((a, b) => {
        if (!a.total || !b.total) return Number(!a.total) - Number(!b.total);
        return a.correct / a.total - b.correct / b.total;
      }).map(item => `<div class="evidence-row"><a href="#topic/${item.topic.id}">${esc(item.topic.title)}</a><span>${item.total ? `${item.correct}/${item.total} correct (${Math.round(item.correct / item.total * 100)}%)${item.unanswered ? " - " + item.unanswered + " blank" : ""}` : "No recorded answer evidence"}</span></div>`).join("")}</div></section>
      <section class="lesson-block"><h2>Recent results</h2><p class="coverage-note">The latest 100 completed sets are retained. Scores are raw practice marks, not standardised results or predictions of admission.</p><div id="result-history">${state.attempts.length ? state.attempts.slice().reverse().map(attempt => {
        const result = progress.summary(attempt);
        return `<div class="evidence-row"><div><strong>${testLabel(attempt.mode)} ${attempt.kind}</strong><p>${esc(new Date(attempt.at).toLocaleString("en-GB"))} &middot; ${result.correct}/${result.total}${attempt.seconds ? " - timed" : " - untimed"}${attempt.expired ? " (time expired)" : ""}</p></div><button class="secondary-button open-result" type="button" data-result="${attempt.id}">Review result</button></div>`;
      }).join("") : "<p>No completed results yet. Finish a short practice set or a test to see evidence here.</p>"}</div></section>
      <section class="lesson-block"><h2>Offline progress backup</h2><p>Export before moving this folder or clearing browser data. Import replaces all saved learning data after validation and confirmation; it does not merge. No file is sent anywhere. Active tests and decks will be closed when importing or resetting.</p><div class="quiz-controls"><button class="cta" id="export-progress" type="button">Export backup</button><label class="file-label">Import a JSON backup<input type="file" id="import-progress" accept=".json,application/json"></label><button class="secondary-button" id="dashboard-reset" type="button">Reset all progress</button></div><p id="backup-status" class="status-line" role="status"></p><div id="backup-confirm"></div></section>`;
    document.getElementById("revise-mistakes").addEventListener("click", () => startRevision(missed));
    document.getElementById("revise-cards").addEventListener("click", () => { cardFilters = { subject: "all", topic: "all", again: true }; deck = null; location.hash = "flashcards"; });
    document.querySelectorAll(".open-result").forEach(button => button.addEventListener("click", () => {
      const attempt = state.attempts.find(item => item.id === button.dataset.result);
      stopTimer();
      exam = { mode: attempt.mode, kind: attempt.kind, items: attempt.questionIds.map(id => progress.byId.get(id)), answers: attempt.answers.slice(), seconds: attempt.seconds, expired: attempt.expired, submitted: true, confirming: false, index: 0 };
      location.hash = "tests";
    }));
    document.getElementById("export-progress").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(progress.validate(state), null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = "brightlane-progress-" + new Date().toISOString().slice(0, 10) + ".json";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      document.getElementById("backup-status").textContent = "Backup download requested. Keep the JSON file somewhere safe.";
    });
    document.getElementById("import-progress").addEventListener("change", async event => {
      const revision = ++importRevision;
      pendingImport = null;
      document.getElementById("backup-confirm").innerHTML = "";
      const file = event.target.files[0];
      event.target.value = "";
      if (!file) return;
      document.getElementById("backup-status").textContent = "Reading and validating backup...";
      try {
        if (file.size > 1024 * 1024) throw new Error("Backup exceeds the 1 MB size limit.");
        const text = await file.text();
        if (revision !== importRevision || location.hash !== "#dashboard") return;
        const parsed = progress.validate(JSON.parse(text));
        pendingImport = parsed;
        document.getElementById("backup-status").textContent = "Valid backup: " + parsed.attempts.length + " results, " + parsed.studied.length + " studied lessons. Confirm to replace current data.";
        backupConfirmation("Replace all progress with this backup? Current data and active study sets will be replaced.", () => {
          stopTimer(); state = pendingImport; pendingImport = null; exam = null; deck = null;
          cardFilters = { subject: "all", topic: "all" };
          save(); dashboardPage(); document.getElementById("backup-status").textContent = persistent ? "Backup imported and saved." : "Backup imported for this visit only. Browser storage is unavailable.";
        });
      } catch (error) {
        if (revision !== importRevision || !document.getElementById("backup-status")) return;
        console.warn("Brightlane backup import rejected:", error);
        document.getElementById("backup-status").textContent = "Import failed: " + error.message + " Current data is unchanged.";
      }
    });
    document.getElementById("dashboard-reset").addEventListener("click", () => {
      ++importRevision; pendingImport = null;
      backupConfirmation("Clear all saved lessons, results, flashcard ratings and planner settings? Export first if you need a backup.", () => {
        resetState(); dashboardPage(); document.getElementById("backup-status").textContent = "All learning progress cleared.";
      });
    });
  }
  function backupConfirmation(message, onConfirm) {
    document.getElementById("backup-confirm").innerHTML = `<p>${esc(message)}</p><div class="quiz-controls"><button class="cta" id="backup-yes" type="button">Confirm replacement</button><button class="secondary-button" id="backup-no" type="button">Cancel</button></div>`;
    document.getElementById("backup-yes").addEventListener("click", onConfirm);
    document.getElementById("backup-no").addEventListener("click", () => { pendingImport = null; ++importRevision; document.getElementById("backup-confirm").innerHTML = ""; document.getElementById("backup-status").textContent = "Cancelled. Current data is unchanged."; });
    document.getElementById("backup-yes").focus();
  }
  function plannerPage() {
    const planner = state.planner;
    const remaining = topics.filter(t => !planner.completed.includes(t.id));
    const today = new Date();
    const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const days = planner.examDate ? Math.round((Date.parse(planner.examDate + "T00:00:00Z") - todayUTC) / 86400000) : null;
    const weeks = days === null ? null : Math.max(1, Math.ceil(days / 7));
    const checklist = [["guidance", "Check current school/provider subjects, format and exam date"], ["registration", "Check registration steps and deadlines in official guidance"], ["arrangements", "Discuss any access arrangements with the school/provider if needed"], ["exam-day", "Plan travel, required materials and exam-day instructions"]];
    main.innerHTML = `<div class="page-header"><p class="eyebrow">YOUR OWN 2027 EXAM PLAN</p><h1>A steady plan, not a race.</h1><p>Enter a confirmed exam date from your school's current guidance. This is the date you take an exam in 2027, not a school entry date. No official dates or deadlines are supplied here.</p></div>
      <section class="lesson-block"><h2>Set your study rhythm</h2><form id="planner-form" novalidate><div class="filters"><label>Exam date in 2027 (optional)<input id="planner-date" type="text" inputmode="numeric" placeholder="YYYY-MM-DD" value="${esc(planner.examDate)}" aria-describedby="planner-date-help"></label><label>Study sessions per week<input id="planner-sessions" type="number" min="1" max="7" step="1" value="${planner.weeklySessions}"></label></div><p id="planner-date-help" class="coverage-note">Use YYYY-MM-DD. Leave blank if the date is not confirmed. Dates outside 2027 or impossible calendar dates are rejected.</p><button class="cta" type="submit">Save plan settings</button><p class="status-line" id="planner-status" role="status"></p></form></section>
      <section class="lesson-block"><h2>Your suggested rhythm</h2><p>${days === null ? "Choose a date when confirmed. Meanwhile, aim for " + planner.weeklySessions + " short sessions a week, rotating Maths, English and review." : days < 0 ? "Your entered exam date has passed. Update it if needed; your checklist remains available." : days === 0 ? "Your entered exam date is today. Keep today's plan light and check the school's exam-day instructions." : `${days} days until your entered date (about ${weeks} weeks). At ${planner.weeklySessions} sessions per week, that is about ${weeks * planner.weeklySessions} available sessions.`}</p><p class="coverage-note">${remaining.length} topics remain on your planning checklist. ${weeks && days > 0 ? "A simple starting point is " + Math.ceil(remaining.length / weeks) + " topics per week, with later sessions for mistakes and recall. " : ""}Use 15-25 minute sessions as a flexible suggestion, not a required or official timetable. Adjust to your needs, leave time for rest, and revisit difficult ideas. Checking a topic here is planning only, not tested mastery.</p></section>
      <section class="lesson-block"><h2>Preparation checklist</h2><div class="planner-checks">${checklist.map(([id, text]) => `<label><input type="checkbox" data-check="${id}"${planner.checks.includes(id) ? " checked" : ""}> ${esc(text)}</label>`).join("")}</div></section>
      <section class="lesson-block"><h2>Topic revision checklist</h2><p id="planner-topic-count">${planner.completed.length} of 30 topics checked</p><div class="planner-checks">${topics.map(t => `<div class="planner-topic"><label><input type="checkbox" data-topic="${t.id}"${planner.completed.includes(t.id) ? " checked" : ""}> ${label(t.subject)}: ${esc(t.title)}</label><a class="text-button" href="#topic/${t.id}">Study topic</a></div>`).join("")}</div></section>`;
    document.getElementById("planner-form").addEventListener("submit", event => {
      event.preventDefault();
      const date = document.getElementById("planner-date").value.trim();
      const sessions = Number(document.getElementById("planner-sessions").value);
      try {
        const candidate = progress.validate({ ...state, planner: { ...planner, examDate: date, weeklySessions: sessions } });
        state.planner = candidate.planner; save(); plannerPage();
        document.getElementById("planner-status").textContent = persistent ? "Plan settings saved." : "Plan set for this visit only; export to keep a copy.";
      } catch (error) {
        console.warn("Brightlane planner settings rejected:", error);
        document.getElementById("planner-status").textContent = error.message + " Your saved plan is unchanged.";
      }
    });
    document.querySelectorAll("[data-check], [data-topic]").forEach(input => input.addEventListener("change", () => {
      const field = input.dataset.check ? "checks" : "completed";
      const id = input.dataset.check || input.dataset.topic;
      planner[field] = input.checked ? [...planner[field], id] : planner[field].filter(item => item !== id);
      save();
      if (field === "completed") { plannerPage(); document.querySelector(`[data-topic="${id}"]`).focus(); }
    }));
  }
  function printMaterial(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    document.body.classList.add("printing-material");
    section.classList.add("print-target");
    window.print();
    document.body.classList.remove("printing-material");
    section.classList.remove("print-target");
  }
  function revisionSheet(topic) {
    return `<h2>${esc(topic.title)}</h2><p>${esc(topic.summary)}</p><h3>Key ideas</h3><ol>${topic.learn.map(item => `<li>${esc(item)}</li>`).join("")}</ol><div class="worked-example"><h3>Worked example</h3><p><strong>${esc(topic.example[0])}</strong></p><p>${esc(topic.example[1])}</p></div><p class="pitfall"><strong>Watch out:</strong> ${esc(topic.pitfall)}</p><p><a class="text-button" href="#topic/${topic.id}">Open the full lesson and three practice questions</a></p>`;
  }
  function worksheetMarkup(topic) {
    return `<div class="worksheet-sheet" id="worksheet-print"><p class="eyebrow">${label(topic.subject)} &middot; WORKSHEET</p><h3>${esc(topic.title)}: practice sheet</h3><p>${esc(topic.summary)} Try each question on paper before opening the answer key.</p><ol class="worksheet-questions">${topic.questions.map(q => `<li><p>${esc(q.q)}</p><ol type="A">${q.options.map(option => `<li>${esc(option)}</li>`).join("")}</ol></li>`).join("")}</ol><details class="worksheet-answer-key"><summary>Answer key &amp; explanations (included when printed)</summary><ol>${topic.questions.map(q => `<li><strong>${esc(q.options[q.answer])}.</strong> ${esc(q.why)}</li>`).join("")}</ol></details></div>`;
  }
  function materialsPage() {
    const defaultTopic = topics[0];
    main.innerHTML = `<div class="page-header"><p class="eyebrow">YOUR OFFLINE REVISION LIBRARY</p><h1>Study materials, ready when you are.</h1><p>Topic sheets, clear reference notes, original longer reading practice and writing plans. Print a worksheet for paper practice; all material is bundled for offline use.</p></div>
      <nav class="material-nav" aria-label="Study material sections"><button type="button" data-material-target="revision-section">Topic revision sheets</button><button type="button" data-material-target="reference-section">Maths &amp; English reference</button><button type="button" data-material-target="reading-section">Longer comprehension</button><button type="button" data-material-target="writing-section">Writing workshop</button><button type="button" data-material-target="worksheet-section">Printable worksheets</button></nav>
      <section class="lesson-block material-section" id="revision-section"><p class="eyebrow">30 TOPIC-LINKED SUMMARIES</p><h2>Topic revision sheet</h2><div class="material-controls"><label>Choose a topic<select id="revision-topic">${topics.map(topic => `<option value="${topic.id}">${label(topic.subject)}: ${esc(topic.title)}</option>`).join("")}</select></label><button class="secondary-button print-material" id="print-revision" type="button">Print revision sheet</button></div><article class="revision-sheet printable-material" id="revision-sheet" aria-live="polite">${revisionSheet(defaultTopic)}</article></section>
      <section class="lesson-block material-section printable-material" id="reference-section"><p class="eyebrow">QUICK LOOK-UP</p><h2>Maths methods &amp; English language reference</h2><p>Use these short reminders to check a method, then revisit the linked lesson for fuller worked practice. Spelling patterns are useful clues, not rules without exceptions.</p><div class="material-controls"><button class="secondary-button print-material" id="print-reference" type="button">Print reference cards</button></div><h3>Maths</h3><div class="reference-grid">${studyMaterials.reference.filter(item => item.subject === "maths").map(item => `<article class="reference-card"><h4>${esc(item.title)}</h4><p>${esc(item.rule)}</p><p><strong>Example:</strong> ${esc(item.example)}</p><a href="#topic/${item.topicId}">Revise ${esc(topics.find(t => t.id === item.topicId).title)}</a></article>`).join("")}</div><h3>English</h3><div class="reference-grid">${studyMaterials.reference.filter(item => item.subject === "english").map(item => `<article class="reference-card"><h4>${esc(item.title)}</h4><p>${esc(item.rule)}</p><p><strong>Example:</strong> ${esc(item.example)}</p><a href="#topic/${item.topicId}">Revise ${esc(topics.find(t => t.id === item.topicId).title)}</a></article>`).join("")}</div></section>
      <section class="lesson-block material-section" id="reading-section"><p class="eyebrow">3 ORIGINAL PASSAGES &middot; 12 EXPLAINED QUESTIONS</p><h2>Longer comprehension practice</h2><p>Read the passage closely, then answer each question. You will see feedback and explanations after each choice. Look for evidence in the text; these are practice passages, not exam-provider material.</p>${studyMaterials.readings.map(reading => `<article class="reading-card"><h3>${esc(reading.title)}</h3><p>${reading.passage.trim().split(/\s+/).length} words &middot; four questions</p><details><summary>Read the full passage</summary><p class="long-passage">${esc(reading.passage)}</p></details><button class="cta start-reading" type="button" data-reading="${reading.id}">Start questions</button><section class="reading-quiz practice-panel" id="quiz-${reading.id}" hidden aria-label="${esc(reading.title)} questions"></section></article>`).join("")}</section>
      <section class="lesson-block material-section" id="writing-section"><p class="eyebrow">PLAN, DRAFT, EDIT</p><h2>Writing workshop</h2><p>These prompts invite original writing. The scaffold helps you plan; the self-check is for reflection only. Brightlane does not automatically grade extended writing.</p><div class="writing-grid">${studyMaterials.writing.map((item, index) => `<article class="writing-card"><p class="eyebrow">${esc(item.form)} ${index + 1}</p><h3>${esc(item.title)}</h3><p>${esc(item.prompt)}</p><h4>Planning scaffold</h4><ol>${item.plan.map(step => `<li>${esc(step)}</li>`).join("")}</ol><h4>Self-check rubric</h4><ul>${item.checks.map(check => `<li>${esc(check)}</li>`).join("")}</ul></article>`).join("")}</div><button class="secondary-button print-material" id="print-writing" type="button">Print writing prompts &amp; self-checks</button></section>
      <section class="lesson-block material-section" id="worksheet-section"><p class="eyebrow">PAPER PRACTICE</p><h2>Printable topic worksheets</h2><p>Choose any of the 30 topics for a short three-question worksheet. Print includes an answer key and explanations on a separate page; you can also open the full interactive lesson.</p><div class="material-controls"><label>Worksheet topic<select id="worksheet-topic">${topics.map(topic => `<option value="${topic.id}">${label(topic.subject)}: ${esc(topic.title)}</option>`).join("")}</select></label><button class="cta print-material" id="print-worksheet" type="button">Print worksheet &amp; answer key</button></div><div class="worksheet-output" id="worksheet-output">${worksheetMarkup(defaultTopic)}</div></section>
      <p class="coverage-note">The library draws on the site's 30 original topic lessons. It is a broad revision resource, not an exhaustive curriculum or an official paper. School and provider content varies; check current guidance for the target exam.</p>`;
    document.querySelectorAll("[data-material-target]").forEach(button => button.addEventListener("click", () => document.getElementById(button.dataset.materialTarget).scrollIntoView({ behavior: "auto", block: "start" })));
    document.getElementById("revision-topic").addEventListener("change", event => {
      document.getElementById("revision-sheet").innerHTML = revisionSheet(topics.find(topic => topic.id === event.target.value));
    });
    document.getElementById("print-revision").addEventListener("click", () => printMaterial("revision-section"));
    document.getElementById("print-reference").addEventListener("click", () => printMaterial("reference-section"));
    document.getElementById("print-writing").addEventListener("click", () => printMaterial("writing-section"));
    document.getElementById("worksheet-topic").addEventListener("change", event => {
      document.getElementById("worksheet-output").innerHTML = worksheetMarkup(topics.find(topic => topic.id === event.target.value));
    });
    document.getElementById("print-worksheet").addEventListener("click", () => printMaterial("worksheet-section"));
    document.querySelectorAll(".start-reading").forEach(button => button.addEventListener("click", () => {
      const reading = studyMaterials.readings.find(item => item.id === button.dataset.reading);
      const panel = document.getElementById("quiz-" + reading.id);
      panel.hidden = false;
      startQuiz(reading.questions.map(q => ({ ...q, topic: topics.find(topic => topic.id === q.topicId) })), panel.id, null);
      panel.scrollIntoView({ block: "start", behavior: "auto" });
    }));
  }
  function filteredCards() {
    return window.BRIGHTLANE_FLASHCARDS.filter(card => {
      const topic = topics.find(t => t.id === card.topicId);
      return (cardFilters.subject === "all" || topic.subject === cardFilters.subject) &&
        (cardFilters.topic === "all" || card.topicId === cardFilters.topic) &&
        (!cardFilters.again || state.cardRatings[card.id] === "again");
    });
  }
  function flashcardsPage() {
    const availableTopics = topics.filter(t => cardFilters.subject === "all" || t.subject === cardFilters.subject);
    main.innerHTML = `<div class="page-header"><p class="eyebrow">A LITTLE ACTIVE RECALL</p><h1>Flashcards that make ideas stick.</h1><p>Try saying the answer before revealing it. Then choose "Know it" or "Practise again". These are your own judgements, not automatically marked answers.</p></div>
      <div class="filters"><label>Subject<select id="card-subject">${[["all", "Maths & English"], ["maths", "Maths"], ["english", "English"]].map(([value, text]) => `<option value="${value}"${cardFilters.subject === value ? " selected" : ""}>${esc(text)}</option>`).join("")}</select></label><label>Topic<select id="card-topic"><option value="all">All topics</option>${availableTopics.map(t => `<option value="${t.id}"${cardFilters.topic === t.id ? " selected" : ""}>${esc(t.title)}</option>`).join("")}</select></label></div>
      <label class="card-revision-filter"><input type="checkbox" id="cards-again-only"${cardFilters.again ? " checked" : ""}> Only saved "practise again" cards</label>
      <p class="coverage-note">Saved self-assessments survive reloads when browser storage is available. Changing a filter or restarting clears this round only, not saved ratings. Your current deck order/revealed answer lasts for this visit. Lesson and test progress are unchanged.</p>
      <section id="flashcard-deck" aria-label="Flashcard study deck"></section>`;
    document.getElementById("card-subject").addEventListener("change", event => {
      cardFilters = { subject: event.target.value, topic: "all", again: cardFilters.again };
      deck = null; flashcardsPage(); document.getElementById("card-subject").focus();
    });
    document.getElementById("cards-again-only").addEventListener("change", event => { cardFilters.again = event.target.checked; deck = null; renderDeck(); });
    document.getElementById("card-topic").addEventListener("change", event => {
      cardFilters.topic = event.target.value;
      deck = null; renderDeck();
    });
    renderDeck();
  }
  function newDeck(cards) {
    deck = { cards: cards.slice(), index: 0, revealed: false, ratings: {}, complete: false };
  }
  function focusDeck() {
    const heading = document.querySelector("#flashcard-deck h2");
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); heading.scrollIntoView({ block: "center" }); }
  }
  function renderDeck() {
    if (!deck) newDeck(filteredCards());
    const panel = document.getElementById("flashcard-deck");
    if (!deck.cards.length) {
      panel.innerHTML = `<div class="lesson-block"><h2>No cards in this deck.</h2><p>No cards match these filters or saved practise-again ratings. Choose another topic or return to all cards.</p><button id="cards-show-all" type="button" class="cta">Show all flashcards</button></div>`;
      document.getElementById("cards-show-all").addEventListener("click", () => { cardFilters = { subject: "all", topic: "all" }; deck = null; flashcardsPage(); focusDeck(); });
      return;
    }
    const rated = Object.keys(deck.ratings).length;
    const known = Object.values(deck.ratings).filter(value => value === "known").length;
    const missed = deck.cards.filter(card => deck.ratings[card.id] === "again");
    if (deck.complete) {
      panel.innerHTML = `<div class="lesson-block deck-summary"><p class="eyebrow">DECK COMPLETE</p><h2>${known} known &middot; ${missed.length} to practise again</h2><p>You self-assessed all ${deck.cards.length} cards. "Known" is your judgement, not proof of mastery. Explain one idea without looking to check your recall.</p><div class="quiz-controls"><button class="cta" id="cards-repeat-missed" type="button"${missed.length ? "" : " disabled"}>Practise again (${missed.length})</button><button class="secondary-button" id="cards-restart" type="button">Restart selected deck</button></div><p class="coverage-note">${missed.length ? "The next round contains only the cards you marked to practise again." : "No cards were marked to practise again. Restart the selected deck whenever you want another round."}</p></div>`;
      document.getElementById("cards-repeat-missed").addEventListener("click", () => { newDeck(shuffle(missed)); renderDeck(); focusDeck(); });
      document.getElementById("cards-restart").addEventListener("click", () => { newDeck(filteredCards()); renderDeck(); focusDeck(); });
      return;
    }
    const card = deck.cards[deck.index];
    const topic = topics.find(t => t.id === card.topicId);
    const rating = deck.ratings[card.id];
    panel.innerHTML = `<div class="card-study-bar"><p>Card ${deck.index + 1} of ${deck.cards.length} &middot; ${label(topic.subject)} &middot; ${esc(topic.title)}</p><button class="secondary-button" id="cards-shuffle" type="button">Shuffle deck</button></div>
      <article class="recall-card"><p class="eyebrow">THINK FIRST, THEN REVEAL</p><h2>${esc(card.front)}</h2><button class="cta" id="card-reveal" type="button" aria-expanded="${deck.revealed}" aria-controls="card-answer">${deck.revealed ? "Hide answer" : "Reveal answer"}</button><div id="card-answer" class="card-answer"${deck.revealed ? "" : " hidden"}><h3>Answer &amp; explanation</h3><p>${esc(card.back)}</p><a class="text-button" href="#topic/${topic.id}">Revisit ${esc(topic.title)}</a></div>
      <div class="quiz-controls" id="card-assessment"${deck.revealed ? "" : " hidden"}><button class="secondary-button" id="card-again" type="button">Practise again</button><button class="cta" id="card-known" type="button">Know it</button></div><p class="status-line" id="card-status" role="status">${rating ? "This round: " + (rating === "known" ? "know it" : "practise again") + ". " : "Not assessed yet in this round. "}${state.cardRatings[card.id] ? "Saved assessment: " + (state.cardRatings[card.id] === "known" ? "know it" : "practise again") + ". Reveal to update." : "No saved assessment."}</p></article>
      <div class="card-navigation"><button class="secondary-button" id="card-previous" type="button"${deck.index === 0 ? " disabled" : ""}>Previous card</button><p id="deck-progress">${rated} of ${deck.cards.length} assessed &middot; ${known} known</p><button class="secondary-button" id="card-next" type="button"${deck.index === deck.cards.length - 1 ? " disabled" : ""}>Next card</button></div><p class="coverage-note">Previous and Next let you skip or revisit without rating. Self-assessment moves to the next unassessed card. Shuffle changes order, hides the answer and keeps your assessments.</p>`;
    document.getElementById("card-reveal").addEventListener("click", event => {
      deck.revealed = !deck.revealed;
      event.target.textContent = deck.revealed ? "Hide answer" : "Reveal answer";
      event.target.setAttribute("aria-expanded", String(deck.revealed));
      document.getElementById("card-answer").hidden = !deck.revealed;
      document.getElementById("card-assessment").hidden = !deck.revealed;
    });
    function move(index) { deck.index = index; deck.revealed = false; renderDeck(); focusDeck(); }
    document.getElementById("card-previous").addEventListener("click", () => move(deck.index - 1));
    document.getElementById("card-next").addEventListener("click", () => move(deck.index + 1));
    document.getElementById("cards-shuffle").addEventListener("click", () => {
      shuffle(deck.cards); deck.index = 0; deck.revealed = false; renderDeck(); focusDeck();
      document.getElementById("card-status").textContent = "Deck shuffled. Your self-assessments were kept.";
    });
    function assess(value) {
      deck.ratings[card.id] = value;
      state.cardRatings[card.id] = value;
      save();
      const remaining = deck.cards.findIndex((item, index) => index > deck.index && !deck.ratings[item.id]);
      const firstRemaining = deck.cards.findIndex(item => !deck.ratings[item.id]);
      if (firstRemaining === -1) { deck.complete = true; deck.revealed = false; renderDeck(); focusDeck(); }
      else move(remaining === -1 ? firstRemaining : remaining);
    }
    document.getElementById("card-known").addEventListener("click", () => assess("known"));
    document.getElementById("card-again").addEventListener("click", () => assess("again"));
  }
  function testQuestions(subject, count) {
    const groups = shuffle(topics.filter(t => t.subject === subject).map(t =>
      shuffle(window.BRIGHTLANE_TEST_BANK.filter(q => q.topicId === t.id).map(q => ({ ...q, topic: t })))
    ));
    // Take one per topic before extras so subject tests sample the full syllabus.
    const first = groups.map(group => group[0]);
    return [...first, ...shuffle(groups.flatMap(group => group.slice(1)))].slice(0, count);
  }
  function startTest(mode, items, seconds = 0, kind = "test", extended = false) {
    stopTimer();
    const count = extended ? (mode === "maths" ? 36 : mode === "english" ? 24 : 40) : 20;
    const selected = items || shuffle(mode === "mixed" ? [...testQuestions("maths", count / 2), ...testQuestions("english", count / 2)] : testQuestions(mode, count));
    exam = { mode, kind, seconds, deadline: seconds ? Date.now() + seconds * 1000 : null, expired: false, items: selected, answers: selected.map(() => null), index: 0, submitted: false, confirming: false };
    if (seconds) timer = setInterval(tickTimer, 250);
    testsPage();
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  function stopTimer() {
    if (timer !== null) clearInterval(timer);
    timer = null;
  }
  function remainingTime() {
    const seconds = Math.max(0, Math.ceil((exam.deadline - Date.now()) / 1000));
    return Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
  }
  function timerMarkup() {
    return `<div class="test-timer">${exam.seconds ? `<span id="test-clock" role="timer" aria-live="off" aria-label="Time remaining">${remainingTime()}</span> remaining. The timer continues while visiting other pages; expiry submits automatically.` : "Untimed - no countdown or automatic submission."}</div>`;
  }
  function finishTest(expired) {
    if (!exam || exam.submitted) return;
    exam.expired = expired;
    exam.submitted = true; exam.confirming = false;
    stopTimer();
    recordAttempt(exam.items, exam.answers, exam.mode, exam.kind, exam.seconds, expired);
    if (location.hash === "#tests") {
      testResults(); main.focus({ preventScroll: true }); window.scrollTo(0, 0);
    } else if (expired) notice("Your timed test has ended and was submitted. Open Practice tests or Progress to review your result.");
  }
  function expireIfNeeded() {
    if (exam && !exam.submitted && exam.seconds && Date.now() >= exam.deadline) { finishTest(true); return true; }
    return false;
  }
  function tickTimer() {
    if (expireIfNeeded()) return;
    const clock = document.getElementById("test-clock");
    if (clock && exam && !exam.submitted) clock.textContent = remainingTime();
  }
  function testHeader(title, description) {
    return `<div class="page-header"><p class="eyebrow">BRIGHTLANE PRACTICE TESTS</p><h1>${esc(title)}</h1><p>${esc(description)}</p></div>`;
  }
  function testsPage() {
    if (expireIfNeeded()) return;
    if (exam) {
      if (exam.submitted) testResults();
      else if (exam.confirming) confirmTestSubmission();
      else renderTest();
      return;
    }
    main.innerHTML = testHeader("A bigger step, at your own pace.", "Put your learning together in an original practice test. Unlike short practice, answers stay hidden until you submit.") +
      `<section class="lesson-block test-instructions"><h2>Before you start</h2><ul><li>Choose a 20-question test or an extended set: Maths 36, English 24, mixed 40 (20 per subject). Select one answer per question; use paper for working and practise Maths without a calculator.</li><li>Untimed is the accessible default. An optional 15, 25 or 40 minute timer is a personal practice setting, not an official exam duration. It continues during navigation, confirmation or tab inactivity, and automatically submits when time runs out, with blanks scoring zero. Reloading abandons an unfinished test; completed results are saved. The timer uses your device clock, so keep it accurate.</li><li>Use Previous, Next or question numbers to revisit answers. Manual submission asks for confirmation; timer expiry does not. Correct answers earn one mark; wrong or blank responses earn zero with no deductions.</li><li>Subject tests sample all their lesson topics before extras; mixed sets are balanced by subject. Repeated sets shuffle a finite bank of 60 separate questions, so they can repeat. They are not official papers or standardised admission predictions.</li></ul></section>
      <div class="filters"><label>Set length<select id="test-length"><option value="20">20 questions</option><option value="extended">Extended: Maths 36 / English 24 / mixed 40</option></select></label><label>Timing<select id="test-timing"><option value="0">Untimed (default)</option><option value="900">15 minutes</option><option value="1500">25 minutes</option><option value="2400">40 minutes</option></select></label></div>
      <div class="test-mode-grid">${["maths", "english", "mixed"].map(mode => `<section class="lesson-block test-mode"><p class="eyebrow">YOUR CHOICE OF LENGTH &amp; TIMING</p><h2>${testLabel(mode)} test</h2><p>${mode === "mixed" ? "Connect both subjects in a balanced question set." : mode === "maths" ? "Numbers, calculations, measures, geometry and data across 18 topics." : "Original reading passages, language, grammar and writing skills across 12 topics."}</p><button class="cta start-test" type="button" data-mode="${mode}">Start ${testLabel(mode)} test</button></section>`).join("")}</div>
      <p class="coverage-note">These are original practice tests, not official papers, standardised scores or predictions of admission. Sets draw from a separate bank of ${window.BRIGHTLANE_TEST_BANK.length} questions; repeated attempts may share questions. School and provider requirements vary, and extended writing is not automatically graded.</p>`;
    document.querySelectorAll(".start-test").forEach(button => button.addEventListener("click", () => startTest(button.dataset.mode, null, Number(document.getElementById("test-timing").value), "test", document.getElementById("test-length").value === "extended")));
  }
  function answeredCount() {
    return exam.answers.filter(answer => answer !== null).length;
  }
  function focusTestQuestion() {
    const question = document.querySelector("#test-form legend");
    if (question) {
      question.tabIndex = -1;
      question.focus({ preventScroll: true });
      question.scrollIntoView({ block: "center" });
    }
  }
  function renderTest() {
    if (expireIfNeeded()) return;
    const item = exam.items[exam.index];
    main.innerHTML = testHeader(testLabel(exam.mode) + " practice test", "Take your time. Your choices are kept while you move between questions. No answers are revealed until final submission.") +
      timerMarkup() + `<div class="test-layout"><section class="practice-panel" id="test-question-panel"><div class="quiz-meta"><span>Question ${exam.index + 1} of ${exam.items.length}</span><span>${label(item.topic.subject)} &middot; ${esc(item.topic.title)}</span></div><h2>Your next question</h2>
      ${item.passage ? `<details open><summary>Original passage for this question</summary><div class="passage">${esc(item.passage)}</div></details>` : ""}
      <form id="test-form">${answerChoices(item, exam.answers[exam.index])}<p class="status-line" id="test-answer-status" role="status"></p><div class="quiz-controls"><button id="test-previous" class="secondary-button" type="button"${exam.index === 0 ? " disabled" : ""}>Previous</button><button id="test-next" class="cta" type="button"${exam.index === exam.items.length - 1 ? " disabled" : ""}>Next question</button><button id="test-clear" class="text-button" type="button">Clear answer</button></div></form></section>
      <aside class="lesson-block test-navigation" aria-label="Test question navigation"><h2>Your test map</h2><p id="test-count" role="status">${answeredCount()} of ${exam.items.length} answered</p><p class="test-map-key">A tick means answered, not marked correct. Highlighted = current question.</p><nav class="question-map" aria-label="Choose a test question">${exam.items.map((q, i) => `<button type="button" data-index="${i}" aria-label="Question ${i + 1}, ${exam.answers[i] === null ? "unanswered" : "answered"}"${i === exam.index ? ' aria-current="step"' : ""} class="question-jump${exam.answers[i] !== null ? " answered" : ""}">${i + 1}${exam.answers[i] !== null ? '<span aria-hidden="true"> &#10003;</span>' : ""}</button>`).join("")}</nav><button class="cta" type="button" id="test-submit">Review &amp; submit</button><p class="test-map-key">Leaving keeps an active test for this visit. Any timer continues. Reloading or closing abandons it; completed results save to Progress.</p></aside></div>`;
    document.getElementById("test-form").addEventListener("submit", event => event.preventDefault());
    document.getElementById("test-form").addEventListener("change", event => {
      if (expireIfNeeded()) return;
      if (event.target.name !== "answer") return;
      exam.answers[exam.index] = Number(event.target.value);
      updateTestAnswerStatus("Answer selected. You can change it before submission.");
    });
    document.getElementById("test-clear").addEventListener("click", () => {
      if (expireIfNeeded()) return;
      exam.answers[exam.index] = null;
      document.querySelectorAll("#test-form input").forEach(input => { input.checked = false; });
      updateTestAnswerStatus("Answer cleared.");
    });
    function move(index) { if (expireIfNeeded()) return; exam.index = index; renderTest(); focusTestQuestion(); }
    document.getElementById("test-previous").addEventListener("click", () => move(exam.index - 1));
    document.getElementById("test-next").addEventListener("click", () => move(exam.index + 1));
    document.querySelectorAll(".question-jump").forEach(button => button.addEventListener("click", () => move(Number(button.dataset.index))));
    document.getElementById("test-submit").addEventListener("click", () => {
      if (expireIfNeeded()) return;
      exam.confirming = true;
      confirmTestSubmission();
      main.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    });
  }
  function updateTestAnswerStatus(message) {
    document.getElementById("test-answer-status").textContent = message;
    document.getElementById("test-count").textContent = answeredCount() + " of " + exam.items.length + " answered";
    const button = document.querySelector(`.question-jump[data-index="${exam.index}"]`);
    const answered = exam.answers[exam.index] !== null;
    button.classList.toggle("answered", answered);
    button.setAttribute("aria-label", `Question ${exam.index + 1}, ${answered ? "answered" : "unanswered"}`);
    button.innerHTML = (exam.index + 1) + (answered ? '<span aria-hidden="true"> &#10003;</span>' : "");
  }
  function confirmTestSubmission() {
    if (expireIfNeeded()) return;
    const missing = exam.answers.map((answer, i) => answer === null ? i + 1 : null).filter(number => number !== null);
    main.innerHTML = testHeader("Ready to submit?", testLabel(exam.mode) + " practice test - " + answeredCount() + " of " + exam.items.length + " questions answered.") +
      timerMarkup() + `<section class="lesson-block"><h2>${missing.length ? `${missing.length} unanswered ${missing.length === 1 ? "question" : "questions"}` : "Every question has an answer."}</h2><p>${missing.length ? "Unanswered: " + missing.join(", ") + ". These will earn zero marks if you submit now." : "You can still return to check or change your choices."}</p><p class="coverage-note">Final submission locks your answers and reveals your score and all explanations. There are no deductions for wrong answers.</p><div class="quiz-controls"><button class="cta" id="test-confirm-submit" type="button">Submit test${missing.length ? " with unanswered questions" : ""}</button><button class="secondary-button" id="test-return" type="button">Return to questions</button></div></section>`;
    document.getElementById("test-return").addEventListener("click", () => {
      if (expireIfNeeded()) return;
      exam.confirming = false;
      if (missing.length) exam.index = missing[0] - 1;
      renderTest(); focusTestQuestion();
    });
    document.getElementById("test-confirm-submit").addEventListener("click", () => {
      if (expireIfNeeded()) return;
      finishTest(false);
    });
  }
  function testResults() {
    const correct = exam.items.filter((q, i) => q.answer === exam.answers[i]).length;
    const unanswered = exam.items.length - answeredCount();
    main.innerHTML = testHeader(testLabel(exam.mode) + " test results", "This is a raw practice score, not a standardised exam score or an admission prediction.") +
      `<section class="lesson-block test-result-summary"><p class="eyebrow">TEST COMPLETE${exam.expired ? " - TIME EXPIRED" : ""}</p><h2 id="test-score">${correct} / ${exam.items.length} &middot; ${Math.round(correct / exam.items.length * 100)}%</h2><p id="test-score-breakdown">${correct} correct &middot; ${exam.items.length - correct - unanswered} incorrect &middot; ${unanswered} unanswered</p><p class="coverage-note">Completed results are saved to Progress when browser storage is available. Your studied lessons and best short-practice scores are unchanged. ${exam.expired ? "Time ran out, so the saved choices were submitted automatically." : ""}</p><div class="quiz-controls"><button class="cta" id="test-retry" type="button">Retry these questions</button><button class="secondary-button" id="test-revise" type="button"${correct === exam.items.length ? " disabled" : ""}>Revise incorrect or blank answers</button><button class="secondary-button" id="test-new" type="button">Choose a new test</button><a class="text-button" href="#dashboard">Saved progress &amp; results</a></div></section>
      <section class="test-review" aria-labelledby="test-review-heading"><h2 id="test-review-heading">Your answer review</h2><p>Every question, your choice and the reason behind the correct answer.</p>${exam.items.map((q, i) => {
        const chosen = exam.answers[i];
        const status = chosen === null ? "Unanswered" : chosen === q.answer ? "Correct" : "Incorrect";
        return `<article class="lesson-block review-item"><p class="eyebrow">QUESTION ${i + 1} &middot; ${label(q.topic.subject)} &middot; ${status.toUpperCase()}</p><h3>${esc(q.q)}</h3>${q.passage ? `<details><summary>Re-read the original passage</summary><div class="passage">${esc(q.passage)}</div></details>` : ""}<p class="review-choice">Your answer: <strong>${chosen === null ? "Not answered" : esc(q.options[chosen])}</strong></p><div class="feedback${status === "Correct" ? "" : " incorrect"}"><p>Correct answer: <strong>${esc(q.options[q.answer])}</strong></p><p>${esc(q.why)}</p></div><a class="text-button" href="#topic/${q.topic.id}">Revisit ${esc(q.topic.title)}</a></article>`;
      }).join("")}</section>`;
    document.getElementById("test-retry").addEventListener("click", () => startTest(exam.mode, exam.items, exam.seconds, exam.kind));
    document.getElementById("test-revise").addEventListener("click", () => startRevision(exam.items.filter((q, i) => q.answer !== exam.answers[i])));
    document.getElementById("test-new").addEventListener("click", () => { exam = null; testsPage(); main.focus({ preventScroll: true }); window.scrollTo(0, 0); });
  }
  function startQuiz(items, target, topicId) {
    quiz = { items, target, topicId, index: 0, correct: 0, checked: false, recorded: false, answers: items.map(() => null) };
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
      }
      if (!quiz.recorded) {
        const subjects = new Set(quiz.items.map(q => q.topic.subject));
        recordAttempt(quiz.items, quiz.answers, subjects.size > 1 ? "mixed" : quiz.items[0].topic.subject, "practice");
        quiz.recorded = true;
      }
      panel.innerHTML = `<div class="quiz-complete"><p class="eyebrow">SET COMPLETE</p><h2>You got ${quiz.correct} of ${quiz.items.length} correct.</h2><h3>${quiz.correct === quiz.items.length ? "A lovely little win." : "Every answer is a chance to learn."}</h3><p>${quiz.correct === quiz.items.length ? "Try explaining one answer aloud. Understanding the reason matters more than remembering the option." : "Revisit the key ideas and examples, then try again. Your first attempt does not define your ability."}</p>${quiz.topicId ? `<p>Best topic score: ${state.scores[quiz.topicId]}/${quiz.items.length}.${persistent ? "" : " Saved for this visit only."}</p>` : ""}<button class="cta" id="retry-quiz" type="button">Try this set again</button></div>`;
      document.getElementById("retry-quiz").addEventListener("click", () => { quiz.index = 0; quiz.correct = 0; quiz.checked = false; quiz.recorded = false; quiz.answers = quiz.items.map(() => null); renderQuiz(); focusQuiz(); });
      return;
    }
    const item = quiz.items[quiz.index];
    panel.innerHTML = `<div class="quiz-meta"><span>Question ${quiz.index + 1} of ${quiz.items.length}</span><span>${label(item.topic.subject)} &middot; ${esc(item.topic.title)}</span></div><h2>Check your understanding</h2>
      ${!quiz.topicId && item.topic.passage ? `<details open><summary>Passage for this question</summary><div class="passage">${esc(item.topic.passage)}</div></details>` : ""}
      <form id="answer-form">${answerChoices(item)}<div class="quiz-controls"><button class="cta" id="check-answer" type="submit">Check answer</button><span class="quiz-message" id="quiz-message" role="status"></span></div></form><div id="answer-feedback" aria-live="polite"></div>`;
    document.getElementById("answer-form").addEventListener("submit", event => {
      event.preventDefault();
      if (quiz.checked) return;
      const selected = panel.querySelector('input[name="answer"]:checked');
      if (!selected) { document.getElementById("quiz-message").textContent = "Choose an answer first."; return; }
      quiz.checked = true;
      quiz.answers[quiz.index] = Number(selected.value);
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
    if (path !== "dashboard") { pendingImport = null; ++importRevision; }
    let page = path;
    quiz = null;
    if (path === "home") home();
    else if (path === "maths" || path === "english") subjectPage(path);
    else if (path === "practice") practicePage();
    else if (path === "tests") testsPage();
    else if (path === "flashcards") flashcardsPage();
    else if (path === "materials") materialsPage();
    else if (path === "dashboard") dashboardPage();
    else if (path === "planner") plannerPage();
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
    document.title = (heading ? heading.textContent : "Study") + " | Brightlane 2027 11+ preparation";
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
    resetState();
    document.getElementById("reset-confirm").hidden = true;
    route(false);
  });
  document.querySelector(".skip-link").addEventListener("click", event => {
    event.preventDefault();
    main.focus();
    main.scrollIntoView({ block: "start" });
  });
  window.addEventListener("hashchange", () => route(false));
  document.addEventListener("visibilitychange", tickTimer);
  updateProgress();
  route(true);
})();
