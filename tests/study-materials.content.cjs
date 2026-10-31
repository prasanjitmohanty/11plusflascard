const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const sandbox = { window: {}, Map, Set, Object };
for (const file of ["topics.js", "test-bank.js", "flashcards.js", "study-materials.js", "scenario-bank.js", "sutton-bank.js", "progress.js"]) vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox);
const topics = sandbox.window.BRIGHTLANE_TOPICS;
const materials = sandbox.window.BRIGHTLANE_STUDY_MATERIALS;
const progress = sandbox.window.BRIGHTLANE_PROGRESS;
assert.equal(progress.questions.length, 403);
assert.equal(progress.byId.size, 403);
assert.equal(progress.questions.filter(q => q.topic.subject === "maths").length, 231);
assert.equal(progress.questions.filter(q => q.topic.subject === "english").length, 172);
assert.equal(new Set(progress.questions.map(q => q.id)).size, 403, "Stable question IDs are unique");
const stems = progress.questions.map(q => q.q.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-GB"));
assert.equal(new Set(stems).size, stems.length, "No duplicate question stems across the complete bank");
const existingQuestions = progress.questions.filter(q => !q.id.startsWith("sutton-set-") && q.format !== "numeric-entry" && !q.id.startsWith("tiffin-unfamiliar-"));
assert.ok(existingQuestions.every(q => q.options.length === 4 && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4 && q.why.length >= 35));
assert.ok(progress.questions.filter(q => q.id.startsWith("sutton-set-")).every(q => q.options.length === 5 && (Array.isArray(q.answer) ? q.answer.length >= 2 && q.answer.every(answer => Number.isInteger(answer)) : Number.isInteger(q.answer)) && q.why.length >= 30));
const numericQuestions = progress.questions.filter(q => q.format === "numeric-entry");
assert.equal(numericQuestions.length, 24);
assert.ok(numericQuestions.every(q => /^\d+$/.test(q.answer) && q.why.length >= 30));
const unfamiliarQuestions = progress.questions.filter(q => q.id.startsWith("tiffin-unfamiliar-"));
assert.equal(unfamiliarQuestions.length, 20);
assert.ok(unfamiliarQuestions.every(q => q.options.length === 5 && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 5 && q.why.length >= 30));
assert.equal(materials.reference.length, 30);
assert.equal(new Set(materials.reference.map(item => item.topicId)).size, topics.length);
for (const item of materials.reference) {
  const topic = topics.find(t => t.id === item.topicId);
  assert.ok(topic, item.title + " linked topic exists");
  assert.equal(item.subject, topic.subject);
  assert.ok(item.rule.length >= 70 && item.example.length >= 22);
}
assert.equal(materials.readings.length, 3);
const expected = [
  ["A box of returned books", "She was committed even before seeing results", "A new shoot emerging from the soil", "Its signs of real use make it feel cared for, not perfect"],
  ["A parcel", "She asks which road the replacement bus will use", "He is preparing to use it to check the bus route", "She feels disappointed by the cancellation"],
  ["For as long as anyone could remember", "The minute hand trembled as a lorry passed", "Different observations can combine to help solve a problem", "To share the repair and the explanation with customers"]
];
let readingQuestionCount = 0;
materials.readings.forEach((reading, index) => {
  assert.ok(topics.some(t => t.id === reading.topicId && t.subject === "english"));
  const wordCount = reading.passage.trim().split(/\s+/).length;
  assert.ok(wordCount >= 130, reading.title + " is a substantive longer passage (" + wordCount + " words)");
  assert.equal(reading.questions.length, 4);
  reading.questions.forEach((question, questionIndex) => {
    assert.equal(question.id, reading.id + "-q" + (questionIndex + 1));
    assert.equal(question.topicId, reading.topicId);
    assert.equal(question.passage, reading.passage);
    assert.equal(question.options[question.answer], expected[index][questionIndex], question.id + " independently checked correct answer");
    assert.ok(question.why.length >= 50, question.id + " explained answer");
    readingQuestionCount++;
  });
});
assert.equal(readingQuestionCount, 12);
assert.equal(materials.writing.length, 6);
for (const prompt of materials.writing) {
  assert.ok(prompt.prompt.length >= 40 && prompt.plan.length >= 3 && prompt.checks.length >= 4);
}
assert.doesNotMatch(fs.readFileSync(path.join(root, "study-materials.js"), "utf8"), /https?:\/\/|fetch\s*\(|XMLHttpRequest|@import/);
for (const topic of topics) assert.equal(topic.questions.length, 3, topic.id + " worksheet has three linked questions");
console.log("PASS: 403 registered practice questions have unique stable IDs/stems; all 30 topic references, 3 longer passages/12 checked answers, 6 writing scaffolds/rubrics and 30 reusable worksheet sets verified.");
