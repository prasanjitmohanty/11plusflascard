const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const filename = path.resolve(__dirname, "..", "vocabulary-bank.js");
const runtime = fs.readFileSync(filename, "utf8");
const normalise = text => text.trim().toLocaleLowerCase("en-GB").replace(/\s+/g, " ");
const escapeRegex = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const containsWord = (text, word) => new RegExp("(^|[^a-z])" + escapeRegex(word) + "(?=$|[^a-z])", "i").test(text);
const key = number => String(number).padStart(3, "0");
const range = (start, count) => Array.from({ length: count }, (_, index) => start + index);
const clone = value => JSON.parse(JSON.stringify(value));

function load() {
  const sandbox = { window: {} };
  vm.runInNewContext(runtime, sandbox, {
    filename,
    timeout: 1000,
    contextCodeGeneration: { strings: false, wasm: false }
  });
  assert.deepEqual(Object.keys(sandbox), ["window"], "No ambient global dependencies or side effects");
  assert.deepEqual(Object.keys(sandbox.window), ["BRIGHTLANE_VOCABULARY"], "Exactly one classic-script export");
  return clone(sandbox.window.BRIGHTLANE_VOCABULARY);
}

function unique(values, label) {
  assert.equal(new Set(values.map(normalise)).size, values.length, label);
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

function blank(sentence, label) {
  assert.equal((sentence.match(/____/g) || []).length, 1, label + " has one four-underscore blank");
  assert.doesNotMatch(sentence.replace("____", ""), /_/, label + " has no extra underscores");
  assert.match(sentence, /(^|[\s'"])____(?=$|[\s.,!?;:'"])/, label + " replaces a whole word");
}

const bank = load();
assert.deepEqual(load(), bank, "Repeated loads produce the same fixed data");
fields(bank, ["entries", "questions", "spellings", "sources"], "Export");
const { entries, questions, spellings, sources } = bank;
assert.equal(entries.length, 300, "300 reference entries, not counted as quiz questions");
assert.equal(questions.length, 200, "200 separately authored vocabulary questions");
assert.equal(spellings.length, 104, "100 statutory entries expand to 104 practice forms");
unique([...entries, ...questions, ...spellings].map(record => record.id), "IDs are unique across all collections");
unique(entries.map(entry => entry.word), "Distinct vocabulary headwords");
unique(entries.map(entry => entry.example), "Distinct vocabulary examples");
unique(entries.map(entry => entry.definition), "Distinct sense definitions");

// Pin identities independently of array order so saved progress cannot silently move to another word.
const stableWords = `
abundant accurate admit alert anxious approach arrive bold brief calm
cautious cheerful combine common conceal confident considerate cruel curious decline
delicate eager expand familiar flexible fortunate generous gentle genuine gloomy
gradual grateful honest humble include increase innocent lively loyal minor
narrow neat obedient ordinary patient permanent plentiful polite praise prevent
private protect purchase rapid rare reduce refuse release reliable repair
reveal rigid sensible separate shallow shrink silent simple sincere steady
sturdy succeed suitable support temporary tense timid transparent trust unite
urgent vacant vanish victory visible voluntary wary weaken willing advance
wisdom avoid balance blame borrow capture encourage failure freedom harmony
ambitious awkward bewildered blunt brittle brisk capable courteous dejected dense
deserted determined devour dispute dwindle efficient elaborate emerge encounter enhance
essential evident exaggerate excessive feeble fierce flimsy frantic frequent glum
hasty hesitant hostile ignorant immense inferior ingenious initial intentional intricate
jovial lavish lenient lucid meagre meticulous mournful neglect obscure optimistic
peculiar perilous persist placid plausible precise prohibit prosper punctual reluctant
remote resentful resilient retain reward scarce severe significant solitary sparse
stern subtle sufficient tedious thrive tranquil trivial unique vague weary
wretched yield absorb accelerate accomplish ascend attract construct conserve deceive
defend descend discourage forbid interrupt soothe strengthen triumph unity generosity
abrasive abrupt aloof ambiguous amiable apprehensive arrogant assertive audacious austere
benevolent candid coherent complacent concise conspicuous credible defiant deliberate diligent
diminish discord dismiss dissuade divulge dubious eloquent equitable exhilarated explicit
extravagant feasible fervent fickle flourish formidable frivolous frugal impartial impetuous
inadvertent incessant inclusive inconspicuous industrious inevitable inquisitive insolent intrepid irritable
judicious lethargic magnanimous malevolent methodical morose nonchalant obstinate ominous opaque
ornate pensive perceptive perpetual pessimistic placate prudent recede reconcile refute
reinforce relinquish restrain resolute resourceful revere ruthless sceptical scrutinise serene
shrewd spontaneous steadfast stoical superficial suppress tentative tenacious turbulent unanimous
undermine versatile vigilant vindicate vivacious vulnerable wane zeal adversity deteriorate
`.trim().split(/\s+/);
assert.equal(stableWords.length, 300);
const byId = new Map(entries.map(entry => [entry.id, entry]));
stableWords.forEach((word, index) => {
  assert.equal(byId.get("vocabulary-" + key(index + 1))?.word, word, "Stable word " + word);
});

const difficulties = ["foundation", "stretch", "challenge"];
const partsOfSpeech = ["adjective", "verb", "noun", "adverb"];
for (const difficulty of difficulties) {
  assert.equal(entries.filter(entry => entry.difficulty === difficulty).length, 100, difficulty + " coverage");
}
for (const entry of entries) {
  fields(entry, ["id", "word", "partOfSpeech", "definition", "synonym", "antonym", "example", "family", "difficulty"], entry.id);
  assert.match(entry.id, /^vocabulary-\d{3}$/);
  assert.match(entry.word, /^[a-z]+$/);
  assert.ok(partsOfSpeech.includes(entry.partOfSpeech), entry.id + " part of speech");
  assert.ok(difficulties.includes(entry.difficulty), entry.id + " difficulty");
  text(entry.definition, 12, entry.id + " definition");
  text(entry.synonym, 3, entry.id + " synonym");
  text(entry.antonym, 3, entry.id + " antonym");
  text(entry.example, 30, entry.id + " example");
  assert.ok(containsWord(entry.example, entry.word), entry.id + " example uses its headword in context");
  assert.doesNotMatch(entry.example, /____|(?:word|term) ['"][a-z]+['"] means/i, entry.id + " is an example, not a definition template");
  assert.notEqual(normalise(entry.definition), normalise(entry.example));
  unique([entry.word, entry.synonym, entry.antonym], entry.id + " distinct headword and meaning pair");
  assert.ok(Array.isArray(entry.family) && entry.family.length >= 1, entry.id + " word family");
  unique(entry.family, entry.id + " distinct family members");
  for (const relative of entry.family) {
    assert.match(relative, /^[a-z]+$/, entry.id + " family form");
    assert.notEqual(relative, entry.word, entry.id + " family adds another form");
  }
}

const expectedTargets = {
  cloze: [...range(1, 35), ...range(101, 35), ...range(201, 30)],
  synonym: [...range(36, 15), ...range(136, 20), ...range(231, 15)],
  antonym: [...range(51, 15), ...range(156, 20), ...range(246, 15)]
};
const questionsById = new Map(questions.map(question => [question.id, question]));
for (const [type, targets] of Object.entries(expectedTargets)) {
  assert.equal(questions.filter(question => question.type === type).length, targets.length, type + " count");
  targets.forEach((entryNumber, index) => {
    const id = "vocabulary-" + type + "-" + key(index + 1);
    assert.equal(questionsById.get(id)?.entryId, "vocabulary-" + key(entryNumber), id + " stable target");
  });
  for (const difficulty of difficulties) {
    assert.ok(questions.some(question => question.type === type && question.difficulty === difficulty), type + " spans " + difficulty);
  }
}
unique(questions.map(question => question.q), "Unique question stems");
unique(questions.map(question => question.q.replace(/[^a-z0-9\s_]/gi, "")), "No punctuation-only question duplicates");
unique(questions.map(question => question.entryId), "200 different target entries, not repeated word permutations");
unique(questions.map(question => question.why), "Individual educational explanations");
const answerPositions = [0, 0, 0, 0];
for (const question of questions) {
  fields(question, ["id", "entryId", "type", "topicId", "difficulty", "q", "options", "answer", "why"], question.id);
  assert.ok(Object.hasOwn(expectedTargets, question.type), question.id + " supported type");
  assert.match(question.id, new RegExp("^vocabulary-" + question.type + "-\\d{3}$"));
  const entry = byId.get(question.entryId);
  assert.ok(entry, question.id + " links to a known entry");
  assert.equal(question.difficulty, entry.difficulty, question.id + " difficulty matches its word");
  assert.equal(question.topicId, question.type === "cloze" ? "context" : "synonyms", question.id + " existing topic ID");
  text(question.q, 55, question.id + " contextual prompt");
  assert.ok(Array.isArray(question.options), question.id + " choices are an array");
  assert.equal(question.options.length, 4, question.id + " four choices");
  question.options.forEach(option => text(option, 2, question.id + " option"));
  unique(question.options, question.id + " distinct choices");
  assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, question.id + " zero-based answer");
  const answer = question.options[question.answer];
  assert.equal(answer, question.type === "cloze" ? entry.word : entry[question.type], question.id + " reviewed answer key");
  assert.ok(!containsWord(question.q, answer), question.id + " does not leak its answer in the prompt");
  text(question.why, 70, question.id + " educational explanation");
  assert.ok(question.why.split(/\s+/).length >= 12, question.id + " explains rather than merely naming the answer");
  assert.ok(question.why.split(/[.!?]\s+/).length >= 2, question.id + " explains the meaning and the choice");
  assert.ok(containsWord(question.why, answer), question.id + " explanation identifies its answer");
  assert.notEqual(normalise(question.why), normalise(entry.definition), question.id + " explanation addresses this question");
  if (question.type === "cloze") {
    blank(question.q, question.id);
    assert.notEqual(normalise(question.q.replace("____", entry.word)), normalise(entry.example), question.id + " new context, not a blanked reference example");
    for (const relative of entry.family) {
      assert.ok(!containsWord(question.q, relative), question.id + " does not give a related spelling as a clue");
    }
  } else {
    assert.doesNotMatch(question.q, /_/, question.id + " no cloze in relation questions");
    assert.ok(containsWord(question.q, entry.word), question.id + " identifies the word being compared");
  }
  answerPositions[question.answer]++;
}
assert.deepEqual(answerPositions, [50, 50, 50, 50], "No preferred answer position");

// Sense-sensitive cases are pinned as well as schema: these are not interchangeable meanings.
for (const [word, partOfSpeech, synonym, antonym, clue] of [
  ["decline", "verb", "reject", "accept", "invitation"],
  ["gloomy", "adjective", "dim", "bright", "Dark"],
  ["patient", "adjective", "tolerant", "impatient", "wait"],
  ["private", "adjective", "personal", "public", "limited"],
  ["shallow", "adjective", "not deep", "deep", "bottom"],
  ["balance", "noun", "steadiness", "imbalance", "tip"],
  ["awkward", "adjective", "clumsy", "graceful", "movement"],
  ["blunt", "adjective", "dull", "sharp", "edge"],
  ["efficient", "adjective", "economical", "wasteful", "wasting"],
  ["elaborate", "adjective", "intricate", "simple", "details"],
  ["ignorant", "adjective", "uninformed", "knowledgeable", "particular"],
  ["obscure", "adjective", "little-known", "famous", "Known"],
  ["plausible", "adjective", "credible", "implausible", "Seeming"],
  ["solitary", "adjective", "lone", "accompanied", "Alone"],
  ["yield", "verb", "surrender", "resist", "give way"],
  ["absorb", "verb", "soak up", "release", "liquid"],
  ["abrasive", "adjective", "harsh", "courteous", "Rude"],
  ["austere", "adjective", "plain", "ornate", "decoration"],
  ["complacent", "adjective", "self-satisfied", "vigilant", "overlook"],
  ["concise", "adjective", "brief", "wordy", "clearly"],
  ["deliberate", "adjective", "intentional", "accidental", "intentionally"],
  ["dismiss", "verb", "reject", "consider", "idea"],
  ["dissuade", "verb", "deter", "persuade", "not"],
  ["dubious", "adjective", "doubtful", "certain", "Feeling"],
  ["explicit", "adjective", "clear", "implicit", "hinted"],
  ["formidable", "adjective", "daunting", "unimpressive", "daunted"],
  ["frivolous", "adjective", "light-hearted", "serious", "seriously"],
  ["nonchalant", "adjective", "casual", "anxious", "Appearing"],
  ["opaque", "adjective", "non-transparent", "transparent", "see through"],
  ["refute", "verb", "disprove", "confirm", "evidence"],
  ["superficial", "adjective", "shallow", "thorough", "surface"],
  ["vindicate", "verb", "clear", "incriminate", "wrongly blamed"]
]) {
  const entry = entries.find(record => record.word === word);
  assert.deepEqual([entry.partOfSpeech, entry.synonym, entry.antonym], [partOfSpeech, synonym, antonym], word + " reviewed sense");
  assert.ok(entry.definition.includes(clue), word + " definition keeps the intended sense");
}

// Independently transcribed from the linked DfE PDF, page 23, checked 2026-10-31.
const statutoryList = [
  "accommodate", "accompany", "according", "achieve", "aggressive", "amateur",
  "ancient", "apparent", "appreciate", "attached", "available", "average",
  "awkward", "bargain", "bruise", "category", "cemetery", "committee",
  "communicate", "community", "competition", "conscience*", "conscious*",
  "controversy", "convenience", "correspond", "criticise (critic + ise)",
  "curiosity", "definite", "desperate", "determined", "develop", "dictionary",
  "disastrous", "embarrass", "environment", "equip (\u2013ped, \u2013ment)",
  "especially", "exaggerate", "excellent", "existence", "explanation", "familiar",
  "foreign", "forty", "frequently", "government", "guarantee", "harass", "hindrance",
  "identity", "immediate(ly)", "individual", "interfere", "interrupt", "language",
  "leisure", "lightning", "marvellous", "mischievous", "muscle", "necessary",
  "neighbour", "nuisance", "occupy", "occur", "opportunity", "parliament",
  "persuade", "physical", "prejudice", "privilege", "profession", "programme",
  "pronunciation", "queue", "recognise", "recommend", "relevant", "restaurant",
  "rhyme", "rhythm", "sacrifice", "secretary", "shoulder", "signature", "sincere(ly)",
  "soldier", "stomach", "sufficient", "suggest", "symbol", "system", "temperature",
  "thorough", "twelfth", "variety", "vegetable", "vehicle", "yacht"
];
const alternatives = {
  "equip (\u2013ped, \u2013ment)": ["equip", "equipped", "equipment"],
  "immediate(ly)": ["immediate", "immediately"],
  "sincere(ly)": ["sincere", "sincerely"]
};
const expectedSpellings = statutoryList.flatMap(item => {
  if (Object.hasOwn(alternatives, item)) return alternatives[item];
  if (item === "criticise (critic + ise)") return ["criticise"];
  return [item.replace(/\*$/, "")];
});
assert.equal(statutoryList.length, 100);
assert.equal(expectedSpellings.length, 104);
assert.deepEqual(sources.statutoryList, statutoryList, "Exact statutory list including printed annotations");
assert.deepEqual(sources.alternatives, alternatives, "Parenthesised forms explicitly preserved");
const spellingById = new Map(spellings.map(spelling => [spelling.id, spelling]));
expectedSpellings.forEach((word, index) => {
  assert.equal(spellingById.get("spelling-" + key(index + 1))?.word, word, "Stable statutory spelling " + word);
});
assert.deepEqual(spellings.map(spelling => spelling.word).sort(), [...expectedSpellings].sort(), "Complete statutory membership, no invented additions");
unique(spellings.map(spelling => spelling.word), "Distinct expanded spelling forms");
unique(spellings.map(spelling => spelling.sentence), "Distinct spelling contexts");
unique(spellings.map(spelling => spelling.clue), "Distinct meaning cues");
for (const spelling of spellings) {
  fields(spelling, ["id", "word", "sentence", "clue"], spelling.id);
  assert.match(spelling.id, /^spelling-\d{3}$/);
  assert.match(spelling.word, /^[a-z]+$/, spelling.id + " answer is an actual spelling, not a parenthesised label");
  text(spelling.sentence, 30, spelling.id + " original sentence");
  text(spelling.clue, 12, spelling.id + " meaning cue");
  blank(spelling.sentence, spelling.id);
  assert.ok(!containsWord(spelling.sentence + " " + spelling.clue, spelling.word), spelling.id + " no answer leakage");
  for (const forms of Object.values(alternatives)) {
    if (forms.includes(spelling.word)) {
      for (const form of forms) {
        assert.ok(!containsWord(spelling.sentence + " " + spelling.clue, form), spelling.id + " no related-form leakage");
      }
    }
  }
  assert.doesNotMatch(spelling.clue, /(?:spell(?:ed|ing)?|letters?|starts? with|ends? with)\b/i, spelling.id + " clue teaches meaning, not letter order");
}

const officialURL = "https://assets.publishing.service.gov.uk/media/5a7ccc06ed915d63cc65ce61/English_Appendix_1_-_Spelling.pdf";
assert.equal(sources.url, officialURL, "Verified direct official document");
assert.equal(sources.publicationUrl, "https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study");
assert.equal(sources.title, "English Appendix 1: Spelling");
assert.equal(sources.section, "Word list \u2013 years 5 and 6");
assert.equal(sources.page, 23);
assert.equal(sources.publisher, "Department for Education");
assert.equal(sources.checkedDate, "2026-10-31");
assert.equal(sources.copyright, "Crown copyright 2013");
assert.equal(sources.licence, "Contains public sector information licensed under the Open Government Licence v3.0.");
assert.equal(sources.licenceUrl, "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/");
assert.match(sources.scope, /Only the statutory spelling list/);
assert.match(sources.scope, /original Brightlane practice/);
assert.match(sources.scope, /not official/);
assert.match(sources.notes, /100 printed entries yield 104/);

const examplesAndExercises = [
  ...entries.map(entry => entry.example),
  ...questions.map(question => question.type === "cloze" ? question.q.replace("____", question.options[question.answer]) : question.q),
  ...spellings.map(spelling => spelling.sentence.replace("____", spelling.word))
];
unique(examplesAndExercises, "No reused examples or exercises across the bank");
assert.doesNotMatch(JSON.stringify({ entries, questions, spellings }), /https?:\/\/|www\./, "Educational records are self-contained offline text");
assert.doesNotMatch(JSON.stringify({ entries, questions, spellings }), /\b(?:color|colorful|favorite|neighbor|organize|organized|behavior|center|recognize|criticize|marvelous)\b/, "British English spellings");
// Ignore quoted prose such as "each document." when checking executable code.
const executable = runtime.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");
assert.doesNotMatch(executable, /\b(?:fetch|require|import|setTimeout|setInterval|eval|Function)\s*\(|\b(?:XMLHttpRequest|WebSocket|EventSource)\b|\b(?:document|navigator|localStorage)\s*(?:\.|\[)|\bexport\s|@import|\bMath\.random\s*\(/, "No runtime imports, I/O, network, storage or dynamic code");

console.log("PASS: 300 stable vocabulary entries across three levels; 100 cloze, 50 synonym and 50 antonym questions; 104 original spelling exercises covering all 100 DfE entries and alternatives; fixed answer keys, unique contexts, no answer leakage, OGL provenance and standalone offline loading.");
