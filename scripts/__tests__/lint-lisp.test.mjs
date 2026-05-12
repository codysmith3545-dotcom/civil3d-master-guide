// Tests for scripts/lint-lisp.mjs
//
// Uses node:test if available; falls back to a tiny hand-rolled runner
// so the suite is runnable on environments without it.

import { lintSource, stripCommentsAndStrings } from '../lint-lisp.mjs';

let test, before, runViaNode;
try {
  const nt = await import('node:test');
  test = nt.test;
  runViaNode = true;
} catch {
  runViaNode = false;
}

const cases = [];
function tc(name, fn) {
  cases.push({ name, fn });
  if (runViaNode) test(name, fn);
}

function assert(cond, msg) {
  if (!cond) throw new Error('assertion failed: ' + (msg || ''));
}

function findIssue(issues, code) {
  return issues.find((i) => i.code === code);
}

// --------- balanced file -> 0 errors ---------
tc('balanced file with header + trailing princ has 0 errors', () => {
  const src = `;;; test routine
;;; License : MIT
(defun c:HELLO ( / x)
  (setq x 1)
  (princ x))
(princ)
`;
  const issues = lintSource(src, 'fixture.lsp');
  const errs = issues.filter((i) => i.level === 'error');
  assert(errs.length === 0, JSON.stringify(errs));
});

// --------- unbalanced parens reported ---------
tc('unbalanced parens reports UNBALANCED_PARENS with counts', () => {
  const src = `;;; test
(defun c:BAD ( / x)
  (setq x (+ 1 2))
  (princ x)))
(princ)
`;
  const issues = lintSource(src, 'fixture.lsp');
  const e = findIssue(issues, 'UNBALANCED_PARENS');
  assert(e, 'expected UNBALANCED_PARENS issue');
  assert(/opens/.test(e.message) && /closes/.test(e.message), 'message has counts');
});

// --------- missing trailing (princ) ---------
tc('missing trailing (princ) reports MISSING_TRAILING_PRINC', () => {
  const src = `;;; test
(defun c:NOPRINC ( / x)
  (setq x 1))
`;
  const issues = lintSource(src, 'fixture.lsp');
  const e = findIssue(issues, 'MISSING_TRAILING_PRINC');
  assert(e, 'expected MISSING_TRAILING_PRINC issue');
});

// --------- non-allowed head reported as warning ---------
tc('unknown head reported as UNKNOWN_FUNCTION warning', () => {
  const src = `;;; test
(defun c:USEUNK ( / x)
  (setq x (totally-not-a-real-function 1 2))
  (princ))
(princ)
`;
  const issues = lintSource(src, 'fixture.lsp');
  const e = findIssue(issues, 'UNKNOWN_FUNCTION');
  assert(e, 'expected UNKNOWN_FUNCTION issue');
  assert(e.level === 'warning', 'should be warning level');
});

// --------- missing header comment ---------
tc('missing top-of-file comment header is an error', () => {
  const src = `(defun c:NOHEADER ( / x)
  (princ))
(princ)
`;
  const issues = lintSource(src, 'fixture.lsp');
  const e = findIssue(issues, 'MISSING_HEADER_COMMENT');
  assert(e && e.level === 'error', 'expected MISSING_HEADER_COMMENT error');
});

// --------- unlocalized vars warning ---------
tc('defun with no / separator triggers UNLOCALIZED_VARS', () => {
  const src = `;;; test
(defun c:LEAKY ()
  (setq x 1)
  (princ))
(princ)
`;
  const issues = lintSource(src, 'fixture.lsp');
  const e = findIssue(issues, 'UNLOCALIZED_VARS');
  assert(e && e.level === 'warning', 'expected UNLOCALIZED_VARS warning');
});

// --------- cmdecho without save -> warning ---------
tc('CMDECHO setvar without getvar triggers SYSVAR_UNSAVED', () => {
  const src = `;;; test
(defun c:CMDONLY ( / )
  (setvar "CMDECHO" 0)
  (princ))
(princ)
`;
  const issues = lintSource(src, 'fixture.lsp');
  const e = findIssue(issues, 'SYSVAR_UNSAVED');
  assert(e && e.level === 'warning', 'expected SYSVAR_UNSAVED warning');
});

// --------- comments stripped but string preserved-length ---------
tc('stripCommentsAndStrings preserves length and line counts', () => {
  const src = `;; comment
(setq s "hello ; not a comment")
;|
block comment with ( ) inside
|;
(princ)
`;
  const clean = stripCommentsAndStrings(src);
  assert(clean.length === src.length, 'lengths match');
  // No semicolons should remain (all comments stripped).
  assert(!clean.includes(';'), 'no semicolons remain');
  // Parens inside the block comment should be erased
  let o = 0, c = 0;
  for (const ch of clean) { if (ch === '(') o++; else if (ch === ')') c++; }
  // src has: (setq...) (princ) and any parens from "( )" inside block comment.
  // After stripping: 2 opens, 2 closes.
  assert(o === 2 && c === 2, `paren counts: ${o}/${c}`);
});

// --------- defun with arglist doesn't trigger UNKNOWN_FUNCTION on args ---------
tc('arglist symbols are not flagged as unknown heads', () => {
  const src = `;;; test
(defun helper (deg / d m s)
  (setq d (fix deg))
  d)
(defun c:USE ( / )
  (helper 3.14)
  (princ))
(princ)
`;
  const issues = lintSource(src, 'fixture.lsp');
  const unk = issues.filter((i) => i.code === 'UNKNOWN_FUNCTION');
  assert(unk.length === 0, 'should not flag arglist symbols: ' + JSON.stringify(unk));
});

// --------- (cond ((test) ...)) doesn't flag test expressions as heads ---------
tc('cond clause heads are not flagged as unknown functions', () => {
  const src = `;;; test
(defun c:CONDTEST ( / x)
  (cond
    ((null x) (princ "n"))
    ((= x 1) (princ "one"))
    (T (princ "other")))
  (princ))
(princ)
`;
  const issues = lintSource(src, 'fixture.lsp');
  // null, =, princ are all in allow-list. T is the last clause's "head" but
  // since cond-clause's head is treated as an expression, the only "real"
  // call heads we should report are defun, cond, null, =, princ. None should
  // be UNKNOWN_FUNCTION.
  const unk = issues.filter((i) => i.code === 'UNKNOWN_FUNCTION');
  assert(unk.length === 0, 'no unknown heads expected: ' + JSON.stringify(unk));
});

// ---------- run hand-rolled if node:test unavailable ----------
if (!runViaNode) {
  let pass = 0, fail = 0;
  for (const c of cases) {
    try { await c.fn(); pass++; process.stdout.write(`ok  ${c.name}\n`); }
    catch (e) { fail++; process.stdout.write(`FAIL ${c.name}\n  ${e.message}\n`); }
  }
  process.stdout.write(`\n${pass} passed, ${fail} failed\n`);
  if (fail) process.exit(1);
}
