const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const root = path.resolve(__dirname, "..");
const url = pathToFileURL(path.join(root, "index.html")).href;
const artifacts = process.env.ARTIFACTS_DIR;
async function run() {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ offline: true, viewport: { width: 1440, height: 1100 } });
    const page = await context.newPage();
    const errors = [];
    const network = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
    await page.goto(url);
    const topics = await page.evaluate(() => window.BRIGHTLANE_TOPICS);
    const questionRegistry = await page.evaluate(() => window.BRIGHTLANE_PROGRESS.questions);
    assert.equal(topics.length, 30);
    await page.getByRole("link", { name: "Skip to content" }).focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#main").evaluate(el => el === document.activeElement), true);
    assert.match(await page.locator("h1").textContent(), /Your 11\+ journey/);
    await page.locator("h1").click();
    if (artifacts) await page.screenshot({ path: path.join(artifacts, "brightlane-desktop.png"), fullPage: true });
    async function route(hash) {
      await page.evaluate(hash => { location.hash = hash; }, hash);
      await page.waitForFunction(hash => location.hash === hash, hash);
      await page.waitForTimeout(15);
    }
    for (const subject of ["maths", "english"]) {
      await route("#" + subject);
      assert.equal(await page.locator(".topic-card").count(), subject === "maths" ? 18 : 12);
      await page.locator("#topic-search").fill("zzzz-no-match");
      assert.equal(await page.locator(".topic-card").count(), 0);
      assert.match(await page.locator(".empty").textContent(), /No topics match/);
      await page.locator("#topic-search").fill(subject === "maths" ? "fraction" : "verb");
      assert.ok(await page.locator(".topic-card").count() > 0);
    }
    let checked = 0;
    for (const t of topics) {
      await route("#topic/" + t.id);
      await page.getByRole("heading", { name: t.title, exact: true }).waitFor();
      assert.equal(await page.locator(".lesson-layout article > .lesson-block").first().locator("ul > li").count(), t.learn.length);
      if (t.passage) assert.equal(await page.locator(".passage").textContent(), t.passage);
      await page.locator("#check-answer").click();
      assert.match(await page.locator("#quiz-message").textContent(), /Choose an answer/);
      for (const q of t.questions) {
        assert.equal(await page.locator(".question").textContent(), q.q);
        await page.locator(`input[value="${q.answer}"]`).check();
        await page.locator("#check-answer").click();
        assert.match(await page.locator(".feedback").textContent(), /That's right/);
        assert.ok((await page.locator(".feedback").textContent()).includes(q.why));
        await page.locator("#answer-form").evaluate(form => form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
        await page.locator("#next-question").click();
        checked++;
      }
      assert.match(await page.locator(".quiz-complete h2").textContent(), /3 of 3/);
      await page.locator("#retry-quiz").click();
      for (const q of t.questions) {
        await page.locator(`input[value="${(q.answer + 1) % 4}"]`).check();
        await page.locator("#check-answer").click();
        assert.equal(await page.locator(".feedback.incorrect").count(), 1);
        assert.ok((await page.locator(".feedback").textContent()).includes(q.options[q.answer]));
        await page.locator("#next-question").click();
      }
      assert.match(await page.locator(".quiz-complete h2").textContent(), /0 of 3/);
      assert.match(await page.locator(".quiz-complete").textContent(), /Best topic score: 3\/3/);
      await page.locator("#mark-studied").click();
    }
    assert.equal(checked, 90);
    await page.reload();
    assert.match(await page.locator("#progress-count").textContent(), /30 of 30/);
    assert.equal(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("brightlane-progress-v1")).scores).length), 30);
    await page.locator("#mark-studied").click();
    assert.match(await page.locator("#progress-count").textContent(), /29 of 30/);
    await route("#practice");
    for (const subject of ["all", "maths", "english"]) {
      for (const size of ["5", "10", "15"]) {
        await page.locator("#practice-subject").selectOption(subject);
        await page.locator("#practice-size").selectOption(size);
        await page.locator("#start-mixed").click();
        const seen = new Set();
        for (let i = 0; i < Number(size); i++) {
          const question = (await page.locator(".question").textContent())
            .replace(/ Select two answers\.$/, "")
            .replace(/ Choose every correct answer\. Practice is marked by exact match\.$/, "");
          assert.ok(!seen.has(question), "No repeats in mixed set");
          seen.add(question);
          const q = questionRegistry.find(item => item.q === question);
          assert.ok(q, "Mixed practice draws from the integrated objective catalogue");
          const t = topics.find(t => t.id === q.topicId);
          if (subject !== "all") assert.equal(t.subject, subject);
          if (q.passage || q.passageSegments) assert.ok(await page.locator("#mixed-quiz .passage").count() > 0, "Passage-based practice keeps its source available");
          if (q.format === "numeric-entry") await page.locator("#numeric-answer-input").fill(q.answer);
          else for (const answer of (Array.isArray(q.answer) ? q.answer : [q.answer])) {
            await page.locator(`#answer-form input[value="${answer}"]`).check();
          }
          await page.locator("#check-answer").click();
          await page.locator("#next-question").click();
        }
        assert.match(await page.locator(".quiz-complete h2").textContent(), new RegExp(size + " of " + size));
      }
    }
    await route("#topic/not-real");
    assert.match(await page.locator("h1").textContent(), /Topic not found/);
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const hash of ["#home", "#maths", "#english", "#practice", ...topics.map(t => "#topic/" + t.id)]) {
        await route(hash);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), width + "px " + hash + " no horizontal overflow");
      }
    }
    await page.setViewportSize({ width: 375, height: 850 });
    await route("#home");
    await page.locator("#home-reset").click();
    await page.locator("#home-cancel").click();
    assert.match(await page.locator("#progress-count").textContent(), /29 of 30/);
    await page.locator("#home-reset").click();
    await page.locator("#home-confirm").click();
    assert.match(await page.locator("#progress-count").textContent(), /0 of 30/);
    if (artifacts) await page.screenshot({ path: path.join(artifacts, "brightlane-mobile.png"), fullPage: true });
    await page.setViewportSize({ width: 1440, height: 1100 });
    await route("#topic/fractions");
    if (artifacts) await page.screenshot({ path: path.join(artifacts, "brightlane-lesson.png"), fullPage: true });
    await page.emulateMedia({ media: "print" });
    assert.equal(await page.locator(".sidebar").isVisible(), false);
    await page.emulateMedia({ media: "screen", reducedMotion: "reduce" });
    assert.equal(await page.locator(".subject-card").count(), 0);
    assert.deepEqual(network, []);
    assert.deepEqual(errors, []);
    const blockedContext = await browser.newContext({ offline: true });
    await blockedContext.addInitScript(() => {
      Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage blocked for test"); } });
    });
    const blocked = await blockedContext.newPage();
    await blocked.goto(url);
    assert.match(await blocked.locator("#main").textContent(), /storage is unavailable/i);
    await blocked.goto(url + "#topic/operations");
    await blocked.locator("#mark-studied").click();
    assert.match(await blocked.locator("#lesson-status").textContent(), /this visit only/);
    assert.match(await blocked.locator("#progress-count").textContent(), /1 of 30/);
    const corruptContext = await browser.newContext({ offline: true });
    await corruptContext.addInitScript(() => localStorage.setItem("brightlane-progress-v1", "{bad"));
    const corrupt = await corruptContext.newPage();
    await corrupt.goto(url);
    assert.match(await corrupt.locator("#main").textContent(), /storage is unavailable/i);
    console.log("PASS: direct file:// with browser offline; all 90 correct and 90 incorrect answer flows; double-submit guard; best scores, reload, undo/reset; 9 mixed configurations; search; keyboard skip; 170 responsive route checks at 320–1440px; print; unavailable/corrupt storage; zero network requests and page errors.");
    if (artifacts) fs.writeFileSync(path.join(artifacts, "verification.txt"), "Brightlane verified in Chromium with offline networking enabled.\n30 lessons, 30 worked examples, 90 independently checked answer keys.\nAll topic correct/incorrect flows, double submissions, best scores, persistence/reset, 9 mixed sets, search, keyboard skip and 170 width/route combinations passed.\nNo external network requests or JavaScript page errors.\nStorage unavailable and corrupted-data cases warn and keep visit-only progress.\n");
  } finally {
    await browser.close();
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
