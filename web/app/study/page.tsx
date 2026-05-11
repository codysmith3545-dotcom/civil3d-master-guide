import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import StudyClient, { type Question } from "./StudyClient";

export const metadata: Metadata = {
  title: "Study — Indiana PS Exam Prep",
  description:
    "Spaced-repetition flashcards for Indiana Professional Surveyor exam prep.",
};

const CONTENT_ROOT =
  process.env.CIVIL3D_CONTENT_ROOT ??
  path.join(process.cwd(), "..", "content");

function loadBank(): { questions: Question[] } {
  const bankPath = path.join(
    CONTENT_ROOT,
    "exam-prep",
    "ps-indiana",
    "questions",
    "bank.json",
  );
  const raw = fs.readFileSync(bankPath, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed || !Array.isArray(parsed.questions)) {
    throw new Error("bank.json missing 'questions' array");
  }
  return { questions: parsed.questions as Question[] };
}

export default function StudyPage() {
  const { questions } = loadBank();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <p className="text-sm font-medium uppercase tracking-wider text-ink-500">
          Indiana PS exam prep
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-900">
          Study
        </h1>
        <p className="mt-2 text-ink-700">
          Fifty original multiple-choice questions, scheduled with a simple
          SM-2 spaced-repetition algorithm. Progress is stored locally in your
          browser; no account or sign-in.
        </p>
      </header>
      <StudyClient questions={questions} />
    </div>
  );
}
