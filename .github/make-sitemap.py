#!/usr/bin/env python3
"""Write sitemap.xml, listing every published page with the date it last changed.

The date comes from git: for each file, the date of the commit that last touched
it.  A file with uncommitted changes, or one not yet committed at all, is dated
today, which is when it is about to be committed.  Nothing has to be maintained
by hand; adding a page is enough.

Run it from anywhere:  python .github/make-sitemap.py
"""

import subprocess
import sys
from datetime import date
from pathlib import Path

BASE = "https://mario-ullrich.github.io"

ROOT = Path(__file__).resolve().parent.parent

# Google's site-verification file has to stay exactly as Google wrote it and is
# not a page of the site.
EXCLUDED = {"google1362b60d0ab34f50.html"}

TODAY = date.today().isoformat()


def git(*args: str) -> str:
    """Run a git command inside the repository and return its output."""
    return subprocess.run(
        ["git", *args], cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout.strip()


def last_changed(path: Path) -> str:
    """The date this file last changed, as YYYY-MM-DD."""
    rel = path.relative_to(ROOT).as_posix()
    if git("status", "--porcelain", "--", rel):
        return TODAY
    committed = git("log", "-1", "--format=%cs", "--", rel)
    return committed or TODAY


def location(path: Path) -> str:
    """The canonical address of this file, matching its <link rel="canonical">."""
    rel = path.relative_to(ROOT).as_posix()
    if rel == "index.html":
        return f"{BASE}/"
    return f"{BASE}/{rel}"


def pages() -> list[Path]:
    """Every published file worth listing: the pages, then the CV as a PDF."""
    html = sorted(p for p in ROOT.glob("*.html") if p.name not in EXCLUDED)
    index = [p for p in html if p.name == "index.html"]
    rest = [p for p in html if p.name != "index.html"]
    return index + rest + sorted(ROOT.glob("docs/*.pdf"))


def main() -> None:
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for page in pages():
        lines += [
            "  <url>",
            f"    <loc>{location(page)}</loc>",
            f"    <lastmod>{last_changed(page)}</lastmod>",
            "  </url>",
        ]
    lines.append("</urlset>")

    out = ROOT / "sitemap.xml"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print(f"{out.name}: {len(pages())} entries")


if __name__ == "__main__":
    sys.exit(main())
