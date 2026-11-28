---
name: user-guide
description: Write or update a page of the portal user guide (Docusaurus, English and French). Use whenever you create, edit, translate or review a page in docs/docs/user-guide/ or docs/i18n/fr/.
paths: ["portal/docs/docs/user-guide/**", "portal/docs/i18n/**", "docs/docs/user-guide/**", "docs/i18n/**"]
---

# User guide

`docs/STYLE-GUIDE.md` holds the rules. Read it before writing, and apply it.

1. **Pick the page type** (concept, procedure, reference, troubleshooting) and start from its template in `docs/docs/user-guide/_templates/`.
2. **Check every UI label in the code**, never from memory: grep `frontend/translations/common/fr.json` for the French page and `en.json` for the English one, and quote the value exactly. When the flow of a screen is unclear, read its component in `frontend/apps/` rather than guess, and list what you could not verify.
3. **Write both languages in the same change**: French first, then English, same file name and same `{/* #heading-id */}` in `docs/docs/user-guide/` and `docs/i18n/fr/docusaurus-plugin-content-docs/current/user-guide/`.
4. **Screenshots**: never take or ask for one from prod. Name the screenshots the page needs (screen, state, annotations) and let the user take them on local or QA.
5. **Check the build** from `docs/`: `npm run build` builds both locales and fails on a broken link.
