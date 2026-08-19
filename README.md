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
- `cv.html` — appointments, education, awards, talks
- `teaching.html` — teaching, incl. the new "Mathematics for Quantum Science 1–3"
- `service.html` — editorial boards, organization, committees, refereeing
- `press.html` — press and media
- `contact.html` — address and contact

Every page carries its own copy of the same stylesheet and the same `<script>`
block, so a change to the shared design has to be repeated in all of them.

## Editing notes

- **Preview.** Run `python -m http.server` in this folder and open
  <http://localhost:8000/>. Serving over `http(s)://` rather than opening the
  files via `file://` keeps the clipboard "Copy" button and the language
  preference (stored in `localStorage`) working.
- **Language.** English text lives in the HTML; German overrides are in the
  `DE = { … }` dictionary inside the `<script>` block of each page. Every
  translatable element carries a `data-i18n="key"` attribute. In those German
  strings, quotes and backslashes are escaped: `\"` for a quote, `\\(` for the
  opening MathJax delimiter.
- **Formulas.** MathJax is loaded from a CDN, but only on pages that actually
  contain `\( … \)`, so math-free pages skip the ~1 MB download. Adding a formula
  to a page changes that.
- **Photo.** The home hero shows the round portrait `2026.jpg`, set in
  `index.html` inside `<div class="portrait hero-portrait">`. To swap it, drop a
  new image in the root and change the `src` there.
- **Email.** The address never appears in readable form in the source. It is
  stored Base64-encoded in `data-eml` on `a.email` elements and assembled at
  runtime by JavaScript. The Copy button decodes the same attribute on click.
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
