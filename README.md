# Mario Ullrich — academic website

A small, static multi-page personal website (plain HTML/CSS/JS, no build step).
Bilingual (English/German) with a language toggle, a regenerating random
point-set background, MathJax for inline formulas, and a scraping-safe email.

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

## Hosting on GitHub Pages

1. Create a repository. For an address directly under your account, name it
   `mario-ullrich.github.io` (the site is then served at `https://mario-ullrich.github.io/`).
   Any other name also works; the site then lives at
   `https://mario-ullrich.github.io/<repo>/` because all links are relative.
2. Upload all eight `.html` files (and this `README.md`) to the repository root.
3. Settings → Pages → Build and deployment → Source: "Deploy from a branch",
   branch `main`, folder `/ (root)`, then Save.
4. After a minute or two the site is live at the URL shown there.

Serving over `https://` (as GitHub Pages does) is a secure context, so the
clipboard "Copy" button and the language preference (stored in `localStorage`)
work reliably, more so than when opening the files locally via `file://`.

### Custom domain (optional)

To use your own domain, add a file named `CNAME` (no extension) in the
repository root containing only the domain, e.g.

    www.example.org

and point that domain to GitHub Pages at your DNS provider (a CNAME record to
`mario-ullrich.github.io`). Without a custom domain, ignore this entirely.

## Editing notes

- **Photo.** The home hero shows a monogram placeholder. To use a photo, place
  `photo.jpg` in the root and, in `index.html`, replace
  `<div class="mono">MU</div>` with
  `<img src="photo.jpg" alt="Mario Ullrich">`.
- **Language.** English text lives in the HTML; German overrides are in the
  `DE = { … }` dictionary inside the `<script>` block of each page. Every
  translatable element carries a `data-i18n="key"` attribute.
- **Email.** The address never appears in readable form in the source. It is
  stored Base64-encoded in `data-eml` on `a.email` elements and assembled at
  runtime by JavaScript. The Copy button decodes the same attribute on click.
- **Background.** A single fixed layer (`.page-bg`) is filled with random points
  by JavaScript on every page load, so the pattern changes each time.
- **Formulas.** MathJax is loaded from a CDN; inline math uses `\( … \)`.

## License / content

All textual content is about and by Mario Ullrich. Code may be reused freely.
