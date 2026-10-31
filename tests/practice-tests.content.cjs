const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const sandbox = { window: {} };
for (const name of ["topics.js", "test-bank.js"]) vm.runInNewContext(fs.readFileSync(path.join(root, name), "utf8"), sandbox);
const topics = sandbox.window.BRIGHTLANE_TOPICS;
const bank = sandbox.window.BRIGHTLANE_TEST_BANK;
const expected = {
  "place-value": ["60,000", "14 degrees"],
  operations: [String(18 * (14 - 9) + 7), String(3.6 * 0.5)],
  factors: ["36", "75"],
  fractions: ["5/8", "1 1/2 metres"],
  decimals: ["1/8", (7.08 + 0.965).toFixed(3)],
  percentages: ["£54", "30%"],
  ratio: ["240 ml", "£10"],
  algebra: [String((29 + 3) / 4), String(2 * 3 + 5 * 5)],
  sequences: [String(6 * 6), String(7 + 7 * 4)],
  units: ["2.55 m", "3 litres"],
  "time-money": ["2 hours 25 minutes", "£3.30"],
  angles: ["75 degrees", "72 degrees"],
  shapes: ["A triangular prism", "6"],
  "area-volume": ["78 square m", "3 cm"],
  coordinates: ["(-3, -4)", "(1, 5)"],
  data: ["7.5", "10"],
  probability: ["1/2", "1/3"],
  "word-problems": [String(Math.ceil(137 / 24)), String(9 * 16 - 58)],
  comprehension: ["To protect them from frost", "The seedlings were carried inside."],
  inference: ["She is disappointed.", "She wins a competition the next day."],
  evidence: ["'queues curled around the hall'", "To contrast it with the crowded hall"],
  context: ["Easy to break", "Examined closely"],
  synonyms: ["Short", "Shrink"],
  spelling: ["travelling", "there"],
  "word-classes": ["Those", "often"],
  sentences: ["works", "Although it was late, we finished the puzzle."],
  tenses: ["had begun", "We are playing chess."],
  punctuation: ["the boys' bags", "We packed three things: bread, cheese and apples."],
  devices: ["'Steam twisted like a ribbon'", "Gives the morning a human action"],
  writing: ["I am writing to request a pedestrian crossing near our school.", "Whether the information is relevant and clearly organised"]
};
assert.equal(bank.length, 60);
assert.equal(new Set(bank.map(q => q.id)).size, 60);
assert.equal(new Set(bank.map(q => q.q)).size, 60);
assert.equal(bank.filter(q => topics.find(t => t.id === q.topicId).subject === "maths").length, 36);
assert.equal(bank.filter(q => topics.find(t => t.id === q.topicId).subject === "english").length, 24);
const lessonQuestions = new Set(topics.flatMap(t => t.questions.map(q => q.q)));
for (const t of topics) {
  const questions = bank.filter(q => q.topicId === t.id);
  assert.equal(questions.length, 2, t.id + " test representation");
  questions.forEach((q, i) => {
    assert.ok(q.q.length > 10 && q.why.length > 45, q.id + " explained original question");
    assert.ok(!lessonQuestions.has(q.q), q.id + " separate from short practice");
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
    assert.equal(q.options[q.answer], expected[t.id][i], q.id + " independently reviewed answer key");
    if (["comprehension", "inference", "evidence", "context", "devices"].includes(t.id)) assert.ok(q.passage.length > 100, q.id + " bundled original passage");
  });
}
for (const name of ["index.html", "app.js", "test-bank.js", "styles.css"]) {
  assert.doesNotMatch(fs.readFileSync(path.join(root, name), "utf8"), /https?:\/\/|@import|fetch\s*\(|XMLHttpRequest|type=["']module["']/, name + " offline runtime");
}
assert.ok(fs.readFileSync(path.join(root, "index.html"), "utf8").indexOf('src="test-bank.js"') < fs.readFileSync(path.join(root, "index.html"), "utf8").indexOf('src="app.js"'));
console.log("PASS: 60 distinct original test questions (36 Maths, 24 English), 30 topics represented, all answer keys independently checked; bundled passages and no remote runtime resources.");
