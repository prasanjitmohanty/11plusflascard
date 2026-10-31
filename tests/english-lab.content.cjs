const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const filename = path.resolve(__dirname, "..", "english-lab.js");
const runtime = fs.readFileSync(filename, "utf8");
const normalise = text => text.trim().toLocaleLowerCase("en-GB").replace(/\s+/g, " ");
const words = text => text.match(/[A-Za-z]+(?:['-][A-Za-z]+)*/g) || [];
const key = number => String(number).padStart(2, "0");

function load() {
  const sandbox = { window: {} };
  vm.runInNewContext(runtime, sandbox, {
    filename,
    timeout: 1000,
    contextCodeGeneration: { strings: false, wasm: false }
  });
  assert.deepEqual(Object.keys(sandbox), ["window"]);
  assert.deepEqual(Object.keys(sandbox.window), ["BRIGHTLANE_ENGLISH_LAB"], "One standalone classic-script export");
  return JSON.parse(JSON.stringify(sandbox.window.BRIGHTLANE_ENGLISH_LAB));
}

function fields(record, expected, label) {
  assert.deepEqual(Object.keys(record).sort(), [...expected].sort(), label + " fields");
}

function text(value, minimum, label) {
  assert.equal(typeof value, "string", label + " is text");
  assert.equal(value.trim(), value, label + " has no surrounding whitespace");
  assert.ok(value.length >= minimum, label + " is substantive");
  assert.doesNotMatch(value, /<[^>]+>|\b(?:TODO|TBC|lorem ipsum)\b/, label + " is finished plain text");
}

function unique(values, label) {
  assert.equal(new Set(values.map(normalise)).size, values.length, label);
}

function strings(values, minimumItems, minimumLength, label) {
  assert.ok(Array.isArray(values) && values.length >= minimumItems, label + " is a complete array");
  values.forEach(value => text(value, minimumLength, label));
  unique(values, label + " has distinct items");
}

const bank = load();
assert.deepEqual(load(), bank, "The data is deterministic and independent of time or random state");
fields(bank, ["passages", "writingPrompts", "modelParagraphs", "languageBanks", "dialogueGuide", "typeQuestions"], "Export");
const { passages, writingPrompts, modelParagraphs, languageBanks, dialogueGuide, typeQuestions } = bank;
assert.equal(passages.length, 4);
assert.equal(writingPrompts.length, 22);
assert.equal(modelParagraphs.length, 6);
assert.equal(languageBanks.length, 6);
assert.equal(dialogueGuide.length, 7);
assert.equal(typeQuestions.length, 14);

const allQuestions = passages.flatMap(passage => passage.questions);
const allSegments = passages.flatMap(passage => passage.segments);
assert.equal(allQuestions.length, 32, "Eight questions per new passage");
assert.equal(allQuestions.filter(question => question.format === "select-one").length, 16);
assert.equal(allQuestions.filter(question => question.format === "written").length, 16);
assert.equal(allSegments.length, 101);
unique([
  ...passages, ...allSegments, ...allQuestions, ...writingPrompts,
  ...modelParagraphs, ...languageBanks, ...typeQuestions
].map(item => item.id), "IDs are unique across all content collections");
unique(passages.map(passage => passage.title), "Distinct passage titles");
unique(allSegments.map(segment => segment.text), "No duplicated passage units");
unique([...allQuestions, ...typeQuestions].map(question => question.q), "Distinct question stems");
unique([...allQuestions, ...typeQuestions].map(question => question.q.replace(/[^a-z0-9\s]/gi, "")), "No punctuation-only stem duplicates");
unique([...allQuestions, ...typeQuestions].map(question => question.why), "Individual educational explanations");

const difficultyNames = ["foundation", "stretch", "challenge"];
const topicForType = {
  retrieval: "comprehension",
  inference: "inference",
  vocabulary: "context",
  language: "devices",
  purpose: "evidence",
  summary: "comprehension",
  "true-false-not-given": "evidence"
};
const typesInOrder = ["retrieval", "inference", "vocabulary", "language", "purpose", "summary", "inference", "true-false-not-given"];
const passageFixtures = [
  ["english-lab-fiction", "A Gap in the Sky", "fiction", 26],
  ["english-lab-nonfiction", "Where Does the Rain Go?", "non-fiction", 28],
  ["english-lab-poetry", "Night Shift at the Library", "poetry", 20],
  ["english-lab-playscript", "The Smallest Exhibit", "playscript", 27]
];
const passageById = new Map(passages.map(passage => [passage.id, passage]));
const questionById = new Map(allQuestions.map(question => [question.id, question]));
const passageText = id => passageById.get(id).segments.map(segment => segment.text).join(" ");
const segmentText = (id, number) => passageById.get(id).segments.find(segment => segment.id === id + "-s" + key(number)).text;
const choicePositions = [0, 0, 0, 0];

function multipleChoice(question) {
  assert.ok(Array.isArray(question.options), question.id + " choices are an array");
  assert.equal(question.options.length, 4, question.id + " four choices");
  strings(question.options, 4, 3, question.id + " choices");
  assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, question.id + " valid zero-based answer");
  assert.ok(!normalise(question.q).includes(normalise(question.options[question.answer])), question.id + " does not simply give its full answer");
}

for (const [id, title, genre, segmentCount] of passageFixtures) {
  const passage = passageById.get(id);
  assert.ok(passage, id + " stable identity");
  fields(passage, ["id", "title", "genre", "segments", "questions"], id);
  assert.equal(passage.title, title);
  assert.equal(passage.genre, genre);
  assert.equal(passage.segments.length, segmentCount);
  const count = words(passageText(id)).length;
  assert.ok(count >= (genre === "poetry" ? 140 : 350) && count <= (genre === "poetry" ? 220 : 600), id + " appropriate passage length: " + count);
  const segmentIds = new Set(passage.segments.map(segment => segment.id));
  let paragraph = 1;
  passage.segments.forEach((segment, index) => {
    fields(segment, ["id", "text", "paragraph"], segment.id);
    assert.equal(segment.id, id + "-s" + key(index + 1), "Stable ordered segment keys");
    text(segment.text, 20, segment.id + " text");
    assert.ok(words(segment.text).length <= 45, segment.id + " is a sentence-sized unit or poetry line");
    assert.ok(Number.isInteger(segment.paragraph) && segment.paragraph >= paragraph && segment.paragraph <= paragraph + 1, segment.id + " ordered, contiguous paragraph or stanza");
    paragraph = segment.paragraph;
  });
  assert.equal(passage.segments[0].paragraph, 1);
  assert.equal(passage.questions.length, 8);
  assert.equal(passage.questions.filter(question => question.format === "select-one").length, 4);
  assert.equal(passage.questions.filter(question => question.format === "written").length, 4);
  passage.questions.forEach((question, index) => {
    assert.equal(question.id, id + "-q" + key(index + 1), "Stable question IDs");
    assert.equal(question.type, typesInOrder[index], question.id + " intended reading skill");
    assert.equal(question.topicId, topicForType[question.type], question.id + " existing topic ID");
    assert.ok(difficultyNames.includes(question.difficulty), question.id + " difficulty");
    text(question.q, 35, question.id + " prompt");
    text(question.why, 80, question.id + " explanation");
    strings(question.evidenceIds, 1, 5, question.id + " evidence");
    for (const reference of question.evidenceIds) {
      assert.ok(segmentIds.has(reference), question.id + " evidence is in its own passage: " + reference);
    }
    const commonFields = ["id", "type", "topicId", "difficulty", "format", "q", "why", "evidenceIds"];
    if (question.format === "select-one") {
      fields(question, [...commonFields, "options", "answer"], question.id);
      multipleChoice(question);
      choicePositions[question.answer]++;
    } else {
      assert.equal(question.format, "written", question.id + " supported format");
      fields(question, [...commonFields, "modelAnswer", "marks", "scheme"], question.id);
      text(question.modelAnswer, 90, question.id + " complete model answer");
      assert.ok(Number.isInteger(question.marks) && question.marks >= 2 && question.marks <= 3, question.id + " practice marks");
      strings(question.scheme, question.marks, 45, question.id + " acceptable-answer guidance");
      assert.equal(question.scheme.length, question.marks, question.id + " one guidance point per mark");
      for (const point of question.scheme) assert.match(point, /^1 mark: /, question.id + " transparent mark allocation");
      assert.notEqual(normalise(question.modelAnswer), normalise(question.why), question.id + " explains the answer as well as modelling it");
      if (question.type === "summary") {
        const limit = Number(question.q.match(/no more than (\d+) words/)[1]);
        assert.ok(words(question.modelAnswer).length <= limit, question.id + " model obeys its own word limit");
      }
    }
  });
}
assert.deepEqual(choicePositions, [4, 4, 4, 4], "Balanced passage MCQ answer positions");
for (const type of Object.keys(topicForType)) {
  assert.equal(allQuestions.filter(question => question.type === type).length, type === "inference" ? 8 : 4, type + " coverage");
}

// Pin reviewed answers and the actual evidence used, not just structurally valid indices.
const reviewedChoices = [
  ["english-lab-fiction-q01", "Five o'clock", [3]],
  ["english-lab-fiction-q02", "He seems to be leaving Nia room to accept his suggestion.", [4, 13, 18]],
  ["english-lab-fiction-q03", "Hardly any", [9]],
  ["english-lab-fiction-q04", "It makes the spreading paint seem powerful and beyond Nia's control.", [5, 6]],
  ["english-lab-nonfiction-q01", "420 millilitres", [14]],
  ["english-lab-nonfiction-q02", "To reduce other differences that could affect the comparison.", [11, 13]],
  ["english-lab-nonfiction-q03", "Held there for a time", [6, 8]],
  ["english-lab-nonfiction-q04", "That one measure can solve every heavy-rain problem without limits.", [25, 26]],
  ["english-lab-poetry-q01", "On the returns trolley", [8]],
  ["english-lab-poetry-q02", "The story seems paused until someone reads on.", [9, 19, 20]],
  ["english-lab-poetry-q03", "Gone or no longer present", [6]],
  ["english-lab-poetry-q04", "It personifies the library as if it were relaxing after a busy day.", [1]],
  ["english-lab-playscript-q01", "It tears when it is lifted.", [21]],
  ["english-lab-playscript-q02", "He is still drawn to the impressive model and seems unsure about the modest ticket.", [3, 9]],
  ["english-lab-playscript-q03", "Impressive", [3]],
  ["english-lab-playscript-q04", "It shows interest in the ticket together with care for its fragility.", [21, 27]]
];
for (const [id, answer, evidence] of reviewedChoices) {
  const question = questionById.get(id);
  assert.equal(question.options[question.answer], answer, id + " independently reviewed key");
  const passageId = id.replace(/-q\d+$/, "");
  for (const number of evidence) assert.ok(question.evidenceIds.includes(passageId + "-s" + key(number)), id + " retains its supporting evidence");
}

const reviewedWrittenPoints = [
  ["english-lab-fiction-q05", [/credit/i, /earlier/i, /attitude/i]],
  ["english-lab-fiction-q06", [/green paint/i, /tree/i, /shares the work/i]],
  ["english-lab-fiction-q07", [/earlier/i, /match/i, /flexible/i]],
  ["english-lab-fiction-q08", [/A is true/, /B is false/, /C is not given/]],
  ["english-lab-nonfiction-q05", [/one short comparison/i, /further testing/i, /evidence/i]],
  ["english-lab-nonfiction-q06", [/temporarily/i, /varies/i, /qualified/i]],
  ["english-lab-nonfiction-q07", [/Only one trial/i, /five minutes/i, /more water may drain later/i]],
  ["english-lab-nonfiction-q08", [/A is false/, /B is not given/, /C is true/]],
  ["english-lab-poetry-q05", [/waiting/i, /imagined journey/i, /still library/i]],
  ["english-lab-poetry-q06", [/quiet/i, /journeys/i, /continue/i]],
  ["english-lab-poetry-q07", [/may/i, /possibility/i, /not a certainty/i]],
  ["english-lab-poetry-q08", [/A is false/, /B is not given/, /C is true/]],
  ["english-lab-playscript-q05", [/small/i, /story/i, /size/i]],
  ["english-lab-playscript-q06", [/welcome/i, /tin/i, /own words/i]],
  ["english-lab-playscript-q07", [/At first/i, /Later/i, /kindness/i]],
  ["english-lab-playscript-q08", [/A is false/, /B is true/, /C is not given/]]
];
for (const [id, points] of reviewedWrittenPoints) {
  for (const point of points) assert.match(questionById.get(id).modelAnswer, point, id + " retains a reviewed answer point");
}
assert.match(segmentText("english-lab-fiction", 3), /ready by five/);
assert.match(segmentText("english-lab-fiction", 5), /her sleeve caught a jar/);
assert.match(segmentText("english-lab-fiction", 9), /scarcely any blue/);
assert.match(segmentText("english-lab-fiction", 20), /match it instead of correcting/);
assert.match(segmentText("english-lab-fiction", 26), /Eli's name first/);
assert.doesNotMatch(passageText("english-lab-fiction"), /art club|Saturday/i, "The art-club statement remains genuinely not given");
assert.match(segmentText("english-lab-nonfiction", 10), /imaginary classroom trial/, "Illustrative numbers are not presented as external research");
assert.match(segmentText("english-lab-nonfiction", 11), /same surface area/);
assert.match(segmentText("english-lab-nonfiction", 13), /500 millilitres.*each at the same rate/);
const collected = segmentText("english-lab-nonfiction", 14).match(/\d+/g).map(Number);
assert.deepEqual(collected, [420, 220]);
assert.equal(collected[0] - collected[1], 200, "The written question's difference matches the passage");
assert.match(segmentText("english-lab-nonfiction", 17), /one trial cannot show/);
assert.match(segmentText("english-lab-nonfiction", 19), /already wet/);
assert.doesNotMatch(passageText("english-lab-nonfiction"), /white flowers/i, "The model flower colour remains unknown");
assert.match(segmentText("english-lab-poetry", 8), /returns trolley.*book lies open/);
assert.match(segmentText("english-lab-poetry", 9), /story's boat/);
assert.match(segmentText("english-lab-poetry", 18), /rain may have stopped/);
assert.match(segmentText("english-lab-poetry", 19), /without leaving the chair/);
assert.doesNotMatch(passageText("english-lab-poetry"), /child's receipt|receipt belongs/i, "No receipt owner is supplied");
assert.match(segmentText("english-lab-playscript", 13), /found the exit easily enough/, "Leo's speculation is not substituted for Mr Dale's account");
assert.match(segmentText("english-lab-playscript", 14), /walked with me to the street/);
assert.match(segmentText("english-lab-playscript", 16), /cannot remember the price/);
assert.match(segmentText("english-lab-playscript", 21), /tears when it is lifted/);
assert.doesNotMatch(passageText("english-lab-playscript"), /every year|annual exhibition/i, "Previous annual visits remain unknown");
assert.equal(passages.find(passage => passage.genre === "poetry").segments.length, 20, "Poetry retains individual lines");
assert.equal(new Set(passages.find(passage => passage.genre === "poetry").segments.map(segment => segment.paragraph)).size, 4, "Four readable stanzas");

const writingCounts = { Narrative: 4, Descriptive: 3, "Persuasive article": 3, "Formal letter": 3, "Diary entry": 3, Report: 3, Speech: 3 };
unique(writingPrompts.map(prompt => prompt.title), "Distinct writing titles");
unique(writingPrompts.map(prompt => prompt.prompt), "Distinct original writing tasks");
const existingPrompts = [
  "Write a story about a message that arrives at exactly the wrong moment.",
  "Describe a place just before it opens for the day.",
  "Write an article for your school newsletter arguing whether every class should have a weekly outdoor lesson.",
  "Write to the manager of a local park suggesting one improvement for families.",
  "Write a short report on a survey about how pupils travel to school.",
  "Write a short speech encouraging pupils to care for a shared school space.",
  "Write a diary entry about a time you changed your mind after learning something new.",
  "Write a review of a book, performance or place you know well, recommending it to a particular reader."
];
assert.equal(existingPrompts.length + writingPrompts.length, 30, "The eight existing school-format prompts plus 22 new tasks make 30");
unique([...existingPrompts, ...writingPrompts.map(prompt => prompt.prompt)], "New tasks do not duplicate the known existing prompts");
for (const [type, count] of Object.entries(writingCounts)) {
  assert.equal(writingPrompts.filter(prompt => prompt.type === type).length, count, type + " balanced prompt coverage");
}
writingPrompts.forEach((prompt, index) => {
  fields(prompt, ["id", "title", "type", "prompt", "audience", "purpose", "plan", "criteria"], prompt.id);
  assert.equal(prompt.id, "english-writing-" + key(index + 1));
  text(prompt.title, 8, prompt.id + " title");
  text(prompt.prompt, 140, prompt.id + " substantive task");
  text(prompt.audience, 10, prompt.id + " audience");
  text(prompt.purpose, 20, prompt.id + " purpose");
  strings(prompt.plan, 5, 30, prompt.id + " planning steps");
  strings(prompt.criteria, 5, 20, prompt.id + " self-check guidance");
});

const promptById = new Map(writingPrompts.map(prompt => [prompt.id, prompt]));
const repairReport = promptById.get("english-writing-06");
for (const detail of [/fictional practice facts/i, /six volunteers/, /Twenty-four visitors/, /30 items/, /18 were repaired/, /eight were referred/, /four were judged unsafe/, /20 visitors who gave feedback/, /16 wanted another/, /four were unsure/, /four visitors gave no feedback/, /Costs were not recorded/]) {
  assert.match(repairReport.prompt, detail, "Repair report supplies all factual inputs");
}
assert.equal(18 + 8 + 4, 30, "Repair outcomes account for every item");
assert.equal(16 + 4, 20, "Feedback categories account for respondents");
assert.equal(20 + 4, 24, "Respondents plus non-respondents account for visitors");
const towelReport = promptById.get("english-writing-13");
for (const detail of [/fictional investigation results/, /10 cm by 10 cm/, /same dropper/, /Sample A held 14 ml/, /sample B held 18 ml/, /sample C held 10 ml/, /Only one square/, /prices were not recorded/]) {
  assert.match(towelReport.prompt, detail, "Towel report supplies observations and limitations");
}
assert.ok(18 > 14 && 14 > 10, "Sample B is greatest in this one observed comparison");
const clubReport = promptById.get("english-writing-20");
for (const detail of [/fictional survey facts/, /Forty of the 60 Year 5 pupils/, /one preferred new club each/, /chess 14/, /craft 11/, /coding nine/, /choir six/, /Twenty pupils did not respond/, /staffing, costs or preferences in other year groups/]) {
  assert.match(clubReport.prompt, detail, "Club report supplies counts and population limits");
}
assert.equal(14 + 11 + 9 + 6, 40);
assert.equal(40 + 20, 60);
assert.ok(14 < 40 / 2, "The largest response group is not a majority");
for (const report of writingPrompts.filter(prompt => prompt.type === "Report")) {
  assert.match(report.criteria.join(" "), /not|no |limitation/i, report.id + " cautions against unsupported claims");
}

const modelTypes = new Set(["Narrative", "Descriptive", "Persuasive article", "Formal letter"]);
unique(modelParagraphs.flatMap(model => [model.weaker, model.improved]), "Each revision example is original and distinct");
modelParagraphs.forEach((model, index) => {
  fields(model, ["id", "type", "weaker", "improved", "annotations"], model.id);
  assert.equal(model.id, "english-model-" + key(index + 1));
  assert.ok(modelTypes.has(model.type));
  text(model.weaker, 100, model.id + " weaker draft");
  text(model.improved, 240, model.id + " developed revision");
  assert.notEqual(normalise(model.weaker), normalise(model.improved));
  strings(model.annotations, 5, 65, model.id + " revision annotations");
  for (const category of ["Content:", "Organisation:", "Vocabulary:", "Sentences:", "Punctuation:"]) {
    assert.ok(model.annotations.some(note => note.startsWith(category)), model.id + " explains " + category);
  }
});
assert.equal(modelParagraphs.filter(model => model.type === "Narrative").length, 2);
assert.equal(modelParagraphs.filter(model => model.type === "Descriptive").length, 2);
assert.equal(modelParagraphs.filter(model => model.type === "Persuasive article").length, 1);
assert.equal(modelParagraphs.filter(model => model.type === "Formal letter").length, 1);
assert.match(modelParagraphs[4].improved, /could|may/, "Persuasive revision qualifies claims");
assert.doesNotMatch(modelParagraphs[4].improved, /everyone would|everyone wants/i, "Revision removes unsupported universal claims");
assert.match(modelParagraphs[5].improved, /BK204.*Tuesday/s);
assert.match(modelParagraphs[5].improved, /final ten pages are missing.*other three books are undamaged/s);

unique(languageBanks.map(item => item.label), "Distinct mood/setting groups");
unique(languageBanks.flatMap(item => item.words), "Distinct selected language-bank words");
unique(languageBanks.flatMap(item => item.openers), "Original opening examples");
languageBanks.forEach((group, index) => {
  fields(group, ["id", "label", "words", "openers"], group.id);
  assert.equal(group.id, "english-language-" + key(index + 1));
  text(group.label, 12, group.id + " mood/setting");
  strings(group.words, 4, 4, group.id + " useful words");
  strings(group.openers, 4, 25, group.id + " opening examples");
  assert.ok(new Set(group.openers.map(opener => words(opener)[0].toLowerCase())).size >= 3, group.id + " varied opening patterns");
  for (const word of group.words) {
    assert.ok(group.openers.some(opener => new RegExp("\\b" + word + "\\b", "i").test(opener)), group.id + " demonstrates " + word + " in context");
  }
});
unique(dialogueGuide.map(item => item.rule), "Distinct dialogue rules");
unique(dialogueGuide.map(item => item.example), "Distinct dialogue examples");
for (const item of dialogueGuide) {
  fields(item, ["rule", "example", "why"], "Dialogue guidance");
  text(item.rule, 50, "Dialogue rule");
  text(item.example, 15, "Dialogue example");
  text(item.why, 70, "Dialogue explanation");
  assert.equal((item.example.match(/"/g) || []).length % 2, 0, "Balanced quotation marks");
}
assert.equal(dialogueGuide[0].example, "\"The bus is here.\"");
assert.equal(dialogueGuide[1].example, "\"I found the key,\" whispered Mina.");
assert.equal(dialogueGuide[2].example, "Noor said, \"Pack a coat.\"");
assert.match(dialogueGuide[3].example, /asked Arun\.\n\n"Please do," replied Beth\./, "New speaker begins a new paragraph");
assert.match(dialogueGuide[4].example, /\?" asked Jo\./);
assert.match(dialogueGuide[4].example, /!" replied Sam\./);
assert.equal(dialogueGuide[5].example, "\"If the rain stops,\" said Noor, \"we can finish the survey.\"");
assert.equal(dialogueGuide[6].example, "\"The bridge is safe.\" Mina folded the map.");

const typeLabels = {
  Retrieval: "comprehension", Inference: "inference", "Vocabulary in context": "context",
  "Language effect": "devices", Purpose: "evidence", Summary: "comprehension",
  "True/false/not given": "evidence"
};
const expectedLabels = [
  "Retrieval", "Inference", "Vocabulary in context", "Language effect", "Purpose", "Summary", "True/false/not given",
  "Retrieval", "Inference", "Vocabulary in context", "Language effect", "Purpose", "Summary", "True/false/not given"
];
const typePositions = [0, 0, 0, 0];
typeQuestions.forEach((question, index) => {
  fields(question, ["id", "q", "options", "answer", "why", "topicId", "difficulty"], question.id);
  assert.equal(question.id, "english-type-" + key(index + 1));
  text(question.q, 110, question.id + " self-contained skill-identification task");
  text(question.why, 110, question.id + " explanation");
  assert.ok(difficultyNames.includes(question.difficulty));
  multipleChoice(question);
  assert.ok(question.options.every(option => Object.hasOwn(typeLabels, option)), question.id + " valid type labels");
  assert.equal(question.options[question.answer], expectedLabels[index], question.id + " reviewed classification");
  assert.equal(question.topicId, typeLabels[expectedLabels[index]]);
  typePositions[question.answer]++;
});
for (const label of Object.keys(typeLabels)) {
  assert.equal(typeQuestions.filter(question => question.options[question.answer] === label).length, 2, "Two identification tasks for " + label);
}
assert.deepEqual(typePositions, [4, 4, 3, 3], "Varied type-question answer keys");

assert.match(runtime, /self-check guidance, not school mark schemes/, "Practice guidance is not labelled as official marking");
assert.doesNotMatch(runtime, /https?:\/\/|www\.|@import/, "All English content is bundled without external resources");
const executable = runtime.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");
assert.doesNotMatch(executable, /\b(?:fetch|require|import|eval|Function|setTimeout|setInterval)\s*\(|\b(?:XMLHttpRequest|WebSocket|EventSource)\b|\b(?:document|navigator|localStorage)\s*(?:\.|\[)|\bMath\.random\s*\(/, "No runtime imports, network, storage or dynamic code");
assert.doesNotMatch(JSON.stringify(bank), /\b(?:color|colorful|favorite|neighbor|organize|organized|behavior|center|analyze)\b/, "British English throughout");

console.log("PASS: four original genre passages in range, 101 evidence segments, 16 select-one and 16 fully guided written questions; 22 new writing prompts (30 with the existing eight), three supplied report datasets, six annotated revision pairs, six language banks, seven dialogue guides and 14 balanced question-type exercises; reviewed keys/evidence and standalone offline loading.");
