#!/usr/bin/env node
// Lints AutoLISP routines in customization/lisp/library/ (or paths passed on CLI).
//
// Rules:
//   1. UNBALANCED_PARENS         - opens must equal closes (comments stripped)
//   2. MISSING_TRAILING_PRINC    - file's last s-expression must be (princ)
//   3. UNLOCALIZED_VARS          - (defun c:NAME ...) must contain a / separator
//   4. UNKNOWN_FUNCTION          - warn on heads-of-lists not in allow-list
//   5. CMDECHO_OSMODE_UNSAVED    - warn if (setvar "CMDECHO"...) or "OSMODE" used
//                                  without saving via (getvar ...)
//   6. MISSING_HEADER_COMMENT    - first non-blank line must be a ; comment
//
// Usage:
//   node scripts/lint-lisp.mjs
//   node scripts/lint-lisp.mjs path/to/file.lsp [more paths]
//   node scripts/lint-lisp.mjs --fix
//   node scripts/lint-lisp.mjs --quiet      (suppress warnings)
//   node scripts/lint-lisp.mjs --strict     (warnings cause non-zero exit)
//   node scripts/lint-lisp.mjs --help
//
// Exit code:
//   0  no errors (and no warnings if --strict)
//   1  one or more errors
//   2  no errors but warnings present (only when --strict)

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { resolve, relative, join } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const DEFAULT_DIR = resolve(ROOT, 'customization/lisp/library');

