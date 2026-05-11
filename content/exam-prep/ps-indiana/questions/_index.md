---
title: "Question Bank"
section: "exam-prep/ps-indiana/questions"
order: 40
visibility: public
tags: [exam-prep, questions, practice, study]
updated: 2026-05-11
---

> **TL;DR**
> 1. Fifty original multiple-choice questions covering the Indiana PS exam scope. All questions are authored for this repository; nothing is lifted from copyrighted source material.
> 2. Each question cites the page slug used to write it via the `source` field. Open `/study` for the spaced-repetition UI.
> 3. The schema is in `bank.json`. The validator at `scripts/validate-question-bank.mjs` enforces shape and runs as part of `scripts/build-all.mjs`.

## Coverage

| Area | Questions |
|---|---|
| Bearings and azimuths | 5 |
| Distance, slope, EDM | 5 |
| Coordinate systems | 5 |
| Traverse, area, plane trig | 5 |
| Curve geometry | 5 |
| Boundary law (senior, hierarchy, acquiescence) | 6 |
| Riparian, adverse possession | 4 |
| 865 IAC (monumentation, plat content, records) | 6 |
| PLSS restoration | 5 |
| Recording and procedure | 4 |
| **Total** | **50** |

## Difficulty mix

- Easy: 20 questions (40 percent)
- Medium: 20 questions (40 percent)
- Hard: 10 questions (20 percent)

## Schema

See `bank.json`. Each entry:

- `id` — `ps-in-NNN` (zero-padded to 3 digits).
- `topic` — slug under `exam-prep/ps-indiana/`.
- `objective` — NCEES topic objective, when known.
- `difficulty` — `easy`, `medium`, or `hard`.
- `prompt` — plain text question.
- `choices` — array of `{ id, text }` (typically four).
- `correct` — choice id.
- `rationale` — explanation, citing the source.
- `source` — slug under `exam-prep/ps-indiana/` whose page authoritatively supports the question.
- `pending_source` — boolean, true if the source page is not yet committed.
- `tags` — additional topic tags.

## Validator

Run `node scripts/validate-question-bank.mjs` to validate. The validator is also part of `scripts/build-all.mjs`. Unit tests live at `scripts/__tests__/validate-question-bank.test.mjs`.

## Open the study UI

[`/study`](/study) loads `bank.json`, presents flashcards, and tracks SM-2 spaced-repetition progress in browser localStorage.
