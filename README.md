# Botanical Letterpress Wedding Invitations

One React/Vite invitation experience that serves multiple weddings by URL slug.

## Run locally

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open `http://localhost:3000/wedding-invitation/w/demo-wedding`.

## Wedding URLs

- `/w/demo-wedding` — the existing demo invitation
- `/w/rahul-priya` — a second sample invitation using the same design

The root URL redirects to `/w/demo-wedding`.

## Add a wedding

Add a slug-keyed object to `weddings` in [src/utils/content.js](src/utils/content.js). Each configuration supplies the couple, event date/time, venue, story, schedule, and gallery. Future weddings can point `gallery` entries to their own asset paths without duplicating the app.

## GitHub Pages

`public/404.html` redirects direct invitation links back into the app so GitHub Pages can load paths such as `/wedding-invitation/w/rahul-priya`. Keep the existing Vite `base` value aligned with the GitHub repository name.