const ALLOWED_FUNCTIONS = new Set([
  // Core AutoLISP / Visual LISP
  'command', 'command-s', 'entget', 'entmod', 'entsel', 'ssget', 'ssname',
  'sslength', 'getstring', 'getreal', 'getpoint', 'getangle', 'getdist',
  'getint', 'getkword', 'getvar', 'setvar', 'cdr', 'car', 'cadr', 'caddr',
  'cddr', 'cdar', 'caar', 'cadar', 'cdddr', 'cadddr',
  'cons', 'list', 'assoc', 'mapcar', 'foreach', 'lambda', 'function', 'setq',
  'set', 'if', 'cond', 'while', 'repeat', 'progn', 'princ', 'prompt', 'alert',
  'strcase', 'strcat', 'substr', 'strlen', 'atof', 'atoi', 'rtos', 'angtos',
  'distance', 'angle', 'polar', 'open', 'close', 'write-line', 'read-line',
  'vl-load-com', 'vl-string-search', 'vl-string-subst', 'vl-string-position',
  'vl-string-mismatch', 'vl-string-translate', 'vl-string-trim', 'vl-position',
  'vl-remove', 'vl-remove-if', 'vl-remove-if-not', 'vl-sort', 'vl-sort-i',
  'vl-some', 'vl-every', 'vl-member-if', 'vl-member-if-not', 'vl-list*',
  'vl-cmdf', 'vl-symbol-value', 'vl-symbolp', 'vl-consp', 'vl-prin1-to-string',
  'vl-princ-to-string', 'vl-filename-base', 'vl-filename-extension',
  'vl-filename-directory', 'vl-mkdir',
  'vlax-ename->vla-object', 'vlax-vla-object->ename', 'vlax-get-acad-object',
  'vlax-curve-getEndParam', 'vlax-curve-getStartParam',
  'vlax-curve-getPointAtParam', 'vlax-curve-getDistAtParam',
  'vlax-curve-getParamAtDist', 'vlax-curve-getPointAtDist',
  'vlax-curve-getClosestPointTo', 'vlax-curve-getDistAtPoint',
  'vlax-curve-getStartPoint', 'vlax-curve-getEndPoint',
  'vlax-curve-isClosed', 'vlax-curve-getArea',
  'vla-get-Document', 'vla-get-ModelSpace', 'vla-get-PaperSpace',
  'vla-get-ActiveDocument', 'vla-get-Layers', 'vla-get-Blocks',
  'vla-put-Color', 'vla-put-Layer', 'vla-put-Linetype', 'vla-put-TrueColor',
  'vla-add', 'vla-AddLine', 'vla-AddLightWeightPolyline', 'vla-AddPolyline',
  'vla-AddText', 'vla-AddMText', 'vla-AddCircle', 'vla-AddArc',
  'vla-AddBlockReference', 'vla-Item', 'vla-get-Count', 'vla-get-Layer',
  'vla-get-Name', 'vla-get-Color', 'vla-get-Linetype', 'vla-get-Handle',
  'vla-get-ObjectName', 'vla-get-ObjectId', 'vla-get-Visible',
  'vla-put-Visible', 'vla-put-Name', 'vla-put-Freeze', 'vla-get-Freeze',
  'vla-put-LayerOn', 'vla-put-Lock', 'vla-get-Lock',
  'vla-put-BackgroundFill', 'vla-get-BackgroundFill',
  'vla-put-Width', 'vla-get-Width', 'vla-put-Height', 'vla-get-Height',
  'vla-put-Rotation', 'vla-get-Rotation', 'vla-put-Alignment',
  'vla-put-AttachmentPoint', 'vla-put-InsertionPoint',
  'vla-Delete', 'vla-Update', 'vla-Regen', 'vla-Erase', 'vla-Move',
  'vla-Rotate', 'vla-Copy', 'vla-Mirror', 'vla-Offset', 'vla-ScaleEntity',
  'vla-StartUndoMark', 'vla-EndUndoMark', 'vla-SendCommand',
  'vlax-get', 'vlax-put', 'vlax-get-property', 'vlax-put-property',
  'vlax-invoke-method', 'vlax-for', 'vlax-map-collection',
  // Math / numeric
  'itoa', 'expt', '/', '*', '+', '-', '=', '/=', '<', '<=', '>', '>=', 'abs',
  'fix', 'float', 'sin', 'cos', 'tan', 'sqrt', 'atan', 'exp', 'log', 'gcd',
  'max', 'min', 'rem', '1+', '1-',
  // Predicates / control
  'eq', 'equal', 'null', 'listp', 'numberp', 'stringp', 'atom', 'member',
  'length', 'last', 'nth', 'append', 'reverse', 'not', 'and', 'or', 'T',
  'nil', 'defun', 'defun-q', '*error*', 'getcorner', 'ssgetfirst',
  'tblsearch', 'tblnext', 'tblobjname', 'namedobjdict', 'dictsearch',
  'dictadd', 'dictnext', 'dictremove', 'dictrename', 'entdel', 'entnext',
  'entlast', 'handent', 'entupd', 'entmake', 'entmakex', 'ssadd', 'ssdel',
  'ssmemb', 'ssgetfirst', 'sssetfirst', 'wcmatch', 'apply', 'eval', 'quote',
  'boundp', 'type', 'minusp', 'zerop', 'minusp', 'plusp', 'oddp', 'evenp',
  // Express Tools / ACET
  'acet-str-format', 'acet-list-to-string', 'acet-ms->ps', 'acet-ps->ms',
  'acet-error-init', 'acet-error-restore', 'acet-sys-setvar',
  'acet-ui-message', 'acet-ui-progress', 'acet-fname-clear',
  'acet-geom-image-bound', 'acet-layerp-mode',
  // Bitwise / character / additional core
  'logand', 'logior', 'logxor', 'lognot', 'lsh', 'boole', 'chr', 'ascii',
  'subst', 'sublist', 'regapp', 'initget', 'tblobjname', 'redraw', 'grread',
  'grdraw', 'grtext', 'grvecs', 'getstring', 'menugroup', 'menuload',
  'nentsel', 'nentselp', 'osnap', 'cvunit', 'inters',
  // Misc
  'sub_err_handler', '*acad*', 'vl-catch-all-apply', 'vl-catch-all-error-p',
  'vl-catch-all-error-message', 'vlax-add-cmd', 'vlax-product-key',
  'vlax-release-object', 'vlax-invoke', 'vlax-method-applicable-p',
  'vlax-property-available-p', 'vlax-typeinfo-available-p',
  'vlax-3D-point', 'vlax-make-safearray', 'vlax-safearray-fill',
  'vlax-safearray->list', 'vlax-variant-value', 'vlax-make-variant',
  'vlax-variant-type', 'vlax-tmatrix', 'vlax-ldata-get', 'vlax-ldata-put',
  'vlax-ldata-list', 'vlax-ldata-delete',
  'acad-strlsort', 'getfiled', 'findfile', 'getenv', 'setenv',
  'trans', 'getpropertyvalue', 'setpropertyvalue', 'getsubentity',
  'ispropertyreadonly', 'getallpropertynames',
  'ai_propchk', 'princ', 'print', 'terpri', 'exit',
  // Reader things treated as heads in some forms
  'read', 'read-char', 'write-char',
  // Date / system
  'getfiled', 'menucmd', 'inters', 'osnap',
  // The literal :vlax-true / :vlax-false constants are never heads-of-lists
]);

