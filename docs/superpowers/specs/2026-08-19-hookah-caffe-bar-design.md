# Hookah Caffe Bar Design

## Goal

Create a dependency-free, responsive single-page website for a modern hookah caffe bar, using the attached reference image as the primary visual guide.

## Visual Direction

The page follows the reference image's black editorial composition: full-width photographic hero, centered serif headline, thin outlined controls, generous vertical spacing, and alternating image/text sections. The palette stays dark and warm: black, smoke gray, white, amber, copper, and muted green accents from the reference foliage. Typography pairs an elegant display serif for headings with a clean sans-serif for supporting UI and body copy.

## Sections

The site includes:

- Fixed transparent navigation with brand, links, social icons, and a booking button.
- Full-width photographic hero with hookah lounge messaging and a thin outlined call to action.
- Reservation strip with guest count, date, time, and submit button.
- Three-column hours feature: opening hours, central venue image, and happy-hour offer.
- Full-width atmosphere image band.
- Recommendations section with shisha flavors and mocktail pairings beside a cocktail preparation image.
- Three-tile promo/location grid inspired by the reference's promotion/map/promotion row.
- Footer with brand copy, page links, hours, and Instagram-style image thumbnails.

## Behavior

The JavaScript provides mobile menu toggling, smooth anchor scrolling, booking form feedback, scroll-reveal animation, active nav highlighting, and a back-to-top control.

## Technical Constraints

- HTML5, CSS3, and vanilla JavaScript only.
- No frameworks or runtime dependencies.
- Use CSS Grid and Flexbox.
- Responsive for desktop, tablet, and mobile.
- Keep files semantic and easy to inspect.
- Use local image assets derived from the supplied reference image so the site runs offline.

## Verification

A Node smoke test checks the HTML structure, local asset references, and core JavaScript interactions. Manual verification should open `index.html` directly in a browser because the site has no server-side requirements.
