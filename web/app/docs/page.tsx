import { redirect } from "next/navigation";

// /docs is a synonym for /docs/00-index — the master TOC page in content/.
export default function DocsRoot() {
  redirect("/docs/00-index");
}
