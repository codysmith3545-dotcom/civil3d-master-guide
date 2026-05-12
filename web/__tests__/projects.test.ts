/**
 * Unit tests for `web/lib/projects.ts`.
 *
 * Supabase is mocked end-to-end so the tests can run without network or
 * a live Postgres. Run with `pnpm --filter web test` once vitest is wired
 * up in the workspace.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Row = Record<string, unknown>;

/**
 * Minimal mock of the Supabase query builder. Each `from(table)` call
 * returns a fresh builder that records every chained call so tests can
 * assert against it.
 */
function makeMockClient(result: { data: Row | Row[] | null; error: { message: string } | null }) {
  const calls: Array<{ method: string; args: unknown[] }> = [];

  const builder: Record<string, unknown> = {};
  const chain = (method: string) =>
    (...args: unknown[]) => {
      calls.push({ method, args });
      return builder;
    };

  builder.select = chain("select");
  builder.insert = chain("insert");
  builder.delete = chain("delete");
  builder.eq = chain("eq");
  builder.order = chain("order");
  builder.single = vi.fn(async () => result);
  builder.maybeSingle = vi.fn(async () => result);
  // Make the builder thenable so `await query` resolves to the result
  // for queries that don't terminate in single/maybeSingle (e.g. list, delete).
  builder.then = (resolve: (v: typeof result) => unknown) => resolve(result);

  const client = {
    from: vi.fn((table: string) => {
      calls.push({ method: "from", args: [table] });
      return builder;
    }),
  };

  return { client, calls, builder };
}

// We have to set up the mock BEFORE importing the module under test.
vi.mock("../lib/supabase", () => {
  return {
    getServerSupabase: () => (globalThis as { __mockSupabase?: unknown }).__mockSupabase,
  };
});

import { createProject, deleteProject, getProject, listProjects } from "../lib/projects";

const USER_ID = "11111111-1111-1111-1111-111111111111";
const PROJECT_ID = "22222222-2222-2222-2222-222222222222";

function install(mock: ReturnType<typeof makeMockClient>) {
  (globalThis as { __mockSupabase?: unknown }).__mockSupabase = mock.client;
}

beforeEach(() => {
  (globalThis as { __mockSupabase?: unknown }).__mockSupabase = undefined;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("listProjects", () => {
  it("filters by owner_user_id and orders by created_at desc", async () => {
    const rows = [
      { id: PROJECT_ID, owner_user_id: USER_ID, name: "Demo", slug: "demo" },
    ];
    const mock = makeMockClient({ data: rows, error: null });
    install(mock);

    const result = await listProjects(USER_ID);
    expect(result).toEqual(rows);
    expect(mock.client.from).toHaveBeenCalledWith("projects");

    const eqCall = mock.calls.find((c) => c.method === "eq");
    expect(eqCall?.args).toEqual(["owner_user_id", USER_ID]);

    const orderCall = mock.calls.find((c) => c.method === "order");
    expect(orderCall?.args[0]).toBe("created_at");
    expect(orderCall?.args[1]).toMatchObject({ ascending: false });
  });

  it("throws when supabase is not configured", async () => {
    (globalThis as { __mockSupabase?: unknown }).__mockSupabase = null;
    await expect(listProjects(USER_ID)).rejects.toThrow(/not configured/i);
  });
});

describe("createProject", () => {
  it("inserts a row on the projects table with the supplied owner", async () => {
    const row = {
      id: PROJECT_ID,
      owner_user_id: USER_ID,
      name: "Carmel Subdivision",
      slug: "carmel-subdivision",
    };
    const mock = makeMockClient({ data: row, error: null });
    install(mock);

    const result = await createProject(USER_ID, {
      name: "Carmel Subdivision",
      slug: "carmel-subdivision",
    });

    expect(result).toEqual(row);
    expect(mock.client.from).toHaveBeenCalledWith("projects");
    const insertCall = mock.calls.find((c) => c.method === "insert");
    expect(insertCall?.args[0]).toMatchObject({
      owner_user_id: USER_ID,
      name: "Carmel Subdivision",
      slug: "carmel-subdivision",
    });
  });

  it("rejects malformed slugs without calling supabase", async () => {
    const mock = makeMockClient({ data: null, error: null });
    install(mock);
    await expect(
      createProject(USER_ID, { name: "X", slug: "Has Spaces" }),
    ).rejects.toThrow(/slug/i);
    expect(mock.client.from).not.toHaveBeenCalled();
  });
});

describe("getProject", () => {
  it("returns null when no row matches", async () => {
    const mock = makeMockClient({ data: null, error: null });
    install(mock);
    const result = await getProject(USER_ID, "missing-slug");
    expect(result).toBeNull();

    // Should have queried by slug because the input is not a UUID.
    const eqCalls = mock.calls.filter((c) => c.method === "eq");
    expect(eqCalls).toContainEqual({
      method: "eq",
      args: ["slug", "missing-slug"],
    });
    expect(eqCalls).toContainEqual({
      method: "eq",
      args: ["owner_user_id", USER_ID],
    });
  });

  it("queries by id when given a UUID", async () => {
    const row = { id: PROJECT_ID, owner_user_id: USER_ID, slug: "demo" };
    const mock = makeMockClient({ data: row, error: null });
    install(mock);
    const result = await getProject(USER_ID, PROJECT_ID);
    expect(result).toEqual(row);
    const eqCalls = mock.calls.filter((c) => c.method === "eq");
    expect(eqCalls).toContainEqual({ method: "eq", args: ["id", PROJECT_ID] });
  });
});

describe("deleteProject", () => {
  it("scopes the delete by id AND owner_user_id", async () => {
    const mock = makeMockClient({ data: null, error: null });
    install(mock);
    await deleteProject(USER_ID, PROJECT_ID);
    const eqCalls = mock.calls.filter((c) => c.method === "eq");
    expect(eqCalls).toContainEqual({
      method: "eq",
      args: ["owner_user_id", USER_ID],
    });
    expect(eqCalls).toContainEqual({ method: "eq", args: ["id", PROJECT_ID] });
  });

  it("rejects non-UUID ids", async () => {
    const mock = makeMockClient({ data: null, error: null });
    install(mock);
    await expect(deleteProject(USER_ID, "not-a-uuid")).rejects.toThrow(/UUID/);
    expect(mock.client.from).not.toHaveBeenCalled();
  });
});
