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
    await page.goto(url + "#flashcards");
    const cards = await page.evaluate(() => window.BRIGHTLANE_FLASHCARDS);
    const topics = await page.evaluate(() => window.BRIGHTLANE_TOPICS);
    async function route(hash) {
      await page.evaluate(hash => { location.hash = hash; }, hash);
      await page.waitForTimeout(30);
    }
    async function current() {
      const text = await page.locator(".recall-card h2").textContent();
      const card = cards.find(card => card.front === text);
      assert.ok(card);
      return card;
    }
    assert.match(await page.locator(".card-study-bar").textContent(), /Card 1 of 60/);
    assert.equal(await page.locator("#card-previous").isDisabled(), true);
    assert.equal(await page.locator("#card-answer").isVisible(), false);
    await page.locator("#card-reveal").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#card-reveal").getAttribute("aria-expanded"), "true");
    assert.equal(await page.locator("#card-answer").isVisible(), true);
    assert.equal(await page.locator("#card-answer p").textContent(), cards[0].back);
    if (artifacts) await page.screenshot({ path: path.join(artifacts, "brightlane-flashcards.png"), fullPage: true });
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#card-answer").isVisible(), false);
    await page.locator("#card-next").click();
    assert.equal((await current()).id, cards[1].id);
    assert.equal(await page.locator("#card-answer").isVisible(), false);
    await page.locator("#card-previous").click();
    assert.equal((await current()).id, cards[0].id);
    await page.locator("#card-reveal").click();
    await page.locator("#card-known").click();
    assert.match(await page.locator("#deck-progress").textContent(), /1 of 60 assessed.*1 known/);
    await page.locator("#card-previous").click();
    await page.locator("#card-reveal").click();
    await page.locator("#card-again").click();
    assert.match(await page.locator("#deck-progress").textContent(), /1 of 60 assessed.*0 known/, "Rating changes, not double counts");
    const visited = new Set([cards[0].id]);
    for (let i = 1; i < 60; i++) {
      const card = await current();
      assert.ok(!visited.has(card.id)); visited.add(card.id);
      assert.equal(await page.locator("#card-answer").isVisible(), false);
      await page.locator("#card-reveal").click();
      assert.equal(await page.locator("#card-answer p").textContent(), card.back);
      await page.locator(i % 3 === 0 ? "#card-again" : "#card-known").click();
    }
    assert.equal(visited.size, 60);
    assert.match(await page.locator(".deck-summary h2").textContent(), /40 known.*20 to practise again/);
    await page.locator("#cards-repeat-missed").click();
    assert.match(await page.locator(".card-study-bar").textContent(), /of 20/);
    const missed = new Set();
    for (let i = 0; i < 20; i++) {
      const card = await current();
      assert.ok(!missed.has(card.id)); missed.add(card.id);
      assert.equal((Number(card.id.slice(5)) - 1) % 3, 0);
      await page.locator("#card-reveal").click();
      await page.locator("#card-known").click();
    }
    assert.match(await page.locator(".deck-summary h2").textContent(), /20 known.*0 to practise again/);
    assert.equal(await page.locator("#cards-repeat-missed").isDisabled(), true);
    await page.locator("#cards-restart").click();
    assert.match(await page.locator(".card-study-bar").textContent(), /of 60/);
    assert.match(await page.locator("#deck-progress").textContent(), /0 of 60 assessed/);
    await page.locator("#card-subject").selectOption("maths");
    assert.match(await page.locator(".card-study-bar").textContent(), /of 36/);
    assert.equal(await page.locator("#card-topic option").count(), 19);
    await page.locator("#card-subject").selectOption("english");
    assert.match(await page.locator(".card-study-bar").textContent(), /of 24/);
    assert.equal(await page.locator("#card-topic option").count(), 13);
    await page.locator("#card-subject").selectOption("all");
    for (const topic of topics) {
      await page.locator("#card-topic").selectOption(topic.id);
      assert.match(await page.locator(".card-study-bar").textContent(), /of 2/);
      assert.equal((await current()).topicId, topic.id);
      await page.locator("#card-next").click();
      assert.equal((await current()).topicId, topic.id);
      assert.equal(await page.locator("#card-next").isDisabled(), true);
      await page.locator("#card-reveal").click();
      assert.equal(await page.locator("#card-answer p").textContent(), (await current()).back);
    }
    await page.locator("#card-topic").selectOption("all");
    const initialOrder = cards.map(card => card.id);
    await page.locator("#card-reveal").click();
    await page.locator("#card-known").click();
    await page.locator("#cards-shuffle").click();
    assert.equal(await page.locator("#card-answer").isVisible(), false);
    assert.match(await page.locator("#deck-progress").textContent(), /1 of 60 assessed.*1 known/);
    const shuffled = [];
    for (let i = 0; i < 60; i++) {
      shuffled.push((await current()).id);
      if (i !== 59) await page.locator("#card-next").click();
    }
    assert.equal(new Set(shuffled).size, 60);
    assert.notDeepEqual(shuffled, initialOrder);
    await page.locator("#card-reveal").click();
    const last = (await current()).id;
    await route("#topic/fractions");
    await page.locator("#mark-studied").click();
    const progress = await page.evaluate(() => localStorage.getItem("brightlane-progress-v1"));
    await route("#tests");
    await page.locator('.start-test[data-mode="maths"]').click();
    await page.locator('input[value="0"]').check();
    await route("#flashcards");
    assert.equal((await current()).id, last);
    assert.equal(await page.locator("#card-answer").isVisible(), true, "Deck and revealed state retained for visit");
    await route("#tests");
    assert.equal(await page.locator('input[value="0"]').isChecked(), true, "Flashcards preserve test attempt");
    await route("#flashcards");
    await page.locator("#card-subject").selectOption("english");
    assert.equal(await page.locator("#card-topic").inputValue(), "all");
    assert.match(await page.locator("#deck-progress").textContent(), /0 of 24 assessed/);
    await page.locator("#card-topic").selectOption("punctuation");
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const topic of topics) {
        await page.locator("#card-subject").selectOption("all");
        await page.locator("#card-topic").selectOption(topic.id);
        for (let i = 0; i < 2; i++) {
          if (i) await page.locator("#card-next").click();
          await page.locator("#card-reveal").click();
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), width + " " + topic.id + " no overflow");
        }
      }
    }
    await page.setViewportSize({ width: 375, height: 850 });
    await page.locator("#card-topic").selectOption("inference");
    await page.locator("#card-reveal").click();
    await page.locator(".recall-card h2").click();
    if (artifacts) await page.screenshot({ path: path.join(artifacts, "brightlane-flashcards-mobile.png"), fullPage: true });
    assert.equal(await page.evaluate(() => localStorage.getItem("brightlane-progress-v1")), progress);
    await page.reload();
    assert.match(await page.locator(".card-study-bar").textContent(), /Card 1 of 60/);
    assert.equal(await page.locator("#card-answer").isVisible(), false);
    assert.match(await page.locator("#deck-progress").textContent(), /0 of 60 assessed/);
    // Exercise the defensive empty-deck branch without shipping empty content.
    await page.evaluate(() => { window.BRIGHTLANE_FLASHCARDS = []; });
    await page.locator("#card-topic").selectOption("fractions");
    assert.match(await page.locator("#flashcard-deck").textContent(), /No cards in this deck/);
    await page.evaluate(cards => { window.BRIGHTLANE_FLASHCARDS = cards; }, cards);
    await page.locator("#cards-show-all").click();
    assert.match(await page.locator(".card-study-bar").textContent(), /of 60/);
    assert.deepEqual(errors, []); assert.deepEqual(network, []);
    console.log("PASS: all 60 cards revealed offline via file://; keyboard reveal/hide; navigation, rating changes, completion, 20-card retry-only deck, all-known/restart, 30 topic and subject filters, shuffle membership/retained ratings, visit-only state, unchanged lesson/test progress, defensive empty deck and 300 responsive revealed-card checks; zero external requests or page errors.");
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
