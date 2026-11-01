const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const sandbox = { window: {}, Date, Map, Set, Object };
for (const file of ["topics.js", "test-bank.js", "vocabulary-bank.js", "study-materials.js", "scenario-bank.js", "sutton-bank.js", "maths-bank.js", "english-lab.js", "maths-lab.js", "flashcards.js", "progress.js"]) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox);
}
const bank = sandbox.window.BRIGHTLANE_MATHS_WAVE_TWO;
const progress = sandbox.window.BRIGHTLANE_PROGRESS;
const topics = new Map(sandbox.window.BRIGHTLANE_TOPICS.map(topic => [topic.id, topic]));
const normalise = text => text.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-GB");
assert.equal(bank.length, 100, "Export exactly the reviewed Maths wave-two records; no hidden source rows");
assert.equal(new Set(bank.map(item => item.id)).size, 100);
assert.equal(new Set(bank.map(item => normalise(item.q))).size, 100);
assert.doesNotMatch(fs.readFileSync(path.join(root, "maths-bank.js"), "utf8"), /\.slice\s*\(/, "The public bank is not silently truncated");
assert.ok(bank.every(item => topics.has(item.topicId) && topics.get(item.topicId).subject === "maths"));
assert.ok(bank.every(item => item.options.length === 5 && new Set(item.options).size === 5));
assert.ok(bank.every(item => item.why.length >= 30 && ["foundation", "stretch", "challenge"].includes(item.difficulty)));
assert.ok(bank.every(item => item.exams.length === 4 && item.round === "both"));
for (const item of bank) {
  const keys = Array.isArray(item.answer) ? item.answer : [item.answer];
  assert.ok(keys.length >= 1 && keys.every(index => Number.isInteger(index) && index >= 0 && index < item.options.length), item.id + " has valid key indices");
  assert.equal(new Set(keys).size, keys.length, item.id + " has no repeated answer key");
  if (item.format === "select-two") assert.equal(keys.length, 2, item.id + " has exactly two selected answers");
  else assert.equal(Number.isInteger(item.answer), true, item.id + " has one answer key");
}
const priorStems = new Set(progress.questions.filter(item => !item.id.startsWith("maths-wave2-")).map(item => normalise(item.q)));
assert.ok(bank.every(item => !priorStems.has(normalise(item.q))), "New Maths items do not reuse an existing exact question stem");
const extendedRegistry = progress.questions.filter(item => item.id.startsWith("maths-wave2-"));
assert.equal(extendedRegistry.length, 100, "All new Maths questions use the canonical saved/mock registry");
assert.ok(extendedRegistry.every(item => progress.byId.get(item.id) === item));
const coveredMathsTopics = new Set(bank.map(item => item.topicId));
assert.equal(coveredMathsTopics.size, 18, "Every Maths topic has new practice");

const commonMultiple = bank.find(item => item.format === "select-two");
assert.equal(commonMultiple.q, "Choose the two numbers that are multiples of both 6 and 9.");
assert.deepEqual(Array.from(commonMultiple.answer, index => commonMultiple.options[index]), ["18", "36"]);
assert.deepEqual(Array.from(commonMultiple.options, value => Number(value) % 6 === 0 && Number(value) % 9 === 0), [true, false, true, false, false]);
const xStatements = progress.byId.get("sutton-set-maths-065");
assert.deepEqual(Array.from(xStatements.options, statement => {
  const expression = statement.replace(/\s+/g, "");
  if (expression === "2x=6") return 2 * 3 === 6;
  if (expression === "x+5=9") return 3 + 5 === 9;
  if (expression === "x²=8") return 3 ** 2 === 8;
  if (expression === "x-1=2") return 3 - 1 === 2;
  if (expression === "x÷3=0") return 3 / 3 === 0;
  assert.fail("Unexpected x = 3 statement: " + statement);
}), [true, false, false, true, false]);
assert.deepEqual(Array.from(xStatements.answer, index => xStatements.options[index]), ["2x = 6", "x - 1 = 2"]);
const fraction = bank.find(item => item.q === "Which fraction is greatest?");
assert.equal(fraction.options[fraction.answer], "2/3");
assert.match(fraction.why, /120ths.*75\/120.*80\/120.*70\/120.*72\/120.*66\/120/);
const die = bank.find(item => item.q.includes("fair eight-sided die"));
assert.equal(die.options[die.answer], "3/8");
const biscuits = bank.find(item => item.q.includes("boxes holding up to 15"));
assert.equal(biscuits.options[biscuits.answer], "16");
assert.ok(!bank.some(item => /tank/i.test(item.q) && /240/.test(item.q)), "The repeated 240-litre tank problem is not exported");
assert.ok(!bank.some(item => /18 packs of 24 pencils/i.test(item.q)), "The repeated 18-by-24 pencil problem is not exported");

console.log("PASS: 100 exported original Maths questions across all 18 topics; globally distinct stems, valid/select-two keys, and regression checks for corrected wording, calculations and prior-bank duplicates.");
