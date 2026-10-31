(function () {
  "use strict";
  const topics = window.BRIGHTLANE_TOPICS;
  const cards = window.BRIGHTLANE_FLASHCARDS;
  const readings = window.BRIGHTLANE_STUDY_MATERIALS.readings;
  const questions = [
    ...topics.flatMap(t => t.questions.map((q, i) => ({ ...q, id: t.id + "-lesson-" + (i + 1), topicId: t.id, passage: t.passage, topic: t }))),
    ...window.BRIGHTLANE_TEST_BANK.map(q => ({ ...q, topic: topics.find(t => t.id === q.topicId) })),
    ...readings.flatMap(reading => reading.questions.map(q => ({ ...q, topic: topics.find(t => t.id === q.topicId) })))
  ];
  const byId = new Map(questions.map(q => [q.id, q]));
  const checklist = ["guidance", "registration", "arrangements", "exam-day"];
  function empty() {
    return { version: 2, studied: [], scores: {}, cardRatings: {}, attempts: [], planner: { examDate: "", weeklySessions: 3, completed: [], checks: [] } };
  }
  function fail(message) { throw new Error(message); }
  function object(value, keys, name) {
    if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).some(key => !keys.includes(key))) fail("Invalid " + name + " fields.");
    if (keys.some(key => !Object.hasOwn(value, key))) fail("Missing " + name + " fields.");
  }
  function ids(value, valid, name) {
    if (!Array.isArray(value) || value.length > valid.length || new Set(value).size !== value.length || value.some(id => !valid.includes(id))) fail("Invalid " + name + ".");
  }
  function date(value, year) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [y, m, d] = value.split("-").map(Number);
    const result = new Date(Date.UTC(y, m - 1, d));
    return (!year || y === year) && result.getUTCFullYear() === y && result.getUTCMonth() === m - 1 && result.getUTCDate() === d;
  }
  function validate(value) {
    object(value, ["version", "studied", "scores", "cardRatings", "attempts", "planner"], "progress");
    if (value.version !== 2) fail("Unsupported progress version. Use a Brightlane version 2 backup.");
    const topicIds = topics.map(t => t.id);
    ids(value.studied, topicIds, "studied topics");
    if (!value.scores || typeof value.scores !== "object" || Array.isArray(value.scores)) fail("Invalid scores.");
    for (const [id, score] of Object.entries(value.scores)) {
      if (!topicIds.includes(id) || !Number.isInteger(score) || score < 0 || score > 3) fail("Invalid lesson score.");
    }
    if (!value.cardRatings || typeof value.cardRatings !== "object" || Array.isArray(value.cardRatings)) fail("Invalid flashcard ratings.");
    for (const [id, rating] of Object.entries(value.cardRatings)) {
      if (!cards.some(card => card.id === id) || !["known", "again"].includes(rating)) fail("Invalid flashcard rating.");
    }
    if (!Array.isArray(value.attempts) || value.attempts.length > 100) fail("A backup must contain at most 100 results.");
    const resultIds = new Set();
    for (const attempt of value.attempts) {
      object(attempt, ["id", "at", "mode", "kind", "seconds", "expired", "questionIds", "answers"], "result");
      if (typeof attempt.id !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(attempt.id) || resultIds.has(attempt.id)) fail("Invalid or repeated result identifier.");
      resultIds.add(attempt.id);
      if (typeof attempt.at !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(attempt.at) || !Number.isFinite(Date.parse(attempt.at)) || new Date(attempt.at).toISOString() !== attempt.at) fail("Invalid result date.");
      if (!["maths", "english", "mixed"].includes(attempt.mode) || !["test", "revision", "practice"].includes(attempt.kind)) fail("Invalid result type.");
      if (!Number.isInteger(attempt.seconds) || attempt.seconds < 0 || attempt.seconds > 7200 || typeof attempt.expired !== "boolean" || (attempt.expired && attempt.seconds === 0)) fail("Invalid timer settings.");
      if (!Array.isArray(attempt.questionIds) || attempt.questionIds.length < 1 || attempt.questionIds.length > 60 || new Set(attempt.questionIds).size !== attempt.questionIds.length) fail("Invalid result questions.");
      if (!Array.isArray(attempt.answers) || attempt.answers.length !== attempt.questionIds.length) fail("Invalid result answers.");
      attempt.questionIds.forEach((id, i) => {
        const q = byId.get(id);
        if (!q || (attempt.mode !== "mixed" && q.topic.subject !== attempt.mode)) fail("Unknown question or wrong subject in result.");
        if (attempt.answers[i] !== null && (!Number.isInteger(attempt.answers[i]) || attempt.answers[i] < 0 || attempt.answers[i] >= q.options.length)) fail("Answer must be a choice index or null.");
      });
    }
    object(value.planner, ["examDate", "weeklySessions", "completed", "checks"], "planner");
    if (value.planner.examDate !== "" && !date(value.planner.examDate, 2027)) fail("Choose a real exam date in 2027, not a school entry date.");
    if (!Number.isInteger(value.planner.weeklySessions) || value.planner.weeklySessions < 1 || value.planner.weeklySessions > 7) fail("Weekly study sessions must be a whole number from 1 to 7.");
    ids(value.planner.completed, topicIds, "planner topics");
    ids(value.planner.checks, checklist, "planner checklist");
    // Copy only validated data: imports cannot retain prototypes or extra fields.
    return JSON.parse(JSON.stringify(value));
  }
  function migrate(value) {
    if (value && value.version === 2) return validate(value);
    object(value, ["studied", "scores"], "legacy progress");
    return validate({ ...empty(), studied: value.studied, scores: value.scores });
  }
  function summary(attempt) {
    const correct = attempt.questionIds.filter((id, i) => byId.get(id).answer === attempt.answers[i]).length;
    const unanswered = attempt.answers.filter(answer => answer === null).length;
    return { correct, unanswered, incorrect: attempt.questionIds.length - correct - unanswered, total: attempt.questionIds.length };
  }
  function evidence(state) {
    return topics.map(topic => {
      let total = 0, correct = 0, unanswered = 0;
      for (const attempt of state.attempts) {
        attempt.questionIds.forEach((id, i) => {
          const q = byId.get(id);
          if (q.topicId !== topic.id) return;
          total++;
          if (attempt.answers[i] === null) unanswered++;
          if (attempt.answers[i] === q.answer) correct++;
        });
      }
      return { topic, total, correct, unanswered };
    });
  }
  function missed(state) {
    const latest = new Map();
    state.attempts.forEach(attempt => attempt.questionIds.forEach((id, i) => latest.set(id, attempt.answers[i])));
    return [...latest].filter(([id, answer]) => answer !== byId.get(id).answer).map(([id]) => byId.get(id));
  }
  window.BRIGHTLANE_PROGRESS = { empty, validate, migrate, date, summary, evidence, missed, questions, byId, checklist };
})();
