const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const window = {};
for (const file of ["topics.js", "test-bank.js", "vocabulary-bank.js", "study-materials.js", "scenario-bank.js", "sutton-bank.js", "maths-bank.js", "english-lab.js", "maths-lab.js", "flashcards.js", "progress.js"]) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), { window, Date, Map, Set, Object });
}
const bank = window.BRIGHTLANE_SUTTON_BANK;
const progress = window.BRIGHTLANE_PROGRESS;
const topicById = new Map(window.BRIGHTLANE_TOPICS.map(topic => [topic.id, topic]));
const stageOne = [...bank.stageOne.maths, ...bank.stageOne.english, ...bank.tiffin.unfamiliar];
assert.equal(bank.stageOne.maths.length, 65);
assert.equal(bank.stageOne.english.length, 68);
assert.equal(bank.tiffin.numeric.length, 24);
assert.equal(bank.tiffin.unfamiliar.length, 20);
assert.equal(new Set(stageOne.map(item => item.id)).size, stageOne.length);
for (const item of stageOne) {
  assert.equal(item.options.length, 5, item.id + " has five choices");
  assert.equal(new Set(item.options).size, 5, item.id + " choices are unique");
  assert.ok(topicById.has(item.topicId), item.id + " has a known topic");
  assert.ok(item.why.length >= 30, item.id + " explains its answer");
  const keys = Array.isArray(item.answer) ? item.answer : [item.answer];
  assert.ok(keys.length >= 1 && keys.every(key => Number.isInteger(key) && key >= 0 && key < 5), item.id + " has valid answer keys");
  assert.equal(new Set(keys).size, keys.length, item.id + " has no repeated answer key");
  if (item.format === "select-two") assert.equal(keys.length, 2, item.id + " has exactly two correct options");
  if (Array.isArray(item.answer)) assert.ok(["select-two", "select-many"].includes(item.format), item.id + " declares its multi-select format");
}
assert.equal(bank.stageOne.maths.filter(item => item.format === "select-two").length, 4);
const algebraSelect = bank.stageOne.maths.find(item => item.q === "When x = 3, choose the two true statements.");
const algebraTruth = [2 * 3 === 6, 3 + 5 === 9, 3 ** 2 === 8, 3 - 1 === 2, 3 / 3 === 0];
assert.deepEqual(algebraTruth, [true, false, false, true, false]);
assert.deepEqual(Array.from(algebraSelect.answer), algebraTruth.map((isTrue, index) => isTrue ? index : -1).filter(index => index >= 0));
assert.deepEqual(Array.from(bank.stageOne.english[20].answer, index => bank.stageOne.english[20].options[index]), ["morning lays its colours down", "The buses sigh"]);
assert.equal(bank.stageOne.english[35].q, "In 'We waited patiently for the bus', which word is the adverb?");
assert.equal(bank.stageOne.english[40].options[4], "The dogs in the park was barking loudly.");
assert.equal(bank.stageOne.english[61].q, "In 'The old lantern glowed brightly', which word is the verb?");
assert.equal(bank.tiffin.unfamiliar[1].options[bank.tiffin.unfamiliar[1].answer], "632");
assert.equal(bank.tiffin.unfamiliar[4].options[bank.tiffin.unfamiliar[4].answer], "23");
assert.equal(bank.tiffin.unfamiliar[15].options[bank.tiffin.unfamiliar[15].answer], "2");
assert.match(bank.tiffin.unfamiliar[15].q, /choose two.*digits 2, 4 and 6/i);
assert.match(bank.tiffin.unfamiliar[15].why, /unused digit.*2/i);
const numericAnswers = ["60000", "8600", "927", "532", "392", "78", "36", "45", "10", "19", "35", "29", "34", "325", "0705", "0020", "64", "26", "56", "60", "7", "10", "33", "1025"];
assert.deepEqual(Array.from(bank.tiffin.numeric, item => item.answer), numericAnswers);
assert.ok(bank.tiffin.numeric.every(item => item.format === "numeric-entry" && item.why.length >= 30));

