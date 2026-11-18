# Student Tracker

Track your classes and assignments in one place: see what is due this week, break an assignment into steps, and check them off as you go.

## Getting started

Create a `.env` file with your Supabase project URL and keys, then run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Built with

| Piece | Source | License | Used for |
|---|---|---|---|
| [Next.js](https://nextjs.org) | npm | MIT | App framework, routing, server actions |
| [React](https://react.dev) | npm | MIT | UI components |
| [Supabase JS](https://github.com/supabase/supabase-js) and [Supabase SSR](https://github.com/supabase/ssr) | npm | MIT | Database access and login sessions |
| [Supabase](https://supabase.com) | Hosted service | Supabase Terms of Service | Database and user accounts |
| [Vercel](https://vercel.com) | Hosted service | Vercel Terms of Service | Hosting and deployments |
| [Tailwind CSS](https://tailwindcss.com) | npm | MIT | Styling |
| [Nunito](https://fonts.google.com/specimen/Nunito) | Google Fonts | SIL Open Font License 1.1 | Typeface |
| [TypeScript](https://www.typescriptlang.org), [ESLint](https://eslint.org) | npm | Apache-2.0, MIT | Type checking and linting |

The build also uses browser-support data from [caniuse-lite](https://github.com/browserslist/caniuse-lite) (CC BY 4.0, data by [caniuse.com](https://caniuse.com)). Next.js's image optimizer uses [sharp](https://sharp.pixelplumbing.com) and libvips (LGPL-3.0), unmodified.

Everything else (the pages, components, icons and database migration) was written by our team.

## AI use

We used AI tools while building this project:

- **Claude Code** (Anthropic): writing and debugging code, including the Supabase data layer, assignment steps, and login; drafting commit messages and pull request descriptions. Commits it helped with carry a `Co-Authored-By: Claude` line.
- **Hallmark** (a design skill run inside Claude Code): a design and accessibility review of the app screens, such as focus rings and contrast.
- **GitHub Copilot**: code suggestions in the editor.

A team member reviewed every AI-assisted change before it was merged, and we rejected suggestions that conflicted with teammates' work or didn't match our deployment.
