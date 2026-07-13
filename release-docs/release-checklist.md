# Release checklist

Run `npm run release`; it validates the manifest and locales, creates Chrome, Edge and Firefox ZIPs, then inspects each archive. Confirm that the generated filenames use the manifest version and that every archive contains only extension files and `LICENSE`.

Load the matching unzipped package in each target browser. Verify the control panel, font switching, metadata toggle, local preference persistence and a nested comment page. Confirm the site, privacy URL, Releases page and store listing point to the same repository before creating a `v*` tag.
