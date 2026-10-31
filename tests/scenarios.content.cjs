const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const sandbox = { window: {}, Map, Set, Object };
for (const file of ["topics.js", "test-bank.js", "flashcards.js", "study-materials.js", "scenario-bank.js", "sutton-bank.js", "progress.js"]) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox);
}
const { BRIGHTLANE_SCENARIOS: scenarios, BRIGHTLANE_TOPICS: topics, BRIGHTLANE_STUDY_MATERIALS: materials, BRIGHTLANE_PROGRESS: progress } = sandbox.window;
assert.equal(scenarios.length, 32, "The bounded bank contains 32 original scenarios");
assert.equal(scenarios.filter(scenario => scenario.subject === "maths").length, 16);
assert.equal(scenarios.filter(scenario => scenario.subject === "english").length, 16);
assert.equal(new Set(scenarios.map(scenario => scenario.id)).size, scenarios.length, "Scenario IDs are unique");
assert.ok(scenarios.every(scenario => /^[a-z][a-z0-9-]+$/.test(scenario.id)));
assert.ok(scenarios.every(scenario => typeof scenario.prompt === "string" && scenario.prompt.length >= 80));
assert.ok(scenarios.every(scenario => scenario.type && scenario.title));
assert.ok(scenarios.every(scenario => scenario.questions.length === 2));
assert.equal(scenarios.reduce((sum, scenario) => sum + scenario.questions.length, 0), 64);
const scenarioQuestions = scenarios.flatMap(scenario => scenario.questions);
assert.equal(new Set(scenarioQuestions.map(question => question.id)).size, 64, "Scenario question IDs are stable and unique");
assert.ok(scenarios.every(scenario => topics.some(topic => topic.id === scenario.topicId && topic.subject === scenario.subject)));
assert.ok(scenarioQuestions.every(question => question.options.length === 4 && Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4 && question.why.length >= 50));
const allQuestions = progress.questions;
assert.equal(allQuestions.length, 403);
assert.equal(progress.byId.size, 403);
assert.equal(new Set(allQuestions.map(question => question.id)).size, 403, "All question IDs are unique across existing and scenario banks");
const stems = allQuestions.map(question => question.q.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-GB"));
assert.equal(new Set(stems).size, stems.length, "Scenario questions do not duplicate existing question stems");
assert.equal(allQuestions.filter(question => question.topic.subject === "maths").length, 231);
assert.equal(allQuestions.filter(question => question.topic.subject === "english").length, 172);
assert.ok(scenarioQuestions.every(question => progress.byId.get(question.id).scenario && progress.byId.get(question.id).topic));
const mathsAnswerText = [
  [["fair-badges", ["12", "£21.60"]], ["club-drinks", ["10 litres", "9 litres"]], ["recipe-pasta", ["750 g", "2 packets, 250 g left"]], ["coat-sale", ["£36", "£14"]], ["museum-visit", ["11:23", "12:38"]], ["cycle-route", ["3.15 km", "3,150 m"]], ["garden-beds", ["51 m²", "29 m"]], ["classroom-tiles", ["17.28 m²", "48"]], ["sail-angles", ["65°", "52°"]], ["sports-timings", ["13 minutes", "13.5 minutes"]], ["lost-property-draw", ["7/10", "0"]], ["pencil-order", ["432", "43 each, 2 left"]], ["walking-trail", ["18 km", "9 km"]], ["map-translation", ["(6, 1)", "(5, 2)"]], ["charity-stall", ["£32", "£24"]], ["water-tank", ["1,650 ml", "2,250 ml"]]]
];
for (const [scenarioId, expected] of mathsAnswerText[0]) {
  const scenario = scenarios.find(item => item.id === scenarioId);
  scenario.questions.forEach((question, index) => assert.equal(question.options[question.answer], expected[index], scenarioId + " q" + (index + 1) + " checked result"));
}
const englishAnswerText = {
  "garden-gate": ["She is unsure whether to touch it", "A muddy spaniel"],
  "library-notice": ["To explain a temporary change and give practical information", "In the community hall"],
  "market-word-choice": ["A line of people moving steadily", "Crowded"],
  "homophone-edit": ["your", "there"],
  "team-sentence": ["is", "The basket of clean cloths is beside the door."],
  "garden-description": ["Strolled", "The gravel crunched softly beneath each step."],
  "diary-tenses": ["The path became muddy near the stream.", "We saw a heron by the bridge."],
  "stage-directions": ["'Are you ready?' asked Mina.", "Mina's bag was beside the door."],
  "poem-image": ["Personification", "Thin bands of light appearing across the wet street"],
  "newsletter-edit": ["quietly", "A noun"],
  "story-order": ["The open window and paper caught on the ivy", "To help retrieve the page safely"],
  "club-invitation": ["The meeting day, time, place and how to join", "Come and explore the school garden with us on Thursdays after lessons."],
  "spelling-check": ["grateful", "The guests will arrive early."],
  "school-report": ["The survey asked only one class", "More benches"],
  "persuasive-choice": ["A count of how many children cross there at busy times", "State the request, give evidence and reasons, suggest a practical next step, close politely"],
  "lost-dog-poster": ["If you see him, please phone 01400 123456.", "His white chest patch and blue collar"]
};
for (const [scenarioId, expected] of Object.entries(englishAnswerText)) {
  const scenario = scenarios.find(item => item.id === scenarioId);
  scenario.questions.forEach((question, index) => assert.equal(question.options[question.answer], expected[index], scenarioId + " q" + (index + 1) + " checked answer"));
}
assert.equal(materials.readings.length, 3, "Existing original study materials remain present");
assert.doesNotMatch(fs.readFileSync(path.join(root, "scenario-bank.js"), "utf8"), /real past.paper|official paper|provider paper|from 2017|from 2026/i, "The bank makes no false source or historical claims");
assert.match(fs.readFileSync(path.join(root, "app.js"), "utf8"), /not real past-paper questions from 2017–2026/);
for (const file of ["scenario-bank.js", "index.html"]) {
  assert.doesNotMatch(fs.readFileSync(path.join(root, file), "utf8"), /https?:\/\/|fetch\s*\(|XMLHttpRequest|@import/);
}
console.log("PASS: 32 original scenarios (16 per subject), 64 explained subquestions, supported topic/type metadata, independently checked Maths answer values, and 403 globally unique registered question IDs/stems (231 Maths, 172 English). Existing reading materials and honest provenance copy retained.");
