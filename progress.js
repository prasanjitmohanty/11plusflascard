(function () {
  "use strict";
  const topics = window.BRIGHTLANE_TOPICS;
  const cards = window.BRIGHTLANE_FLASHCARDS;
  const readings = window.BRIGHTLANE_STUDY_MATERIALS.readings;
  const scenarios = window.BRIGHTLANE_SCENARIOS;
  const vocabulary = window.BRIGHTLANE_VOCABULARY;
  const sutton = window.BRIGHTLANE_SUTTON_BANK;
  const tiffin = sutton.tiffin;
  const englishLab = window.BRIGHTLANE_ENGLISH_LAB || { passages: [], typeQuestions: [], writingPrompts: [] };
  const mathsLab = window.BRIGHTLANE_MATHS_LAB || { strategyQuestions: [], visualQuestions: [] };
  const writingPromptIds = [
    ...window.BRIGHTLANE_STUDY_MATERIALS.writing.map((item, index) => item.id || "study-writing-" + String(index + 1).padStart(3, "0")),
    ...sutton.stageTwo.writing.map(item => item.id),
    ...englishLab.writingPrompts.map(item => item.id)
  ];
  const writtenTaskMeta = [
    ...sutton.stageTwo.maths.map(item => ({ id: item.id, subject: "maths", maxMarks: item.maxMarks })),
    ...sutton.stageTwo.passages.flatMap(passage => passage.questions.map(question => ({ id: question.id, subject: "english", maxMarks: question.marks }))),
    ...sutton.stageTwo.writing.map(item => ({ id: item.id, subject: "english", maxMarks: item.criteria.length })),
    ...englishLab.passages.flatMap(passage => passage.questions.filter(question => question.format === "written").map(question => ({ id: question.id, subject: "english", maxMarks: question.marks }))),
    ...mathsLab.strategyQuestions.map(question => ({ id: question.id, subject: "maths", maxMarks: question.maxMarks }))
  ];
  const writtenTaskById = new Map(writtenTaskMeta.map(item => [item.id, item]));
  const stageTwoIds = writtenTaskMeta.map(item => item.id);
  const readingTaskIds = englishLab.passages.flatMap(passage => passage.questions.filter(question => question.format === "written").map(question => question.id));
  const writingBandCategories = ["content", "organisation", "vocabulary", "sentence-variety", "punctuation", "spelling"];
  const questions = [
    ...topics.flatMap(t => t.questions.map((q, i) => ({ ...q, id: t.id + "-lesson-" + (i + 1), topicId: t.id, passage: t.passage, topic: t }))),
    ...window.BRIGHTLANE_TEST_BANK.map(q => ({ ...q, topic: topics.find(t => t.id === q.topicId) })),
    ...readings.flatMap(reading => reading.questions.map(q => ({ ...q, topic: topics.find(t => t.id === q.topicId) }))),
    ...scenarios.flatMap(scenario => scenario.questions.map(q => ({
      ...q,
      topicId: scenario.topicId,
      topic: topics.find(t => t.id === scenario.topicId),
      scenario: { id: scenario.id, title: scenario.title, prompt: scenario.prompt, type: scenario.type }
    }))),
    ...Object.values(sutton.stageOne).flatMap(items => items.map(q => ({ ...q, topic: topics.find(t => t.id === q.topicId) }))),
    ...tiffin.numeric.concat(tiffin.unfamiliar).map(q => ({ ...q, topic: topics.find(t => t.id === q.topicId) })),
    ...window.BRIGHTLANE_MATHS_WAVE_TWO.map(q => ({ ...q, topic: topics.find(t => t.id === q.topicId) })),
    ...vocabulary.questions.map(q => ({ ...q, exams: ["All exams"], round: "both", topic: topics.find(t => t.id === q.topicId) })),
    ...englishLab.passages.flatMap(passage => passage.questions.filter(q => q.format === "select-one").map(q => ({
      ...q, exams: ["General KS2"], round: "Stage 2", passage: passage.segments.map(segment => segment.text).join("\n\n"),
      passageTitle: passage.title, passageGenre: passage.genre, passageSegments: passage.segments, topic: topics.find(t => t.id === q.topicId)
    }))),
    ...englishLab.typeQuestions.map(q => ({ ...q, exams: ["General KS2"], round: "both", topic: topics.find(t => t.id === q.topicId) })),
    ...mathsLab.visualQuestions.map(q => ({ ...q, exams: ["General KS2"], round: "both", topic: topics.find(t => t.id === q.topicId) }))
  ];
  const reviewableIds = [...cards.map(card => card.id), ...vocabulary.entries.map(entry => entry.id), ...vocabulary.spellings.map(item => item.id)];
  const byId = new Map(questions.map(q => [q.id, q]));
  const checklist = ["guidance", "registration", "arrangements", "exam-day", "sutton-practice", "week-maths", "week-english", "week-recall", "week-mistakes", "week-rest", "exam-date", "exam-kit", "exam-sheet", "exam-timing", "exam-travel"];
  function empty() {
    return { version: 2, studied: [], scores: {}, cardRatings: {}, attempts: [], planner: { examDate: "", weeklySessions: 3, completed: [], checks: [] }, suttonReviewed: [], reviewSchedule: {}, writtenDraft: null, writingDrafts: {}, writingBands: {}, readingDrafts: {}, mistakeBook: {}, sprintHistory: [], sprintBests: {} };
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
    const required = ["version", "studied", "scores", "cardRatings", "attempts", "planner"];
    if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).some(key => ![...required, "suttonReviewed", "reviewSchedule", "writtenDraft", "writingDrafts", "writingBands", "readingDrafts", "mistakeBook", "sprintHistory", "sprintBests"].includes(key)) || required.some(key => !Object.hasOwn(value, key))) fail("Invalid progress fields.");
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
      if (!["maths", "english", "mixed"].includes(attempt.mode) || !["test", "revision", "practice", "sutton-set", "tiffin-stage-one"].includes(attempt.kind)) fail("Invalid result type.");
      if (!Number.isInteger(attempt.seconds) || attempt.seconds < 0 || attempt.seconds > 7200 || typeof attempt.expired !== "boolean" || (attempt.expired && attempt.seconds === 0)) fail("Invalid timer settings.");
      if (!Array.isArray(attempt.questionIds) || attempt.questionIds.length < 1 || attempt.questionIds.length > 60 || new Set(attempt.questionIds).size !== attempt.questionIds.length) fail("Invalid result questions.");
      if (!Array.isArray(attempt.answers) || attempt.answers.length !== attempt.questionIds.length) fail("Invalid result answers.");
      attempt.questionIds.forEach((id, i) => {
        const q = byId.get(id);
        if (!q || (attempt.mode !== "mixed" && q.topic.subject !== attempt.mode)) fail("Unknown question or wrong subject in result.");
        const answer = attempt.answers[i];
        if (!validAnswer(q, answer)) fail("Invalid saved answer.");
      });
    }
    object(value.planner, ["examDate", "weeklySessions", "completed", "checks"], "planner");
    if (value.planner.examDate !== "" && !date(value.planner.examDate, 2027)) fail("Choose a real exam date in 2027, not a school entry date.");
    if (!Number.isInteger(value.planner.weeklySessions) || value.planner.weeklySessions < 1 || value.planner.weeklySessions > 7) fail("Weekly study sessions must be a whole number from 1 to 7.");
    ids(value.planner.completed, topicIds, "planner topics");
    ids(value.planner.checks, checklist, "planner checklist");
    if (value.suttonReviewed !== undefined) ids(value.suttonReviewed, stageTwoIds, "Sutton Stage 2 self-reviews");
    const reviewSchedule = value.reviewSchedule === undefined ? {} : value.reviewSchedule;
    if (!reviewSchedule || typeof reviewSchedule !== "object" || Array.isArray(reviewSchedule)) fail("Invalid spaced-repetition schedule.");
    for (const [id, schedule] of Object.entries(reviewSchedule)) {
      if (!reviewableIds.includes(id)) fail("Unknown spaced-repetition item.");
      object(schedule, ["box", "dueDate"], "review schedule");
      if (!Number.isInteger(schedule.box) || schedule.box < 0 || schedule.box > 5 || !date(schedule.dueDate)) fail("Invalid spaced-repetition interval.");
    }
    const writtenDraft = value.writtenDraft === undefined ? null : value.writtenDraft;
    if (writtenDraft !== null) {
      object(writtenDraft, ["subject", "paper", "scope", "seconds", "deadline", "expired", "submitted", "confirming", "itemIds", "answers", "selfMarks"], "written mock");
      if (!["maths", "english"].includes(writtenDraft.subject) || !["A", "B"].includes(writtenDraft.paper) || !["sutton", "nwssee", "tiffin-stage-two"].includes(writtenDraft.scope)) fail("Invalid written mock settings.");
      if (!Number.isInteger(writtenDraft.seconds) || writtenDraft.seconds < 0 || writtenDraft.seconds > 7200 || (writtenDraft.seconds === 0 ? writtenDraft.deadline !== null : !Number.isSafeInteger(writtenDraft.deadline) || writtenDraft.deadline < 0)) fail("Invalid written mock timer.");
      if (typeof writtenDraft.expired !== "boolean" || typeof writtenDraft.submitted !== "boolean" || typeof writtenDraft.confirming !== "boolean" || (writtenDraft.expired && !writtenDraft.submitted) || (writtenDraft.submitted && writtenDraft.confirming)) fail("Invalid written mock status.");
      if (!Array.isArray(writtenDraft.itemIds) || writtenDraft.itemIds.length < 1 || writtenDraft.itemIds.length > 60 || new Set(writtenDraft.itemIds).size !== writtenDraft.itemIds.length || writtenDraft.itemIds.some(id => !writtenTaskById.has(id) || writtenTaskById.get(id).subject !== writtenDraft.subject)) fail("Invalid written mock questions.");
      if (!Array.isArray(writtenDraft.answers) || writtenDraft.answers.length !== writtenDraft.itemIds.length || writtenDraft.answers.some(answer => typeof answer !== "string" || answer.length > 10000) || writtenDraft.answers.reduce((sum, answer) => sum + answer.length, 0) > 100000) fail("Invalid written mock responses.");
      if (!Array.isArray(writtenDraft.selfMarks) || writtenDraft.selfMarks.length !== writtenDraft.itemIds.length || writtenDraft.selfMarks.some((mark, index) => mark !== null && (!Number.isInteger(mark) || mark < 0 || mark > writtenTaskById.get(writtenDraft.itemIds[index]).maxMarks))) fail("Invalid written mock self-assessment.");
    }
    const writingDrafts = value.writingDrafts === undefined ? {} : value.writingDrafts;
    if (!writingDrafts || typeof writingDrafts !== "object" || Array.isArray(writingDrafts) || Object.keys(writingDrafts).some(id => !writingPromptIds.includes(id)) || Object.values(writingDrafts).some(draft => typeof draft !== "string" || draft.length > 10000) || Object.values(writingDrafts).reduce((sum, draft) => sum + draft.length, 0) > 100000) fail("Invalid writing drafts.");
    const writingBands = value.writingBands === undefined ? {} : value.writingBands;
    if (!writingBands || typeof writingBands !== "object" || Array.isArray(writingBands)) fail("Invalid writing self-assessment bands.");
    for (const [id, bands] of Object.entries(writingBands)) {
      if (!writingPromptIds.includes(id) || !bands || typeof bands !== "object" || Array.isArray(bands) || Object.keys(bands).some(key => !writingBandCategories.includes(key)) || Object.values(bands).some(score => !Number.isInteger(score) || score < 1 || score > 4)) fail("Invalid writing self-assessment bands.");
    }
    const readingDrafts = value.readingDrafts === undefined ? {} : value.readingDrafts;
    if (!readingDrafts || typeof readingDrafts !== "object" || Array.isArray(readingDrafts)) fail("Invalid reading response drafts.");
    let readingDraftLength = 0;
    for (const [id, draft] of Object.entries(readingDrafts)) {
      if (!readingTaskIds.includes(id) || !draft || typeof draft !== "object" || Array.isArray(draft) || Object.keys(draft).some(key => !["point", "evidence", "explain"].includes(key)) || Object.values(draft).some(text => typeof text !== "string" || text.length > 10000)) fail("Invalid reading response draft.");
      readingDraftLength += Object.values(draft).reduce((sum, text) => sum + text.length, 0);
    }
    if (readingDraftLength > 100000) fail("Reading response drafts exceed the saved limit.");
    const mistakeBook = value.mistakeBook === undefined ? {} : value.mistakeBook;
    if (!mistakeBook || typeof mistakeBook !== "object" || Array.isArray(mistakeBook)) fail("Invalid mistake book.");
    for (const [id, record] of Object.entries(mistakeBook)) {
      const question = byId.get(id);
      if (!question) fail("Unknown mistake-book question.");
      object(record, ["wrongCount", "correctStreak", "mastered", "lastWrongAt", "lastCorrectAt", "lastWrongAnswer"], "mistake-book record");
      if (!Number.isInteger(record.wrongCount) || record.wrongCount < 1 || !Number.isInteger(record.correctStreak) || record.correctStreak < 0 || typeof record.mastered !== "boolean" || record.mastered !== (record.correctStreak >= 2)) fail("Invalid mistake-book mastery.");
      for (const dateValue of [record.lastWrongAt, record.lastCorrectAt]) {
        if (dateValue !== null && (typeof dateValue !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(dateValue) || !Number.isFinite(Date.parse(dateValue)))) fail("Invalid mistake-book date.");
      }
      if (record.lastWrongAt === null || !validAnswer(question, record.lastWrongAnswer) || isCorrect(question, record.lastWrongAnswer)) fail("Invalid last mistake answer.");
    }
    const sprintHistory = value.sprintHistory === undefined ? [] : value.sprintHistory;
    if (!Array.isArray(sprintHistory) || sprintHistory.length > 100) fail("Invalid sprint history.");
    sprintHistory.forEach(sprint => {
      object(sprint, ["id", "at", "duration", "attempted", "correct"], "mental-maths sprint");
      if (typeof sprint.id !== "string" || !/^[a-zA-Z0-9-]{1,80}$/.test(sprint.id) || typeof sprint.at !== "string" || !Number.isFinite(Date.parse(sprint.at)) || ![0, 60, 120].includes(sprint.duration) || !Number.isInteger(sprint.attempted) || sprint.attempted < 0 || sprint.attempted > 1000 || !Number.isInteger(sprint.correct) || sprint.correct < 0 || sprint.correct > sprint.attempted) fail("Invalid sprint result.");
    });
    const sprintBests = value.sprintBests === undefined ? {} : value.sprintBests;
    if (!sprintBests || typeof sprintBests !== "object" || Array.isArray(sprintBests) || Object.entries(sprintBests).some(([duration, best]) => !["0", "60", "120"].includes(duration) || !Number.isInteger(best) || best < 0 || best > 1000)) fail("Invalid sprint personal bests.");
    // Copy only validated data: imports cannot retain prototypes or extra fields.
    const copy = JSON.parse(JSON.stringify(value));
    if (!copy.suttonReviewed) copy.suttonReviewed = [];
    if (!copy.reviewSchedule) copy.reviewSchedule = {};
    if (!Object.hasOwn(copy, "writtenDraft")) copy.writtenDraft = null;
    if (!copy.writingDrafts) copy.writingDrafts = {};
    if (!copy.writingBands) copy.writingBands = {};
    if (!copy.readingDrafts) copy.readingDrafts = {};
    if (!copy.mistakeBook) copy.mistakeBook = {};
    if (!copy.sprintHistory) copy.sprintHistory = [];
    if (!copy.sprintBests) copy.sprintBests = {};
    return copy;
  }
  function migrate(value) {
    if (value && value.version === 2) return validate(value);
    object(value, ["studied", "scores"], "legacy progress");
    return validate({ ...empty(), studied: value.studied, scores: value.scores });
  }
  function summary(attempt) {
    const correct = attempt.questionIds.filter((id, i) => isCorrect(byId.get(id), attempt.answers[i])).length;
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
          if (isCorrect(q, attempt.answers[i])) correct++;
        });
      }
      return { topic, total, correct, unanswered };
    });
  }
  function missed(state) {
    return Object.entries(state.mistakeBook || {}).filter(([, record]) => !record.mastered).map(([id]) => byId.get(id)).filter(Boolean);
  }
  function recordMistakeResult(book, question, answer, at) {
    const record = book[question.id];
    if (!isCorrect(question, answer)) {
      book[question.id] = {
        wrongCount: (record?.wrongCount || 0) + 1,
        correctStreak: 0,
        mastered: false,
        lastWrongAt: at,
        lastCorrectAt: record?.lastCorrectAt || null,
        lastWrongAnswer: answer
      };
    } else if (record && !record.mastered) {
      const correctStreak = record.correctStreak + 1;
      book[question.id] = { ...record, correctStreak, mastered: correctStreak >= 2, lastCorrectAt: at };
    }
  }
  function isCorrect(question, answer) {
    if (Array.isArray(question.answer)) {
      return Array.isArray(answer) && question.answer.length === answer.length && question.answer.every(choice => answer.includes(choice));
    }
    return !Array.isArray(answer) && answer === question.answer;
  }
  function validAnswer(question, answer) {
    if (answer === null) return true;
    if (question.format === "numeric-entry") return typeof answer === "string" && /^\d{1,8}$/.test(answer);
    if (Array.isArray(question.answer)) return Array.isArray(answer) && answer.length <= question.options.length && new Set(answer).size === answer.length && answer.every(choice => Number.isInteger(choice) && choice >= 0 && choice < question.options.length);
    return Number.isInteger(answer) && answer >= 0 && answer < question.options.length;
  }
  function mistakes(state) {
    return Object.entries(state.mistakeBook || {}).filter(([, record]) => !record.mastered).map(([id, record]) => ({ question: byId.get(id), ...record }));
  }
  window.BRIGHTLANE_PROGRESS = { empty, validate, migrate, date, summary, evidence, missed, mistakes, recordMistakeResult, isCorrect, questions, byId, checklist, stageTwoIds, reviewableIds, writtenTaskById, writingPromptIds };
})();
