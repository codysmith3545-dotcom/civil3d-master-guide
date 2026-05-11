import { describe, it, expect, beforeEach } from "vitest";
import { check, _resetRateLimit, clientIp } from "../lib/rate-limit";

describe("rate-limit / check()", () => {
  beforeEach(() => _resetRateLimit());

  it("permits up to `limit` requests in the window", () => {
    for (let i = 0; i < 5; i++) {
      const r = check("test", "1.2.3.4", { limit: 5, windowMs: 60_000 });
      expect(r.ok).toBe(true);
    }
    const blocked = check("test", "1.2.3.4", {
      limit: 5,
      windowMs: 60_000,
    });
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetAt).toBeGreaterThan(Date.now());
  });

  it("keys are independent per IP", () => {
    for (let i = 0; i < 3; i++) {
      expect(
        check("test", "1.1.1.1", { limit: 3, windowMs: 60_000 }).ok,
      ).toBe(true);
    }
    // Different IP starts from zero.
    expect(
      check("test", "2.2.2.2", { limit: 3, windowMs: 60_000 }).ok,
    ).toBe(true);
  });

  it("buckets are independent", () => {
    for (let i = 0; i < 3; i++) {
      check("a", "ip", { limit: 3, windowMs: 60_000 });
    }
    // Bucket `b` is untouched.
    expect(
      check("b", "ip", { limit: 3, windowMs: 60_000 }).ok,
    ).toBe(true);
  });

  it("recovers after the window expires", async () => {
    for (let i = 0; i < 2; i++) {
      check("t", "ip", { limit: 2, windowMs: 30 });
    }
    expect(check("t", "ip", { limit: 2, windowMs: 30 }).ok).toBe(false);
    await new Promise((r) => setTimeout(r, 50));
    expect(check("t", "ip", { limit: 2, windowMs: 30 }).ok).toBe(true);
  });
});

describe("clientIp()", () => {
  it("prefers the first hop of x-forwarded-for", () => {
    const req = new Request("http://example.com", {
      headers: { "x-forwarded-for": "203.0.113.1, 10.0.0.2" },
    });
    expect(clientIp(req)).toBe("203.0.113.1");
  });
  it("falls back to x-real-ip", () => {
    const req = new Request("http://example.com", {
      headers: { "x-real-ip": "198.51.100.7" },
    });
    expect(clientIp(req)).toBe("198.51.100.7");
  });
  it("returns 'unknown' when no header is present", () => {
    const req = new Request("http://example.com");
    expect(clientIp(req)).toBe("unknown");
  });
});
