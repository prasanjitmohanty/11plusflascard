# Brightlane — 2027 preparation edition

This offline UK 11+ Maths and English edition supports preparation for **exams
taken in 2027**. The preparation/exam year is **not a universal school entry
year**. Check each target school's or exam provider's current guidance for
requirements, exam dates and the relevant entry-year timetable.

The edition label does not assert a new official 2027 syllabus, changed exam
format or changed admissions requirements. The original foundation lessons,
practice tests and flashcards are retained; this is not a school-specific
admissions guide or a guarantee of coverage for every exam.

A standalone, responsive Maths and English study website. **30 lessons, 30 worked
examples and 90 lesson-practice questions**, plus **60 separate test questions**
for 20-question Maths, English and mixed practice tests. Every question has an
answer and explanation. **60 separate flashcards** cover all 30 lesson topics.
All passages and questions are original. There are no accounts, adverts, runtime
dependencies, external fonts, analytics or network requests.

## Open offline

1. Download and extract the complete website ZIP, or copy this repository folder.
2. Open **index.html** in a modern browser (Chrome, Edge, Firefox or Safari).
3. Keep `index.html`, `styles.css`, `topics.js`, `test-bank.js`, `flashcards.js` and `app.js` together. No installation,
   server, internet connection or service worker is required.

Lessons, search, topic quizzes, mixed practice, tests and flashcards work directly using `file://`.
JavaScript must be enabled. On mobile, use a browser that supports opening local
HTML folders; a file manager's HTML preview may not run scripts. A desktop browser
is the most reliable direct-file route.

Studied lessons and best topic scores are saved in browser local storage when
available. Direct-file storage behaviour varies by browser and file location.
When storage fails the site displays a warning and retains progress only for the
current visit. Moving the folder, using private browsing or clearing browser data
may remove progress. “Studied” is self-reported, not a mastery assessment.

## Use the site

- Choose Maths or English and browse or search topics.
- Read key ideas, follow the worked example and try the three practice questions.
- Select an answer and choose **Check answer** for an explanation; continue to
  see your result. Topic sets retain the best score.
- Mark a lesson studied when ready. You can undo it or reset all progress.
- Mixed practice draws 5, 10 or 15 shuffled questions from the same bank, optionally
  restricted to one subject. It is untimed, and its score is not retained.
- English mixed questions include their passage in an expandable panel.
- Use the browser's print command to print a lesson; use paper for working.

## Practice tests

Choose **Practice tests** in the navigation or on the overview. There are three
untimed modes: **Maths** (20 questions), **English** (20 questions) and **Mixed**
(10 Maths + 10 English). They draw from a separate original bank of 36 Maths and
24 English questions, not the short-practice bank. Subject tests select at least
one question from each of their lesson topics before adding extras; mixed tests
sample 10 topics in each subject. Question order and selection are shuffled.

Read the instructions before starting. Use paper for working and practise Maths
without a calculator. Use Previous, Next or the question map to skip, return to
or change answers. The map distinguishes answered, unanswered and current
questions; it does not reveal correctness. **Clear answer** removes a choice.

**Review & submit** shows an explicit confirmation, including unanswered question
numbers. Return to fill them in, or submit with them blank. Final submission locks
the answers. Each correct answer earns one mark; wrong and unanswered responses
earn zero with no deductions. Results show the raw score, percentage, correct/
incorrect/unanswered counts, and a complete review with explanations and links
back to relevant lessons. Passages remain available in answer review.

Retry resets all answers for the same questions. Choose a new test to draw
another set; the finite bank means questions may repeat. Navigating to lessons
and back keeps the current test or result **for this visit only**. Reloading or
closing the page clears it. Tests do not change stored lesson progress or short-
practice scores. These are original practice exercises, not official provider
papers, standardised scores or predictions of admission.

## Flashcards

Choose **Flashcards** in the navigation or overview. There are 60 original recall
cards: 36 Maths and 24 English, with two cards for each of the 30 lesson topics.
They use separate prompts from the practice tests, with substantive answers and
explanations. Select both subjects, one subject or a particular topic.

Try recalling the answer before choosing **Reveal answer**. **Hide answer** folds
it away again. After revealing, choose **Know it** or **Practise again** to record
your own judgement and move to the next unassessed card. These choices are not
automatic marking or proof of mastery. Previous/Next let you skip or revisit
cards without rating; revisiting a rated card lets you change its rating.

**Shuffle deck** changes the order and hides the answer while preserving ratings.
After all cards are assessed, the summary offers a round containing only
**Practise again** cards, or **Restart selected deck** for a fresh full round.
If no cards need another round, that button is disabled. Changing subject/topic
starts a fresh deck and clears the old deck's ratings.

Your filters, deck, revealed answer and ratings remain when you visit a lesson
or test and return, **for this visit only**. Reloading or closing the page clears
them. Flashcards do not change saved lesson/quiz progress or test attempts.
All controls work with keyboard focus and Enter/Space; there are no hidden
swipe-only gestures or network requirements.

## Coverage and limits

Maths: number and negative numbers, operations, factors/multiples/primes,
fractions, decimals, percentages, ratio/proportion, algebra, sequences,
measurement/units, time/money, angles, shapes/nets/symmetry,
perimeter/area/volume, coordinates/transformations, data/averages, probability
and multi-step word problems.

English: comprehension, inference, evidence/purpose/viewpoint, vocabulary in
context, synonyms/antonyms, spelling/homophones, word classes,
sentences/clauses/agreement, tenses/voice, punctuation, literary devices/poetry
and writing/planning/editing.

This is broad foundation coverage, **not a claim to cover every school or exam**.
Depth, formats and writing requirements vary by school and exam provider.
Check the target school's current guidance. Verbal and non-verbal reasoning
are not included as separate subjects. Three questions per topic provide an
introduction and check, not an exhaustive exam bank. Writing practice here
teaches planning and editing through examples and objective questions; it does
not automatically grade extended written responses.

## Optional local preview

From the extracted website folder, if Python 3 is installed:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000`. Press Ctrl+C to stop. This is optional and does not
change the direct-file offline capability.

## Development

Edit `topics.js` for lessons and short practice, and `test-bank.js` for the
separate test bank and `flashcards.js` for recall cards; `app.js` controls navigation, search, practice, tests, flashcards and
progress; `styles.css` includes responsive,
reduced-motion and print styles. All scripts are classic deferred scripts.
Preserve local relative asset paths and avoid `fetch`, module imports or remote
resources so the direct-file route remains functional.

Check content structure, answer keys and absence of remote runtime resources:

```sh
node tests/content.test.cjs
node tests/practice-tests.content.cjs
node tests/flashcards.content.cjs
```

For optional browser regression checks, install Playwright in your development
environment and run `node tests/browser.test.cjs`. It exercises the site through
`file://` with networking disabled, including all answer flows and responsive
routes. `PLAYWRIGHT_MODULE` may point to an existing Playwright installation;
`ARTIFACTS_DIR` may name an existing output folder for screenshots. Neither test
tool nor Node.js is required to use the website.
Run `node tests/practice-tests.browser.cjs` with the same optional variables to
check full test navigation, submission, review, unanswered questions, repeats,
offline operation and test layouts.
Run `node tests/flashcards.browser.cjs` with the same optional variables to
check filtering, reveal/hide, navigation, shuffle, self-assessment and deck-end
states through the offline direct-file route.
