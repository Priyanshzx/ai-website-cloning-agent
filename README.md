# WebClone AI: Website Cloning Agent

Enter a public website URL. The agent analyzes the page, generates a modular React + TypeScript + Tailwind frontend, shows a live responsive preview, and lets you modify the result with natural-language prompts.

**Demo video:** YOUR_VIDEO_LINK

![Architecture](architecture/architecture.png)

> If your diagram file has a different name, update the path above (check the `architecture/` folder).

---

## Architecture

```
URL -> Analysis -> Generation -> Validation -> Preview -> Modification
```

| Stage | What happens |
|---|---|
| **1. Analysis** | The server fetches the page and parses it with Cheerio: sections, navigation, text, images, colors, fonts, and layout. |
| **2. Structuring** | The page is classified into sections (Navbar, Hero, Features, Pricing, Testimonials, Footer) and design tokens are extracted into a structured analysis object. |
| **3. Generation** | Each section becomes a separate React component (`Navbar.tsx`, `Hero.tsx`, ...) plus `App.tsx`. Two engines: an LLM (Gemini / OpenAI) when an API key is set, or a built-in deterministic synthesizer that needs no key. |
| **4. Validation** | A static sanitizer fixes common generated-code errors (unclosed void tags, `class` vs `className`, missing imports, unbalanced brackets) before the code is mounted. |
| **5. Preview** | Live preview with Desktop / Tablet / Mobile viewports, side-by-side comparison, and ZIP export of the generated project. |
| **6. Modification** | Natural-language prompts edit only the affected component or design tokens, and the preview updates. |

## Tech stack

- **Client:** React 18, Vite, TypeScript, Tailwind CSS
- **Server:** Node.js, Express, TypeScript, Cheerio, Axios, Archiver
- **Models:** Google Gemini and OpenAI GPT-4o (optional), plus a deterministic synthesizer (no API cost)

## Setup

Requires Node.js 18+.

```bash
git clone https://github.com/Priyanshzx/ai-website-cloning-agent.git
cd ai-website-cloning-agent
npm run install:all
npm run dev
```

- Studio UI: http://localhost:5173
- API server: http://localhost:5000

### API keys (optional)

### API keys (optional)

The app works **without any API key** using the built-in synthesizer. To use an LLM, click **Settings** in the UI and paste your Gemini or OpenAI key. The key is sent with the request from the UI and is not stored in the repository.
`.env` is gitignored, so keys are never committed.

## Try it

1. Enter a URL (presets: linear.app, stripe.com, supabase.com, tartinebakery.com) and click **Clone & Recreate**.
2. Check the **Tokens & UI** tab for extracted colors, fonts, and sections.
3. Switch between Desktop, Tablet, and Mobile views.
4. Open **AI Modifier** and try prompts such as:
   - "Change the primary color to blue."
   - "Replace the hero section with a bakery hero."
   - "Make the navbar sticky."
   - "Remove the pricing section."
   - "Add a testimonials section."

An end-to-end API smoke test is available with the server running: `node test-pipeline.js`.

## Key implementation decisions

- **Section-per-component output.** Smaller generation units are more reliable than one large file, and they make edits targeted (e.g. "remove pricing" touches one component and one import).
- **Two generation engines.** The deterministic synthesizer keeps the app usable without an API key or when an LLM call fails, and it costs nothing to run.
- **Design tokens in one place.** Color and font changes propagate across components.
- **Cost control.** Only extracted text, headings, and design tokens are sent to the LLM, not raw HTML, and modifications regenerate only the affected component.
- **Static validation before mounting.** A regex-based sanitizer catches the most common generated-JSX mistakes cheaply. It is not a full compiler check.

## Limitations

- Analysis uses static HTML fetching (Cheerio), so heavily JavaScript-rendered pages may yield less content, and there are no computed styles.
- Sites behind bot protection (e.g. Cloudflare) may block the fetch.
- Validation is regex-based, not a full TypeScript/AST compile; some errors can slip through.
- Some sites block being shown inside an iframe, which can break the side-by-side comparison view.
- Complex WebGL/canvas visuals and animations are approximated with static images.
- Output is a single-page recreation, not a multi-page site.
- Natural-language edits handle common instructions best; unusual requests depend on the LLM being enabled.

## Possible improvements

- Headless-browser rendering (Playwright) for JS-heavy sites, with screenshot comparison against the original.
- Real compile-check (TypeScript/esbuild) with an LLM repair loop.
- Per-run token and cost reporting in the UI.

## License

MIT. Created by Priyansh Yadav.