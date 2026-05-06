import { SignJWT, jwtVerify } from "jose";

const ALG = "HS256";

function getSecret(): Uint8Array {
  const raw = process.env.INVITE_SECRET;
  if (!raw) {
    throw new Error(
      "INVITE_SECRET is not set. Generate one and put it in .env.local before issuing invite tokens.",
    );
  }
  return new TextEncoder().encode(raw);
}

export type InvitePayload = {
  /** Subject — usually the invite recipient's email or a free-form label. */
  sub: string;
  /** Optional notes shown to the operator (not the invitee). */
  note?: string;
};

export async function mintToken(
  payload: InvitePayload,
  ttlSeconds = 60 * 60 * 24 * 30,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT({ note: payload.note ?? "" })
    .setProtectedHeader({ alg: ALG })
    .setSubject(payload.sub)
    .setIssuedAt(now)
    .setExpirationTime(now + ttlSeconds)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<InvitePayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: [ALG],
    });
    if (typeof payload.sub !== "string") return null;
    return { sub: payload.sub, note: (payload.note as string) ?? "" };
  } catch {
    return null;
  }
}
