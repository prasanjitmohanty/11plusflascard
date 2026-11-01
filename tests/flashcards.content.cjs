const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const sandbox = { window: {} };
for (const file of ["topics.js", "test-bank.js", "vocabulary-bank.js", "study-materials.js", "scenario-bank.js", "sutton-bank.js", "maths-lab.js", "flashcards.js"]) vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox);
const cards = sandbox.window.BRIGHTLANE_FLASHCARDS;
const topics = sandbox.window.BRIGHTLANE_TOPICS;
assert.equal(cards.length, 250);
assert.equal(new Set(cards.map(card => card.id)).size, 250);
assert.equal(new Set(cards.map(card => card.front)).size, 250);
const lessonCards = cards.filter(card => /^card-\d+$/.test(card.id));
const examCards = cards.filter(card => card.id.startsWith("exam-card-"));
assert.equal(lessonCards.length, 60);
assert.equal(examCards.length, 94);
assert.equal(cards.filter(card => card.id.startsWith("vocabulary-card-")).length, 50);
assert.equal(cards.filter(card => card.id.startsWith("spelling-card-")).length, 20);
assert.equal(cards.filter(card => card.id.startsWith("strategy-card-")).length, 20);
assert.equal(cards.filter(card => card.id.startsWith("maths-strategy-card-")).length, 6);
assert.equal(lessonCards.filter(card => topics.find(t => t.id === card.topicId).subject === "maths").length, 36);
assert.equal(lessonCards.filter(card => topics.find(t => t.id === card.topicId).subject === "english").length, 24);
const testPrompts = new Set(sandbox.window.BRIGHTLANE_TEST_BANK.map(q => q.q));
for (const topic of topics) {
  const group = lessonCards.filter(card => card.topicId === topic.id);
  assert.equal(group.length, 2, topic.id + " coverage");
  for (const card of group) {
    assert.ok(card.front.length > 10 && card.back.length > 90, card.id + " substantive content");
    assert.ok(!testPrompts.has(card.front), card.id + " separate recall prompt");
  }
}
assert.ok(cards.every(card => topics.some(topic => topic.id === card.topicId) && card.exam && card.back.length >= 35));
assert.deepEqual([...new Set(examCards.map(card => card.exam))].sort(), ["All exams", "NWSSEE Stage 2", "SET", "Tiffin Stage One", "Tiffin Stage Two"].sort());
const examples = {
  "card-1": "50,000", "card-3": "27", "card-4": "104 x 6 = 624",
  "card-7": "1/2", "card-8": "14", "card-10": "0.483", "card-12": "£81",
  "card-13": "4/9", "card-16": "x = 7", "card-17": "22", "card-18": "25",
  "card-19": "2,600", "card-20": "10,000", "card-21": "1.75", "card-22": "£2.30",
  "card-26": "12 edges", "card-27": "24 square cm", "card-28": "42 cubic cm",
  "card-30": "(5, 2)", "card-31": "6", "card-32": "range 6", "card-34": "3/4"
};
for (const [id, text] of Object.entries(examples)) assert.ok(cards.find(card => card.id === id).back.includes(text), id + " checked worked answer");
const runtime = fs.readFileSync(path.join(root, "flashcards.js"), "utf8");
assert.doesNotMatch(runtime, /https?:\/\/|@import|fetch\s*\(|XMLHttpRequest|type=["']module["']/);
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert.ok(html.indexOf('src="flashcards.js"') < html.indexOf('src="app.js"'));
console.log("PASS: 250 cards (60 topic, 94 exam-format, 70 vocabulary/spelling, 20 general strategy and six Maths-lab strategy cards), 36 Maths/24 English base cards, two per topic; all exam/topic links, unique prompts, checked worked examples and local bundled scripts.");
