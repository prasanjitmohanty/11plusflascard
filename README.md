# Brightlane — offline UK 11+ study

A standalone, responsive Maths and English study website. **30 lessons, 30 worked
examples and 90 multiple-choice questions**, each with an answer and explanation.
All passages and questions are original. There are no accounts, adverts, runtime
dependencies, external fonts, analytics or network requests.

## Open offline

1. Download and extract the complete website ZIP, or copy this repository folder.
2. Open **index.html** in a modern browser (Chrome, Edge, Firefox or Safari).
3. Keep `index.html`, `styles.css`, `topics.js` and `app.js` together. No installation,
   server, internet connection or service worker is required.

Lessons, search, topic quizzes and mixed practice work directly using `file://`.
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

Edit `topics.js` for lesson content and the question bank; `app.js` controls
navigation, search, practice and progress; `styles.css` includes responsive,
reduced-motion and print styles. All scripts are classic deferred scripts.
Preserve local relative asset paths and avoid `fetch`, module imports or remote
resources so the direct-file route remains functional.

Check content structure, answer keys and absence of remote runtime resources:

```sh
node tests/content.test.cjs
```

For optional browser regression checks, install Playwright in your development
environment and run `node tests/browser.test.cjs`. It exercises the site through
`file://` with networking disabled, including all answer flows and responsive
routes. `PLAYWRIGHT_MODULE` may point to an existing Playwright installation;
`ARTIFACTS_DIR` may name an existing output folder for screenshots. Neither test
tool nor Node.js is required to use the website.
