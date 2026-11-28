# User guide style guide

Rules for the pages of the user guide (`docs/user-guide/`, French in `i18n/fr/`). They apply to both languages. French is the writing language; English is translated from it.

## Principles

1. **One page, one goal.** A page answers one question: understand, do, check or troubleshoot. Do not mix an explanation and a procedure.
2. **Readers scan for the next step.** Explicit headings, numbered steps, short sentences.
3. **Predictable structure.** Pages of the same type have the same sections in the same order.
4. **Visual signals keep one meaning.** Use them sparingly so that they keep their weight.
5. **The words of the screen.** Quote the UI labels exactly, in the language of the page.

## Page types

Start each page from its template in `docs/user-guide/_templates/`.

| Type | Question | Title | Sections |
|---|---|---|---|
| Concept | What is it, what is it for? | A noun: « Les filtres enregistrés » / *Saved filters* | Definition, purpose, links to procedures |
| Procedure | How do I do it? | An infinitive verb: « Enregistrer un filtre » / imperative: *Save a filter* | Introduction, Avant de commencer, steps, result, Voir aussi |
| Reference | What does this column or value mean? | A precise noun: « Colonnes du tableau des variants » | One table: element, description, possible values |
| Troubleshooting | Why does it not work? | The symptom: « Le téléchargement échoue » | Symptom, cause, solution. The FAQ groups short questions. |

Capitalize only the first word of a heading, in both languages.

## Admonitions

Use only the five Docusaurus types. Pick the first that applies:

| Question | Type | FR title | EN title |
|---|---|---|---|
| Is the action irreversible, or can it expose patient data? | `:::danger` | Danger | Danger |
| Can the reader lose work or get an unexpected result? | `:::warning` | Attention | Warning |
| Must the reader know or prepare something first? | `:::info[Avant de commencer]` | Avant de commencer | Before you begin |
| Is there a faster way? | `:::tip` | Astuce | Tip |
| Is it a secondary detail? | `:::note` | Remarque | Note |

- At most one per section, never two in a row; more than three on a page means the page needs rewriting.
- Never a step inside an admonition. Place it just before the step it concerns.
- Start with the fact, not with « Veuillez noter que ».
- No image, table or admonition inside an admonition. Default titles, except « Avant de commencer ».

## Typography

| Element | Convention | Example |
|---|---|---|
| UI label (button, tab, field, menu) | Bold, exact label | Cliquez sur **Enregistrer le filtre**. |
| Navigation path | Bold, separated by › | **Paramètres › Profil** |
| Text to type, value, identifier, file name | Monospace | Saisissez `BRCA1`. |
| Keyboard key | `<kbd>` | <kbd>Entrée</kbd> |
| Message shown by the portal | Quotes, exact text | Le message « Filtre enregistré » s'affiche. |
| Glossary term, first use on the page | Link to the glossary | un [variant](../glossary#variant) |
| Emphasis | Italics, rarely | |

No capitals for emphasis, no underlining, no meaning carried by color alone.

## Procedures

- One action per step. Place first, then action: « Dans le champ **Nom**, saisissez… ».
- Imperative, *vous* in French.
- Nine steps at most; split beyond that. A single action is a sentence, not a list. Optional steps start with « (Facultatif) ».
- One path per procedure; the alternatives go in a tip.
- Verbs: cliquer sur / click (button, link, icon), sélectionner / select (option, checkbox, list item), saisir / enter (text), ouvrir / open (page, tab), activer · désactiver / turn on · off (switch).

## Screenshots

- **Test data only**, from the local or QA environment, never prod. Check that no real patient identifier shows, even blurred.
- The UI in the language of the page.
- One per new screen, not one per step. Cropped to the useful area, no browser bar.
- 1440 px wide window, 100 % zoom, light theme. Annotations: numbered pins and rectangles in Radiant blue, matching the step numbers.
- PNG under 300 KB, named after the page (`save-a-filter-01.png`), in an `img/` folder next to the page.
- Alt text that describes what the image shows.

## Other components

- **Tabs** (`@theme/Tabs`, with a `groupId`) for parallel cases, e.g. SNV / CNV.
- **`<details>`** for FAQ answers and optional details, never for a step.
- **Reference table** with three columns: element, description, possible values.
- **Badges** under the title for the role or context: `<span className="badge badge--primary">Admin</span>`, `badge--warning` for beta.
- **Mermaid** for an overview of a flow of screens, in concept pages.
- **`<DocCardList />`** on the index page of each section.
- No videos, animated GIFs, emojis, or custom React components.

## French

- *Vous*, present tense, active voice, sentences of 25 words at most. Explain the tool, not genetics.
- Non-breaking space (U+00A0) before `:` `;` `?` `!` and inside « », as the UI does. Docusaurus does not add it.
- Numbers: `1 000`, `0,05`, `25 %`. A value quoted from the screen keeps the screen's format.
- Terms come from `frontend/translations/common/fr.json`: « le variant » (masculine, never « variante »), « enregistrer » (never « sauvegarder »), « requête », « filtre », « facette », « germinal », « somatique », « réseau » / *network* (a private data space; never « tenant »).
- Avoid anglicisms: « cliquer sur » (not « cliquer le »), « courriel », « charger », « prendre en charge ».

## Two languages

- Same tree and same file names (in English) in `docs/user-guide/` and `i18n/fr/docusaurus-plugin-content-docs/current/user-guide/`. Docusaurus matches pages by path.
- Every `##` heading has an explicit English ID, the same in both languages, so that anchors work everywhere: `## Voir aussi {/* #see-also */}`. The site's `future.v4` flag rejects the `{#see-also}` and `<!-- -->` syntaxes: use `{/* */}` for comments too.
- One screenshot set per language.
- A change to the guide updates both languages in the same PR.
- Copy UI labels from `fr.json` and `en.json`; never translate them yourself.
