# ChatGPT workflow

Use this checklist for work in this repository. Shared client facts and project rules remain in the existing source docs; this file defines how ChatGPT should work with them.

## Before producing work

- Read the matching project README and prompt, then follow links to source data, approved corrections, shared brand docs, and client decisions.
- Treat project source files as authoritative. Do not infer missing facts from examples, old posts, or generated output.
- Never invent prices, ratings, shipping countries, performance stats, or other client facts. Mark unverified details as unverified or use the agreed placeholder.
- Keep each deliverable scoped to the requested project. Do not pull unrelated analytics or prior tasks into it.
- Preserve existing build output and scripts. Archive a distinct ChatGPT render under `.chatgpt/generated/` unless the project explicitly asks to replace its canonical build.

## Producing and checking outputs

- Keep approved names, quantities, wording, and other source values exact. Apply only corrections allowed by the task brief.
- Follow the project's dimensions, format, accessibility, and brand asset requirements. Use supplied official logos and real photos as specified; do not redraw or substitute them.
- Check every output against source data. For tabular or inventory artwork, include a line-by-line check file and reconcile totals to the source.
- Inspect rendered exports for legibility, cropping, text fit, ordering, and visible artifacts before delivery.
- Do not rewrite approved copy such as a caption unless asked.

## Archiving

For a finished ChatGPT deliverable, use `.chatgpt/generated/<workstream>/<YYYY-MM>/` with a README, final exports, and a plan or source mapping plus QA/check report. Link the source prompt and data from the package README. Keep editable project sources under `projects/`; this folder records generated outputs and their checks.