const HELP = `lint-lisp - AutoLISP linter for the Civil 3D Master Guide

Usage:
  node scripts/lint-lisp.mjs [options] [path...]

Options:
  --help     show this help and exit
  --fix      auto-fix safely-fixable issues (currently: missing trailing princ)
  --quiet    suppress warnings (only errors printed)
  --strict   exit non-zero on warnings as well as errors

With no paths, lints every .lsp under customization/lisp/library/.

Exit codes:
  0  no errors (no warnings, or warnings allowed)
  1  one or more errors
  2  --strict and one or more warnings
`;

// ----------------------------- helpers -----------------------------

function parseArgs(argv) {
  const opts = { fix: false, quiet: false, strict: false, help: false, paths: [] };
  for (const a of argv) {
    if (a === '--help' || a === '-h') opts.help = true;
    else if (a === '--fix') opts.fix = true;
    else if (a === '--quiet') opts.quiet = true;
    else if (a === '--strict') opts.strict = true;
    else if (a.startsWith('--')) {
      console.error(`Unknown option: ${a}`);
      process.exit(2);
    } else opts.paths.push(a);
  }
  return opts;
}

async function walk(dir) {
  const out = [];
  let ents;
  try {
    ents = await readdir(dir, { withFileTypes: true });
  } catch (e) {
    return out;
  }
  for (const e of ents) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.isFile() && p.toLowerCase().endsWith('.lsp')) out.push(p);
  }
  return out;
}

// Strip ;| ... |; block comments and ; line comments and string literals
// from a source so we can count parens, scan heads, etc. Returns the
// "cleaned" source with comment/string spans replaced by spaces of the
// same length (so line/column offsets are preserved).
export function stripCommentsAndStrings(src) {
  const out = src.split('');
  const n = src.length;
  let i = 0;
  while (i < n) {
    const c = src[i];
    // block comment ;| ... |;
    if (c === ';' && src[i + 1] === '|') {
      const end = src.indexOf('|;', i + 2);
      const stop = end === -1 ? n : end + 2;
      for (let k = i; k < stop; k++) if (src[k] !== '\n') out[k] = ' ';
      i = stop;
      continue;
    }
    // line comment ; ...\n
    if (c === ';') {
      let k = i;
      while (k < n && src[k] !== '\n') { out[k] = ' '; k++; }
      i = k;
      continue;
    }
    // string literal "..."
    if (c === '"') {
      out[i] = ' ';
      let k = i + 1;
      while (k < n) {
        if (src[k] === '\\' && k + 1 < n) {
          if (src[k] !== '\n') out[k] = ' ';
          if (src[k + 1] !== '\n') out[k + 1] = ' ';
          k += 2;
          continue;
        }
        if (src[k] === '"') { out[k] = ' '; k++; break; }
        if (src[k] !== '\n') out[k] = ' ';
        k++;
      }
      i = k;
      continue;
    }
    i++;
  }
  return out.join('');
}

