import { NextRequest } from "next/server";
import { getLispEntry, readLispDoc, readLispSource } from "@/lib/lisp";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } },
) {
  const entry = getLispEntry(params.name);
  if (!entry) {
    return new Response("Not found", { status: 404 });
  }
  const format = (req.nextUrl.searchParams.get("format") ?? "lsp").toLowerCase();
  if (format === "md" || format === "markdown" || format === "doc") {
    const doc = readLispDoc(entry);
    if (doc == null) return new Response("Not found", { status: 404 });
    return new Response(doc, {
      headers: { "content-type": "text/markdown; charset=utf-8" },
    });
  }
  if (format === "lsp" || format === "lisp" || format === "source") {
    const src = readLispSource(entry);
    if (src == null) return new Response("Not found", { status: 404 });
    return new Response(src, {
      headers: { "content-type": "text/x-autolisp; charset=utf-8" },
    });
  }
  return new Response("Unsupported format. Use ?format=lsp or ?format=md.", {
    status: 400,
  });
}
