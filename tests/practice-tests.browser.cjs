const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const artifacts = process.env.ARTIFACTS_DIR;
const url = pathToFileURL(path.resolve(__dirname, "..", "index.html")).href;
async function run() {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ offline: true, viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    const errors = [], network = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
    await page.goto(url + "#tests");
    const bank = await page.evaluate(() => window.BRIGHTLANE_TEST_BANK);
    const topics = await page.evaluate(() => window.BRIGHTLANE_TOPICS);
    const saved = { studied: ["fractions"], scores: { fractions: 2 } };
    await page.evaluate(saved => localStorage.setItem("brightlane-progress-v1", JSON.stringify(saved)), saved);
    await page.reload();
    assert.equal(await page.locator(".start-test").count(), 3);
    if (artifacts) await page.screenshot({ path: path.join(artifacts, "brightlane-tests.png"), fullPage: true });
    async function route(hash) {
      await page.evaluate(hash => { location.hash = hash; }, hash);
      await page.waitForTimeout(30);
    }
    async function jump(index) { await page.locator(`.question-jump[data-index="${index}"]`).click(); }
    async function current() {
      const text = await page.locator("#test-form legend").textContent();
      const q = bank.find(q => q.q === text);
      assert.ok(q, "Test draws only from the separate bank");
      return q;
    }
    async function submit() {
      await page.locator("#test-submit").click();
      assert.equal(await page.locator("#test-confirm-submit").count(), 1);
      await page.locator("#test-confirm-submit").click();
    }
    let reviewed = 0;
    for (const mode of ["maths", "english", "mixed"]) {
      await page.locator(`.start-test[data-mode="${mode}"]`).click();
      assert.equal(await page.locator(".question-jump").count(), 20);
      assert.equal(await page.locator("#test-previous").isDisabled(), true);
      assert.equal(await page.locator(".feedback").count(), 0, "Answers withheld");
      const first = await current();
      await page.locator(`input[value="${(first.answer + 1) % 4}"]`).check();
      await page.locator("#test-next").click();
      await page.locator("#test-previous").click();
      assert.equal(await page.locator(`input[value="${(first.answer + 1) % 4}"]`).isChecked(), true);
      await page.locator("#test-clear").click();
      assert.equal(await page.locator("input:checked").count(), 0);
      assert.match(await page.locator("#test-count").textContent(), /0 of 20/);
      await page.locator(`input[value="${first.answer}"]`).check();
      await route("#topic/fractions");
      await route("#tests");
      assert.equal(await page.locator(`input[value="${first.answer}"]`).isChecked(), true, "Navigation retains attempt");
      await page.locator("#test-submit").click();
      assert.match(await page.locator("h2").textContent(), /19 unanswered/);
      await page.locator("#test-return").click();
      assert.equal(await page.locator('.question-jump[aria-current="step"]').getAttribute("data-index"), "1");
      const seen = new Set(), represented = new Set();
      let maths = 0, english = 0;
      for (let i = 0; i < 20; i++) {
        await jump(i);
        const q = await current();
        assert.ok(!seen.has(q.id), "No repeats in an attempt"); seen.add(q.id);
        represented.add(q.topicId);
        const subject = topics.find(t => t.id === q.topicId).subject;
        if (subject === "maths") maths++; else english++;
        if (mode !== "mixed") assert.equal(subject, mode);
        if (q.passage) assert.equal(await page.locator("#test-question-panel .passage").textContent(), q.passage);
        await page.locator(`input[value="${q.answer}"]`).check();
        assert.equal(await page.locator(".feedback").count(), 0);
      }
      if (mode === "mixed") { assert.equal(maths, 10); assert.equal(english, 10); assert.equal(represented.size, 20); }
      else assert.equal(represented.size, mode === "maths" ? 18 : 12);
      assert.equal(await page.locator("#test-next").isDisabled(), true);
      assert.match(await page.locator("#test-count").textContent(), /20 of 20/);
      await submit();
      assert.match(await page.locator("#test-score").textContent(), /20 \/ 20.*100%/);
      assert.match(await page.locator("#test-score-breakdown").textContent(), /20 correct.*0 incorrect.*0 unanswered/);
      assert.equal(await page.locator(".review-item").count(), 20);
      assert.equal(await page.locator("#test-form").count(), 0, "Submitted answers locked");
      const review = await page.locator(".review-item").allTextContents();
      for (const id of seen) {
        const q = bank.find(q => q.id === id);
        const card = review.find(text => text.includes(q.q));
        assert.ok(card.includes(q.why) && card.includes(q.options[q.answer]), "Complete explained review");
        reviewed++;
      }
      if (mode === "english") {
        if (artifacts) await page.screenshot({ path: path.join(artifacts, "brightlane-test-results.png"), fullPage: false });
        await page.locator(".review-item .text-button").first().click();
        await route("#tests");
        assert.match(await page.locator("#test-score").textContent(), /20 \/ 20/);
      }
      await page.locator("#test-retry").click();
      assert.equal((await current()).id, first.id, "Retry keeps question order");
      assert.match(await page.locator("#test-count").textContent(), /0 of 20/);
      for (let i = 0; i < 20; i++) {
        await jump(i);
        const q = await current();
        if (i >= 5) await page.locator(`input[value="${i < 12 ? q.answer : (q.answer + 1) % 4}"]`).check();
      }
      await page.locator("#test-submit").click();
      assert.match(await page.locator("h2").textContent(), /5 unanswered/);
      await page.locator("#test-confirm-submit").click();
      assert.match(await page.locator("#test-score").textContent(), /7 \/ 20.*35%/);
      assert.match(await page.locator("#test-score-breakdown").textContent(), /7 correct.*8 incorrect.*5 unanswered/);
      assert.equal((await page.locator(".review-item").allTextContents()).filter(text => text.includes("Your answer: Not answered")).length, 5);
      await page.locator("#test-retry").click();
      await submit();
      assert.match(await page.locator("#test-score").textContent(), /0 \/ 20.*0%/);
      assert.match(await page.locator("#test-score-breakdown").textContent(), /0 correct.*0 incorrect.*20 unanswered/);
      await page.locator("#test-new").click();
    }
    assert.equal(reviewed, 60);
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("brightlane-progress-v1")));
    assert.deepEqual(stored.studied, saved.studied, "Tests preserve studied lessons");
    assert.deepEqual(stored.scores, saved.scores, "Tests preserve best lesson scores");
    assert.equal(stored.attempts.length, 9, "Completed tests persist");
    await page.locator('.start-test[data-mode="english"]').click();
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (let i = 0; i < 20; i++) {
        await jump(i);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), width + "px question " + i);
      }
      await page.locator("#test-submit").click();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), width + "px confirmation");
      await page.locator("#test-return").click();
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await jump(0);
    if (artifacts) await page.screenshot({ path: path.join(artifacts, "brightlane-test-question.png"), fullPage: true });
    await submit();
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), width + "px review");
    }
    await page.reload();
    assert.equal(await page.locator(".start-test").count(), 3, "Reload clears visit-only attempt");
    await page.setViewportSize({ width: 375, height: 850 });
    if (artifacts) await page.screenshot({ path: path.join(artifacts, "brightlane-tests-mobile.png"), fullPage: true });
    assert.deepEqual(errors, []); assert.deepEqual(network, []);
    console.log("PASS: all three full-test modes offline via file://; complete correct, mixed wrong/unanswered and all-blank scoring; 60 explained reviews; navigation/change/clear; balanced topic coverage; retry/new tests; visit-only state and preserved lesson progress; 110 responsive question/confirmation/review checks; zero network or page errors.");
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
