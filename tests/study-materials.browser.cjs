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
    await page.locator("#revision-topic").selectOption("fractions");
    assert.match(await page.locator("#revision-sheet").textContent(), /Fraction/);
    assert.match(await page.locator("#revision-sheet").textContent(), /common denominator/i);
    await page.locator('[data-material-target="reading-section"]').click();
    assert.equal(await page.locator("#reading-section .reading-card").count(), 3);
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
    await page.locator("#writing-section h2").scrollIntoViewIfNeeded();
    assert.equal(await page.locator("#writing-section .writing-card").count(), 6);
    assert.equal(await page.locator("#writing-section .writing-card ul li").count(), 24);
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
    assert.equal(state.attempts.length, 3, "All original long-comprehension sets are saved");
    assert.equal(state.attempts.reduce((sum, attempt) => sum + attempt.questionIds.length, 0), 12);
    assert.equal(await page.evaluate(() => {
      const p = window.BRIGHTLANE_PROGRESS;
      const attempts = JSON.parse(localStorage.getItem("brightlane-progress-v1")).attempts;
      return attempts.filter(attempt => attempt.answers.every((answer, i) => p.byId.get(attempt.questionIds[i]).answer === answer)).length;
    }), 3);
    console.log("PASS: topic revision selection, 30 linked references, all three long reading quizzes/12 saved answers, six writing prompts/rubrics, 30-question worksheet selector, print isolation and separate answer-key page, responsive direct-file offline use and zero external requests/page errors.");
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
