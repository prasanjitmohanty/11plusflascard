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
    await page.goto(url + "#scenarios");
    const scenarioData = await page.evaluate(() => window.BRIGHTLANE_SCENARIOS);
    const questionData = await page.evaluate(() => window.BRIGHTLANE_PROGRESS.questions);
    assert.equal(await page.locator(".scenario-card").count(), 32);
    assert.match(await page.locator("#main").textContent(), /not real past-paper questions from 2017–2026/);
    assert.match(await page.locator("#main").textContent(), /school\/provider requirements and formats vary/i);
    await page.locator("#scenario-subject").selectOption("english");
    assert.equal(await page.locator(".scenario-card").count(), 16);
    await page.locator("#scenario-topic").selectOption("comprehension");
    assert.equal(await page.locator(".scenario-card").count(), 1);
    await page.locator("#scenario-type").selectOption("Comprehension & inference");
    assert.equal(await page.locator(".scenario-card").count(), 1);
    await page.locator("#scenario-subject").selectOption("maths");
    assert.equal(await page.locator("#scenario-topic").inputValue(), "all", "Incompatible topic selection resets when changing subject");
    assert.equal(await page.locator(".scenario-card").count(), 0, "Other filters still apply after the subject changes");
    await page.locator("#scenario-type").selectOption("all");
    assert.equal(await page.locator(".scenario-card").count(), 16);
    await page.locator("#scenario-subject").selectOption("all");
    assert.equal(await page.locator(".scenario-card").count(), 32);
    if (artifacts) await page.screenshot({ path: path.join(artifacts, "brightlane-scenarios.png") });

    const firstScenario = scenarioData.find(scenario => scenario.id === "fair-badges");
    await page.locator('.start-scenario[data-scenario="fair-badges"]').click();
    const firstPanel = page.locator("#quiz-scenario-fair-badges");
    assert.match(await firstPanel.locator(".scenario-context").textContent(), /30 badges/);
    const firstQuestion = firstScenario.questions[0];
    await firstPanel.locator(`input[value="${(firstQuestion.answer + 1) % 4}"]`).check();
    await firstPanel.locator("#check-answer").click();
    assert.match(await firstPanel.locator("#answer-feedback").textContent(), /Not quite/);
    assert.match(await firstPanel.locator("#answer-feedback").textContent(), /Two fifths of 30 is 12/);
    await firstPanel.locator("#next-question").click();
    const secondQuestion = firstScenario.questions[1];
    await firstPanel.locator(`input[value="${secondQuestion.answer}"]`).check();
    await firstPanel.locator("#check-answer").click();
    assert.match(await firstPanel.locator("#answer-feedback").textContent(), /18 × £1\.20 = £21\.60/);
    await firstPanel.locator("#next-question").click();
    assert.match(await firstPanel.textContent(), /You got 1 of 2 correct/);
    let saved = await page.evaluate(() => JSON.parse(localStorage.getItem("brightlane-progress-v1")));
    assert.equal(saved.attempts.length, 1);
    assert.deepEqual(saved.attempts[0].questionIds, firstScenario.questions.map(question => question.id));
    assert.deepEqual(saved.attempts[0].answers, [(firstQuestion.answer + 1) % 4, secondQuestion.answer]);
    assert.equal(await page.evaluate(() => window.BRIGHTLANE_PROGRESS.evidence(JSON.parse(localStorage.getItem("brightlane-progress-v1"))).find(item => item.topic.id === "fractions").total), 2);
    await page.evaluate(() => { location.hash = "dashboard"; });
    await page.locator(".open-result").first().click();
    assert.match(await page.locator("#test-score").textContent(), /1 \/ 2/);
    assert.match(await page.locator(".test-review").textContent(), /The school fair badge stall/);
    assert.match(await page.locator(".test-review").textContent(), /Two fifths of 30 is 12/);
    assert.match(await page.locator("#main h1").textContent(), /Maths practice results/);
    await page.evaluate(() => { location.hash = "scenarios"; });
    await page.locator("#scenario-subject").waitFor();

    await page.evaluate(() => {
      window.__printCall = null;
      window.print = () => { window.__printCall = { target: document.querySelector("#main>.print-target")?.id, active: document.body.classList.contains("printing-material") }; };
    });
    await page.locator("#print-scenarios").click();
    assert.deepEqual(await page.evaluate(() => window.__printCall), { target: "scenario-workspace", active: true });
    await page.evaluate(() => { document.body.classList.add("printing-material"); document.getElementById("scenario-workspace").classList.add("print-target"); });
    await page.emulateMedia({ media: "print" });
    assert.equal(await page.locator("#scenario-results").evaluate(el => getComputedStyle(el).display), "none");
    assert.equal(await page.locator("#scenario-print-output").evaluate(el => getComputedStyle(el).display), "block");
    assert.equal(await page.locator(".scenario-answer-key ol").first().evaluate(el => getComputedStyle(el).display), "block", "Closed answer key is included in print");
    assert.match(await page.locator(".scenario-answer-key").first().evaluate(el => getComputedStyle(el).breakBefore), /page/);
    await page.evaluate(() => { document.body.classList.remove("printing-material"); document.getElementById("scenario-workspace").classList.remove("print-target"); });
    await page.emulateMedia({ media: "screen" });

    for (const scenario of scenarioData) {
      await page.locator(`.start-scenario[data-scenario="${scenario.id}"]`).click();
      const panel = page.locator("#quiz-scenario-" + scenario.id);
      assert.equal(await panel.locator("input[type=radio]").count(), 4);
      for (let index = 0; index < scenario.questions.length; index++) {
        const question = scenario.questions[index];
        const fullQuestion = questionData.find(item => item.id === question.id);
        assert.ok(fullQuestion, "Registered for progress/backup: " + question.id);
        await panel.locator(`input[value="${question.answer}"]`).check();
        await panel.locator("#check-answer").click();
        assert.match(await panel.locator("#answer-feedback").textContent(), /That's right/);
        assert.ok((await panel.locator("#answer-feedback").textContent()).includes(question.why));
        await panel.locator("#next-question").click();
      }
      assert.match(await panel.locator(".quiz-complete").textContent(), /You got 2 of 2 correct/);
      if (scenario.id === "fair-badges") {
        await panel.locator(".retry-quiz").click();
        assert.match(await panel.locator(".quiz-meta").textContent(), /Question 1 of 2/);
        for (const question of scenario.questions) {
          await panel.locator(`input[value="${question.answer}"]`).check();
          await panel.locator("#check-answer").click();
          await panel.locator("#next-question").click();
        }
        assert.match(await panel.locator(".quiz-complete").textContent(), /You got 2 of 2 correct/);
      }
    }
    saved = await page.evaluate(() => JSON.parse(localStorage.getItem("brightlane-progress-v1")));
    assert.equal(saved.attempts.length, 34, "Repeat attempts and results are saved");
    assert.ok(await page.evaluate(() => window.BRIGHTLANE_PROGRESS.validate(JSON.parse(localStorage.getItem("brightlane-progress-v1")))), "Existing version 2 progress backup accepts scenario answers");
    await page.reload();
    assert.equal(await page.locator(".scenario-card").count(), 32);
    await page.locator("#scenario-subject").selectOption("maths");
    assert.equal(await page.locator(".scenario-card").count(), 16);
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "No horizontal overflow at " + width);
    }
    await page.locator("#scenario-subject").selectOption("all");
    await page.locator(".start-scenario[data-scenario='fair-badges']").click();
    assert.match(await page.locator("#quiz-scenario-fair-badges").textContent(), /The school fair badge stall/);
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    console.log("PASS: direct-file offline scenarios, subject/topic/type filters, contextual explained answers, saved evidence and backup compatibility, retry, scenario review material, isolated print/answer-key page breaks, responsive layouts and zero network requests/page errors.");
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
