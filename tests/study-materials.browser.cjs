const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const artifacts = process.env.ARTIFACTS_DIR;
const url = pathToFileURL(path.resolve(process.env.SITE_ROOT || path.resolve(__dirname, ".."), "index.html")).href;
async function run() {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ offline: true, viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [], external = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => { if (/^https?:/.test(request.url())) external.push(request.url()); });
    await page.goto(url + "#materials");
    assert.equal(await page.locator("#revision-topic option").count(), 30);
    assert.equal(await page.locator("#reference-section > .reference-grid").count(), 2);
    assert.equal(await page.locator("#reference-section > .reference-grid").nth(0).locator(".reference-card").count(), 18);
    assert.equal(await page.locator("#reference-section > .reference-grid").nth(1).locator(".reference-card").count(), 12);
    assert.equal(await page.locator("#strategy-section .writing-card").count(), 6, "All six worked strategy lessons are reachable");
    for (const lesson of await page.locator("#strategy-section .writing-card").all()) {
      assert.match(await lesson.textContent(), /Worked example/);
      assert.match(await lesson.textContent(), /Final answer:/);
      assert.ok(await lesson.locator("ol").count() >= 2, "Strategy and worked-example steps are displayed");
    }
    await page.locator("#revision-topic").selectOption("fractions");
    assert.match(await page.locator("#revision-sheet").textContent(), /Fraction/);
    assert.match(await page.locator("#revision-sheet").textContent(), /common denominator/i);
    await page.locator('[data-material-target="reading-section"]').click();
    assert.equal(await page.locator("#reading-section .reading-card").count(), 7);
    assert.equal(await page.locator("#reading-section .reading-card details[open]").count(), 0, "Passages start collapsed and can be expanded");
    await page.locator("#reading-section .reading-card details summary").first().click();
    assert.ok((await page.locator("#reading-section .reading-card details").first().textContent()).split(/\s+/).length > 120);
    if (artifacts) await page.screenshot({ path: path.join(artifacts, "brightlane-study-materials.png") });
    const data = await page.evaluate(() => window.BRIGHTLANE_STUDY_MATERIALS);
    for (const reading of data.readings) {
      await page.locator(`.start-reading[data-reading="${reading.id}"]`).click();
      const panel = page.locator("#quiz-" + reading.id);
      for (let i = 0; i < reading.questions.length; i++) {
        await panel.locator(`input[value="${reading.questions[i].answer}"]`).check();
        await panel.locator("#check-answer").click();
        assert.match(await panel.locator("#answer-feedback").textContent(), /That's right/);
        await panel.locator("#next-question").click();
      }
      assert.match(await panel.textContent(), /You got 4 of 4 correct/);
      assert.equal((await page.evaluate(() => JSON.parse(localStorage.getItem("brightlane-progress-v1")).attempts.at(-1).questionIds)).length, 4);
    }
    const englishLab = await page.evaluate(() => window.BRIGHTLANE_ENGLISH_LAB);
    for (const reading of englishLab.passages) {
      const card = page.locator("#reading-section .reading-card").filter({ hasText: reading.title });
      await card.locator("details summary").click();
      const firstEvidence = reading.questions[0].evidenceIds[0];
      const sourceTarget = card.locator(`[data-evidence-target="${firstEvidence}"]`).first();
      assert.ok((await sourceTarget.getAttribute("aria-label")).includes(reading.segments.find(segment => segment.id === firstEvidence).text), "Accessible name preserves the source text");
      await sourceTarget.click();
      assert.equal(await sourceTarget.getAttribute("aria-pressed"), "true", "Evidence segment is highlightable from the passage");
      await card.locator(`.start-reading[data-reading="english-lab-${reading.id}"]`).click();
      const quizTarget = card.locator(`#quiz-english-lab-${reading.id} [data-evidence-target="${firstEvidence}"]`);
      await quizTarget.click();
      assert.equal(await quizTarget.getAttribute("aria-pressed"), "true", "The matching evidence in the question copy is independently highlightable");
      assert.equal(await sourceTarget.getAttribute("aria-pressed"), "true", "Highlighting a second copy does not alter the original passage copy");
      const poetry = reading.genre === "poetry";
      if (poetry) {
        const paragraphCount = new Set(reading.segments.map(segment => segment.paragraph)).size;
        const source = card.locator("details").first();
        const quizCopy = card.locator(".reading-quiz");
        assert.equal(await source.locator(".poetry-stanza").count(), paragraphCount, "Source passage retains its stanza groups");
        assert.equal(await quizCopy.locator(".poetry-stanza").count(), paragraphCount, "Quiz copy retains its stanza groups");
        assert.ok(await source.locator(".poetry-stanza br").count() > 0, "Source poetry retains line breaks");
        assert.ok(await quizCopy.locator(".poetry-stanza br").count() > 0, "Quiz poetry retains line breaks");
      }
      const questions = reading.questions.filter(question => question.format === "select-one");
      const panel = page.locator("#quiz-english-lab-" + reading.id);
      for (const question of questions) {
        await panel.locator(`input[value="${question.answer}"]`).check();
        await panel.locator("#check-answer").click();
        assert.match(await panel.locator("#answer-feedback").textContent(), /That's right/);
        await panel.locator("#next-question").click();
      }
      assert.match(await panel.textContent(), /You got 4 of 4 correct/);
    }
    assert.equal(await page.locator(".passage-segments [id]").count(), 0, "Stable evidence keys are data attributes, never repeated DOM ids");
    await page.locator("#writing-section h2").scrollIntoViewIfNeeded();
    assert.equal(await page.locator("#stage-two-writing-prompts .writing-card").count(), 30);
    assert.equal(await page.locator("#topic-writing-prompts .writing-card").count(), 6);
    assert.equal(await page.locator("#writing-section [data-writing-draft]").count(), 36);
    assert.equal(await page.locator("#model-paragraphs .writing-card").count(), 6, "All six weaker/improved writing comparisons are visible");
    assert.equal(await page.locator("#language-banks .writing-card").count(), 6, "All six language banks are visible");
    assert.equal(await page.locator("#dialogue-guide .writing-card").count(), 7, "All seven dialogue rules are visible");
    assert.equal(await page.locator("#stage-two-writing-prompts [data-writing-band]").count(), 180, "Every Tiffin/NWSSEE-style prompt has six self-assessment controls");
    assert.equal(await page.locator("#pee-section .pee-passage").count(), 4);
    assert.equal(await page.locator("#pee-section .pee-question").count(), 16, "Every written question from the four segmented passages has a PEE form");
    const pee = page.locator("#pee-section .pee-question").first();
    const peeId = await pee.getAttribute("data-pee-question");
    await pee.locator('[data-reading-field="point"]').fill("The narrator is cautious.");
    await pee.locator('[data-reading-field="evidence"]').fill("A relevant phrase from the passage.");
    await pee.locator('[data-reading-field="explain"]').fill("This detail supports the point because it shows hesitation.");
    await pee.locator("[data-highlight-evidence]").first().click();
    assert.equal(await pee.locator("[data-highlight-evidence]").first().getAttribute("aria-pressed"), "true", "The passage evidence control highlights within its own passage instance");
    const rubric = page.locator("#stage-two-writing-prompts [data-writing-band]").first();
    const rubricPrompt = await rubric.getAttribute("data-writing-band");
    await rubric.selectOption("3");
    const duplicateIds = await page.evaluate(() => {
      const ids = [...document.querySelectorAll("[id]")].map(element => element.id);
      return [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    });
    assert.equal(duplicateIds.length, 0, "Writing and PEE controls have unique DOM IDs: " + duplicateIds.join(", "));
    const savedPromptId = await page.evaluate(() => window.BRIGHTLANE_SUTTON_BANK.stageTwo.writing[0].id);
    await page.locator(`[data-writing-draft="${savedPromptId}"]`).fill("A saved writing draft with an opening, a change and a thoughtful ending.");
    await page.locator('[data-writing-draft="study-writing-001"]').fill("A saved topic writing draft with a clear beginning and ending.");
    await page.reload();
    assert.equal(await page.locator(`[data-writing-draft="${savedPromptId}"]`).inputValue(), "A saved writing draft with an opening, a change and a thoughtful ending.", "Stage 2 writing drafts survive reloads");
    assert.equal(await page.locator('[data-writing-draft="study-writing-001"]').inputValue(), "A saved topic writing draft with a clear beginning and ending.", "The original six writing prompts also save drafts");
    assert.equal(await page.locator(`[data-writing-band="${rubricPrompt}"][data-band-category="content"]`).inputValue(), "3", "Writing self-assessment survives reload");
    assert.equal(await page.locator(`[data-pee-question="${peeId}"] [data-reading-field="point"]`).inputValue(), "The narrator is cautious.", "PEE responses survive reload");
    assert.equal(await page.locator(`[data-pee-question="${peeId}"] [data-reading-field="evidence"]`).inputValue(), "A relevant phrase from the passage.");
    await page.locator("#start-type-practice").click();
    assert.equal(await page.locator("#type-question-quiz").isVisible(), true, "The question-type identifier quiz is reachable");
    assert.equal(await page.locator("#type-question-quiz #answer-form").count(), 1);
    assert.ok(await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem("brightlane-progress-v1"));
      return state.writingBands && state.readingDrafts;
    }), "Rubric and reading draft state are stored in the local progress backup");
    await page.locator("#worksheet-topic").selectOption("punctuation");
    assert.equal(await page.locator("#worksheet-output .worksheet-questions>li").count(), 3);
    assert.match(await page.locator("#worksheet-output").textContent(), /Answer key & explanations/);
    assert.equal(await page.locator("#worksheet-output details").evaluate(el => el.open), false);
    await page.evaluate(() => {
      window.__printCall = null;
      window.print = () => { window.__printCall = { target: document.querySelector("#main>.print-target")?.id, active: document.body.classList.contains("printing-material") }; };
    });
    await page.locator("#print-worksheet").click();
    assert.deepEqual(await page.evaluate(() => window.__printCall), { target: "worksheet-section", active: true });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => { document.body.classList.add("printing-material"); document.getElementById("worksheet-section").classList.add("print-target"); });
    assert.equal(await page.locator("#worksheet-section").evaluate(el => getComputedStyle(el).display), "block");
    assert.equal(await page.locator("#revision-section").evaluate(el => getComputedStyle(el).display), "none");
    assert.equal(await page.locator("#worksheet-output .worksheet-answer-key ol").evaluate(el => getComputedStyle(el).display), "block", "Closed answer key is included in print");
    assert.match(await page.locator("#worksheet-section .worksheet-answer-key").evaluate(el => getComputedStyle(el).breakBefore), /page/);
    await page.evaluate(() => { document.body.classList.remove("printing-material"); document.getElementById("worksheet-section").classList.remove("print-target"); });
    await page.emulateMedia({ media: "screen" });
    for (const width of [320, 375, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "materials page has no horizontal overflow at " + width);
    }
    await page.locator("#print-revision").click();
    assert.equal(await page.evaluate(() => window.__printCall.target), "revision-section");
    await page.locator("#print-reference").click();
    assert.equal(await page.evaluate(() => window.__printCall.target), "reference-section");
    await page.locator("#print-writing").click();
    assert.equal(await page.evaluate(() => window.__printCall.target), "writing-section");
    await page.locator("#print-worksheet").click();
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem("brightlane-progress-v1")));
    assert.equal(state.attempts.length, 7, "All seven long-comprehension sets are saved");
    assert.equal(state.attempts.reduce((sum, attempt) => sum + attempt.questionIds.length, 0), 28);
    assert.equal(await page.evaluate(() => {
      const p = window.BRIGHTLANE_PROGRESS;
      const attempts = JSON.parse(localStorage.getItem("brightlane-progress-v1")).attempts;
      return attempts.filter(attempt => attempt.answers.every((answer, i) => p.byId.get(attempt.questionIds[i]).answer === answer)).length;
    }), 7);
    console.log("PASS: topic revision selection, 30 linked references, seven reading quizzes/28 saved answers, type and PEE practice, passage evidence controls, persistent writing drafts and self-assessment, six model pairs/language banks, seven dialogue guides, 30-topic worksheets, print isolation and separate answer-key page, responsive direct-file offline use and zero external requests/page errors.");
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
