import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LISP cheat sheet (printable)",
  description:
    "One-page printable summary of the top AutoLISP/AutoCAD commands and helpers commonly used by surveyors and Civil 3D drafters.",
};

// Top 20 AutoCAD/AutoLISP commands and built-in helpers commonly used by
// surveyors and Civil 3D drafters. Sourced from Autodesk help and the
// in-repo /content/customization/lisp/ pages.
const ROWS: Array<{ cmd: string; usage: string }> = [
  { cmd: "(setq sym val)", usage: "Bind a value to a symbol." },
  { cmd: "(getpoint [pt] [prompt])", usage: "Prompt the user for a point pick (optional base + prompt)." },
  { cmd: "(getstring [cr] [prompt])", usage: "Prompt for a string. cr=T allows spaces." },
  { cmd: "(getreal [prompt]) / (getint [prompt])", usage: "Prompt for a real / integer number." },
  { cmd: "(command \"_LINE\" p1 p2 \"\")", usage: "Issue a CAD command with arguments. Use the underscore prefix for English names." },
  { cmd: "(ssget [filter])", usage: "Build a selection set; pass a DXF filter list to constrain it." },
  { cmd: "(entget ent)", usage: "Get the DXF group list for an entity. Layer is (cdr (assoc 8 ...))." },
  { cmd: "(entmod elist)", usage: "Modify an entity by writing back its DXF list." },
  { cmd: "(entmake elist)", usage: "Create a new entity from a DXF list." },
  { cmd: "(vl-load-com)", usage: "Load the COM/ActiveX bridge so vla-* / vlax-* are available." },
  { cmd: "(vlax-curve-getPointAtParam c p)", usage: "Walk a curve (poly, arc, alignment) by parameter." },
  { cmd: "(vlax-ename->vla-object e)", usage: "Convert an entity name to a VLA object for property access." },
  { cmd: "LAYFRZ / LAYTHW / LAYISO", usage: "Built-in layer freeze/thaw/isolate commands." },
  { cmd: "LIST / DBLIST", usage: "Print entity properties to the command line." },
  { cmd: "QSELECT", usage: "Quick-select by property — handy alternative to (ssget) filters." },
  { cmd: "MEASUREGEOM", usage: "Measure distance, radius, angle, area, volume." },
  { cmd: "ID / DIST", usage: "Report point coordinates or distance between two picks." },
  { cmd: "PURGE / -PURGE", usage: "Remove unused styles, blocks, layers." },
  { cmd: "AUDIT / RECOVER", usage: "Diagnose and repair drawing corruption (use with backup)." },
  { cmd: "APPLOAD / (load \"file.lsp\")", usage: "Load a LISP file. APPLOAD remembers it across sessions." },
];

export default function LispCheatSheet() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 print:py-2">
      <header className="mb-4 print:mb-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          AutoLISP &amp; AutoCAD field cheat sheet
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          Top 20 commands and helpers for survey/Civil 3D field-day reference.
          Sources: Autodesk AutoLISP Developer&apos;s Guide; internal LISP library.
        </p>
        <p className="mt-1 text-xs text-ink-500 print:hidden">
          Tip: use your browser&apos;s Print dialog (Ctrl/Cmd + P) to print this page on a single sheet.
        </p>
      </header>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-ink-300 text-left">
            <th className="py-1 pr-3 align-top">Command / form</th>
            <th className="py-1 align-top">Usage</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.cmd} className="border-b border-ink-100 align-top">
              <td className="py-1 pr-3 font-mono text-xs">{r.cmd}</td>
              <td className="py-1 text-sm">{r.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-xs text-ink-500">
        Always test custom routines on a backup drawing. AutoCAD command names
        are localized; prefix with an underscore (e.g. <code>_LINE</code>) to
        invoke the English name regardless of the user&apos;s language pack.
      </p>
    </div>
  );
}