assert.equal(bank.stageTwo.maths.length, 30);
assert.equal(bank.stageTwo.maths.filter(item => item.maxMarks >= 3).length, 10);
assert.equal(new Set(bank.stageTwo.maths.map(item => item.id)).size, 30);
for (const item of bank.stageTwo.maths) {
  assert.equal(item.maxMarks, item.scheme.length, item.id + " mark scheme matches marks");
  assert.ok(item.scheme.length >= 2 && item.scheme.every(step => step.length >= 18), item.id + " has complete method guidance");
}
const checkedMathsValues = [161, 193, 7450, 131, 4, 1, 4.1, 58, 84, 2.5, 9, 41, 1600, 98, 33.6, 57, 80, 52, 160, 36, 2, 9, 84, 7 / 12, 349, 46, 400, 1515, 1512, 12];
bank.stageTwo.maths.forEach((item, index) => assert.ok(Math.abs(item.finalValue - checkedMathsValues[index]) < 1e-9, item.id + " independently checked numeric result"));
assert.equal(bank.stageTwo.maths[9].finalAnswer, "7.5 cups in total; 2.5 cups per bowl");
assert.equal(bank.stageTwo.passages.length, 4);
assert.equal(bank.stageTwo.passages.reduce((sum, passage) => sum + passage.questions.length, 0), 16);
const readingQ2 = bank.stageTwo.passages[0].questions[1];
assert.match(readingQ2.q, /two details the narrator notices about the key/);
assert.match(readingQ2.scheme, /brass.*small.*warm from the sun.*lowest step/);
assert.equal(bank.stageTwo.writing.length, 8);
assert.equal(bank.guidance.wallingtonGirls2028.registrationOpens, "1 May 2027");
assert.equal(bank.guidance.wallingtonGirls2028.openEvening, "Tuesday 6 July 2027");
assert.equal(bank.guidance.wallingtonGirls2028.stageTwoDate, null);
assert.doesNotMatch(bank.guidance.tiffin.priorCycleNote, /dates have passed/i);

assert.equal(progress.questions.length, 773);
assert.equal(new Set(progress.questions.map(item => item.id)).size, 773);
assert.equal(new Set(progress.questions.map(item => item.q.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-GB"))).size, 773);
const numeric = progress.byId.get(bank.tiffin.numeric[14].id);
const state = progress.empty();
state.attempts = [{
  id: "numeric-test-1", at: "2027-01-01T10:00:00.000Z", mode: "maths", kind: "tiffin-stage-one",
  seconds: 2700, expired: false, questionIds: [numeric.id], answers: ["0705"]
}];
assert.equal(progress.summary(state.attempts[0]).correct, 1, "Leading-zero numeric time is scored exactly");
assert.equal(progress.validate(state).attempts[0].answers[0], "0705", "Digit strings survive backup validation");
for (const invalid of ["07:05", "70 5", "", "123456789", 705]) {
  const broken = structuredClone(state);
  broken.attempts[0].answers = [invalid];
  assert.throws(() => progress.validate(broken), "Invalid numeric response is rejected");
}

const cards = window.BRIGHTLANE_FLASHCARDS;
assert.equal(cards.length, 250);
const examCards = cards.filter(card => card.id.startsWith("exam-card-"));
assert.equal(examCards.length, 94);
assert.equal(new Set(cards.map(card => card.id)).size, cards.length);
assert.equal(new Set(cards.map(card => card.front)).size, cards.length);
assert.ok(cards.every(card => topicById.has(card.topicId) && card.front.length > 10 && card.back.length >= 35));
assert.deepEqual([...new Set(examCards.map(card => card.exam))].sort(), ["All exams", "NWSSEE Stage 2", "SET", "Tiffin Stage One", "Tiffin Stage Two"].sort());
assert.match(cards.find(card => card.front === "What is alliteration?").back, /six silver stars.*\/s\//i);

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert.ok(html.indexOf('src="sutton-bank.js"') < html.indexOf('src="progress.js"'));
assert.ok(html.indexOf('src="progress.js"') < html.indexOf('src="app.js"'));
for (const file of ["app.js", "progress.js", "sutton-bank.js", "flashcards.js"]) {
  assert.doesNotMatch(fs.readFileSync(path.join(root, file), "utf8"), /fetch\s*\(|XMLHttpRequest|type=["']module["']/);
}
console.log("PASS: 133 SET items, 24 Tiffin digit-entry and 20 unfamiliar-format items; exact select-two keys; all 30 written Maths values and 10 three-mark schemes; four new passages/32 questions, 40 visual Maths questions, 30 strategy problems and 30 writing-bank prompts; 773 saved objective questions; and 250 unique recall cards.");
