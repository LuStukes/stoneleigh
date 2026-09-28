# Stoneleigh Outdoor Co. — landing page template

A design-build hardscaping landing page, built as the reusable base template
for future local-service clients.

## Structure
```
index.html      Page markup + SEO meta tags + LocalBusiness schema
css/style.css   All styles
js/main.js      Mobile nav, FAQ accordion, demo lead form handling
media/          Client photos, favicon.ico, og-image.jpg go here
sitemap.xml     Single-page sitemap (update domain before deploying)
robots.txt      Points crawlers to the sitemap
```

## Reusing this for a new client
1. Find-and-replace: business name, phone, email, city/counties, and the
   `--charcoal / --limestone / --cream / --moss / --clay / --stone-mid`
   color variables at the top of `css/style.css` with the new brand palette.
2. Update every URL in the `<head>` (canonical, og:url, og:image,
   twitter:image), `sitemap.xml`, and `robots.txt` to the client's real domain.
3. Update the `LocalBusiness` JSON-LD block — name, address, areaServed,
   sameAs (social links) — to the new client's details. Swap the schema
   `@type` if the business isn't a LocalBusiness (e.g. `Organization` for a
   SaaS client, `Person` for a coach/consultant).
4. Replace the inline SVG hero/gallery art or swap in real photography via
   the `media/` folder.
5. Rewrite section copy — services, process steps, testimonials, FAQ.

## SEO baseline included
Meta title/description, canonical URL, robots meta, Open Graph + Twitter
Card tags, LocalBusiness JSON-LD, sitemap.xml, robots.txt, semantic heading
hierarchy, alt text conventions, image-free hero (fast load).
