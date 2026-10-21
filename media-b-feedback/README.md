# K2 Family Office — Selected media design test site

Separate test URL: https://bangkokailab-glitch.github.io/k2-media-preview/media-b-feedback/
Page index: https://bangkokailab-glitch.github.io/k2-media-preview/media-b-feedback/review/

2026-10-20. This directory preserves the approved B visual baseline without changing the earlier A/B comparison URLs.

## Implemented frontend

- Home: one column, three article cards per desktop row, nine cards per page.
- Five category pages, eighteen sample article pages, keyword search, tag results.
- Company, privacy, terms and general inquiry pages.
- Article layout: desktop body and sidebar; mobile body, category/tag discovery, author and related articles.
- Shared Guide 01 entry below home/category/article content, and shared footer.
- Mobile menu, pagination, article-only search, tag navigation and article contents navigation.
- Inquiry UI: required name/email/message/consent validation and same-page success/failure demonstration. Failure retains entered values. No request or persistence is performed.
- Robots noindex/nofollow/noarchive on every HTML page. This is an accessible public preview URL, not an access-controlled portal.

## Deferred or provisional

Guide 01–03, FAQ and profile are separate work. Their entry points display an explanatory dialog. The service LP destination is also not connected until its final URL is confirmed. MY FAMILY OFFICE LOGIN is display-only.

Article text is sample content for layout and search. Dates are placeholders. Company data and legal copy require confirmation before production. There are no invented contact details, client quotes or formal destination URLs.

WordPress integration, actual mail delivery, production deployment and production content approval are not part of this static preview completion. Do not use this preview form for real inquiries.

## Sources and build

Baseline: approved B comparison design and existing first-view assets. Page rules: media/guide wireframe dated 2026-10-18, media specification dated 2026-10-08, and subsequent approved user edits (nine cards, removal of decorative arrows, logo MEDIA subtitle, ordering label and guide heading vertical ornament).

Run `node media-b-feedback/build.mjs` from the repository root after editing article route data. `routes.json` lists the generated pages. Renderers and interactions live in `assets/app.js`; new page styles live in `assets/pages.css`. The two approved CSS snapshots are scoped to this new directory and retained unchanged except for asset path resolution.

Existing shared media files under `/assets/` and `/designs/assets/` are reused without alteration.

## Validation

2026-10-20: all 31 routes checked at desktop and mobile widths; one main heading, no horizontal overflow, intended guide banner placement and removal of decorative arrows verified. Search, empty results, query escaping, tag results, page navigation, mobile menu, pending-destination dialogs and inquiry demonstration states passed. Independent browser audit found no JavaScript errors, missing contents anchors, broken navigation or asset URLs.

## 2026-10-21 selected combination

Common first view and background video; B beige article region, layout, type and filled button; A night-office Guide photo and black footer. Earlier preview paths remain unchanged. Typography is preserved for subsequent detailed review.
