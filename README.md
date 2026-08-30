# dhruveshp.com

Personal site of Dhruvesh Patel. Jekyll theme gem: `tma-theme`.

```
bundle install
bundle exec jekyll serve
```

Pushes to `master` deploy to [dhruveshp.com](https://dhruveshp.com) via `.github/workflows/deploy.yml` (also rebuilds weekly so software star counts stay current).

## Edit content

| What | Where |
|------|--------|
| About copy | `index.md` |
| Nav, affiliations, news, talks, mentors, services, software | `_data/*.yml` |
| Mentees | `_data/mentees.yml` (rendered by `mentorship.md`) |
| Publications | `_publications/*.md` — one file per paper |
| Paper landing pages | `_projects/*.md` |
| Blog posts | `_posts/YYYY-MM-DD-title.md` |
| Mentorship / software page copy | `mentorship.md`, `software.md` |

A new publication is a file in `_publications/` with `title`, `authors`, `venue`, `tag`, `year`, `href`, optional `thumbnail`, `links`, and `selected: true` to appear on the About page. Add a `_projects/` page only when the paper needs its own HTML URL.

Thumbnails go in `assets/img/publication_preview/`. The headshot is `assets/img/headshot.jpg`.
