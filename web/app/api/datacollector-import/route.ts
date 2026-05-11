import { NextRequest, NextResponse } from "next/server";

import {
  detectFormat,
  importText,
  type DcFormat,
  type DcImportResult,
} from "@civil3d-master-guide/datacollector-import";

const KNOWN_FORMATS: DcFormat[] = [
  "trimble-csv",
  "topcon-csv",
  "carlson-rw5",
  "generic-pnezd",
  "generic-nezd",
  "generic-pxyz",
];

const BINARY_EXTENSIONS = new Set(["crd", "crdb", "job", "dc"]);

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctype = req.headers.get("content-type") ?? "";

  let text: string | null = null;
  let filename: string | undefined;
  let formatHint: DcFormat | undefined;

  if (ctype.startsWith("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return bad("Missing 'file' in multipart payload.");
    filename = file.name;
    const ext = filename.toLowerCase().split(".").pop() ?? "";
    if (BINARY_EXTENSIONS.has(ext)) {
      return bad(
        `Binary collector format ".${ext}" is not supported. Export your job to CSV (PNEZD) from the data collector first. See /docs/civil3d/points/datacollector-formats.`,
        415,
      );
    }
    const buf = await file.arrayBuffer();
    // UTF-8 with BOM tolerance.
    let raw = new TextDecoder("utf-8").decode(buf);
    if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
    text = raw;
    const fmt = form.get("format");
    if (typeof fmt === "string" && (KNOWN_FORMATS as string[]).includes(fmt)) {
      formatHint = fmt as DcFormat;
    }
  } else {
    let body: { text?: string; format?: string; filename?: string };
    try {
      body = (await req.json()) as typeof body;
    } catch {
      return bad("Body must be JSON or multipart/form-data.");
    }
    if (typeof body.text !== "string" || body.text.length === 0) {
      return bad("Missing 'text' in JSON payload.");
    }
    text = body.text;
    filename = body.filename;
    if (typeof body.format === "string" && (KNOWN_FORMATS as string[]).includes(body.format)) {
      formatHint = body.format as DcFormat;
    }
  }

  const detected = formatHint ?? detectFormat(text, filename);
  if (detected === "unknown") {
    return NextResponse.json(
      {
        error:
          "Could not auto-detect format. Pick a format manually and re-submit.",
        detected: "unknown",
      },
      { status: 422 },
    );
  }

  const result: DcImportResult = importText(text, detected as DcFormat);
  return NextResponse.json(result);
}
