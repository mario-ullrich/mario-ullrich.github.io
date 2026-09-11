# Mario Ullrich — academic website

A small, static multi-page personal website (plain HTML/CSS/JS, no build step).
Bilingual (English/German) with a language toggle, a regenerating random
point-set background, MathJax for inline formulas, and a scraping-safe email.

Live at <https://mario-ullrich.github.io/>, served by GitHub Pages from branch
`main`, folder `/ (root)`. Pushing to `main` publishes; a minute later the change
is online.

## Pages

All pages are flat in the repository root and link to each other with relative
paths, so they must stay together in the same folder:

- `index.html` — home (News + About + Contact, with an "At a glance" card)
- `research.html` — research topics and most important results
- `publications.html` — selected publications, preprints, full list, theses
- `lean.html` — the Lean 4 / Mathlib formalization projects and their entries in
  the Palomar registry
- `cv.html` — appointments, education, awards, grants & funding, talks
- `teaching.html` — teaching, incl. the new "Mathematics for Quantum Science 1–3"
- `service.html` — editorial boards, organization, committees, refereeing
- `press.html` — press and media
- `contact.html` — address and contact

The design and the behaviour are shared, not copied:

- `styles.css` — the whole stylesheet. Rules that apply to one page only sit
  at the bottom, scoped by the class its `<body>` carries (`p-home`,
  `p-research`, `p-pubs`, `p-cv`, `p-lean`, `p-teaching`, `p-service`,
  `p-press`, `p-contact`).
- `site.js` — the language toggle, the fade-in observer, the e-mail
  assembly, the point-set background, the lazy MathJax loader and the visitor
  counter. Each page defines its own `DE` translation table in a short inline
  script directly before loading it.

A change to the shared design is therefore a change in one file.

The full CV as a PDF lives in `docs/`, published alongside the pages.

## Editing notes

- **Preview.** Run `python -m http.server` in this folder and open
  <http://localhost:8000/>. Serving over `http(s)://` rather than opening the
  files via `file://` keeps the clipboard "Copy" button and the language
  preference (stored in `localStorage`) working.
- **Language.** English text lives in the HTML; German overrides are in the
  `DE = { … }` dictionary in the inline script at the foot of each page. Every
  translatable element carries a `data-i18n="key"` attribute. In those German
  strings, quotes and backslashes are escaped: `\"` for a quote, `\\(` for the
  opening MathJax delimiter. A key missing from a `DE` dictionary falls back
  to the English text; `nav.lean` relies on that, the label being a proper name
  that reads the same in both languages.
- **Formulas.** MathJax is loaded from a CDN, but only on pages that actually
  contain `\( … \)`, so math-free pages skip the ~1 MB download. Adding a formula
  to a page changes that.
- **Photo.** The home hero shows the round portrait `2026.jpg`, set in
  `index.html` inside `<div class="portrait hero-portrait">`. To swap it, drop a
  new image in the root and change the `src` there.
- **CV PDF.** `docs/CV-2026-05.pdf` is linked by the "Full CV (PDF)" button in
  the `cv.html` hero, the only place the file name appears. Since the name is
  dated, a newer PDF either keeps it or the `href` there has to be updated.
- **Email.** The address never appears in readable form in the source. It is
  stored Base64-encoded in `data-eml` on `a.email` elements and assembled at
  runtime by JavaScript. The Copy button decodes the same attribute on click.
- **Visitor statistics.** The pages are counted by GoatCounter, loaded at the
  top of `site.js`. The account name sits there in the single constant
  `GOATCOUNTER_CODE`; emptying that string removes the counter from every page.
  The figures are at <https://mario-ullrich.goatcounter.com/>. GoatCounter sets
  no cookies and keeps no personal data, so the site needs no consent banner,
  and its script ignores `localhost`, so a local preview is never counted.
- **The Lean page.** `lean.html` has two repeatable blocks, both meant to be
  copied when something is added.

  A *project* is one `div.feature` inside `#projects`: an `h3` holding the
  project name plus `a.repo` with the repository in brackets, then
  `p.proj-links` with blueprint and dependency-graph links, then the prose
  paragraphs. Its keys are namespaced by project, `lean.snum.*` for the
  s-numbers one, so a second project takes its own prefix.

  A *registered result* is one `div.factcard.result` inside `#registry`, titled
  by the theorem itself (`lean.maxdiff.h`) rather than by a label, followed by
  the rows Entry, Registered and Statements. The row labels `lean.reg.k.*` are
  shared, so a further result reuses them and only needs its own title key and
  values. Take the values from the registry record rather than the entry page,
  which is rendered by JavaScript and arrives empty:
  `https://data.palomar-registry.org/entries/<ID>-v<N>.json`.

- **Publication numbering.** The grouped lists on `publications.html` count
  downwards (`counter-increment: pub -1`), so after adding or removing an entry
  the `counter-reset` value — in the CSS *and* in the inline `style` on the `<ol>`
  — must be the number of entries plus one.
- **News.** The list on `index.html` uses `class="course-list news"`. The `news`
  variant only narrows the left column, which holds a year there, while the press
  page reuses plain `course-list` for its wider source labels.
- **Fading in.** Elements with `class="reveal"` fade in once their top edge
  reaches the viewport, driven by the `IntersectionObserver` at the end of each
  page.
- **Background.** A single fixed layer (`.page-bg`) is filled with random points
  by JavaScript on every page load, so the pattern changes each time.

## License / content

All textual content is about and by Mario Ullrich. Code may be reused freely.
