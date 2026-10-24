# K2 Media — responsive comparison, 2026-10-23

Separate test version of the LINE feedback. The approved/current comparison at `media-review-four-cards-20261023/` is preserved unchanged.

## Layout

- At viewport widths up to and including 1100px, or on coarse-pointer/touch devices (including wide landscape tablets): latest 3 stories, a compact Guide entrance, then 5 categories with 2 stories each (13 visible display slots). Each group alternates the photo left/right. All 13 cards show category, date and headline without excerpts. Surplus desktop cards use `display:none` and are excluded from keyboard navigation.
- Above 1100px on desktop pointing devices: the current six groups of one large and three small cards remain (24 display slots). The large card alternates sides by group. Existing large-card excerpts remain.
- Category navigation stays on one horizontally scrollable row on mobile/tablet; category headings are stronger. Category/date/link text stays at least 15px.
- The existing full-width Guide banner and black footer remain below the feed. The compact middle banner appears only on mobile/tablet and is separate from the bottom banner.

## Background video

- Phone (up to 600px) and desktop retain their current video assets and presentation.
- Tablet: 601–1100px or a coarse-pointer/touch viewport wider than 600px uses a separate 1280×720 video and poster. A 16:9 image window below the header replaces viewport-height cropping.
- Tablet video is rebuilt from the supplied originals: the same 10-photo sequence, about 30 seconds, muted, no audio track, automatic inline playback, subtle movement. The original pre-cropped PC video cannot restore cropped heads through CSS alone.
- Reduced-motion preference uses the static poster. Physical device power-saving/autoplay policies remain platform-dependent.

## Preview boundaries

The existing 20 sample stories are reused. Latest stories also appear in their categories, so display-slot counts are not distinct-story counts. Dates and article bodies are placeholders. No WordPress/date-based feed is connected.

Guide, profile, FAQ, service LP, login and real form delivery are not implemented in this preview. Existing pending-link dialogs explain those destinations. This is a test comparison, not a production launch. No email/LINE operation is part of this revision.

## Paired comparison update — 2026-10-24
The original 18-slot comparison at `media-review-20261023/` now receives the same phone/tablet layout and hero treatment. This version retains the 24-slot desktop alternative. Both can be reviewed on any device without routing visitors to a separate mobile-only URL.

## Guide banner update — 2026-10-25
The compact guide entrance after Latest uses the selected A creative (920×216), including the right chevron. Its full aspect ratio is preserved without cropping or extra text overlays. This remains phone-only, and the client preview keeps navigation disabled. The separate bottom philosophy banner is unchanged.
