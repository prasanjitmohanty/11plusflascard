(function () {
  "use strict";
  const topics = window.BRIGHTLANE_TOPICS;
  const main = document.getElementById("main");
  const key = "brightlane-progress-v1";
  let state = { studied: [], scores: {} };
  let persistent = true;
  let quiz = null;
  let exam = null;
  let deck = null;
  let cardFilters = { subject: "all", topic: "all" };
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
  const testLabel = mode => mode === "mixed" ? "Mixed" : label(mode);
  const totalQuestions = topics.reduce((sum, t) => sum + t.questions.length, 0);
  const coverage = "2027 preparation edition: for UK 11+ exams taken in 2027, not a universal school entry year. This is a broad foundation, not an official 2027 syllabus or a guarantee of every school's exam content. Schools and providers vary in topic depth, format and writing requirements. Check their current guidance for requirements, exam dates and the relevant school entry year. Verbal and non-verbal reasoning are not separate subjects here.";
  function home() {
    main.innerHTML = `
      <section class="hero" aria-labelledby="welcome">
        <div><p class="eyebrow">2027 PREPARATION EDITION</p><h1 id="welcome">Big ideas.<br>Small steps.<br><em>Your 11+ journey.</em></h1>
        <p class="intro">Build confidence in Maths and English, one topic at a time. Clear explanations, worked examples and practice that helps it all click.</p><a class="cta" href="#maths">Explore your topics <span aria-hidden="true">&#8594;</span></a></div>
        <div class="hero-illustration" aria-hidden="true"><div class="art-circle"></div><span class="art-spark">&#10022;</span><div class="book">Aa</div><div class="math-tile">x +</div></div>
      </section>
      <div class="stats" aria-label="Site contents"><div class="stat"><strong>${topics.length}</strong><span>topic lessons<br>to explore</span></div><div class="stat"><strong>${totalQuestions + window.BRIGHTLANE_TEST_BANK.length}</strong><span>practice &amp; test questions<br>with explanations</span></div><div class="stat"><strong>100%</strong><span>offline-ready<br>no sign-in needed</span></div></div>
      <section aria-labelledby="subjects"><div class="section-heading"><h2 id="subjects">What will you discover today?</h2><p>Pick a subject. Find your next small win.</p></div>
      <div class="subject-grid">${["maths", "english"].map(subject => {
        const count = topics.filter(t => t.subject === subject).length;
        return `<a class="subject-card ${subject}" href="#${subject}"><div class="subject-art" aria-hidden="true"><span class="subject-symbol">${subject === "maths" ? "123" : "Aa"}</span><span class="mini-grid">${subject === "maths" ? "&#9651; &nbsp; +<br>1/2 &nbsp; =" : "a story<br>starts here."}</span></div><div class="subject-body"><span class="tag">THINK ${subject === "maths" ? "LOGICALLY" : "CREATIVELY"}</span><h3>${label(subject)}</h3><p>${subject === "maths" ? "From fractions to shapes, discover the patterns and methods behind the numbers." : "Explore words, understand stories and find confidence in your own voice."}</p><div class="card-bottom"><span>${count} topics &middot; ${count * 3} questions</span><span class="card-arrow" aria-hidden="true">&#8594;</span></div></div></a>`;
      }).join("")}</div></section>
      <section class="practice-banner"><span class="badge" aria-hidden="true">&#10022;</span><div><h3>A little practice goes a long way.</h3><p>Try a short mixed set. No timer, no pressure, just progress.</p></div><a class="cta" href="#practice">Let's practise <span aria-hidden="true">&#8594;</span></a></section>
      <section class="test-banner"><div><p class="eyebrow">READY FOR A BIGGER STEP?</p><h2>Put your learning together.</h2><p>20-question Maths, English and mixed tests. Move between questions, then submit for your score and explained review.</p></div><a class="secondary-button" href="#tests">${exam ? "Return to your test" : "Explore practice tests"} <span aria-hidden="true">&#8594;</span></a></section>
      <section class="test-banner flashcard-banner"><div><p class="eyebrow">RECALL A LITTLE, REMEMBER MORE</p><h2>Turn an idea into a small win.</h2><p>${window.BRIGHTLANE_FLASHCARDS.length} flashcards across Maths and English. Try recalling the answer, then reveal and choose what to revisit.</p></div><a class="secondary-button" href="#flashcards">${deck ? "Return to flashcards" : "Explore flashcards"} <span aria-hidden="true">&#8594;</span></a></section>
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
  function filteredCards() {
    return window.BRIGHTLANE_FLASHCARDS.filter(card => {
      const topic = topics.find(t => t.id === card.topicId);
      return (cardFilters.subject === "all" || topic.subject === cardFilters.subject) &&
        (cardFilters.topic === "all" || card.topicId === cardFilters.topic);
    });
  }
  function flashcardsPage() {
    const availableTopics = topics.filter(t => cardFilters.subject === "all" || t.subject === cardFilters.subject);
    main.innerHTML = `<div class="page-header"><p class="eyebrow">A LITTLE ACTIVE RECALL</p><h1>Flashcards that make ideas stick.</h1><p>Try saying the answer before revealing it. Then choose "Know it" or "Practise again". These are your own judgements, not automatically marked answers.</p></div>
      <div class="filters"><label>Subject<select id="card-subject">${[["all", "Maths & English"], ["maths", "Maths"], ["english", "English"]].map(([value, text]) => `<option value="${value}"${cardFilters.subject === value ? " selected" : ""}>${esc(text)}</option>`).join("")}</select></label><label>Topic<select id="card-topic"><option value="all">All topics</option>${availableTopics.map(t => `<option value="${t.id}"${cardFilters.topic === t.id ? " selected" : ""}>${esc(t.title)}</option>`).join("")}</select></label></div>
      <p class="coverage-note">Changing a filter starts a fresh deck and clears its self-assessments. Your deck stays here when visiting other pages for this visit, but reloads and closing the page clear it. Lesson and test progress are unchanged.</p>
      <section id="flashcard-deck" aria-label="Flashcard study deck"></section>`;
    document.getElementById("card-subject").addEventListener("change", event => {
      cardFilters = { subject: event.target.value, topic: "all" };
      deck = null; flashcardsPage(); document.getElementById("card-subject").focus();
    });
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
      panel.innerHTML = `<div class="lesson-block"><h2>No cards in this deck.</h2><p>Choose another topic or return to all cards.</p><button id="cards-show-all" type="button" class="cta">Show all flashcards</button></div>`;
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
      <div class="quiz-controls" id="card-assessment"${deck.revealed ? "" : " hidden"}><button class="secondary-button" id="card-again" type="button">Practise again</button><button class="cta" id="card-known" type="button">Know it</button></div><p class="status-line" id="card-status" role="status">${rating ? "Your assessment: " + (rating === "known" ? "know it" : "practise again") + ". Reveal to change it." : "Not assessed yet."}</p></article>
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
  function startTest(mode, items) {
    const selected = items || shuffle(mode === "mixed" ? [...testQuestions("maths", 10), ...testQuestions("english", 10)] : testQuestions(mode, 20));
    exam = { mode, items: selected, answers: selected.map(() => null), index: 0, submitted: false, confirming: false };
    testsPage();
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  function testHeader(title, description) {
    return `<div class="page-header"><p class="eyebrow">BRIGHTLANE PRACTICE TESTS</p><h1>${esc(title)}</h1><p>${esc(description)}</p></div>`;
  }
  function testsPage() {
    if (exam) {
      if (exam.submitted) testResults();
      else if (exam.confirming) confirmTestSubmission();
      else renderTest();
      return;
    }
    main.innerHTML = testHeader("A bigger step, at your own pace.", "Put your learning together in an original practice test. Unlike short practice, answers stay hidden until you submit.") +
      `<section class="lesson-block test-instructions"><h2>Before you start</h2><ul><li>Each test has 20 multiple-choice questions. Choose one answer per question. Use paper for working; Maths tests are intended for practice without a calculator.</li><li>Tests are untimed. Work at your own pace. Maths and English tests sample all their lesson topics; a mixed test contains 10 questions from each subject.</li><li>Use Previous, Next or the question numbers to skip, revisit or change answers. Submit when ready; you will confirm any unanswered questions first.</li><li>Each correct answer earns one mark. Incorrect or unanswered questions earn zero; there are no deductions. Review every answer and explanation afterwards.</li><li>Your current test stays available when you visit another page here, but it is not saved after a reload or closing the page. Test results do not change lesson progress.</li></ul></section>
      <div class="test-mode-grid">${["maths", "english", "mixed"].map(mode => `<section class="lesson-block test-mode"><p class="eyebrow">20 QUESTIONS &middot; UNTIMED</p><h2>${testLabel(mode)} test</h2><p>${mode === "mixed" ? "Connect both subjects in a balanced 10 + 10 question set." : mode === "maths" ? "Numbers, calculations, measures, geometry and data across 18 topics." : "Original reading passages, language, grammar and writing skills across 12 topics."}</p><button class="cta start-test" type="button" data-mode="${mode}">Start ${testLabel(mode)} test</button></section>`).join("")}</div>
      <p class="coverage-note">These are original practice tests, not official papers, standardised scores or predictions of admission. Sets draw from a separate bank of ${window.BRIGHTLANE_TEST_BANK.length} questions; repeated attempts may share questions. School and provider requirements vary, and extended writing is not automatically graded.</p>`;
    document.querySelectorAll(".start-test").forEach(button => button.addEventListener("click", () => startTest(button.dataset.mode)));
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
    const item = exam.items[exam.index];
    main.innerHTML = testHeader(testLabel(exam.mode) + " practice test", "Take your time. Your choices are kept while you move between questions. No answers are revealed until final submission.") +
      `<div class="test-layout"><section class="practice-panel" id="test-question-panel"><div class="quiz-meta"><span>Question ${exam.index + 1} of ${exam.items.length}</span><span>${label(item.topic.subject)} &middot; ${esc(item.topic.title)}</span></div><h2>Your next question</h2>
      ${item.passage ? `<details open><summary>Original passage for this question</summary><div class="passage">${esc(item.passage)}</div></details>` : ""}
      <form id="test-form">${answerChoices(item, exam.answers[exam.index])}<p class="status-line" id="test-answer-status" role="status"></p><div class="quiz-controls"><button id="test-previous" class="secondary-button" type="button"${exam.index === 0 ? " disabled" : ""}>Previous</button><button id="test-next" class="cta" type="button"${exam.index === exam.items.length - 1 ? " disabled" : ""}>Next question</button><button id="test-clear" class="text-button" type="button">Clear answer</button></div></form></section>
      <aside class="lesson-block test-navigation" aria-label="Test question navigation"><h2>Your test map</h2><p id="test-count" role="status">${answeredCount()} of ${exam.items.length} answered</p><p class="test-map-key">A tick means answered, not marked correct. Highlighted = current question.</p><nav class="question-map" aria-label="Choose a test question">${exam.items.map((q, i) => `<button type="button" data-index="${i}" aria-label="Question ${i + 1}, ${exam.answers[i] === null ? "unanswered" : "answered"}"${i === exam.index ? ' aria-current="step"' : ""} class="question-jump${exam.answers[i] !== null ? " answered" : ""}">${i + 1}${exam.answers[i] !== null ? '<span aria-hidden="true"> &#10003;</span>' : ""}</button>`).join("")}</nav><button class="cta" type="button" id="test-submit">Review &amp; submit</button><p class="test-map-key">Leaving this site's test page keeps your test for this visit. Reloading or closing the page clears it.</p></aside></div>`;
    document.getElementById("test-form").addEventListener("submit", event => event.preventDefault());
    document.getElementById("test-form").addEventListener("change", event => {
      if (event.target.name !== "answer") return;
      exam.answers[exam.index] = Number(event.target.value);
      updateTestAnswerStatus("Answer selected. You can change it before submission.");
    });
    document.getElementById("test-clear").addEventListener("click", () => {
      exam.answers[exam.index] = null;
      document.querySelectorAll("#test-form input").forEach(input => { input.checked = false; });
      updateTestAnswerStatus("Answer cleared.");
    });
    function move(index) { exam.index = index; renderTest(); focusTestQuestion(); }
    document.getElementById("test-previous").addEventListener("click", () => move(exam.index - 1));
    document.getElementById("test-next").addEventListener("click", () => move(exam.index + 1));
    document.querySelectorAll(".question-jump").forEach(button => button.addEventListener("click", () => move(Number(button.dataset.index))));
    document.getElementById("test-submit").addEventListener("click", () => {
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
    const missing = exam.answers.map((answer, i) => answer === null ? i + 1 : null).filter(number => number !== null);
    main.innerHTML = testHeader("Ready to submit?", testLabel(exam.mode) + " practice test - " + answeredCount() + " of " + exam.items.length + " questions answered.") +
      `<section class="lesson-block"><h2>${missing.length ? `${missing.length} unanswered ${missing.length === 1 ? "question" : "questions"}` : "Every question has an answer."}</h2><p>${missing.length ? "Unanswered: " + missing.join(", ") + ". These will earn zero marks if you submit now." : "You can still return to check or change your choices."}</p><p class="coverage-note">Final submission locks your answers and reveals your score and all explanations. There are no deductions for wrong answers.</p><div class="quiz-controls"><button class="cta" id="test-confirm-submit" type="button">Submit test${missing.length ? " with unanswered questions" : ""}</button><button class="secondary-button" id="test-return" type="button">Return to questions</button></div></section>`;
    document.getElementById("test-return").addEventListener("click", () => {
      exam.confirming = false;
      if (missing.length) exam.index = missing[0] - 1;
      renderTest(); focusTestQuestion();
    });
    document.getElementById("test-confirm-submit").addEventListener("click", () => {
      if (exam.submitted) return;
      exam.submitted = true; exam.confirming = false;
      testResults(); main.focus({ preventScroll: true }); window.scrollTo(0, 0);
    });
  }
  function testResults() {
    const correct = exam.items.filter((q, i) => q.answer === exam.answers[i]).length;
    const unanswered = exam.items.length - answeredCount();
    main.innerHTML = testHeader(testLabel(exam.mode) + " test results", "This is a raw practice score, not a standardised exam score or an admission prediction.") +
      `<section class="lesson-block test-result-summary"><p class="eyebrow">TEST COMPLETE</p><h2 id="test-score">${correct} / ${exam.items.length} &middot; ${Math.round(correct / exam.items.length * 100)}%</h2><p id="test-score-breakdown">${correct} correct &middot; ${exam.items.length - correct - unanswered} incorrect &middot; ${unanswered} unanswered</p><p class="coverage-note">Use the explanations to decide what to revisit. Your lesson progress and best short-practice scores are unchanged. Results remain here for this visit only.</p><div class="quiz-controls"><button class="cta" id="test-retry" type="button">Retry these questions</button><button class="secondary-button" id="test-new" type="button">Choose a new test</button></div></section>
      <section class="test-review" aria-labelledby="test-review-heading"><h2 id="test-review-heading">Your answer review</h2><p>Every question, your choice and the reason behind the correct answer.</p>${exam.items.map((q, i) => {
        const chosen = exam.answers[i];
        const status = chosen === null ? "Unanswered" : chosen === q.answer ? "Correct" : "Incorrect";
        return `<article class="lesson-block review-item"><p class="eyebrow">QUESTION ${i + 1} &middot; ${label(q.topic.subject)} &middot; ${status.toUpperCase()}</p><h3>${esc(q.q)}</h3>${q.passage ? `<details><summary>Re-read the original passage</summary><div class="passage">${esc(q.passage)}</div></details>` : ""}<p class="review-choice">Your answer: <strong>${chosen === null ? "Not answered" : esc(q.options[chosen])}</strong></p><div class="feedback${status === "Correct" ? "" : " incorrect"}"><p>Correct answer: <strong>${esc(q.options[q.answer])}</strong></p><p>${esc(q.why)}</p></div><a class="text-button" href="#topic/${q.topic.id}">Revisit ${esc(q.topic.title)}</a></article>`;
      }).join("")}</section>`;
    document.getElementById("test-retry").addEventListener("click", () => startTest(exam.mode, exam.items));
    document.getElementById("test-new").addEventListener("click", () => { exam = null; testsPage(); main.focus({ preventScroll: true }); window.scrollTo(0, 0); });
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
      <form id="answer-form">${answerChoices(item)}<div class="quiz-controls"><button class="cta" id="check-answer" type="submit">Check answer</button><span class="quiz-message" id="quiz-message" role="status"></span></div></form><div id="answer-feedback" aria-live="polite"></div>`;
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
    else if (path === "tests") testsPage();
    else if (path === "flashcards") flashcardsPage();
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