function lineColFromIndex(src, idx) {
  let line = 1;
  let col = 1;
  for (let i = 0; i < idx && i < src.length; i++) {
    if (src[i] === '\n') { line++; col = 1; } else col++;
  }
  return { line, col };
}

// Return the last non-whitespace character (and index) of a string.
function trailingNonWhitespace(s) {
  let i = s.length - 1;
  while (i >= 0 && /\s/.test(s[i])) i--;
  return { ch: i >= 0 ? s[i] : null, idx: i };
}

// Find the last s-expression (top-level) by scanning for the final
// balanced "(...)" group in the cleaned source.
function lastTopLevelExpr(clean) {
  // Walk through, tracking depth; record the start of every depth-0 (...) group.
  const groups = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (c === '(') {
      if (depth === 0) start = i;
      depth++;
    } else if (c === ')') {
      depth--;
      if (depth === 0 && start >= 0) {
        groups.push({ start, end: i });
        start = -1;
      }
    }
  }
  return groups.length ? groups[groups.length - 1] : null;
}

// Collect (head ...) positions by walking the cleaned source with a small
// context stack so we can skip:
//   - quoted lists '(...)   - data, no function head
//   - quoted forms '<sym>   - quoted symbol, never a call
//   - (defun NAME (ARGS) ...)  - skip head-of ARGS list
//   - (defun-q NAME (ARGS) ...)
//   - (lambda (ARGS) ...)      - skip head-of ARGS list
//   - (cond (TEST ...) ...)    - skip head-of each clause (it's an expression)
//   - (foreach VAR LST ...)    - VAR is a symbol, LST is a normal call
//   - (mapcar FN LST ...)      - FN may be 'lambda or quoted symbol
//
// The walker tokenises lazily: at every '(' we decide whether the next inner
// list is "code" or "data/binding/arglist".
function collectListHeads(clean) {
  const heads = [];
  const n = clean.length;

  // Helper: read next symbol starting at p (must point at non-space, non-paren).
  // Always advances at least one character to guarantee progress.
  function readSymbol(p) {
    let k = p;
    while (k < n && !/[\s()'`,]/.test(clean[k])) k++;
    if (k === p) k = p + 1; // force progress on stray punctuation
    return { sym: clean.slice(p, k), end: k };
  }

  // Helper: skip whitespace, return new index.
  function skipWs(p) {
    while (p < n && /\s/.test(clean[p])) p++;
    return p;
  }

  // Walk one list starting AT the '(' character. Records head if it's a function
  // call (not an arglist / cond-clause). Recurses for nested lists. Returns the
  // index just past the matching ')'.
  function walkList(start, kind) {
    // kind: 'code' | 'arglist' | 'cond-clause' | 'data'
    let p = start + 1; // skip '('
    p = skipWs(p);
    if (p >= n) return n;

    if (kind === 'arglist' || kind === 'data') {
      // No head; consume until matching ')'.
      while (p < n && clean[p] !== ')') {
        if (clean[p] === '(') {
          // nested list is still data
          p = walkList(p, 'data');
        } else if (clean[p] === "'") {
          p++;
          if (p < n && clean[p] === '(') p = walkList(p, 'data');
          else { const r = readSymbol(p); p = r.end; }
        } else if (/\s/.test(clean[p])) {
          p++;
        } else {
          const r = readSymbol(p);
          p = r.end;
        }
      }
      return p < n ? p + 1 : n;
    }

    // For 'code' or 'cond-clause': read first element (the "head" or test).
    let headSymbol = null;
    let headIndex = -1;
    if (clean[p] === ')') return p + 1; // ()
    if (clean[p] === '(') {
      // Head is itself a list (e.g. lambda or computed). Walk it as code.
      p = walkList(p, 'code');
    } else if (clean[p] === "'") {
      p++;
      if (p < n && clean[p] === '(') p = walkList(p, 'data');
      else { const r = readSymbol(p); p = r.end; }
    } else {
      const r = readSymbol(p);
      headSymbol = r.sym;
      headIndex = p;
      p = r.end;
      // Record this head only if we're in 'code' context.
      if (kind === 'code' && headSymbol && !/^[-+]?\d/.test(headSymbol)) {
        heads.push({ symbol: headSymbol, index: headIndex });
      }
    }
    p = skipWs(p);

    // Now process remaining child forms with kind-specific behaviour.
    const lower = headSymbol ? headSymbol.toLowerCase() : null;
    // child[i] kinds: by default 'code'. Some heads override slot kinds.
    // We'll iterate child slots one at a time.
    let slot = 0;
    while (p < n && clean[p] !== ')') {
      let childKind = 'code';
      // Determine childKind based on parent head + slot index.
      if (kind === 'code' && lower) {
        if ((lower === 'defun' || lower === 'defun-q')) {
          // slot 0 -> name (symbol), slot 1 -> arglist, rest -> code
          if (slot === 0) childKind = 'symbol';
          else if (slot === 1) childKind = 'arglist';
          else childKind = 'code';
        } else if (lower === 'lambda' || lower === 'function') {
          // slot 0 -> arglist, rest -> code
          if (slot === 0) childKind = 'arglist';
          else childKind = 'code';
        } else if (lower === 'cond') {
          childKind = 'cond-clause';
        } else if (lower === 'quote') {
          childKind = 'data';
        } else if (lower === 'foreach') {
          if (slot === 0) childKind = 'symbol';
          else childKind = 'code';
        } else if (lower === 'setq' || lower === 'set') {
          // setq pairs are (sym expr sym expr ...). Even slots = symbol, odd = code
          childKind = (slot % 2 === 0) ? 'symbol' : 'code';
        }
      }
      // cond-clause: every child is code (including the test which IS code).
      // arglist: handled above as 'arglist' / 'data'.

      if (clean[p] === '(') {
        if (childKind === 'symbol') childKind = 'data'; // shouldn't happen but be safe
        p = walkList(p, childKind === 'arglist' ? 'arglist' : childKind);
      } else if (clean[p] === "'") {
        p++;
        if (p < n && clean[p] === '(') p = walkList(p, 'data');
        else { const r = readSymbol(p); p = r.end; }
      } else if (/\s/.test(clean[p])) {
        p++;
        continue; // don't increment slot until we consume a real token
      } else {
        const r = readSymbol(p);
        p = r.end;
      }
      slot++;
      p = skipWs(p);
    }
    return p < n ? p + 1 : n;
  }

  // Top-level walk
  let p = 0;
  while (p < n) {
    if (clean[p] === '(') p = walkList(p, 'code');
    else if (clean[p] === "'") {
      p++;
      if (p < n && clean[p] === '(') p = walkList(p, 'data');
      else { const r = readSymbol(p); p = r.end; }
    } else if (/\s/.test(clean[p])) {
      p++;
    } else {
      const r = readSymbol(p);
      p = r.end;
    }
  }
  return heads;
}

function isAllowedFunction(sym) {
  if (ALLOWED_FUNCTIONS.has(sym)) return true;
  const lower = sym.toLowerCase();
  if (ALLOWED_FUNCTIONS.has(lower)) return true;
  // Be lenient on commonly-encountered prefixes that follow Autodesk conventions.
  if (/^vla-(get|put|add)-./i.test(sym)) return true;
  if (/^vla-./i.test(sym)) return true;            // any vla-* method
  if (/^vlax-curve-./i.test(sym)) return true;     // vlax-curve-* helpers
  if (/^vlax-./i.test(sym)) return true;           // vlax-* primitives
  if (/^vl-./i.test(sym)) return true;             // vl-* utilities
  if (/^acet-./i.test(sym)) return true;           // express tools
  // User-defined helpers commonly use lowercase-with-hyphens; allow any symbol
  // that is the head of a (defun ...) elsewhere in the same file. The caller
  // handles that lookup; here we only flag truly unknown.
  return false;
}

// --------------------------- core lint ---------------------------

export function lintSource(src, filePath) {
  const issues = [];
  const clean = stripCommentsAndStrings(src);

  // Rule 1: balanced parens
  let opens = 0, closes = 0;
  for (let i = 0; i < clean.length; i++) {
    if (clean[i] === '(') opens++;
    else if (clean[i] === ')') closes++;
  }
  if (opens !== closes) {
    // Try to report the line of the first unmatched paren (depth-1 scan).
    let depth = 0;
    let badIdx = -1;
    for (let i = 0; i < clean.length; i++) {
      if (clean[i] === '(') depth++;
      else if (clean[i] === ')') {
        if (depth === 0) { badIdx = i; break; }
        depth--;
      }
    }
    if (badIdx === -1 && opens > closes) {
      // Last unclosed open; harder to pinpoint - report file:1:1
      badIdx = 0;
    }
    const { line, col } = lineColFromIndex(src, Math.max(0, badIdx));
    issues.push({
      level: 'error',
      code: 'UNBALANCED_PARENS',
      line, col,
      message: `${opens} opens / ${closes} closes`,
    });
  }

  // Rule 2: trailing (princ)
  // The last top-level s-expression must be exactly (princ).
  const last = lastTopLevelExpr(clean);
  if (!last) {
    issues.push({
      level: 'error',
      code: 'MISSING_TRAILING_PRINC',
      line: 1, col: 1,
      message: 'file contains no s-expressions',
    });
  } else {
    const lastText = src.slice(last.start, last.end + 1).trim();
    if (!/^\(\s*princ\s*\)$/i.test(lastText)) {
      const { line, col } = lineColFromIndex(src, last.start);
      issues.push({
        level: 'error',
        code: 'MISSING_TRAILING_PRINC',
        line, col,
        message: `last form is not (princ): ${lastText.slice(0, 40).replace(/\s+/g, ' ')}...`,
      });
    }
  }

  // Rule 3: localized vars in (defun c:NAME ...)
  // Look for (defun c:NAME LIST ...) and check LIST contains /
  // Regex on cleaned source so comments don't fool us.
  const defunCmdRe = /\(\s*defun\s+(c:\S+|C:\S+)\s*\(([^()]*)\)/g;
  let m;
  while ((m = defunCmdRe.exec(clean)) !== null) {
    const name = m[1];
    const arglist = m[2];
    if (!/\//.test(arglist)) {
      const idx = m.index;
      const { line, col } = lineColFromIndex(src, idx);
      issues.push({
        level: 'warning',
        code: 'UNLOCALIZED_VARS',
        line, col,
        message: `(defun ${name} (${arglist.trim()}) ...) has no / separator; locals may leak`,
      });
    }
  }

  // Find defuns and their names so we can treat them as allowed heads.
  const userDefined = new Set();
  const defunRe = /\(\s*defun(?:-q)?\s+([^\s()]+)/g;
  while ((m = defunRe.exec(clean)) !== null) {
    userDefined.add(m[1]);
    userDefined.add(m[1].toLowerCase());
  }

  // Rule 4: unknown heads (warnings)
  const heads = collectListHeads(clean);
  const reported = new Set();
  for (const h of heads) {
    const sym = h.symbol;
    if (isAllowedFunction(sym)) continue;
    if (userDefined.has(sym) || userDefined.has(sym.toLowerCase())) continue;
    // Skip 'defun (handled separately) and certain forms that begin with c:
    if (/^c:/i.test(sym)) continue;
    const key = sym;
    if (reported.has(key)) continue;
    reported.add(key);
    const { line, col } = lineColFromIndex(src, h.index);
    issues.push({
      level: 'warning',
      code: 'UNKNOWN_FUNCTION',
      line, col,
      message: `head '${sym}' is not in the AutoLISP allow-list`,
    });
  }

  // Rule 5: cmdecho / osmode save-restore
  // Flag (setvar "CMDECHO" ...) when there is no matching (getvar "CMDECHO" ...).
  for (const sysvar of ['CMDECHO', 'OSMODE']) {
    const setRe = new RegExp(`\\(\\s*setvar\\s+"${sysvar}"`, 'i');
    const getRe = new RegExp(`\\(\\s*getvar\\s+"${sysvar}"`, 'i');
    // search the original source for setvar/getvar so that strings count.
    // setvar/getvar of a sysvar IS inside a string literal so stripCommentsAndStrings
    // would have erased it - we must scan the raw source.
    if (setRe.test(src) && !getRe.test(src)) {
      const idx = src.search(setRe);
      const { line, col } = lineColFromIndex(src, idx);
      issues.push({
        level: 'warning',
        code: 'SYSVAR_UNSAVED',
        line, col,
        message: `${sysvar} is changed via setvar but never saved via getvar`,
      });
    }
  }

  // Rule 6: missing top-of-file comment header
  // The first non-blank line must start with ;
  const firstLine = src.split('\n').find((l) => l.trim().length > 0) || '';
  if (!firstLine.trimStart().startsWith(';')) {
    issues.push({
      level: 'error',
      code: 'MISSING_HEADER_COMMENT',
      line: 1, col: 1,
      message: 'file must start with a ; comment header (routine name, purpose, license)',
    });
  }

  return issues;
}

// --------------------------- fixers ----------------------------

function applySafeFixes(src) {
  let out = src;
  let changed = false;
  // Trailing (princ): append if missing.
  const clean = stripCommentsAndStrings(out);
  const last = lastTopLevelExpr(clean);
  const needs =
    !last ||
    !/^\(\s*princ\s*\)$/i.test(out.slice(last.start, last.end + 1).trim());
  if (needs) {
    if (!out.endsWith('\n')) out += '\n';
    out += '(princ)\n';
    changed = true;
  }
  return { src: out, changed };
}

// ----------------------------- main -----------------------------

async function main() {
  const argv = process.argv.slice(2);
  const opts = parseArgs(argv);
  if (opts.help) {
    process.stdout.write(HELP);
    process.exit(0);
  }

  let files;
  if (opts.paths.length) {
    files = [];
    for (const p of opts.paths) {
      const abs = resolve(process.cwd(), p);
      let s;
      try { s = await stat(abs); } catch { continue; }
      if (s.isDirectory()) files.push(...(await walk(abs)));
      else files.push(abs);
    }
  } else {
    files = await walk(DEFAULT_DIR);
  }

  files.sort();

  let errors = 0;
  let warnings = 0;
  for (const f of files) {
    let src = await readFile(f, 'utf8');
    if (opts.fix) {
      const { src: fixed, changed } = applySafeFixes(src);
      if (changed) {
        await writeFile(f, fixed);
        src = fixed;
      }
    }
    const issues = lintSource(src, f);
    const rel = relative(ROOT, f);
    for (const it of issues) {
      if (it.level === 'error') errors++;
      else warnings++;
      if (it.level === 'warning' && opts.quiet) continue;
      const tag = it.level;
      process.stdout.write(`${rel}:${it.line}:${it.col} ${tag} ${it.code}: ${it.message}\n`);
    }
  }

  const total = files.length;
  process.stdout.write(`\n${total} file(s) checked: ${errors} error(s), ${warnings} warning(s)\n`);

  if (errors > 0) process.exit(1);
  if (opts.strict && warnings > 0) process.exit(2);
  process.exit(0);
}

// Allow this module to be imported by tests without executing main().
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('lint-lisp.mjs')) {
  main().catch((e) => { console.error(e); process.exit(2); });
}
