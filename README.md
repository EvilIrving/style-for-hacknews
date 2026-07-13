# Style for Hacker News

Style for Hacker News is a local-first readability extension for `news.ycombinator.com`: refined typography, calmer spacing, visible comment depth and a small control panel for local preferences.

[Website](https://evilirving.github.io/style-for-hacknews/) · [Install](https://evilirving.github.io/style-for-hacknews/install.html) · [Privacy](https://evilirving.github.io/style-for-hacknews/privacy.html) · [Support](https://github.com/EvilIrving/style-for-hacknews/issues)

## Install

Download the matching browser package from [GitHub Releases](https://github.com/EvilIrving/style-for-hacknews/releases), unzip it, then load the folder through the browser’s extension management page. See the [installation guide](https://evilirving.github.io/style-for-hacknews/install.html) for browser-specific steps.

## Development and release

`npm run validate` checks the MV3 manifest, referenced files and all locales. `npm run package` produces Chrome, Edge and Firefox archives. `npm run release` also inspects the generated ZIPs for correct manifests and accidental source-file leakage. CI runs that same command for main and pull requests; a `v*` tag creates the GitHub Release.

## Privacy and scope

The extension runs only on Hacker News, stores font and metadata preferences locally, and does not collect or transmit user data. It is independent and is not affiliated with Hacker News or Y Combinator.

## License

[MIT](./LICENSE)
