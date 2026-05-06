import { cookies } from "next/headers";
import { verifyToken } from "./invites";
import type { Page } from "./content";

export const INVITE_COOKIE = "kb_invite";

export async function hasValidInvite(): Promise<boolean> {
  const jar = cookies();
  const tok = jar.get(INVITE_COOKIE)?.value;
  if (!tok) return false;
  const payload = await verifyToken(tok);
  return payload !== null;
}

/**
 * Returns true when the page may be shown to the current viewer.
 * Pages with `visibility: invite` require a valid `kb_invite` cookie.
 */
export async function canView(page: Page): Promise<boolean> {
  const v = page.frontmatter.visibility ?? "public";
  if (v !== "invite") return true;
  return hasValidInvite();
}

/**
 * Cheap check that mirrors `canView` but accepts a raw visibility string.
 * Useful for gating a non-page route.
 */
export async function checkVisibility(
  visibility: string | undefined,
): Promise<boolean> {
  if (!visibility || visibility === "public") return true;
  if (visibility === "invite") return hasValidInvite();
  return true;
}
