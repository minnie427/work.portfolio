# Search pages

The home pages keep the existing visual design. Their service links lead to three distinct service pages in Korean and English. The service text, shared metadata, structured data and sitemap are maintained in `scripts/build-search-pages.js`.

After editing that file, or before releasing homepage changes, run:

```sh
node scripts/build-search-pages.js
node --check scripts/build-search-pages.js
```

The build replaces the homepage `<head>` from the shared source. If verified ownership tags or analytics are added later, maintain them in the build source rather than only editing generated HTML. Never insert fictitious verification IDs. Service images use the existing `images/` assets.

Submit `https://work.minniepark.art/sitemap.xml` after publication and owner verification. These changes do not submit a sitemap or launch an advertising campaign by themselves.

No new tracking or advertising tags are enabled. Before paid traffic: connect the approved analytics account, review privacy requirements, distinguish form success from email/Kakao link clicks, and check attribution. Never collect form names, emails or message contents in analytics events. A mailto/Kakao click is not proof of an enquiry or a contract.

The existing FormSubmit contact form has not been submitted during this SEO work. A live test sends an email and requires approval of the exact final test message. The existing form submission handler should be checked against the service’s actual success response before using it as an advertising conversion trigger.
