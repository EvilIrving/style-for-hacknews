# Chrome Web Store Submission — v1.0.0

## Package Info
- Title (软件包中的标题): Style for Hacker News (max 75 chars)
- Summary (软件包中的摘要): Improve Hacker News readability with custom fonts, better typography, spacing, and controls to toggle article metadata visibility. (max 132 chars)
- Description (说明): Style for Hacker News enhances the reading experience on Hacker News by applying refined typography, optimized spacing, and a cleaner layout. It comes with 8 hand-picked variable fonts (including MapleMono for code, LXGW ZhenKai for CJK, and Google Sans Flex for Latin text) that users can cycle through with a single click.

The extension also adds a floating control panel that lets you show or hide article subtext (points, comment counts, timestamps) to reduce visual noise when browsing. All preferences are saved locally and persist across visits.

No data is collected, no account is required, and everything runs entirely in your browser.

- Category (分类): 功能与界面 (Functionality & UI)

## Single Purpose (单一用途)
0/1000
This extension modifies the visual appearance of Hacker News (news.ycombinator.com) to improve readability by applying custom typography, spacing adjustments, and providing UI controls to toggle the display of article metadata.

## Permission Justifications (需请求权限的理由)
- `storage` (0/1000): Used to save the user's font selection and subtext visibility preference locally in the browser, so these choices persist across page reloads and browser sessions. No data is ever transmitted externally.

- Host permissions (0/1000): The content script runs on `https://news.ycombinator.com/*` to inject CSS style overrides and a floating control panel into Hacker News pages. This host pattern is needed because the extension's sole function is to customize the appearance of Hacker News — without access to these pages, the typography, layout improvements, and visibility toggle controls cannot be applied.

## Remote Code (远程代码)
- Using remote code? No

## Data Usage (数据使用)

### Data Collection Categories
Mark which user data the extension collects (check = collects, no check = does not collect):
- [ ] Personally identifiable information
- [ ] Health information
- [ ] Financial and payment information
- [ ] Authentication information
- [ ] Personal communications
- [ ] Location
- [ ] Web history
- [ ] User activity
- [ ] Website content

### Data Use Certifications
All three must be checked:
- [x] I do not sell or transfer user data to third parties for uses outside of approved use cases
- [x] I do not use or transfer user data for purposes unrelated to my product's single purpose
- [x] I do not use or transfer user data to determine creditworthiness or for lending

## Official URLs
- Associated website: None
- Homepage URL (首页网址, max 2048 chars): https://evilirving.github.io/style-for-hacknews/
- Support page URL (支持信息页面网址, max 2048 chars): https://evilirving.github.io/style-for-hacknews/support.html

## Adult Content
- Contains adult content? No

## Privacy Policy (隐私权政策)
- URL (max 2048 chars): https://evilirving.github.io/style-for-hacknews/privacy.html

## Product Support
- Enable product support? Off

## Distribution
- Payment: Free
- Visibility: Public

## Tags
hacker news, readability, typography, font switcher, minimal, clean, news, productivity
