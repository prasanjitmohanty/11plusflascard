const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "topics.js"), "utf8"), sandbox);
const topics = sandbox.window.BRIGHTLANE_TOPICS;
assert.equal(topics.length, 30);
assert.equal(topics.filter(t => t.subject === "maths").length, 18);
assert.equal(topics.filter(t => t.subject === "english").length, 12);
assert.equal(new Set(topics.map(t => t.id)).size, 30);
const expected = {
  "place-value": ["60,000", "7,800", "-3"],
  operations: [String(48 + 6 * 3), String(936 / 8), (4.7 - 2.85).toFixed(2)],
  factors: ["29", "12", "24 minutes"],
  fractions: [String(48 / 4 * 3), "1/2", String(1.5 / 0.75)],
  decimals: ["0.39", (6.28 / 100).toFixed(4), "3.48"],
  percentages: [String(0.35 * 80), "£44", "£30"],
  ratio: ["3:4", "450 g", String(35 / 7 * 3)],
  algebra: [String(4 * 6 - 7), String(45 / 5), "5y + 4"],
  sequences: ["48", String(2 + 5 * 3), String(4 * 3 + 1)],
  units: ["2,350 g", "75 cm", "40 g"],
  "time-money": ["19:45", "£4.45", "12:10"],
  angles: ["53 degrees", "65 degrees", "225 degrees"],
  shapes: ["12", "Equilateral", "2"],
  "area-volume": ["26 cm", "30 square cm", "60 cubic cm"],
  coordinates: ["(-4, -2)", "(-2, 3)", "270"],
  data: [String((5 + 7 + 8 + 12) / 4), "6", "20 books"],
  probability: ["1/2", "2/5", "0.7"],
  "word-problems": [String(8 * 12 / 6), String((31 - 7) / 2), String(Math.floor(50 / 7))],
  comprehension: ["Nine o'clock", "Beside the window", "It is the finest room in the village."],
  inference: ["Nervousness", "His shoulders are no longer drawn up.", "He definitely wins the main part."],
  evidence: ["'shuddered'", "It contrasts safety with danger.", "It makes the river seem aggressive, like an animal."],
  context: ["Empty of people", "Alone", "A movement downwards"],
  synonyms: ["Limited", "Stingy", "Intelligent"],
  spelling: ["stopping", "They're", "babies"],
  "word-classes": ["loudly", "she", "A preposition"],
  sentences: ["The children waited outside.", "is", "but"],
  tenses: ["written", "The branch was broken by the wind.", "I was reading."],
  punctuation: ["the girl's coat", "It's raining today.", "The sun set; the street grew quiet."],
  devices: ["'My scarf, a flag'", "Personification", "free / sea"],
  writing: ["Identify the audience and the change you want.", "When time, place, speaker or focus changes.", "My hands trembled as I unfolded the note."]
};
let count = 0;
for (const t of topics) {
  assert.match(t.id, /^[a-z]+(?:-[a-z]+)*$/);
  assert.ok(t.title && t.summary && t.pitfall);
  assert.equal(t.learn.length, 3);
  assert.equal(t.example.length, 2);
  assert.ok(t.learn.every(p => p.length > 60), t.id + " substantive lesson");
  assert.ok(t.example[1].length > 80, t.id + " worked example");
  assert.equal(t.questions.length, 3);
  t.questions.forEach((q, i) => {
    assert.ok(q.q && q.why.length > 35);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
    assert.equal(q.options[q.answer], expected[t.id][i], t.id + " independently checked answer " + (i + 1));
    count++;
  });
}
assert.equal(count, 90);
for (const file of ["index.html", "app.js", "topics.js", "styles.css"]) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  assert.doesNotMatch(source, /https?:\/\/|@import|fetch\s*\(|XMLHttpRequest|type=["']module["']/, file + " must be network-free");
}
console.log("PASS: 30 substantive lessons, 30 examples, 90 independently checked answer keys; no remote runtime resources.");
