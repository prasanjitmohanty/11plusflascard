const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const sandbox = { window: {}, Date, Map, Set, Object };
for (const file of ["topics.js", "test-bank.js", "vocabulary-bank.js", "study-materials.js", "scenario-bank.js", "sutton-bank.js", "maths-bank.js", "english-lab.js", "maths-lab.js", "flashcards.js", "progress.js"]) vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox);
const p = sandbox.window.BRIGHTLANE_PROGRESS;
const clone = value => JSON.parse(JSON.stringify(value));
assert.equal(p.questions.length, 773);
assert.equal(p.byId.size, 773);
assert.equal(new Set(p.questions.map(question => question.id)).size, 773, "All question identifiers are unique");
const normalizedStems = p.questions.map(question => question.q.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-GB"));
assert.equal(new Set(normalizedStems).size, normalizedStems.length, "No repeated question stems across the complete bank");
assert.deepEqual(clone(p.validate(p.empty())), clone(p.empty()));
assert.deepEqual(clone(p.migrate({ studied: ["fractions"], scores: { fractions: 2 } })).studied, ["fractions"]);
for (const date of ["2027-02-29", "2027-02-30", "2027-04-31", "2027-13-01", "2026-12-01", "2027-1-01", "garbage"]) assert.equal(p.date(date, 2027), false, date);
for (const date of ["2027-01-01", "2027-02-28", "2027-12-31"]) assert.equal(p.date(date, 2027), true, date);
const q = p.byId.get("fractions-test-1");
const writtenTask = Array.from(p.writtenTaskById.values()).find(item => item.subject === "maths");
const draftState = p.empty();
draftState.writtenDraft = {
  subject: "maths", paper: "A", scope: "sutton", seconds: 0, deadline: null,
  expired: false, submitted: false, confirming: true,
  itemIds: [writtenTask.id], answers: ["My saved calculation"], selfMarks: [null]
};
const promptId = p.writingPromptIds[0];
draftState.writingDrafts[promptId] = "A persistent original writing draft.";
assert.equal(p.validate(draftState).writtenDraft.answers[0], "My saved calculation", "Written mock drafts validate and survive backup round trips");
assert.equal(p.validate(draftState).writingDrafts[promptId], "A persistent original writing draft.", "Writing studio drafts are included in validated backups");
const englishLabQuestion = sandbox.window.BRIGHTLANE_ENGLISH_LAB.passages.flatMap(passage => passage.questions).find(question => question.format === "written");
assert.ok(p.writtenTaskById.has(englishLabQuestion.id), "English-lab written questions are registered by format, not question-type code");
const englishDraft = {
  subject: "english", paper: "A", scope: "tiffin-stage-two", seconds: 0, deadline: null,
  expired: false, submitted: true, confirming: false, itemIds: [englishLabQuestion.id],
  answers: ["A partial written response."], selfMarks: [1]
};
assert.deepEqual(clone(p.validate({ ...p.empty(), writtenDraft: englishDraft }).writtenDraft), clone(englishDraft), "English-lab mock answers and self-marks remain valid for restore and import");
const preDraftState = p.empty();
delete preDraftState.writtenDraft;
assert.equal(p.migrate(preDraftState).writtenDraft, null, "Earlier version-2 backups migrate without losing progress");
const badDraft = clone(draftState);
badDraft.writtenDraft.selfMarks[0] = writtenTask.maxMarks + 1;
assert.throws(() => p.validate(badDraft), /self-assessment/);
const badWritingDraft = clone(draftState);
badWritingDraft.writingDrafts.unknown = "not a known prompt";
assert.throws(() => p.validate(badWritingDraft), /writing drafts/);
const attempt = { id: "result-1", at: "2027-01-01T10:00:00.000Z", mode: "maths", kind: "test", seconds: 900, expired: true, questionIds: [q.id], answers: [null] };
const state = p.empty();
const wrongAnswer = q.answer === 0 ? 1 : 0;
state.mistakeBook[q.id] = { wrongCount: 1, correctStreak: 0, mastered: false, lastWrongAt: attempt.at, lastCorrectAt: null, lastWrongAnswer: wrongAnswer };
state.attempts = [attempt]; state.cardRatings["card-1"] = "again";
assert.equal(p.validate(state).attempts.length, 1);
assert.deepEqual(clone(p.summary(attempt)), { total: 1, correct: 0, incorrect: 0, unanswered: 1 });
assert.equal(p.missed(state)[0].id, q.id);
assert.equal(p.evidence(state).find(item => item.topic.id === "fractions").unanswered, 1);
state.attempts.push({ ...attempt, id: "result-2", answers: [q.answer], expired: false });
p.recordMistakeResult(state.mistakeBook, q, q.answer, "2027-01-02T10:00:00.000Z");
assert.equal(p.missed(state).length, 1, "One correct retry leaves the mistake unresolved");
assert.equal(state.mistakeBook[q.id].correctStreak, 1);
p.recordMistakeResult(state.mistakeBook, q, q.answer, "2027-01-03T10:00:00.000Z");
assert.equal(p.missed(state).length, 0, "Two consecutive correct objective retries reach practice mastery");
assert.equal(p.validate(state).mistakeBook[q.id].mastered, true, "Mastery survives validated backup round trips");
p.recordMistakeResult(state.mistakeBook, q, wrongAnswer, "2027-01-04T10:00:00.000Z");
assert.equal(p.missed(state).length, 1, "A later wrong answer reopens the mistake");
assert.equal(state.mistakeBook[q.id].correctStreak, 0);
assert.equal(state.mistakeBook[q.id].wrongCount, 2);
state.attempts = Array.from({ length: 100 }, (_, index) => ({ ...attempt, id: "rollover-" + index, answers: [q.answer] }));
assert.equal(p.missed(p.validate(state))[0].id, q.id, "An unresolved mistake remains after the capped attempt history rolls over");
const evidence = p.evidence(state).find(item => item.topic.id === "fractions");
assert.equal(evidence.total, 100);
assert.equal(evidence.correct, 100, "Accuracy retains repeated-answer evidence after attempt rollover");
assert.equal(p.evidence(state).find(item => item.topic.id === "algebra").total, 0);
const persistedPractice = p.empty();
persistedPractice.sprintHistory = [{ id: "sprint-untimed", at: "2027-01-05T10:00:00.000Z", duration: 0, attempted: 2, correct: 1 }];
persistedPractice.sprintBests = { "0": 2 };
persistedPractice.writingBands[promptId] = { content: 3, organisation: 2 };
persistedPractice.readingDrafts[englishLabQuestion.id] = { point: "A point.", evidence: "A detail.", explain: "A link." };
assert.deepEqual(clone(p.validate(persistedPractice).sprintHistory), clone(persistedPractice.sprintHistory), "Untimed sprint results survive validation and backup round trips");
assert.deepEqual(clone(p.validate(persistedPractice).sprintBests), clone(persistedPractice.sprintBests), "All-time sprint bests are preserved separately from the capped attempt history");
assert.deepEqual(clone(p.validate(persistedPractice).writingBands), clone(persistedPractice.writingBands), "Self-assessment bands survive backup round trips");
assert.deepEqual(clone(p.validate(persistedPractice).readingDrafts), clone(persistedPractice.readingDrafts), "PEE drafts survive backup round trips");
for (const mutate of [
  s => { s.version = 3; }, s => { s.extra = "bad"; }, s => { delete s.planner; },
  s => { s.studied = ["unknown"]; }, s => { s.studied = ["fractions", "fractions"]; },
  s => { s.scores.fractions = 4; }, s => { s.scores.unknown = 1; },
  s => { s.cardRatings["card-999"] = "known"; }, s => { s.cardRatings["card-1"] = "mastered"; },
  s => { s.planner.examDate = "2027-02-29"; }, s => { s.planner.examDate = "2028-01-01"; },
  s => { s.planner.weeklySessions = 1.5; }, s => { s.planner.weeklySessions = 0; },
  s => { s.planner.completed = ["unknown"]; }, s => { s.planner.checks = ["unknown"]; },
  s => { s.attempts[0].answers = [4]; }, s => { s.attempts[0].answers = ["2"]; },
  s => { s.attempts[0].questionIds = ["unknown"]; }, s => { s.attempts[0].mode = "english"; },
  s => { s.attempts[0].at = "2027-02-30T10:00:00.000Z"; }, s => { s.attempts[0].seconds = 0; },
  s => { s.attempts[0].questionIds = [q.id, q.id]; s.attempts[0].answers = [0, 0]; },
  s => { s.attempts.push(clone(s.attempts[0])); },
  s => { s.attempts = Array.from({ length: 101 }, (_, i) => ({ ...attempt, id: "result-" + i })); }
]) {
  const invalid = clone(state); mutate(invalid);
  assert.throws(() => p.validate(invalid));
}
const polluted = JSON.parse('{"version":2,"studied":[],"scores":{},"cardRatings":{},"attempts":[],"planner":{"examDate":"","weeklySessions":3,"completed":[],"checks":[]},"__proto__":{"polluted":true}}');
assert.throws(() => p.validate(polluted));
assert.equal({}.polluted, undefined);
assert.doesNotMatch(fs.readFileSync(path.join(root, "progress.js"), "utf8"), /https?:\/\/|fetch\s*\(|XMLHttpRequest|@import/);
console.log("PASS: strict progress/backup validation, legacy migration, multi-select answer evidence, Sutton self-review IDs, calendar dates, bounded history and invalid/prototype payload rejection.");
