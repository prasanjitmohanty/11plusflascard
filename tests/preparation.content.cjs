const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const sandbox = { window: {}, Date, Map, Set, Object };
for (const file of ["topics.js", "test-bank.js", "flashcards.js", "study-materials.js", "scenario-bank.js", "sutton-bank.js", "progress.js"]) vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox);
const p = sandbox.window.BRIGHTLANE_PROGRESS;
const clone = value => JSON.parse(JSON.stringify(value));
assert.equal(p.questions.length, 403);
assert.equal(p.byId.size, 403);
assert.equal(new Set(p.questions.map(question => question.id)).size, 403, "All question identifiers are unique");
const normalizedStems = p.questions.map(question => question.q.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-GB"));
assert.equal(new Set(normalizedStems).size, normalizedStems.length, "No repeated question stems across the complete bank");
assert.deepEqual(clone(p.validate(p.empty())), clone(p.empty()));
assert.deepEqual(clone(p.migrate({ studied: ["fractions"], scores: { fractions: 2 } })).studied, ["fractions"]);
for (const date of ["2027-02-29", "2027-02-30", "2027-04-31", "2027-13-01", "2026-12-01", "2027-1-01", "garbage"]) assert.equal(p.date(date, 2027), false, date);
for (const date of ["2027-01-01", "2027-02-28", "2027-12-31"]) assert.equal(p.date(date, 2027), true, date);
const q = p.byId.get("fractions-test-1");
const attempt = { id: "result-1", at: "2027-01-01T10:00:00.000Z", mode: "maths", kind: "test", seconds: 900, expired: true, questionIds: [q.id], answers: [null] };
const state = p.empty();
state.attempts = [attempt]; state.cardRatings["card-1"] = "again";
assert.equal(p.validate(state).attempts.length, 1);
assert.deepEqual(clone(p.summary(attempt)), { total: 1, correct: 0, incorrect: 0, unanswered: 1 });
assert.equal(p.missed(state)[0].id, q.id);
assert.equal(p.evidence(state).find(item => item.topic.id === "fractions").unanswered, 1);
state.attempts.push({ ...attempt, id: "result-2", answers: [q.answer], expired: false });
assert.equal(p.missed(state).length, 0, "Latest correct clears revision");
const evidence = p.evidence(state).find(item => item.topic.id === "fractions");
assert.equal(evidence.total, 2);
assert.equal(evidence.correct, 1, "Accuracy retains repeated-answer evidence");
assert.equal(p.evidence(state).find(item => item.topic.id === "algebra").total, 0);
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
