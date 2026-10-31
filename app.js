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
  let writtenMock = null;
  let deck = null;
  let cardFilters = { subject: "all", topic: "all", exam: "all" };
  let timer = null;
  let pendingImport = null;
  let importRevision = 0;
  let scenarioFilters = { subject: "all", topic: "all", type: "all" };
  let suttonFilters = { material: "maths", topic: "all", mathQuestion: "", passage: "sutton-stage2-reading-1", writing: "sutton-writing-1" };
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
    state = progress.empty(); exam = null; writtenMock = null; deck = null; quiz = null; pendingImport = null;
    cardFilters = { subject: "all", topic: "all", exam: "all" };
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
  const scenarios = window.BRIGHTLANE_SCENARIOS;
  const sutton = window.BRIGHTLANE_SUTTON_BANK;
  const scenarioQuestionCount = scenarios.reduce((sum, scenario) => sum + scenario.questions.length, 0);
  const suttonQuestionCount = Object.values(sutton.stageOne).reduce((sum, items) => sum + items.length, 0) + sutton.stageTwo.maths.length + sutton.stageTwo.passages.reduce((sum, passage) => sum + passage.questions.length, 0);
  const tiffinQuestionCount = sutton.tiffin.numeric.length + sutton.tiffin.unfamiliar.length;
  const allQuestionCount = totalQuestions + window.BRIGHTLANE_TEST_BANK.length + studyMaterials.readings.reduce((sum, reading) => sum + reading.questions.length, 0) + scenarioQuestionCount + suttonQuestionCount + tiffinQuestionCount;
  const coverage = "2027 preparation edition: for UK 11+ exams taken in 2027, not a universal school entry year. This is a broad foundation, not an official 2027 syllabus or a guarantee of every school's exam content. Schools and providers vary in topic depth, format and writing requirements. Check their current guidance for requirements, exam dates and the relevant school entry year. Verbal and non-verbal reasoning are not separate subjects here.";
  function home() {
    main.innerHTML = `
      <section class="hero" aria-labelledby="welcome">
        <div><p class="eyebrow">2027 PREPARATION EDITION</p><h1 id="welcome">Big ideas.<br>Small steps.<br><em>Your 11+ journey.</em></h1>
        <p class="intro">Build confidence in Maths and English, one topic at a time. Clear explanations, worked examples and practice that helps it all click.</p><a class="cta" href="#maths">Explore your topics <span aria-hidden="true">&#8594;</span></a></div>
        <div class="hero-illustration" aria-hidden="true"><div class="art-circle"></div><span class="art-spark">&#10022;</span><div class="book">Aa</div><div class="math-tile">x +</div></div>
      </section>
      <div class="stats" aria-label="Site contents"><div class="stat"><strong>${topics.length}</strong><span>topic lessons<br>to explore</span></div><div class="stat"><strong>${allQuestionCount}</strong><span>unique practice questions<br>with explanations</span></div><div class="stat"><strong>${window.BRIGHTLANE_FLASHCARDS.length}</strong><span>recall cards<br>to practise offline</span></div></div>
      <section aria-labelledby="subjects"><div class="section-heading"><h2 id="subjects">What will you discover today?</h2><p>Pick a subject. Find your next small win.</p></div>
      <div class="subject-grid">${["maths", "english"].map(subject => {
        const count = topics.filter(t => t.subject === subject).length;
        return `<a class="subject-card ${subject}" href="#${subject}"><div class="subject-art" aria-hidden="true"><span class="subject-symbol">${subject === "maths" ? "123" : "Aa"}</span><span class="mini-grid">${subject === "maths" ? "&#9651; &nbsp; +<br>1/2 &nbsp; =" : "a story<br>starts here."}</span></div><div class="subject-body"><span class="tag">THINK ${subject === "maths" ? "LOGICALLY" : "CREATIVELY"}</span><h3>${label(subject)}</h3><p>${subject === "maths" ? "From fractions to shapes, discover the patterns and methods behind the numbers." : "Explore words, understand stories and find confidence in your own voice."}</p><div class="card-bottom"><span>${count} topics &middot; ${count * 3} questions</span><span class="card-arrow" aria-hidden="true">&#8594;</span></div></div></a>`;
      }).join("")}</div></section>
      <section class="practice-banner"><span class="badge" aria-hidden="true">&#10022;</span><div><h3>A little practice goes a long way.</h3><p>Try a short mixed set. No timer, no pressure, just progress.</p></div><a class="cta" href="#practice">Let's practise <span aria-hidden="true">&#8594;</span></a></section>
      <section class="test-banner"><div><p class="eyebrow">READY FOR A BIGGER STEP?</p><h2>Put your learning together.</h2><p>Maths, English and mixed tests, untimed or with an optional timer. Submit for your score and explained review.</p></div><a class="secondary-button" href="#tests">${exam ? "Return to your test" : "Explore practice tests"} <span aria-hidden="true">&#8594;</span></a></section>
      <section class="test-banner flashcard-banner"><div><p class="eyebrow">RECALL A LITTLE, REMEMBER MORE</p><h2>Turn an idea into a small win.</h2><p>${window.BRIGHTLANE_FLASHCARDS.length} flashcards across Maths and English. Try recalling the answer, then reveal and choose what to revisit.</p></div><a class="secondary-button" href="#flashcards">${deck ? "Return to flashcards" : "Explore flashcards"} <span aria-hidden="true">&#8594;</span></a></section>
      <section class="test-banner"><div><p class="eyebrow">YOUR PREPARATION TOOLKIT</p><h2>Plan, practise, review.</h2><p>See accuracy from real answers, revisit mistakes, save a backup and build a plan around your own confirmed 2027 exam date.</p></div><div class="quiz-controls"><a class="secondary-button" href="#dashboard">Your progress</a><a class="secondary-button" href="#planner">Study planner</a></div></section>
      <section class="test-banner scenario-banner"><div><p class="eyebrow">ORIGINAL EXAM-STYLE PRACTICE</p><h2>Follow a scenario through.</h2><p>${scenarios.length} original Maths and English scenarios with ${scenarioQuestionCount} explained questions. Not actual past-paper questions.</p></div><a class="secondary-button" href="#scenarios">Explore scenarios <span aria-hidden="true">&#8594;</span></a></section>
      <section class="test-banner sutton-banner"><div><p class="eyebrow">SUTTON 2027 · ORIGINAL PRACTICE</p><h2>Prepare for both stages.</h2><p>${sutton.stageOne.maths.length + sutton.stageOne.english.length} original SET-style questions, written Stage 2 materials and mock formats. Not official questions or an exam prediction.</p></div><a class="secondary-button" href="#sutton">Explore Sutton practice <span aria-hidden="true">&#8594;</span></a></section>
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
    if (item.format === "numeric-entry") {
      return `<fieldset class="choices numeric-answer"><legend class="question">${esc(item.q)}</legend><label for="numeric-answer-input">Enter your answer using digits only</label><input id="numeric-answer-input" class="digit-grid-input" type="text" name="answer" inputmode="numeric" pattern="[0-9]*" maxlength="8" autocomplete="off" value="${selected === null ? "" : esc(selected)}" aria-describedby="numeric-answer-help"><p id="numeric-answer-help" class="coverage-note">For a four-digit 24-hour time, include a leading zero and omit the colon: 07:05 becomes 0705.</p></fieldset>`;
    }
    const multiple = Array.isArray(item.answer);
    const instruction = item.format === "select-two" ? " Select two answers." : item.format === "select-many" ? " Choose every correct answer. Practice is marked by exact match." : "";
    return `<fieldset class="choices"><legend class="question">${esc(item.q + instruction)}</legend>${item.options.map((option, i) => {
      const checked = multiple ? Array.isArray(selected) && selected.includes(i) : selected === i;
      return `<label class="choice"><input type="${multiple ? "checkbox" : "radio"}" name="answer" value="${i}"${checked ? " checked" : ""}><span><span class="option-letter" aria-hidden="true">${String.fromCharCode(65 + i)}.</span> ${esc(option)}</span></label>`;
    }).join("")}</fieldset>`;
  }
  function answerText(item, selected) {
    if (selected === null) return "Not answered";
    if (item.format === "numeric-entry") return String(selected);
    return (Array.isArray(selected) ? selected : [selected]).map(index => item.options[index]).join("; ");
  }
  function correctAnswerText(item) {
    if (item.format === "numeric-entry") return item.answer;
    return (Array.isArray(item.answer) ? item.answer : [item.answer]).map(index => item.options[index]).join("; ");
  }
  function testTitle(current) {
    if (current.kind === "tiffin-stage-one") {
      const pool = current.mode === "maths"
        ? sutton.tiffin.numeric
        : sutton.stageOne.english.filter(question => !Array.isArray(question.answer));
      const index = pool.findIndex(question => question.id === current.items[0].id);
      const firstMock = current.mode === "maths" ? index < 12 : index < Math.ceil(pool.length / 2);
      return `Tiffin Girls' Stage One ${label(current.mode)} Mock ${firstMock ? "A" : "B"}`;
    }
    if (current.kind === "practice") return `${testLabel(current.mode)} practice`;
    if (current.kind === "test") return `${testLabel(current.mode)} test`;
    if (current.kind !== "sutton-set") return `${testLabel(current.mode)} ${current.kind} practice`;
    const set = sutton.stageOne[current.mode];
    const midpoint = Math.ceil(set.length / 2);
    const index = set.findIndex(question => question.id === current.items[0].id);
    const paper = index < midpoint ? "Mock A" : "Mock B";
    return `Sutton Stage 1 SET ${label(current.mode)} ${paper}`;
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
      <div class="stats"><div class="stat"><strong>${state.studied.length}/30</strong><span>lessons studied<br>self-reported</span></div><div class="stat"><strong>${answered ? Math.round(correct / answered * 100) + "%" : "No data"}</strong><span>${correct}/${answered} correct<br>completed question attempts</span></div><div class="stat"><strong>${Object.values(state.cardRatings).filter(value => value === "known").length}/${window.BRIGHTLANE_FLASHCARDS.length}</strong><span>flashcards known<br>self-assessed</span></div><div class="stat"><strong>${state.suttonReviewed.length}/${progress.stageTwoIds.length}</strong><span>Stage 2 tasks<br>self-reviewed</span></div></div>
      <section class="lesson-block"><h2>Target your next revision</h2><p>Questions are included when their latest recorded answer is incorrect or blank. A later correct answer removes them from this list. Repeats are practice, not fresh exam evidence. Revision sets contain up to 60 questions; complete another round if more remain.</p><p class="coverage-note">Starting revision or opening a saved result replaces any unfinished test without recording it. A running timer otherwise continues while you visit these pages.</p><div class="quiz-controls"><button id="revise-mistakes" class="cta" type="button"${missed.length ? "" : " disabled"}>Revise mistakes (${missed.length})</button><button id="revise-cards" class="secondary-button" type="button"${again ? "" : " disabled"}>Practise-again flashcards (${again})</button><a class="secondary-button" href="#planner">Your study planner</a></div></section>
      <section class="lesson-block"><h2>Topic accuracy &amp; revision priorities</h2><p class="coverage-note">Based only on completed practice, tests and revision results retained here. Blank answers count as zero. Repeated questions count again. Small samples are uncertain; no answers means no accuracy evidence. Historical best lesson scores alone do not establish accuracy.</p><div class="evidence-list">${evidence.slice().sort((a, b) => {
        if (!a.total || !b.total) return Number(!a.total) - Number(!b.total);
        return a.correct / a.total - b.correct / b.total;
      }).map(item => `<div class="evidence-row"><a href="#topic/${item.topic.id}">${esc(item.topic.title)}</a><span>${item.total ? `${item.correct}/${item.total} correct (${Math.round(item.correct / item.total * 100)}%)${item.unanswered ? " - " + item.unanswered + " blank" : ""}` : "No recorded answer evidence"}</span></div>`).join("")}</div></section>
      <section class="lesson-block"><h2>Recent results</h2><p class="coverage-note">The latest 100 completed sets are retained. Stage 1 raw marks are practice results, not standardised scores or predictions of admission. Stage 2 work is self-marked; this dashboard does not grade written responses.</p><div id="result-history">${state.attempts.length ? state.attempts.slice().reverse().map(attempt => {
        const result = progress.summary(attempt);
        return `<div class="evidence-row"><div><strong>${attempt.kind === "sutton-set" ? esc(testTitle({ ...attempt, items: attempt.questionIds.map(id => progress.byId.get(id)) })) + " mock" : testLabel(attempt.mode) + " " + esc(attempt.kind)}</strong><p>${esc(new Date(attempt.at).toLocaleString("en-GB"))} &middot; ${result.correct}/${result.total}${attempt.seconds ? " - timed" : " - untimed"}${attempt.expired ? " (time expired)" : ""}</p></div><button class="secondary-button open-result" type="button" data-result="${attempt.id}">Review result</button></div>`;
      }).join("") : "<p>No completed results yet. Finish a short practice set or a test to see evidence here.</p>"}</div></section>
      <section class="lesson-block"><h2>Offline progress backup</h2><p>Export before moving this folder or clearing browser data. Import replaces all saved learning data after validation and confirmation; it does not merge. No file is sent anywhere. Active tests and decks will be closed when importing or resetting.</p><div class="quiz-controls"><button class="cta" id="export-progress" type="button">Export backup</button><label class="file-label">Import a JSON backup<input type="file" id="import-progress" accept=".json,application/json"></label><button class="secondary-button" id="dashboard-reset" type="button">Reset all progress</button></div><p id="backup-status" class="status-line" role="status"></p><div id="backup-confirm"></div></section>`;
    document.getElementById("revise-mistakes").addEventListener("click", () => startRevision(missed));
    document.getElementById("revise-cards").addEventListener("click", () => { cardFilters = { subject: "all", topic: "all", exam: "all", again: true }; deck = null; location.hash = "flashcards"; });
    document.querySelectorAll(".open-result").forEach(button => button.addEventListener("click", () => {
      const attempt = state.attempts.find(item => item.id === button.dataset.result);
      stopTimer();
      writtenMock = null;
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
          stopTimer(); state = pendingImport; pendingImport = null; exam = null; writtenMock = null; deck = null;
          cardFilters = { subject: "all", topic: "all", exam: "all" };
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
    const checklist = [["guidance", "Check current school/provider subjects, format and exam date"], ["registration", "Check registration steps and deadlines in official guidance"], ["arrangements", "Discuss any access arrangements with the school/provider if needed"], ["exam-day", "Plan travel, required materials and exam-day instructions"], ["sutton-practice", "Review Sutton SET/Stage 2 formats with current school guidance"]];
    main.innerHTML = `<div class="page-header"><p class="eyebrow">YOUR OWN 2027 EXAM PLAN</p><h1>A steady plan, not a race.</h1><p>Enter a confirmed exam date from your school's current guidance. This is the date you take an exam in 2027, not a school entry date. No official dates or deadlines are supplied here.</p></div>
      <section class="lesson-block"><h2>Set your study rhythm</h2><form id="planner-form" novalidate><div class="filters"><label>Exam date in 2027 (optional)<input id="planner-date" type="text" inputmode="numeric" placeholder="YYYY-MM-DD" value="${esc(planner.examDate)}" aria-describedby="planner-date-help"></label><label>Study sessions per week<input id="planner-sessions" type="number" min="1" max="7" step="1" value="${planner.weeklySessions}"></label></div><p id="planner-date-help" class="coverage-note">Use YYYY-MM-DD. Leave blank if the date is not confirmed. Dates outside 2027 or impossible calendar dates are rejected.</p><button class="cta" type="submit">Save plan settings</button><p class="status-line" id="planner-status" role="status"></p></form></section>
      <section class="lesson-block"><h2>Your suggested rhythm</h2><p>${days === null ? "Choose a date when confirmed. Meanwhile, aim for " + planner.weeklySessions + " short sessions a week, rotating Maths, English and review." : days < 0 ? "Your entered exam date has passed. Update it if needed; your checklist remains available." : days === 0 ? "Your entered exam date is today. Keep today's plan light and check the school's exam-day instructions." : `${days} days until your entered date (about ${weeks} weeks). At ${planner.weeklySessions} sessions per week, that is about ${weeks * planner.weeklySessions} available sessions.`}</p><p class="coverage-note">${remaining.length} topics remain on your planning checklist. ${weeks && days > 0 ? "A simple starting point is " + Math.ceil(remaining.length / weeks) + " topics per week, with later sessions for mistakes and recall. " : ""}Use 15-25 minute sessions as a flexible suggestion, not a required or official timetable. Adjust to your needs, leave time for rest, and revisit difficult ideas. Checking a topic here is planning only, not tested mastery.</p></section>
      <section class="lesson-block"><h2>Preparation checklist</h2><div class="planner-checks">${checklist.map(([id, text]) => `<label><input type="checkbox" data-check="${id}"${planner.checks.includes(id) ? " checked" : ""}> ${esc(text)}</label>`).join("")}</div><p class="coverage-note">For Sutton SET/Stage 2, review the format and make a plan only after checking current guidance. This checklist is personal preparation, not confirmation of a school requirement.</p><a class="secondary-button" href="#sutton">Sutton 2027 format and original practice</a></section>
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
  function scenarioCard(scenario) {
    const topic = topics.find(item => item.id === scenario.topicId);
    return `<article class="scenario-card" data-scenario="${scenario.id}"><p class="eyebrow">${label(scenario.subject)} &middot; ${esc(topic.title)} &middot; ${esc(scenario.type)}</p><h3>${esc(scenario.title)}</h3><p class="scenario-prompt">${esc(scenario.prompt)}</p><p class="scenario-question-count">${scenario.questions.length} linked questions with explanations</p><button class="cta start-scenario" type="button" data-scenario="${scenario.id}">Practise this scenario</button><section class="scenario-quiz practice-panel" id="quiz-scenario-${scenario.id}" hidden aria-label="${esc(scenario.title)} practice"></section></article>`;
  }
  function scenarioPrintCard(scenario) {
    const topic = topics.find(item => item.id === scenario.topicId);
    return `<article class="scenario-print-card"><p class="eyebrow">${label(scenario.subject)} &middot; ${esc(topic.title)} &middot; ${esc(scenario.type)}</p><h3>${esc(scenario.title)}</h3><p>${esc(scenario.prompt)}</p><ol class="worksheet-questions">${scenario.questions.map(question => `<li><p>${esc(question.q)}</p><ol type="A">${question.options.map(option => `<li>${esc(option)}</li>`).join("")}</ol></li>`).join("")}</ol><details class="scenario-answer-key"><summary>Answer key &amp; explanations (included when printed)</summary><ol>${scenario.questions.map(question => `<li><strong>${esc(question.options[question.answer])}.</strong> ${esc(question.why)}</li>`).join("")}</ol></details></article>`;
  }
  function scenarioPage() {
    const matching = scenarios.filter(scenario => {
      return (scenarioFilters.subject === "all" || scenario.subject === scenarioFilters.subject) &&
        (scenarioFilters.topic === "all" || scenario.topicId === scenarioFilters.topic) &&
        (scenarioFilters.type === "all" || scenario.type === scenarioFilters.type);
    });
    const topicOptions = topics.filter(topic => scenarioFilters.subject === "all" || topic.subject === scenarioFilters.subject);
    const types = [...new Set(scenarios.map(scenario => scenario.type))].sort((a, b) => a.localeCompare(b, "en-GB"));
    main.innerHTML = `<div class="page-header"><p class="eyebrow">ORIGINAL EXAM-STYLE PRACTICE</p><h1>Think through a whole scenario.</h1><p>Use the details in each situation, then answer its linked questions and read the explanations. Scenarios practise common UK 11+ preparation formats; they are original material, not real past-paper questions from 2017–2026. There is no single complete national archive of 11+ papers, and school/provider requirements and formats vary.</p></div>
      <section class="lesson-block scenario-workspace" id="scenario-workspace"><p class="eyebrow">${scenarios.length} ORIGINAL SCENARIOS &middot; ${scenarioQuestionCount} EXPLAINED QUESTIONS</p><h2>Choose a practice set</h2><p>Each scenario includes ${scenarios[0].questions.length} linked questions. Completed answers contribute to the existing saved topic evidence and mistake-revision tools. Leaving this page or changing filters abandons an unfinished set; completed results can be reviewed from Progress.</p>
        <div class="material-controls scenario-controls"><label>Subject<select id="scenario-subject"><option value="all"${scenarioFilters.subject === "all" ? " selected" : ""}>Maths &amp; English</option><option value="maths"${scenarioFilters.subject === "maths" ? " selected" : ""}>Maths</option><option value="english"${scenarioFilters.subject === "english" ? " selected" : ""}>English</option></select></label><label>Topic<select id="scenario-topic"><option value="all">All topics</option>${topicOptions.map(topic => `<option value="${topic.id}"${scenarioFilters.topic === topic.id ? " selected" : ""}>${label(topic.subject)}: ${esc(topic.title)}</option>`).join("")}</select></label><label>Scenario type<select id="scenario-type"><option value="all">All types</option>${types.map(type => `<option value="${esc(type)}"${scenarioFilters.type === type ? " selected" : ""}>${esc(type)}</option>`).join("")}</select></label><button class="secondary-button print-material" id="print-scenarios" type="button"${matching.length ? "" : " disabled"}>Print filtered scenarios &amp; answer keys</button></div>
        <p id="scenario-count" class="result-count" aria-live="polite">${matching.length} ${matching.length === 1 ? "scenario" : "scenarios"}</p><div id="scenario-results" class="scenario-grid">${matching.length ? matching.map(scenarioCard).join("") : `<p class="empty">No scenarios match these filters. Choose a broader subject, topic or type.</p>`}</div>
        <div id="scenario-print-output" class="scenario-print-output">${matching.map(scenarioPrintCard).join("")}</div>
      </section><p class="coverage-note">All scenarios, passages and questions are original and bundled for direct file:// use. They are grouped by subject, topic and practice format, not attributed to historical years or providers. This broad resource does not claim complete ten-year past-paper coverage or universal syllabus coverage; check the target school's current guidance.</p>`;
    document.getElementById("scenario-subject").addEventListener("change", event => {
      scenarioFilters.subject = event.target.value;
      if (scenarioFilters.topic !== "all" && !topicOptionsForSubject(scenarioFilters.subject).some(topic => topic.id === scenarioFilters.topic)) scenarioFilters.topic = "all";
      scenarioPage();
      document.getElementById("scenario-subject").focus();
    });
    document.getElementById("scenario-topic").addEventListener("change", event => { scenarioFilters.topic = event.target.value; scenarioPage(); document.getElementById("scenario-topic").focus(); });
    document.getElementById("scenario-type").addEventListener("change", event => { scenarioFilters.type = event.target.value; scenarioPage(); document.getElementById("scenario-type").focus(); });
    document.getElementById("print-scenarios").addEventListener("click", () => printMaterial("scenario-workspace"));
    document.querySelectorAll(".start-scenario").forEach(button => button.addEventListener("click", () => {
      const scenario = scenarios.find(item => item.id === button.dataset.scenario);
      const panel = document.getElementById("quiz-scenario-" + scenario.id);
      panel.hidden = false;
      startQuiz(progress.questions.filter(question => question.scenario && question.scenario.id === scenario.id), panel.id, null);
      panel.scrollIntoView({ block: "start", behavior: "auto" });
      focusQuiz();
    }));
  }
  function topicOptionsForSubject(subject) {
    return topics.filter(topic => subject === "all" || topic.subject === subject);
  }
  function suttonSetQuestions(subject) {
    return sutton.stageOne[subject].map(question => ({ ...question, topic: topics.find(topic => topic.id === question.topicId) }));
  }
  function startSuttonSet(subject, paper) {
    const items = suttonSetQuestions(subject);
    const midpoint = Math.ceil(items.length / 2);
    const selected = paper === "A" ? items.slice(0, midpoint) : items.slice(midpoint);
    const seconds = Number(document.getElementById("sutton-set-timing").value);
    writtenMock = null;
    startTest(subject, selected, seconds, "sutton-set");
  }
  function saveSuttonReview(id, button) {
    if (!state.suttonReviewed.includes(id)) {
      state.suttonReviewed = [...state.suttonReviewed, id];
      save();
    }
    button.textContent = "Self-review saved";
    button.disabled = true;
  }
  function suttonMaterialCard(item) {
    const topic = topics.find(entry => entry.id === item.topicId);
    return `<article class="lesson-block sutton-study-card"><p class="eyebrow">${esc(topic.title)} &middot; ${item.maxMarks} self-awarded marks</p><h3>${esc(item.q)}</h3><label class="sutton-response-label" for="sutton-answer-${item.id}">Your working or answer</label><textarea id="sutton-answer-${item.id}" rows="4" placeholder="Show your method and final answer."></textarea><details><summary>Worked answer and mark scheme</summary><p><strong>Model answer:</strong> ${esc(item.finalAnswer)}</p><ol>${item.scheme.map(step => `<li>${esc(step)}</li>`).join("")}</ol></details><button class="secondary-button sutton-reviewed" data-review-id="${item.id}" type="button"${state.suttonReviewed.includes(item.id) ? " disabled" : ""}>${state.suttonReviewed.includes(item.id) ? "Self-review saved" : "Mark this solution self-reviewed"}</button></article>`;
  }
  function suttonReadingCard(passage) {
    return `<article class="lesson-block sutton-study-card"><p class="eyebrow">ORIGINAL PASSAGE &middot; ${esc(passage.title)}</p><h3>${esc(passage.title)}</h3><div class="passage long-passage">${esc(passage.text)}</div>${passage.questions.map(question => `<section class="sutton-written-question"><h4>${esc(question.q)} <span>(${question.marks} ${question.marks === 1 ? "mark" : "marks"})</span></h4><label class="sutton-response-label" for="sutton-answer-${question.id}">Your written response</label><textarea id="sutton-answer-${question.id}" rows="3" placeholder="Write an answer using evidence from the passage."></textarea><details><summary>Model answer and self-mark guide</summary><p>${esc(question.modelAnswer)}</p><p><strong>Mark guide:</strong> ${esc(question.scheme)}</p></details><button class="secondary-button sutton-reviewed" data-review-id="${question.id}" type="button"${state.suttonReviewed.includes(question.id) ? " disabled" : ""}>${state.suttonReviewed.includes(question.id) ? "Self-review saved" : "Mark this answer self-reviewed"}</button></section>`).join("")}</article>`;
  }
  function suttonWritingCard(item) {
    return `<article class="lesson-block sutton-study-card"><p class="eyebrow">${esc(item.type)} &middot; ${esc(item.audience)}</p><h3>${esc(item.prompt)}</h3><p><strong>Purpose:</strong> ${esc(item.purpose)}</p><h4>Planning scaffold</h4><ol>${item.plan.map(step => `<li>${esc(step)}</li>`).join("")}</ol><label class="sutton-response-label" for="sutton-draft-${item.id}">Your draft (kept on this page only)</label><textarea id="sutton-draft-${item.id}" rows="10" placeholder="Plan and draft your response here. Copy it elsewhere if you want to keep it."></textarea><h4>Self-check rubric — not an automatic grade</h4><div class="planner-checks">${item.criteria.map((criterion, index) => `<label><input type="checkbox" aria-label="Self-check ${index + 1}: ${esc(criterion)}"> ${esc(criterion)}</label>`).join("")}</div><button class="secondary-button sutton-reviewed" data-review-id="${item.id}" type="button"${state.suttonReviewed.includes(item.id) ? " disabled" : ""}>${state.suttonReviewed.includes(item.id) ? "Self-review saved" : "Mark this writing self-reviewed"}</button></article>`;
  }
  function renderSuttonStudyMaterial() {
    const panel = document.getElementById("sutton-study-material");
    const mode = document.getElementById("sutton-material-type").value;
    if (mode === "maths") {
      const byTopic = sutton.stageTwo.maths.filter(item => suttonFilters.topic === "all" || item.topicId === suttonFilters.topic);
      if (!byTopic.some(item => item.id === suttonFilters.mathQuestion)) suttonFilters.mathQuestion = byTopic[0]?.id || "";
      const topic = document.getElementById("sutton-material-topic");
      topic.innerHTML = `<option value="all">All Maths topics</option>${topics.filter(item => item.subject === "maths").map(item => `<option value="${item.id}"${suttonFilters.topic === item.id ? " selected" : ""}>${esc(item.title)}</option>`).join("")}`;
      const selected = byTopic.find(item => item.id === suttonFilters.mathQuestion) || byTopic[0];
      document.getElementById("sutton-material-question-label").hidden = false;
      const questionSelect = document.getElementById("sutton-material-question");
      questionSelect.hidden = false;
      questionSelect.innerHTML = byTopic.map((item, index) => `<option value="${item.id}"${selected?.id === item.id ? " selected" : ""}>Problem ${index + 1} of ${byTopic.length}</option>`).join("");
      panel.innerHTML = selected ? suttonMaterialCard(selected) : `<p class="empty">No written problems match this topic.</p>`;
    } else if (mode === "reading") {
      suttonFilters.passage = suttonFilters.passage || sutton.stageTwo.passages[0].id;
      const readingTopic = document.getElementById("sutton-material-topic");
      readingTopic.innerHTML = `<option value="all">All comprehension skills</option>${topics.filter(item => ["comprehension", "evidence", "inference"].includes(item.id)).map(item => `<option value="${item.id}">${esc(item.title)}</option>`).join("")}`;
      readingTopic.value = suttonFilters.topic;
      if (!readingTopic.value) { suttonFilters.topic = "all"; readingTopic.value = "all"; }
      document.getElementById("sutton-material-question-label").hidden = false;
      const passageSelect = document.getElementById("sutton-material-question");
      passageSelect.hidden = false;
      passageSelect.innerHTML = sutton.stageTwo.passages.map(passage => `<option value="${passage.id}"${suttonFilters.passage === passage.id ? " selected" : ""}>${esc(passage.title)}</option>`).join("");
      const selected = sutton.stageTwo.passages.find(passage => passage.id === suttonFilters.passage) || sutton.stageTwo.passages[0];
      const topic = document.getElementById("sutton-material-topic").value;
      const questions = topic === "all" ? selected.questions : selected.questions.filter(question => question.topicId === topic);
      panel.innerHTML = `<article class="lesson-block sutton-study-card"><p class="eyebrow">ORIGINAL PASSAGE &middot; ${esc(selected.title)}</p><h3>${esc(selected.title)}</h3><div class="passage long-passage">${esc(selected.text)}</div>${questions.length ? questions.map(question => `<section class="sutton-written-question"><h4>${esc(question.q)} <span>(${question.marks} ${question.marks === 1 ? "mark" : "marks"})</span></h4><label class="sutton-response-label" for="sutton-answer-${question.id}">Your written response</label><textarea id="sutton-answer-${question.id}" rows="3" placeholder="Write an answer using evidence from the passage."></textarea><details><summary>Model answer and self-mark guide</summary><p>${esc(question.modelAnswer)}</p><p><strong>Mark guide:</strong> ${esc(question.scheme)}</p></details><button class="secondary-button sutton-reviewed" data-review-id="${question.id}" type="button"${state.suttonReviewed.includes(question.id) ? " disabled" : ""}>${state.suttonReviewed.includes(question.id) ? "Self-review saved" : "Mark this answer self-reviewed"}</button></section>`).join("") : `<p>No questions match this skill in this passage. Try another comprehension skill.</p>`}</article>`;
    } else {
      const writingType = document.getElementById("sutton-material-topic");
      writingType.innerHTML = `<option value="all">All writing forms</option>${[...new Set(sutton.stageTwo.writing.map(item => item.type))].map(type => `<option value="${esc(type)}">${esc(type)}</option>`).join("")}`;
      writingType.value = suttonFilters.topic;
      if (!writingType.value) { suttonFilters.topic = "all"; writingType.value = "all"; }
      document.getElementById("sutton-material-question-label").hidden = false;
      const writing = sutton.stageTwo.writing.filter(item => suttonFilters.topic === "all" || item.type === suttonFilters.topic);
      if (!writing.some(item => item.id === suttonFilters.writing)) suttonFilters.writing = writing[0]?.id || "";
      const questionSelect = document.getElementById("sutton-material-question");
      questionSelect.hidden = false;
      questionSelect.innerHTML = writing.map((item, index) => `<option value="${item.id}"${suttonFilters.writing === item.id ? " selected" : ""}>Prompt ${index + 1} of ${writing.length}</option>`).join("");
      const selected = writing.find(item => item.id === suttonFilters.writing);
      panel.innerHTML = selected ? suttonWritingCard(selected) : `<p class="empty">No writing prompt matches this form.</p>`;
    }
    panel.querySelectorAll(".sutton-reviewed").forEach(button => button.addEventListener("click", () => saveSuttonReview(button.dataset.reviewId, button)));
  }
  function startTiffinStageOne(subject, paper, seconds = 2700) {
    let selected;
    if (subject === "maths") {
      const start = paper === "A" ? 0 : 12;
      const numeric = sutton.tiffin.numeric.slice(start, start + 12);
      const unfamiliarStart = paper === "A" ? 0 : 10;
      const unfamiliar = sutton.tiffin.unfamiliar.slice(unfamiliarStart, unfamiliarStart + 10);
      const regularStart = paper === "A" ? 0 : 2;
      const regular = sutton.stageOne.maths.filter(question => !Array.isArray(question.answer)).slice(regularStart, regularStart + 2);
      selected = [...numeric, ...unfamiliar, ...regular].map(question => progress.byId.get(question.id));
    } else {
      const bank = sutton.stageOne.english.filter(question => !Array.isArray(question.answer));
      const midpoint = Math.ceil(bank.length / 2);
      selected = bank.slice(paper === "A" ? 0 : midpoint, paper === "A" ? midpoint : undefined).map(question => progress.byId.get(question.id));
    }
    startTest(subject, selected, seconds, "tiffin-stage-one");
  }
  function examGuidePage() {
    const source = labelText => sutton.guidance.sources.find(item => item.label.includes(labelText));
    const tiffinPage = source("The Tiffin Girls' School: Year 7 admissions");
    const tiffinFaq = source("FAQs for September 2027 entry");
    const tiffinPolicy = source("admissions arrangements for September 2027 entry");
    const setFaq = source("Sutton Grammar School admissions FAQs");
    const wilsonsFaq = source("Wilson's School admissions FAQs");
    const girlsGuidance = source("Wallington High School for Girls: Year 7 admissions");
    const girlsPolicy = source("Wallington High School for Girls: published admissions policy");
    main.innerHTML = `<div class="page-header"><p class="eyebrow">GIRLS' 11+ ROUTE · 2028 ENTRY</p><h1>Prepare for Tiffin, Nonsuch &amp; Wallington Girls.</h1><p>Nonsuch and Wallington Girls share the first-stage Sutton Selective Eligibility Test (SET), followed by their joint NWSSEE. Tiffin Girls' runs its own separate Stage One and Stage Two tests. This is original practice, not an official paper or pass prediction. School arrangements can change, so check the current guidance linked below.</p></div>
      <div class="sutton-warning"><strong>Honest coverage:</strong> The practice bank covers common KS2 Maths and English skills and the formats described in published guidance. It cannot cover every possible question, predict the 2027 papers or guarantee an offer. No official or commercial paper questions are reproduced.</div>
      <nav class="material-nav" aria-label="Exam guide sections"><a class="secondary-button" href="#exam-set">Stage 1 · SET</a><a class="secondary-button" href="#exam-nwssee">Nonsuch &amp; Wallington Stage 2</a><a class="secondary-button" href="#exam-tiffin-one">Tiffin Stage One</a><a class="secondary-button" href="#exam-tiffin-two">Tiffin Stage Two</a><a class="secondary-button" href="#exam-sources">Sources &amp; updates</a><a class="secondary-button" href="#tips">Paper-by-paper tips</a></nav>
      <section class="lesson-block" id="exam-set"><p class="eyebrow">STAGE 1 · SHARED SET</p><h2>Nonsuch &amp; Wallington Girls' first round</h2><p>The SET comprises multiple-choice Maths and English papers, broadly based on Key Stage 2. Published guidance says there is no verbal or non-verbal reasoning. Candidates use a separate answer sheet, filling A–E lozenges (including combination answers). Each paper is expected to take 40–50 minutes with a break between. Calculator and rough paper are not permitted; working may be done on the question paper. There is no negative marking.</p><p>English “select two” items score only when both correct answers are selected; choosing one or more than two scores zero. Some other items have 2–4 correct answers and the official partial-marking method is not published. This app therefore uses an exact-match rule for its multi-select practice. SET scores are age-standardised, and the total across both papers determines the SET pass; this app does not calculate standardised marks.</p><p><strong>Expected date for 2028 entry:</strong> Tuesday 14 September 2027. Check the current school guidance. Nonsuch and Wallington Girls' Stage 2 is a separate written assessment, described below.</p><p><a href="${esc(setFaq.url)}" target="_blank" rel="noopener noreferrer">${esc(setFaq.label)} (external official guidance)</a> · <a href="${esc(girlsGuidance.url)}" target="_blank" rel="noopener noreferrer">${esc(girlsGuidance.label)} (external official guidance)</a></p><div class="quiz-controls"><a class="cta" href="#sutton">Practise original SET questions</a></div></section>
      <section class="lesson-block" id="exam-nwssee"><p class="eyebrow">STAGE 2 · NWSSEE</p><h2>Nonsuch &amp; Wallington Girls' written round</h2><p>The joint Nonsuch &amp; Wallington Second Stage Entrance Examination (NWSSEE) has written Maths and English tests; neither is multiple choice. Candidates must pass both parts. Published guidance for its stated cohort combines NWSSEE marks with half the SET aggregate, with each Stage 2 part equally weighted. Check the policy for the correct entry year; do not compare this practice score with an admissions threshold.</p><p>The girls' second-stage date for the 2028-entry cycle has not yet been published in the guidance checked. Confirm current arrangements with both schools.</p><div class="filters"><label>Personal practice time<select id="nwssee-timing"><option value="0">Untimed</option><option value="2700" selected>45 minutes</option><option value="3600">60 minutes</option></select></label></div><div class="mock-links">${["maths", "english"].flatMap(subject => ["A", "B"].map(paper => `<button class="secondary-button start-school-written" data-scope="nwssee" data-subject="${subject}" data-paper="${paper}" data-timer="nwssee-timing" type="button">NWSSEE ${label(subject)} Mock ${paper}</button>`)).join("")}</div><p><a href="${esc(girlsPolicy.url)}" target="_blank" rel="noopener noreferrer">${esc(girlsPolicy.label)} (external official guidance)</a></p></section>
      <section class="lesson-block" id="exam-tiffin-one"><p class="eyebrow">STAGE 1 · THE TIFFIN GIRLS' SCHOOL</p><h2>Tiffin Stage One</h2><p>English is multiple choice. Maths includes some multiple-choice questions and some numeric responses entered as digits in columns on an OMR answer sheet (for example, 07:05 as four digits). Each test lasts under 60 minutes with a short break. The cited guidance says to use an HB pencil and a firm line through the chosen letter or digit. The assessment assumes the Year 5 National Curriculum in English and Maths has been completed and includes unfamiliar formats to test application and adaptability.</p><p>For September 2028 entry, dates are not yet published; the expected window is autumn 2027. As checked on ${esc(sutton.guidance.checked)}, Tiffin's live page still describes September 2027 entry and 2026 test dates; those dates belong to a different cohort and are not 2028-entry dates. The published process uses age-weighted, standardised raw scores, and Stage One performance determines invitations to Stage Two; an invitation is not an offer. The published policy prioritises its Inner/Designated Area (44 postal districts) and lists an intake of 180; the school reports all places have gone to children within the Designated Area since 2014. Check the policy for the relevant cohort.</p><div class="filters"><label>Personal practice time<select id="tiffin-stage-one-timing"><option value="0">Untimed</option><option value="2400">40 minutes</option><option value="2700" selected>45 minutes</option><option value="3000">50 minutes</option></select></label></div><div class="mock-links">${["maths", "english"].flatMap(subject => ["A", "B"].map(paper => `<button class="cta start-tiffin-stage-one" data-subject="${subject}" data-paper="${paper}" type="button">Tiffin Stage One ${label(subject)} Mock ${paper}</button>`)).join("")}</div><p><a href="${esc(tiffinPage.url)}" target="_blank" rel="noopener noreferrer">${esc(tiffinPage.label)} (external official guidance)</a> · <a href="${esc(tiffinFaq.url)}" target="_blank" rel="noopener noreferrer">${esc(tiffinFaq.label)} (external official guidance)</a> · <a href="${esc(tiffinPolicy.url)}" target="_blank" rel="noopener noreferrer">${esc(tiffinPolicy.label)} (external official guidance)</a></p><p class="coverage-note">The digit-entry answer field shows digit columns for practice; it is not an official OMR sheet. These question counts and timings are Brightlane practice choices, not published Tiffin paper lengths. This app does not claim that Tiffin has SET's no-negative-marking rule.</p></section>
      <section class="lesson-block" id="exam-tiffin-two"><p class="eyebrow">STAGE 2 · THE TIFFIN GIRLS' SCHOOL</p><h2>Tiffin Stage Two</h2><p>English includes a reading-comprehension task and a creative-writing task, with answers in booklets. Maths answers go on an answer sheet; the published guidance says working is not marked, so final-answer accuracy matters. The papers are of a similar length to Stage One. No past papers are published and papers change each year.</p><p>For September 2028 entry, the expected window is autumn 2027; check the school's website for current dates, registration and format. As checked on ${esc(sutton.guidance.checked)}, currently published dates relate to September 2027 entry and are not dates for the 2028-entry cycle.</p><div class="filters"><label>Personal practice time<select id="tiffin-stage-two-timing"><option value="0">Untimed</option><option value="2700" selected>45 minutes</option><option value="3600">60 minutes</option></select></label></div><div class="mock-links">${["maths", "english"].flatMap(subject => ["A", "B"].map(paper => `<button class="secondary-button start-school-written" data-scope="tiffin-stage-two" data-subject="${subject}" data-paper="${paper}" data-timer="tiffin-stage-two-timing" type="button">Tiffin Stage Two ${label(subject)} Mock ${paper}</button>`)).join("")}</div><p><a href="${esc(tiffinPage.url)}" target="_blank" rel="noopener noreferrer">${esc(tiffinPage.label)} (external official guidance)</a> · <a href="${esc(tiffinFaq.url)}" target="_blank" rel="noopener noreferrer">${esc(tiffinFaq.label)} (external official guidance)</a> · <a href="${esc(tiffinPolicy.url)}" target="_blank" rel="noopener noreferrer">${esc(tiffinPolicy.label)} (external official guidance)</a></p></section>
      <section class="lesson-block"><p class="eyebrow">SHARED SET · OTHER SUTTON SCHOOLS</p><h2>Brief note on the boys' second-stage route</h2><p>Sutton Grammar, Wallington County Grammar and Wilson's use the shared SET but conduct a different written second stage. The Sutton practice route includes its format and weighting caveats; do not treat it as the girls' NWSSEE or Tiffin process.</p><a class="secondary-button" href="#sutton">Open Sutton SET and Stage 2 guidance</a></section>
      <section class="lesson-block" id="exam-sources"><p class="eyebrow">SOURCES &amp; UPDATES · CHECKED ${esc(sutton.guidance.checked)}</p><h2>Confirmed facts and details still to be published</h2><p>This guide is current to ${esc(sutton.guidance.checked)} and is for September 2028 entry. Published school admissions policies and registration notices take precedence over this study resource; check the target schools' live pages before registering or planning.</p><ul><li><strong>Confirmed for 2028 entry:</strong> Wallington High School for Girls says SET registration opens on ${esc(sutton.guidance.wallingtonGirls2028.registrationOpens)}; its open evening is ${esc(sutton.guidance.wallingtonGirls2028.openEvening)}.</li><li><strong>Expected, not a guarantee:</strong> the shared SET is expected on Tuesday 14 September 2027, as stated by Sutton Grammar and Wilson's. Check both schools' current instructions.</li><li><strong>Unpublished in the guidance checked:</strong> the Nonsuch/Wallington Girls' second-stage date for autumn 2027 has not been published; do not infer it from an earlier cohort.</li><li><strong>Tiffin:</strong> the live Year 7 page still lists September 2027 entry and 2026 test dates. Those belong to a different cohort; dates for September 2028 entry are not published, with autumn 2027 only the expected window.</li><li><strong>School-specific:</strong> test formats, admissions criteria, eligibility and dates can change. Tiffin's published 2027-entry cycle included a Stage Two date of 7 November 2026, which is not the date for 2028 entry.</li></ul><p>These are links to official guidance and are optional: opening them needs an internet connection. Every lesson, question, flashcard, mock, review and printable study material in this app is bundled and works offline.</p><ul class="sutton-sources"><li><a href="${esc(setFaq.url)}" target="_blank" rel="noopener noreferrer">${esc(setFaq.label)} <span class="sr-only">(optional official external guidance)</span></a></li><li><a href="${esc(sutton.guidance.sources.find(item => item.label === "Sutton Grammar School admissions").url)}" target="_blank" rel="noopener noreferrer">Sutton Grammar admissions</a></li><li><a href="${esc(wilsonsFaq.url)}" target="_blank" rel="noopener noreferrer">${esc(wilsonsFaq.label)}</a></li><li><a href="${esc(girlsGuidance.url)}" target="_blank" rel="noopener noreferrer">${esc(girlsGuidance.label)}</a></li><li><a href="${esc(girlsPolicy.url)}" target="_blank" rel="noopener noreferrer">${esc(girlsPolicy.label)}</a></li><li><a href="${esc(tiffinPage.url)}" target="_blank" rel="noopener noreferrer">${esc(tiffinPage.label)}</a></li><li><a href="${esc(tiffinFaq.url)}" target="_blank" rel="noopener noreferrer">${esc(tiffinFaq.label)}</a></li><li><a href="${esc(tiffinPolicy.url)}" target="_blank" rel="noopener noreferrer">${esc(tiffinPolicy.label)}</a></li></ul></section>`;
    document.querySelectorAll(".start-tiffin-stage-one").forEach(button => button.addEventListener("click", () => startTiffinStageOne(button.dataset.subject, button.dataset.paper, Number(document.getElementById("tiffin-stage-one-timing").value))));
    document.querySelectorAll(".start-school-written").forEach(button => button.addEventListener("click", () => startWrittenMock(button.dataset.subject, button.dataset.paper, Number(document.getElementById(button.dataset.timer).value), button.dataset.scope)));
  }
  function tipsPage() {
    const tips = [
      ["SET · Maths lozenges", ["Read the whole question twice and underline what it asks for.", "At home, scrap paper is useful for working. In the exam, no separate rough paper is permitted; work on the question paper as instructed.", "Fill one lozenge clearly on the separate sheet. If changing an answer, follow the current sheet instructions rather than leaving two marks.", "Check place value, units and whether your answer is sensible. There is no negative marking in the published SET guidance, so do not leave a guess blank if time is nearly over."]],
      ["SET · English & select-two", ["Read the question stem before returning to the passage; locate the relevant line, then use evidence.", "For inference, state the clue and explain what it suggests. Do not treat a guess as a fact.", "For select-two, identify exactly two supported choices before marking either one: both must be correct, and one or more than two scores zero.", "For multi-select items with an unspecified number of answers, the official partial-marking approach is unpublished; this practice app uses exact match."]],
      ["Tiffin Stage One · Maths numeric entry", ["Separate the units: decide whether the answer needs a number, a time, money or a measurement.", "For a 24-hour time, keep four digits and include a leading zero: 07:05 is 0705. Convert minutes carefully across an hour or midnight.", "Use estimation and inverse operations to check arithmetic; check a digit has not shifted a column.", "Practise both selectable and numeric-answer formats. This on-screen digit grid is a learning aid, not the school's OMR sheet."]],
      ["Tiffin Stage One · English", ["Skim once for the topic and tone, then scan for key names, times and repeated ideas.", "For retrieval, answer from a precise detail. For inference, link a clue to a reasonable conclusion.", "Work out vocabulary in context by trying a possible meaning in the sentence; check how it changes tone.", "Leave time to review punctuation, spelling and the exact answer-sheet mark required by current guidance."]],
      ["NWSSEE Stage Two · written Maths", ["Write down the target quantity and keep units beside each intermediate value.", "Use a bar model or ratio table when a problem compares parts or changes; show enough steps to check your method.", "For reverse fractions or percentages, work from the known part back to one part, then to the whole.", "Estimate before calculating and check the final response answers the question, not just an intermediate step."]],
      ["NWSSEE Stage Two · written English", ["For each response, make a point, select a short quotation or precise detail, then explain the link.", "Use the question's mark count as a guide to how many distinct details or steps to give.", "Read for the writer's purpose and viewpoint separately; support interpretations with evidence.", "Proofread for clear sentences, accurate punctuation and complete answers. No creative-writing task is claimed here unless current guidance confirms one."]],
      ["Tiffin Stage Two · Maths answer sheet", ["The published guidance says working is not marked, so use working to check privately, then enter the final answer accurately.", "Check the requested units, rounding and answer format before transferring it.", "Use inverse operations, estimation and a second method when practical.", "Practise careful digit transfer, especially decimal points and 24-hour times; this website does not simulate the official sheet."]],
      ["Tiffin Stage Two · comprehension & creative writing", ["For comprehension, skim for structure, scan for evidence, then explain what the evidence suggests.", "Plan a beginning, turning point and ending before drafting a story; descriptive writing can move through a place or image.", "For persuasive or formal tasks, establish audience and purpose, organise distinct points and keep tone appropriate.", "Reserve a few minutes to proofread sentence boundaries, tense consistency, spelling and paragraphing. The rubric is self-check, not an automated grade."]],
      ["Useful Maths methods", ["FDP equivalence: convert fraction, decimal and percentage through hundredths or a common denominator.", "Divisibility: check small factors before testing larger ones; a prime has exactly two positive factors.", "Use ratio parts or a bar model to represent totals and changes; for a best buy, compare unit prices in matching units.", "Area is inside; perimeter is around. For a compound shape, split it into rectangles and check whether any shared edge is counted twice.", "Mean = total ÷ number of values. For a missing value, find the total needed from the mean first.", "Working backwards: undo operations in reverse order. For time, count to a convenient hour, then add the remaining minutes."]],
      ["Useful English methods", ["Look for prefixes, suffixes and word families, but check an unfamiliar spelling in context rather than trusting a single rule.", "Their shows possession; there points to a place; they're means they are. Expand the contraction to check.", "A sentence needs a complete main clause. Check that a conjunction has not left an unfinished dependent clause.", "Use speech punctuation consistently: opening marks, punctuation before closing marks, and a new line for a new speaker when helpful.", "A simile compares using like or as; a metaphor describes one thing as another; personification gives human qualities.", "Edit in passes: meaning and order, sentence clarity, then grammar, punctuation and spelling."]]
    ];
    main.innerHTML = `<div class="page-header"><p class="eyebrow">PRACTICAL EXAM TECHNIQUE</p><h1>Tips for each paper, not magic tricks.</h1><p>Use methods that help you show what you know. These are preparation suggestions, not official school instructions. Follow the latest instructions from your target school on exam day.</p></div><div class="tips-grid">${tips.map(([title, points]) => `<article class="lesson-block tips-card"><p class="eyebrow">PAPER STRATEGY</p><h2>${esc(title)}</h2><ul>${points.map(point => `<li>${esc(point)}</li>`).join("")}</ul></article>`).join("")}</div><p class="coverage-note">SET-specific marking and answer-sheet rules above are limited to official SET guidance. Tiffin's instructions differ; do not assume there is no negative marking or that a practice OMR interface matches the school's materials.</p><a class="cta" href="#exams">Back to the girls' exam guide</a>`;
  }
  function suttonPage() {
    if (exam) {
      testsPage();
      return;
    }
    if (writtenMock) {
      if (writtenMock.submitted) renderWrittenReview();
      else renderWrittenMock();
      return;
    }
    const topicsWithCoverage = topics.map(topic => {
      const setCount = Object.values(sutton.stageOne).flat().filter(question => question.topicId === topic.id).length;
      const stageTwoMathsCount = sutton.stageTwo.maths.filter(question => question.topicId === topic.id).length;
      const stageTwoEnglishCount = sutton.stageTwo.passages.flatMap(passage => passage.questions).filter(question => question.topicId === topic.id).length;
      const writingCount = sutton.stageTwo.writing.filter(item => item.topicId === topic.id).length;
      return `<tr><th scope="row">${label(topic.subject)}: ${esc(topic.title)}</th><td>${setCount || "—"}</td><td>${stageTwoMathsCount || "—"}</td><td>${stageTwoEnglishCount || "—"}</td><td>${writingCount || "—"}</td></tr>`;
    }).join("");
    const setCounts = Object.fromEntries(Object.entries(sutton.stageOne).map(([subject, items]) => [subject, items.length]));
    const writtenMaths = sutton.stageTwo.maths.length;
    const writtenReading = sutton.stageTwo.passages.reduce((sum, passage) => sum + passage.questions.length, 0);
    main.innerHTML = `<div class="page-header"><p class="eyebrow">SUTTON · 2027 EXAM PREPARATION</p><h1>Prepare for both Sutton stages.</h1><p>This edition supports the Sutton tests expected to be sat in autumn 2027 for September 2028 entry. Preparation year and school entry year are different. The format and dates below reflect official guidance checked on ${esc(sutton.guidance.checked)}; check each school's current 2028-entry guidance before acting.</p></div>
      <div class="sutton-warning"><strong>Original practice only.</strong> Everything here is newly written Sutton-style preparation, not an official paper, sample question, real past question, prediction or guarantee. We have not copied or paraphrased official or commercial papers. Content is broadly KS2; exact requirements and selection rules vary by school.</div>
      <nav class="material-nav" aria-label="Sutton preparation sections"><a class="secondary-button" href="#sutton-set">Stage 1 SET</a><a class="secondary-button" href="#sutton-stage-two">Stage 2</a><a class="secondary-button" href="#sutton-study">Written practice library</a><a class="secondary-button" href="#sutton-coverage">Topic coverage</a></nav>
      <section class="lesson-block"><p class="eyebrow">SIX SELECTIVE SCHOOLS</p><h2>The shared Stage 1 SET</h2><p>The Selective Eligibility Test is used by Greenshaw High School, Nonsuch High School for Girls, Sutton Grammar School, Wallington County Grammar School, Wallington High School for Girls and Wilson's School. Published Greenshaw guidance describes a selective band with 60 ability places and no second stage; check its current admissions policy for the 2028 entry cohort.</p><ul class="sutton-school-list">${sutton.guidance.schools.map(school => `<li><strong>${esc(school.name)}</strong>${school.note ? ` — ${esc(school.note)}` : ""}</li>`).join("")}</ul><p>SET consists of multiple-choice Maths and English papers, broadly based on Key Stage 2. It does not include verbal or non-verbal reasoning. Published guidance describes a separate answer sheet with A–E lozenges and combination responses. The published paper duration is 40–50 minutes each, with a break between; candidates do not use a calculator or rough paper, but may work on the question paper. There is no negative marking.</p><p>SET scores are age-standardised, and the total across both papers determines the SET pass. This website does not calculate standardised scores or predict eligibility. For English “select two” items, the published rule requires both correct choices; one or more than two earns zero. For questions with an unspecified number of correct options, the official partial-marking method is not published; our practice uses a clearly stated exact-match rule and gives no partial credit.</p></section>
      <section class="sutton-date-grid" aria-label="Expected 2027 dates"><article class="lesson-block"><p class="eyebrow">EXPECTED · SEPTEMBER 2028 ENTRY</p><h2>SET: Tuesday 14 September 2027</h2><p>Expected date published by Sutton Grammar and Wilson's; confirm it in current school guidance.</p></article><article class="lesson-block"><p class="eyebrow">EXPECTED BOYS' SECOND STAGE</p><h2>Saturday 2 October 2027</h2><p>Sutton Grammar's published expected date for its Stage 2. The shared boys' second-stage Maths and English papers also serve Wallington County Grammar and Wilson's; each school applies its own selection criteria.</p></article><article class="lesson-block"><p class="eyebrow">GIRLS' SECOND STAGE</p><h2>NWSSEE date not yet published</h2><p>Nonsuch and Wallington High School for Girls use a joint written Maths and English second stage. The published WHSG policy at the time checked describes passing both parts and a scoring combination with SET; it applies to its stated cohort, so verify the later 2028-entry policy and date when published.</p></article></section>
      <section class="lesson-block"><h2>How the second stage differs</h2><p>The boys' shared Stage 2 is written, not multiple choice: Maths and English, each about 45 minutes to an hour, broadly KS2, with no VR/NVR. No sample papers are published in the cited guidance. Sutton Grammar uses its own published combination and weighting of the two SET and two Stage 2 subject scores, plus an age allowance; it is not a universal rule for every school. NWSSEE is a joint written Maths and English assessment for Nonsuch and Wallington High School for Girls. Do not compare practice raw marks with age-standardised results or use them to infer a pass.</p></section>
      <section class="lesson-block" id="sutton-set"><p class="eyebrow">STAGE 1 · MULTIPLE CHOICE</p><h2>Original SET-style mock practice</h2><p>These are Brightlane-created practice sets, not official paper lengths or question counts. Each has A–E options. Choose one answer unless the prompt says “select two” or “choose every correct answer”. Use paper to work; these practice screens do not replace the official answer sheet.</p><div class="filters"><label>Personal practice timing<select id="sutton-set-timing"><option value="0">Untimed (accessible option)</option><option value="2400">40 minutes</option><option value="2700" selected>45 minutes (default)</option><option value="3000">50 minutes</option></select></label></div><div class="test-mode-grid sutton-mock-grid">${["maths", "english"].flatMap(subject => ["A", "B"].map(paper => {
        const count = paper === "A" ? Math.ceil(setCounts[subject] / 2) : Math.floor(setCounts[subject] / 2);
        return `<article class="lesson-block test-mode"><p class="eyebrow">STAGE 1 · ${label(subject).toUpperCase()}</p><h3>${label(subject)} Mock ${paper}</h3><p>${count} original questions · A–E options. ${subject === "maths" ? "No calculator; work on paper." : "Includes original prose/poetry and language questions."}</p><button class="cta start-sutton-set" type="button" data-subject="${subject}" data-paper="${paper}">Start ${label(subject)} Mock ${paper}</button></article>`;
      })).join("")}</div><p class="coverage-note">The time selector is a personal pacing choice within the published 40–50 minute range; untimed practice is available. The number of questions here is Brightlane's own and does not state the official paper length.</p></section>
      <section class="lesson-block" id="sutton-stage-two"><p class="eyebrow">STAGE 2 · WRITTEN RESPONSE</p><h2>Practise showing your thinking</h2><p>${writtenMaths} original multi-step Maths problems with worked solutions and method-mark schemes; ${writtenReading} comprehension questions across four original passages; and ${sutton.stageTwo.writing.length} scaffolded writing prompts with self-check rubrics. Written responses are not automatically graded. Model answers are guides, not the only acceptable wording.</p><p>Start a timed practice paper or choose untimed. Our personal mock length is not an official question count. Your draft responses remain in this page for this visit only; completed self-review markers persist locally. Timer expiry moves the work to answer guidance without an automatic score.</p><div class="filters"><label>Subject<select id="sutton-written-subject"><option value="maths">Maths</option><option value="english">English</option></select></label><label>Mock<select id="sutton-written-paper"><option value="A">Mock A</option><option value="B">Mock B</option></select></label><label>Personal timing<select id="sutton-written-timing"><option value="0">Untimed</option><option value="2700" selected>45 minutes (default)</option><option value="3000">50 minutes</option><option value="3600">60 minutes</option></select></label><button class="cta" id="start-written-mock" type="button">Start Stage 2 written mock</button></div><p class="coverage-note">Writing is self-assessed against criteria. Any mark is a learner's own review, not an official score or a model of school marking.</p></section>
      <section class="lesson-block" id="sutton-study"><p class="eyebrow">WRITTEN REVISION LIBRARY</p><h2>Study one problem, passage or writing form</h2><p>Work it out before opening the model answer. Self-review saves a completion marker only, not a grade. Your typed response or draft is not backed up.</p><div class="material-controls"><label>Material<select id="sutton-material-type"><option value="maths">Maths problem</option><option value="reading">English passage</option><option value="writing">Writing prompt</option></select></label><label>Topic or form<select id="sutton-material-topic"><option value="all">All topics</option></select></label><label id="sutton-material-question-label">Choose item<select id="sutton-material-question"></select></label><button class="secondary-button print-material" id="print-sutton-material" type="button">Print selected material</button></div><div id="sutton-study-material"></div></section>
      <section class="lesson-block" id="sutton-coverage"><p class="eyebrow">TOPIC × STAGE COVERAGE</p><h2>What this original bank covers</h2><p>Counts are unique questions in the MCQ/written banks. Writing prompts are counted separately from questions. A blank dash means the content type does not apply. This is broad KS2 preparation, not a complete or official syllabus map.</p><div class="table-scroll"><table class="coverage-table"><thead><tr><th scope="col">Topic</th><th scope="col">SET MCQ</th><th scope="col">Stage 2 Maths</th><th scope="col">Stage 2 English reading</th><th scope="col">Writing prompts</th></tr></thead><tbody>${topicsWithCoverage}</tbody></table></div></section>
      <section class="lesson-block"><p class="eyebrow">OFFICIAL GUIDANCE SOURCES</p><h2>Check the current school information</h2><p>Facts and expected dates were checked on ${esc(sutton.guidance.checked)}. Published material can change. Especially verify the 2028-entry admission policies, registration, arrangements and dates before making decisions.</p><ul class="sutton-sources">${sutton.guidance.sources.map(source => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)} <span class="sr-only">(opens an external official guidance page)</span></a></li>`).join("")}</ul><p class="coverage-note">The offline app does not fetch these links. Opening them requires a separate internet connection. No official sample question has been included in this bank.</p></section>`;
    document.getElementById("sutton-material-type").addEventListener("change", () => {
      suttonFilters.material = document.getElementById("sutton-material-type").value;
      suttonFilters.topic = "all";
      renderSuttonStudyMaterial();
      document.getElementById("sutton-material-type").focus();
    });
    document.getElementById("sutton-material-topic").addEventListener("change", event => {
      suttonFilters.topic = event.target.value;
      renderSuttonStudyMaterial();
      document.getElementById("sutton-material-topic").focus();
    });
    document.getElementById("sutton-material-question").addEventListener("change", event => {
      const mode = document.getElementById("sutton-material-type").value;
      if (mode === "maths") suttonFilters.mathQuestion = event.target.value;
      else if (mode === "reading") suttonFilters.passage = event.target.value;
      else suttonFilters.writing = event.target.value;
      renderSuttonStudyMaterial();
      document.getElementById("sutton-material-question").focus();
    });
    document.getElementById("sutton-material-type").value = suttonFilters.material || "maths";
    document.getElementById("sutton-material-topic").value = suttonFilters.topic;
    renderSuttonStudyMaterial();
    document.querySelectorAll(".start-sutton-set").forEach(button => button.addEventListener("click", () => startSuttonSet(button.dataset.subject, button.dataset.paper)));
    document.getElementById("start-written-mock").addEventListener("click", () => startWrittenMock(
      document.getElementById("sutton-written-subject").value,
      document.getElementById("sutton-written-paper").value,
      Number(document.getElementById("sutton-written-timing").value)
    ));
    document.getElementById("print-sutton-material").addEventListener("click", () => printMaterial("sutton-study"));
  }
  function writtenMockItems(subject, paper, scope = "sutton") {
    if (subject === "maths") {
      const midpoint = Math.ceil(sutton.stageTwo.maths.length / 2);
      const selected = paper === "A" ? sutton.stageTwo.maths.slice(0, midpoint) : sutton.stageTwo.maths.slice(midpoint);
      return selected.map(item => ({ ...item, type: "maths", topic: topics.find(topic => topic.id === item.topicId) }));
    }
    const passages = paper === "A" ? sutton.stageTwo.passages.slice(0, 2) : sutton.stageTwo.passages.slice(2);
    const questions = passages.flatMap(passage => passage.questions.map(question => ({
      ...question, type: "reading", passage: passage.text, passageTitle: passage.title, topic: topics.find(topic => topic.id === (question.topicId || "comprehension"))
    })));
    const writing = sutton.stageTwo.writing[paper === "A" ? 0 : 1];
    if (scope !== "nwssee") questions.push({ ...writing, type: "writing", q: writing.prompt, maxMarks: writing.criteria.length, scheme: writing.criteria, topic: topics.find(topic => topic.id === writing.topicId) });
    return questions;
  }
  function startWrittenMock(subject, paper, seconds, scope = "sutton") {
    stopTimer();
    exam = null;
    const items = writtenMockItems(subject, paper, scope);
    writtenMock = {
      subject, paper, seconds, scope, deadline: seconds ? Date.now() + seconds * 1000 : null,
      expired: false, submitted: false, confirming: false, items, answers: items.map(() => "")
    };
    if (seconds) timer = setInterval(tickTimer, 250);
    renderWrittenMock();
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  function writtenRemainingTime() {
    const seconds = Math.max(0, Math.ceil((writtenMock.deadline - Date.now()) / 1000));
    return Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
  }
  function writtenTimerMarkup() {
    return `<div class="test-timer">${writtenMock.seconds ? `<span id="written-test-clock" role="timer" aria-live="off" aria-label="Time remaining">${writtenRemainingTime()}</span> remaining. Timer expiry submits for self-review; there is no automatic grade.` : "Untimed - no countdown or automatic submission."}</div>`;
  }
  function renderWrittenMock() {
    if (!writtenMock || writtenMock.submitted) return renderWrittenReview();
    const items = writtenMock.items;
    if (writtenMock.confirming) {
      const answered = writtenMock.answers.filter(answer => answer.trim()).length;
      const profileTitle = writtenMock.scope === "tiffin-stage-two" ? "Tiffin Stage Two" : writtenMock.scope === "nwssee" ? "NWSSEE Stage 2" : "Sutton Stage 2";
      main.innerHTML = testHeader(`${profileTitle} ${label(writtenMock.subject)} Mock ${writtenMock.paper}: ready to review`, `${answered} of ${items.length} written responses contain text. Blank responses are allowed; the mock does not mark your writing automatically.`) +
        writtenTimerMarkup() + `<section class="lesson-block"><h2>Submit for model answers and self-review?</h2><p>Your answers are kept only for this browser visit. Final submission locks this draft until you leave the review; reload abandons an unfinished mock. You can still return to add or change a response.</p><div class="quiz-controls"><button class="cta" id="written-confirm-submit" type="button">Submit and open self-review</button><button class="secondary-button" id="written-return" type="button">Return to my responses</button></div></section>`;
      document.getElementById("written-confirm-submit").addEventListener("click", () => finishWrittenMock(false));
      document.getElementById("written-return").addEventListener("click", () => {
        tickTimer();
        if (writtenMock.submitted) return;
        writtenMock.confirming = false;
        renderWrittenMock();
      });
      return;
    }
    let activePassage = "";
    const cards = items.map((item, index) => {
      const passage = item.passage && item.passageTitle !== activePassage
        ? `<details open class="sutton-passage"><summary>${esc(item.passageTitle)}</summary><div class="passage long-passage">${esc(item.passage)}</div></details>` : "";
      if (item.passageTitle) activePassage = item.passageTitle;
      const writing = item.type === "writing" ? `<p><strong>Purpose:</strong> ${esc(item.purpose)} · <strong>Audience:</strong> ${esc(item.audience)}</p><h4>Planning scaffold</h4><ol>${item.plan.map(step => `<li>${esc(step)}</li>`).join("")}</ol>` : "";
      return `<article class="lesson-block sutton-mock-item"><p class="eyebrow">QUESTION ${index + 1} OF ${items.length} · ${esc(item.topic.title)} · ${item.maxMarks} self-awarded marks</p>${passage}<h3>${esc(item.q)}</h3>${writing}<label class="sutton-response-label" for="written-response-${index}">${item.type === "writing" ? "Your draft" : "Your answer and working"}</label><textarea id="written-response-${index}" data-written-index="${index}" rows="${item.type === "writing" ? 12 : 4}" placeholder="${item.type === "writing" ? "Write your response. Your draft stays on this page only." : "Show your method and final answer."}">${esc(writtenMock.answers[index])}</textarea></article>`;
    }).join("");
    const profileTitle = writtenMock.scope === "tiffin-stage-two" ? "Tiffin Stage Two" : writtenMock.scope === "nwssee" ? "NWSSEE Stage 2" : "Sutton Stage 2";
    const mathNote = writtenMock.scope === "tiffin-stage-two" && writtenMock.subject === "maths" ? " Tiffin's published guidance says working is not marked. The worked steps here are an instructional aid, not the school's mark scheme; final-answer accuracy matters." : "";
    main.innerHTML = testHeader(`${profileTitle} ${label(writtenMock.subject)} Mock ${writtenMock.paper}`, "Original, written-response practice. Show your working or write a full response. There is no automatic marking; model answers and self-check criteria appear after submission.") +
      writtenTimerMarkup() + `<p class="coverage-note">${items.length} written tasks in this Brightlane-created practice set. The size is not an official paper length. Timer settings are personal, with 45 minutes as a default practice option.${mathNote}</p><form id="written-mock-form">${cards}<div class="quiz-controls"><button class="cta" type="submit">Review &amp; submit written mock</button><a class="secondary-button" href="${writtenMock.scope === "sutton" ? "#sutton" : "#exams"}">Leave to ${writtenMock.scope === "sutton" ? "Sutton overview" : "exam guide"} (timer continues)</a></div></form>`;
    document.querySelectorAll("[data-written-index]").forEach(input => input.addEventListener("input", () => { writtenMock.answers[Number(input.dataset.writtenIndex)] = input.value; }));
    document.getElementById("written-mock-form").addEventListener("submit", event => {
      event.preventDefault();
      if (writtenMock.seconds && Date.now() >= writtenMock.deadline) return finishWrittenMock(true);
      writtenMock.confirming = true;
      renderWrittenMock();
      main.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    });
  }
  function finishWrittenMock(expired) {
    if (!writtenMock || writtenMock.submitted) return;
    writtenMock.expired = expired;
    writtenMock.submitted = true;
    writtenMock.confirming = false;
    stopTimer();
    if (location.hash === "#sutton" || location.hash === "#tests" || location.hash === "#exams") {
      renderWrittenReview();
      main.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    } else {
      notice("Your written practice timer ended. Return to the exam guide to review your written answers.");
    }
  }
  function renderWrittenReview() {
    if (!writtenMock) return;
    const reviewed = writtenMock.items.filter(item => state.suttonReviewed.includes(item.id)).length;
    const items = writtenMock.items.map((item, index) => {
      const response = writtenMock.answers[index].trim() || "No response written.";
      const guidance = item.type === "writing"
        ? `<details open><summary>Self-check rubric — no model answer or automatic grade</summary><p>Audience: ${esc(item.audience)}. Purpose: ${esc(item.purpose)}.</p><ul>${item.criteria.map(criterion => `<li>${esc(criterion)}</li>`).join("")}</ul><p>Choose and revise your own ideas; there is no single correct composition.</p></details>`
        : `<details open><summary>Model answer and mark scheme (${item.maxMarks} marks)</summary><p><strong>Model answer:</strong> ${esc(item.finalAnswer || item.modelAnswer)}</p><ol>${(Array.isArray(item.scheme) ? item.scheme : [item.scheme]).map(step => `<li>${esc(step)}</li>`).join("")}</ol><label>My self-awarded mark<select aria-label="My self-awarded marks for question ${index + 1}">${Array.from({ length: item.maxMarks + 1 }, (_, mark) => `<option value="${mark}">${mark} of ${item.maxMarks}</option>`).join("")}</select></label></details>`;
      return `<article class="lesson-block sutton-mock-item"><p class="eyebrow">QUESTION ${index + 1} · ${esc(item.topic.title)} · ${item.maxMarks} marks for self-check</p>${item.passage ? `<details><summary>Re-read ${esc(item.passageTitle)}</summary><div class="passage long-passage">${esc(item.passage)}</div></details>` : ""}<h3>${esc(item.q)}</h3><p class="written-response"><strong>Your response:</strong><br>${esc(response)}</p>${guidance}<button class="secondary-button sutton-reviewed" data-review-id="${item.id}" type="button"${state.suttonReviewed.includes(item.id) ? " disabled" : ""}>${state.suttonReviewed.includes(item.id) ? "Self-review saved" : "Mark this task self-reviewed"}</button></article>`;
    }).join("");
    const profileTitle = writtenMock.scope === "tiffin-stage-two" ? "Tiffin Stage Two" : writtenMock.scope === "nwssee" ? "NWSSEE Stage 2" : "Sutton Stage 2";
    main.innerHTML = testHeader(`${profileTitle} ${label(writtenMock.subject)} Mock ${writtenMock.paper}: self-review`, "Written responses are not automatically graded. Compare your work with the model answer or rubric, then record only that you completed a self-review.") +
      `<section class="lesson-block"><p class="eyebrow">MOCK COMPLETE${writtenMock.expired ? " · TIME EXPIRED" : ""}</p><h2 id="written-review-count">${reviewed} of ${writtenMock.items.length} tasks already self-reviewed</h2><p>Marks shown in a scheme are guides for your own checking, not official school marks. The dashboard records completion of self-review, not a writing score or evidence of mastery.</p><button class="secondary-button" id="sutton-leave-review" type="button">Return to Sutton study menu</button></section>${items}`;
    document.getElementById("sutton-leave-review").textContent = writtenMock.scope === "sutton" ? "Return to Sutton study menu" : "Return to girls' exam guide";
    document.querySelectorAll(".sutton-reviewed").forEach(button => button.addEventListener("click", () => {
      saveSuttonReview(button.dataset.reviewId, button);
      const count = writtenMock.items.filter(item => state.suttonReviewed.includes(item.id)).length;
      document.getElementById("written-review-count").textContent = `${count} of ${writtenMock.items.length} tasks self-reviewed`;
    }));
    document.getElementById("sutton-leave-review").addEventListener("click", () => {
      const returnToSutton = writtenMock.scope === "sutton";
      writtenMock = null;
      if (returnToSutton) suttonPage();
      else examGuidePage();
      main.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    });
  }
  function revisionSheet(topic) {
    return `<h2>${esc(topic.title)}</h2><p>${esc(topic.summary)}</p><h3>Key ideas</h3><ol>${topic.learn.map(item => `<li>${esc(item)}</li>`).join("")}</ol><div class="worked-example"><h3>Worked example</h3><p><strong>${esc(topic.example[0])}</strong></p><p>${esc(topic.example[1])}</p></div><p class="pitfall"><strong>Watch out:</strong> ${esc(topic.pitfall)}</p><p><a class="text-button" href="#topic/${topic.id}">Open the full lesson and three practice questions</a></p>`;
  }
  function worksheetMarkup(topic) {
    return `<div class="worksheet-sheet" id="worksheet-print"><p class="eyebrow">${label(topic.subject)} &middot; WORKSHEET</p><h3>${esc(topic.title)}: practice sheet</h3><p>${esc(topic.summary)} Try each question on paper before opening the answer key.</p><ol class="worksheet-questions">${topic.questions.map(q => `<li><p>${esc(q.q)}</p><ol type="A">${q.options.map(option => `<li>${esc(option)}</li>`).join("")}</ol></li>`).join("")}</ol><details class="worksheet-answer-key"><summary>Answer key &amp; explanations (included when printed)</summary><ol>${topic.questions.map(q => `<li><strong>${esc(q.options[q.answer])}.</strong> ${esc(q.why)}</li>`).join("")}</ol></details></div>`;
  }
  function materialsPage() {
    const defaultTopic = topics[0];
    main.innerHTML = `<div class="page-header"><p class="eyebrow">YOUR OFFLINE REVISION LIBRARY</p><h1>Study materials, ready when you are.</h1><p>Topic sheets, clear reference notes, original longer reading practice, scenario practice and writing plans. <a href="#scenarios">Browse original exam-style scenarios</a> or print a worksheet; all material is bundled for offline use.</p></div>
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
        (cardFilters.exam === "all" || card.exam === cardFilters.exam) &&
        (!cardFilters.again || state.cardRatings[card.id] === "again");
    });
  }
  function flashcardsPage() {
    const availableTopics = topics.filter(t => cardFilters.subject === "all" || t.subject === cardFilters.subject);
    main.innerHTML = `<div class="page-header"><p class="eyebrow">A LITTLE ACTIVE RECALL</p><h1>Flashcards that make ideas stick.</h1><p>Try saying the answer before revealing it. Then choose "Know it" or "Practise again". These are your own judgements, not automatically marked answers.</p></div>
      <div class="filters"><label>Exam format<select id="card-exam">${[["all", "All exam formats"], ["General revision", "General revision"], ["SET", "SET Stage 1"], ["NWSSEE Stage 2", "NWSSEE Stage 2"], ["Tiffin Stage One", "Tiffin Stage One"], ["Tiffin Stage Two", "Tiffin Stage Two"], ["All exams", "Shared exam recall"]].map(([value, text]) => `<option value="${esc(value)}"${cardFilters.exam === value ? " selected" : ""}>${esc(text)}</option>`).join("")}</select></label><label>Subject<select id="card-subject">${[["all", "Maths & English"], ["maths", "Maths"], ["english", "English"]].map(([value, text]) => `<option value="${value}"${cardFilters.subject === value ? " selected" : ""}>${esc(text)}</option>`).join("")}</select></label><label>Topic<select id="card-topic"><option value="all">All topics</option>${availableTopics.map(t => `<option value="${t.id}"${cardFilters.topic === t.id ? " selected" : ""}>${esc(t.title)}</option>`).join("")}</select></label></div>
      <label class="card-revision-filter"><input type="checkbox" id="cards-again-only"${cardFilters.again ? " checked" : ""}> Only saved "practise again" cards</label>
      <p class="coverage-note">Saved self-assessments survive reloads when browser storage is available. Changing a filter or restarting clears this round only, not saved ratings. Your current deck order/revealed answer lasts for this visit. Lesson and test progress are unchanged.</p>
      <section id="flashcard-deck" aria-label="Flashcard study deck"></section>`;
    document.getElementById("card-subject").addEventListener("change", event => {
      cardFilters = { ...cardFilters, subject: event.target.value, topic: "all" };
      deck = null; flashcardsPage(); document.getElementById("card-subject").focus();
    });
    document.getElementById("card-exam").addEventListener("change", event => {
      cardFilters.exam = event.target.value;
      deck = null; renderDeck();
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
      document.getElementById("cards-show-all").addEventListener("click", () => { cardFilters = { subject: "all", topic: "all", exam: "all" }; deck = null; flashcardsPage(); focusDeck(); });
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
    writtenMock = null;
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
    if (location.hash === "#tests" || location.hash === "#sutton" || location.hash === "#exams") {
      testResults(); main.focus({ preventScroll: true }); window.scrollTo(0, 0);
    } else if (expired) notice("Your timed test has ended and was submitted. Open Practice tests or Progress to review your result.");
  }
  function expireIfNeeded() {
    if (exam && !exam.submitted && exam.seconds && Date.now() >= exam.deadline) { finishTest(true); return true; }
    return false;
  }
  function tickTimer() {
    if (expireIfNeeded()) return;
    if (writtenMock && !writtenMock.submitted && writtenMock.seconds && Date.now() >= writtenMock.deadline) {
      finishWrittenMock(true);
      return;
    }
    const clock = document.getElementById("test-clock");
    if (clock && exam && !exam.submitted) clock.textContent = remainingTime();
    const writtenClock = document.getElementById("written-test-clock");
    if (writtenClock && writtenMock && !writtenMock.submitted && writtenMock.seconds) writtenClock.textContent = writtenRemainingTime();
  }
  function testHeader(title, description) {
    return `<div class="page-header"><p class="eyebrow">BRIGHTLANE PRACTICE TESTS</p><h1>${esc(title)}</h1><p>${esc(description)}</p></div>`;
  }
  function testsPage() {
    if (expireIfNeeded()) return;
    if (writtenMock) {
      if (writtenMock.submitted) renderWrittenReview();
      else renderWrittenMock();
      return;
    }
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
    const description = exam.kind === "sutton-set"
      ? "Original Sutton-style practice only. Use the separate answer sheet as in the published guidance; these on-screen choices are not an official answer sheet. Answers stay hidden until submission."
      : exam.kind === "tiffin-stage-one"
        ? "Original Tiffin-style format practice only. Some Maths items use digit entry; multiple-choice answers stay hidden until submission. Check current school guidance for exam-day requirements."
        : "Take your time. Your choices are kept while you move between questions. No answers are revealed until final submission.";
    main.innerHTML = testHeader(testTitle(exam), description) +
      timerMarkup() + `<div class="test-layout"><section class="practice-panel" id="test-question-panel"><div class="quiz-meta"><span>Question ${exam.index + 1} of ${exam.items.length}</span><span>${label(item.topic.subject)} &middot; ${esc(item.topic.title)}</span></div><h2>Your next question</h2>
      ${item.passage ? `<details open><summary>Original passage for this question</summary><div class="passage">${esc(item.passage)}</div></details>` : ""}
      <form id="test-form">${answerChoices(item, exam.answers[exam.index])}<p class="status-line" id="test-answer-status" role="status"></p><div class="quiz-controls"><button id="test-previous" class="secondary-button" type="button"${exam.index === 0 ? " disabled" : ""}>Previous</button><button id="test-next" class="cta" type="button"${exam.index === exam.items.length - 1 ? " disabled" : ""}>Next question</button><button id="test-clear" class="text-button" type="button">Clear answer</button></div></form></section>
      <aside class="lesson-block test-navigation" aria-label="Test question navigation"><h2>Your test map</h2><p id="test-count" role="status">${answeredCount()} of ${exam.items.length} answered</p><p class="test-map-key">A tick means answered, not marked correct. Highlighted = current question.</p><nav class="question-map" aria-label="Choose a test question">${exam.items.map((q, i) => `<button type="button" data-index="${i}" aria-label="Question ${i + 1}, ${exam.answers[i] === null ? "unanswered" : "answered"}"${i === exam.index ? ' aria-current="step"' : ""} class="question-jump${exam.answers[i] !== null ? " answered" : ""}">${i + 1}${exam.answers[i] !== null ? '<span aria-hidden="true"> &#10003;</span>' : ""}</button>`).join("")}</nav><button class="cta" type="button" id="test-submit">Review &amp; submit</button><p class="test-map-key">Leaving keeps an active test for this visit. Any timer continues. Reloading or closing abandons it; completed results save to Progress.</p></aside></div>`;
    document.getElementById("test-form").addEventListener("submit", event => event.preventDefault());
    const saveTestAnswer = event => {
      if (expireIfNeeded()) return;
      if (event.target.name !== "answer") return;
      if (item.format === "numeric-entry") {
        const value = event.target.value.trim();
        if (!value) {
          exam.answers[exam.index] = null;
          updateTestAnswerStatus("Enter digits only. A non-numeric response is not saved.");
        } else if (/^\d{1,8}$/.test(value)) {
          exam.answers[exam.index] = value;
          updateTestAnswerStatus("Numeric answer saved. Check any leading zero before submission.");
        } else {
          exam.answers[exam.index] = null;
          updateTestAnswerStatus("Use digits only, up to 8 digits. This response is not saved yet.");
        }
      } else if (Array.isArray(item.answer)) {
        const selected = [...document.querySelectorAll('#test-form input[name="answer"]:checked')].map(input => Number(input.value));
        exam.answers[exam.index] = selected.length ? selected : null;
      } else {
        exam.answers[exam.index] = Number(event.target.value);
      }
      if (item.format !== "numeric-entry") updateTestAnswerStatus("Answer selected. You can change it before submission.");
    };
    document.getElementById("test-form").addEventListener("change", saveTestAnswer);
    document.getElementById("test-form").addEventListener("input", saveTestAnswer);
    document.getElementById("test-clear").addEventListener("click", () => {
      if (expireIfNeeded()) return;
      exam.answers[exam.index] = null;
      document.querySelectorAll("#test-form input").forEach(input => {
        if (input.type === "radio" || input.type === "checkbox") input.checked = false;
        else input.value = "";
      });
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
    main.innerHTML = testHeader("Ready to submit?", testTitle(exam) + " - " + answeredCount() + " of " + exam.items.length + " questions answered.") +
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
    const correct = exam.items.filter((q, i) => progress.isCorrect(q, exam.answers[i])).length;
    const unanswered = exam.items.length - answeredCount();
    main.innerHTML = testHeader(testTitle(exam) + " results", "This is a raw practice score, not a standardised exam score or an admission prediction.") +
      (exam.kind === "sutton-set" ? `<p class="coverage-note">The practice uses exact-match scoring for all multi-select questions because the official partial-marking method for questions with an unspecified number of answers is not published. “Select two” is correct only when both correct options, and no others, are selected. No points are deducted for wrong answers.</p>` : "") +
      `<section class="lesson-block test-result-summary"><p class="eyebrow">TEST COMPLETE${exam.expired ? " - TIME EXPIRED" : ""}</p><h2 id="test-score">${correct} / ${exam.items.length} &middot; ${Math.round(correct / exam.items.length * 100)}%</h2><p id="test-score-breakdown">${correct} correct &middot; ${exam.items.length - correct - unanswered} incorrect &middot; ${unanswered} unanswered</p><p class="coverage-note">Completed results are saved to Progress when browser storage is available. Your studied lessons and best short-practice scores are unchanged. ${exam.expired ? "Time ran out, so the saved choices were submitted automatically." : ""}</p><div class="quiz-controls"><button class="cta" id="test-retry" type="button">Retry these questions</button><button class="secondary-button" id="test-revise" type="button"${correct === exam.items.length ? " disabled" : ""}>Revise incorrect or blank answers</button><button class="secondary-button" id="test-new" type="button">Choose a new test</button><a class="text-button" href="#dashboard">Saved progress &amp; results</a></div></section>
      <section class="test-review" aria-labelledby="test-review-heading"><h2 id="test-review-heading">Your answer review</h2><p>Every question, your choice and the reason behind the correct answer.</p>${exam.items.map((q, i) => {
        const chosen = exam.answers[i];
        const status = chosen === null ? "Unanswered" : progress.isCorrect(q, chosen) ? "Correct" : "Incorrect";
        return `<article class="lesson-block review-item"><p class="eyebrow">QUESTION ${i + 1} &middot; ${label(q.topic.subject)} &middot; ${status.toUpperCase()}</p>${q.scenario ? `<details open class="scenario-context"><summary>${esc(q.scenario.title)} &middot; ${esc(q.scenario.type)}</summary><p>${esc(q.scenario.prompt)}</p></details>` : ""}<h3>${esc(q.q)}</h3>${q.passage ? `<details><summary>Re-read the original passage</summary><div class="passage">${esc(q.passage)}</div></details>` : ""}<p class="review-choice">Your answer: <strong>${esc(answerText(q, chosen))}</strong></p><div class="feedback${status === "Correct" ? "" : " incorrect"}"><p>Correct answer: <strong>${esc(correctAnswerText(q))}</strong></p><p>${esc(q.why)}</p></div><a class="text-button" href="#topic/${q.topic.id}">Revisit ${esc(q.topic.title)}</a></article>`;
      }).join("")}</section>`;
    document.getElementById("test-retry").addEventListener("click", () => startTest(exam.mode, exam.items, exam.seconds, exam.kind));
    document.getElementById("test-revise").addEventListener("click", () => startRevision(exam.items.filter((q, i) => !progress.isCorrect(q, exam.answers[i]))));
    document.getElementById("test-new").addEventListener("click", () => {
      const returnToSutton = exam.kind === "sutton-set";
      const returnToExams = exam.kind === "tiffin-stage-one";
      exam = null;
      if (returnToSutton) {
        if (location.hash === "#sutton") suttonPage();
        else location.hash = "sutton";
      } else if (returnToExams) examGuidePage();
      else testsPage();
      main.focus({ preventScroll: true }); window.scrollTo(0, 0);
    });
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
      ${item.scenario ? `<details open class="scenario-context"><summary>${esc(item.scenario.title)} &middot; ${esc(item.scenario.type)}</summary><p>${esc(item.scenario.prompt)}</p></details>` : !quiz.topicId && item.topic.passage ? `<details open><summary>Passage for this question</summary><div class="passage">${esc(item.topic.passage)}</div></details>` : ""}
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
    let sectionAnchor = "";
    quiz = null;
    if (path === "home") home();
    else if (path === "maths" || path === "english") subjectPage(path);
    else if (path === "practice") practicePage();
    else if (path === "tests") testsPage();
    else if (path === "flashcards") flashcardsPage();
    else if (path === "scenarios") scenarioPage();
    else if (path === "exams") {
      if (exam) testsPage();
      else if (writtenMock) writtenMock.submitted ? renderWrittenReview() : renderWrittenMock();
      else examGuidePage();
    }
    else if (path === "tips") tipsPage();
    else if (path === "sutton") suttonPage();
    else if (["exam-set", "exam-nwssee", "exam-tiffin-one", "exam-tiffin-two", "exam-sources"].includes(path)) {
      sectionAnchor = path;
      page = "exams";
      if (exam) testsPage();
      else if (writtenMock) writtenMock.submitted ? renderWrittenReview() : renderWrittenMock();
      else examGuidePage();
    }
    else if (["sutton-set", "sutton-stage-two", "sutton-study", "sutton-coverage"].includes(path)) {
      sectionAnchor = path;
      page = "sutton";
      if (exam) testsPage();
      else if (writtenMock) writtenMock.submitted ? renderWrittenReview() : renderWrittenMock();
      else suttonPage();
    }
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
    if (!initial) {
      window.scrollTo(0, 0);
      if (sectionAnchor) {
        const section = document.getElementById(sectionAnchor);
        if (section) {
          section.tabIndex = -1;
          section.focus({ preventScroll: true });
          section.scrollIntoView({ block: "start" });
        }
      } else main.focus({ preventScroll: true });
    }
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
