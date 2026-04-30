# Style for Hacker News

A Chrome extension that improves Hacker News readability with refined typography, optimized spacing, and a cleaner layout. Available in English, 中文, 日本語, and 한국어.

[中文版本](README.zh_CN.md)

## Features

- **8 variable fonts** — Cycle through MapleMono CN, LXGW ZhenKai, Google Sans Flex, Commit Mono, Geist, Geist Mono, MiSans, and Mona Sans with one click
- **Subtext toggle** — Show or hide article metadata (points, comment counts, timestamps) to reduce visual noise
- **Comment thread indicators** — Visual depth markers make nested discussions instantly readable
- **Persistent preferences** — Font choice and visibility settings saved locally and restored across visits
- **Four languages** — UI labels adapt to English, Simplified Chinese, Japanese, or Korean

## Usage

1. Visit [news.ycombinator.com](https://news.ycombinator.com)
2. Use the floating control panel in the bottom-right corner to switch fonts, toggle metadata, or change the UI language

## Installation

1. Open `chrome://extensions/` in Chrome
2. Enable **Developer mode**
3. Click **Load unpacked** and select this project folder
4. Visit Hacker News to test

## Development

The extension runs as a content script on `news.ycombinator.com`. Key files:

| File | Purpose |
|---|---|
| `content.js` | Control panel, toggle logic, font switching, i18n |
| `content.css` | Typography overrides, comment threading, layout improvements |
| `control-panel.css` | Floating panel styles |
| `_locales/` | UI strings for en, zh_CN, ja, ko |

## License

MIT
