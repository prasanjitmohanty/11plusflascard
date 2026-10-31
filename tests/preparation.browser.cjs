const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const artifacts = process.env.ARTIFACTS_DIR;
const url = pathToFileURL(path.resolve(process.env.SITE_ROOT || path.resolve(__dirname, ".."), "index.html")).href;
async function run() {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ offline: true, viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    const page = await context.newPage();
    const errors = [], network = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("request", request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
    await page.clock.install({ time: new Date("2026-11-01T10:00:00Z") });
    await page.goto(url + "#dashboard");
    const bank = await page.evaluate(() => window.BRIGHTLANE_PROGRESS.questions);
    async function route(hash) {
      await page.evaluate(hash => { location.hash = hash; }, hash);
      await page.waitForTimeout(30);
    }
    const stored = () => page.evaluate(() => JSON.parse(localStorage.getItem("brightlane-progress-v1")));
    async function current() {
      const text = await page.locator("#test-form legend").textContent();
      return bank.find(q => q.q === text);
    }
    async function submit() {
      await page.locator("#test-submit").click();
      await page.locator("#test-confirm-submit").click();
    }
    assert.match(await page.locator("#main").textContent(), /No recorded answer evidence/);
    assert.equal(await page.locator("#revise-mistakes").isDisabled(), true);
    await route("#planner");
    for (const invalid of ["2027-02-29", "2027-02-30", "2027-04-31", "2028-01-01", "2027-1-2", "bad"]) {
      await page.locator("#planner-date").fill(invalid);
      await page.locator("#planner-form button").click();
      assert.match(await page.locator("#planner-status").textContent(), /real exam date/);
    }
    await page.locator("#planner-date").fill("2027-09-04");
    await page.locator("#planner-sessions").fill("8");
    await page.locator("#planner-form button").click();
    assert.match(await page.locator("#planner-status").textContent(), /1 to 7/);
    await page.locator("#planner-sessions").fill("4");
    await page.locator("#planner-form button").click();
    assert.match(await page.locator("#planner-status").textContent(), /saved/);
    await page.locator('[data-check="guidance"]').check();
    await page.locator('[data-topic="fractions"]').check();
    await page.reload();
    assert.equal(await page.locator("#planner-date").inputValue(), "2027-09-04");
    assert.equal(await page.locator('[data-topic="fractions"]').isChecked(), true);
    assert.equal(await page.locator('[data-check="guidance"]').isChecked(), true);
    await route("#flashcards");
    await page.locator("#card-reveal").click();
    await page.locator("#card-again").click();
    await page.reload();
    assert.match(await page.locator("#card-status").textContent(), /Saved assessment: practise again/);
    await page.locator("#cards-again-only").check();
    assert.match(await page.locator(".card-study-bar").textContent(), /of 1/);
    await route("#tests");
    await page.locator("#test-timing").selectOption("900");
    await page.locator('.start-test[data-mode="maths"]').click();
    assert.match(await page.locator("#test-clock").textContent(), /15:00|14:59/);
    const first = await current();
    await page.locator(`input[value="${first.answer}"]`).check();
    await page.locator("#test-next").click();
    const second = await current();
    await page.locator(`input[value="${(second.answer + 1) % 4}"]`).check();
    await page.locator("#test-submit").click();
    await page.clock.fastForward(901000);
    assert.match(await page.locator("#test-score").textContent(), /1 \/ 20.*5%/);
    assert.match(await page.locator("#test-score-breakdown").textContent(), /1 correct.*1 incorrect.*18 unanswered/);
    assert.match(await page.locator("#main").textContent(), /TIME EXPIRED/);
    assert.equal((await stored()).attempts.length, 1);
    await page.reload();
    assert.equal(await page.locator(".start-test").count(), 3);
    await route("#dashboard");
    assert.equal(await page.locator(".open-result").count(), 1);
    assert.equal(await page.locator("#revise-mistakes").isDisabled(), false);
    await page.locator(".open-result").click();
    assert.match(await page.locator("#test-score").textContent(), /1 \/ 20/);
    await route("#dashboard"); await route("#tests");
    assert.equal((await stored()).attempts.length, 1, "Review does not double-record");
    await page.locator("#test-revise").click();
    assert.equal(await page.locator(".question-jump").count(), 19);
    for (let i = 0; i < 19; i++) {
      const q = await current();
      await page.locator(`input[value="${q.answer}"]`).check();
      if (i < 18) await page.locator("#test-next").click();
    }
    await submit();
    assert.match(await page.locator("#test-score").textContent(), /19 \/ 19.*100%/);
    await route("#dashboard");
    assert.equal(await page.locator("#revise-mistakes").isDisabled(), true, "Later correct revision removes mistakes");
    assert.equal((await stored()).attempts.length, 2);
    await page.locator("#revise-cards").click();
    assert.match(await page.locator(".card-study-bar").textContent(), /of 1/);
    await page.locator("#card-reveal").click(); await page.locator("#card-known").click();
    await route("#dashboard");
    assert.equal(await page.locator("#revise-cards").isDisabled(), true);
    // Extended modes are still balanced/unique, with actual blank scoring.
    await route("#tests");
    if (await page.locator("#test-new").count()) await page.locator("#test-new").click();
    for (const [mode, count] of [["maths", 36], ["english", 24], ["mixed", 40]]) {
      await page.locator("#test-length").selectOption("extended");
      await page.locator(`.start-test[data-mode="${mode}"]`).click();
      assert.equal(await page.locator(".question-jump").count(), count);
      const subjects = [];
      const seen = new Set();
      for (let i = 0; i < count; i++) {
        await page.locator(`.question-jump[data-index="${i}"]`).click();
        const q = await current(); assert.ok(!seen.has(q.id)); seen.add(q.id);
        subjects.push(q.topic.subject);
      }
      if (mode === "mixed") { assert.equal(subjects.filter(s => s === "maths").length, 20); assert.equal(subjects.filter(s => s === "english").length, 20); }
      await submit();
      assert.match(await page.locator("#test-score-breakdown").textContent(), new RegExp(count + " unanswered"));
      await page.locator("#test-new").click();
    }
    // Timer continues on other routes, expires once, and cancels on reset.
    await page.locator("#test-timing").selectOption("900");
    await page.locator('.start-test[data-mode="english"]').click();
    await route("#home");
    await page.clock.fastForward(901000);
    assert.match(await page.locator("#global-notice").textContent(), /timed test has ended/);
    const resultsAfterExpiry = (await stored()).attempts.length;
    await page.clock.fastForward(901000);
    assert.equal((await stored()).attempts.length, resultsAfterExpiry);
    await route("#dashboard");
    if (artifacts) await page.screenshot({ path: path.join(artifacts, "brightlane-toolkit.png"), fullPage: true });
    // Export/import validates before confirmation; round trip retains all fields.
    const backup = await stored();
    const downloadEvent = page.waitForEvent("download");
    await page.locator("#export-progress").click();
    const download = await downloadEvent;
    const exported = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
    assert.deepEqual(exported, backup);
    async function importPayload(payload) {
      await page.locator("#import-progress").setInputFiles({ name: "progress.json", mimeType: "application/json", buffer: Buffer.from(typeof payload === "string" ? payload : JSON.stringify(payload)) });
    }
    for (const bad of ["{broken", { ...backup, version: 99 }, { ...backup, studied: ["unknown"] }, { ...backup, planner: { ...backup.planner, examDate: "2027-02-30" } }, { ...backup, cardRatings: { "card-999": "known" } }]) {
      await importPayload(bad);
      await page.getByText(/Import failed:/).waitFor();
      assert.deepEqual(await stored(), backup);
      assert.equal(await page.locator("#backup-yes").count(), 0);
    }
    await page.locator("#import-progress").setInputFiles({ name: "big.json", mimeType: "application/json", buffer: Buffer.alloc(1024 * 1024 + 1, 32) });
    await page.getByText(/1 MB size limit/).waitFor();
    await importPayload(backup);
    await page.locator("#backup-no").click();
    assert.deepEqual(await stored(), backup);
    await page.locator("#dashboard-reset").click();
    await page.locator("#backup-no").click();
    assert.deepEqual(await stored(), backup);
    await page.locator("#dashboard-reset").click(); await page.locator("#backup-yes").click();
    assert.equal((await stored()).attempts.length, 0);
    assert.equal(Object.keys((await stored()).cardRatings).length, 0);
    await importPayload(backup);
    await page.locator("#backup-yes").click();
    assert.deepEqual(await stored(), backup);
    await page.reload();
    assert.equal(await page.locator(".open-result").count(), backup.attempts.length);
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const hash of ["#home", "#dashboard", "#planner", "#tests", "#flashcards"]) {
        await route(hash);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), width + " " + hash + " overflow");
      }
    }
    await route("#tests");
    await page.locator("#test-timing").selectOption("900"); await page.locator('.start-test[data-mode="mixed"]').click();
    await route("#dashboard"); await page.locator("#dashboard-reset").click(); await page.locator("#backup-yes").click();
    await page.clock.fastForward(901000);
    assert.equal((await stored()).attempts.length, 0, "Reset cancels active timer");
    // Past exam date uses passed wording, never an invented future timetable.
    await page.clock.setFixedTime(new Date("2027-03-01T10:00:00Z"));
    await route("#planner");
    await page.locator("#planner-date").fill("2027-01-01"); await page.locator("#planner-form button").click();
    assert.match(await page.locator("#main").textContent(), /date has passed/);
    await page.locator("#planner-date").fill("2027-03-01"); await page.locator("#planner-form button").click();
    assert.match(await page.locator("#main").textContent(), /exam date is today/);
    assert.doesNotMatch(await page.locator("#main").textContent(), /topics per week/);
    assert.deepEqual(errors, []); assert.deepEqual(network, []);
    const blockedContext = await browser.newContext({ offline: true, acceptDownloads: true });
    await blockedContext.addInitScript(() => Object.defineProperty(window, "localStorage", { get() { throw new Error("blocked"); } }));
    const blocked = await blockedContext.newPage();
    await blocked.goto(url + "#dashboard");
    assert.match(await blocked.locator("#main").textContent(), /Storage is unavailable/);
    const blockedDownloadEvent = blocked.waitForEvent("download");
    await blocked.locator("#export-progress").click();
    assert.ok(await (await blockedDownloadEvent).path(), "Visit-only data can be backed up");
    console.log("PASS: optional timer expiry on confirmation/other page, no double submission, extended subject/mixed modes, persistent result review/weaknesses, targeted correction, saved card ratings, planner valid/invalid/past dates, export/import roundtrip and strict errors/cancel/reset, storage-unavailable export, responsive toolkit and offline networking; no page errors.");
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
