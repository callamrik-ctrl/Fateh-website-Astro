# Codex Project Rules — Fateh Plumbing & Electric Website

## Main rule

Work only on the specific task requested by the user. Do not expand the scope. Do not perform a full website audit, broad refactor, redesign, cleanup, or unrelated improvements unless the user explicitly asks for that exact work.

## File inspection limits

* Inspect only the files directly relevant to the requested task.
* Do not recursively scan the entire repository unless explicitly requested.
* Do not inspect the .git directory recursively.
* Do not repeatedly inspect the same files.
* Before opening many files, first identify the minimum files needed.
* For a small task, inspect and modify the smallest practical number of files.
* If more than 10 files likely need review or modification, explain why and ask for confirmation before continuing.

## Preview and long-running process rules

* Never start npm run dev, npm run preview, astro dev, astro preview, a watcher, or any long-running server process from an agent task unless the user explicitly asks for it.
* The user runs the local development server manually in the terminal.
* Do not monitor a running preview server.
* Do not repeatedly refresh pages.
* Do not run browser automation or repeated screenshots unless explicitly requested.
* Do not wait for a development server process to end.
* Do not leave background processes running.

## Commands and verification

* Do not run npm install or update dependencies unless explicitly requested.
* Do not run npm audit fix or npm audit fix --force unless explicitly requested.
* Do not run a production build unless explicitly requested or clearly required for the requested task.
* Do not run broad test suites unless explicitly requested.
* Use only the minimum relevant verification command for the requested change.
* If a command may take longer than 2 minutes, explain why and ask for confirmation before running it.
* If a command appears stuck, stop it rather than repeatedly retrying.

## Safety

* Do not commit, push, deploy, merge, rewrite Git history, or change branches unless explicitly requested.
* Do not delete, rename, or move files without listing the proposed changes and receiving confirmation.
* Do not change deployment configuration unless explicitly requested.
* Preserve existing working pages, design, forms, SEO metadata, URLs, redirects, and integrations unless the requested task directly requires a change.
* Do not expose or commit secret keys, environment variables, or credentials.

## Website development workflow

* Plumbing pages already exist. Preserve them unless a specific plumbing change is requested.
* Commercial pages and electrical pages still need to be developed.
* When creating pages, use the existing website structure, components, styling, and SEO pattern where appropriate.
* Build new pages in small batches.
* For a batch involving more than 5 pages, first provide a plan and wait for confirmation.
* Avoid duplicating large blocks of code when a shared component or data-driven template is appropriate.
* Do not redesign unrelated pages while adding new pages.

## Images and assets

* Do not delete or replace images unless explicitly requested.
* Do not add large images, videos, archives, or backup folders without confirmation.
* Recommend image compression separately when useful, but do not perform it unless requested.

## Response format

For every task:

1. State the narrow scope being handled.
2. Make only the minimum necessary changes.
3. List exactly which files were changed.
4. State what verification was performed.
5. Stop after completing the requested task.
