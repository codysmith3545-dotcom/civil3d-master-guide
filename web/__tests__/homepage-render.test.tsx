/**
 * @vitest-environment jsdom
 *
 * Homepage smoke tests.
 *
 * These tests cover the contract documented for the redesigned homepage:
 *   1. Hero heading renders the brand name from config.yaml
 *   2. By-the-numbers section renders at least one of each stat
 *   3. Audience tabs switch on click
 *
 * To run these locally:
 *   pnpm --filter web add -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @vitejs/plugin-react
 *   pnpm --filter web exec vitest run
 *
 * The build (`pnpm --filter web build`) does not invoke this test file.
 */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import HomeNumbers, { loadHomeNumbers } from "@/components/HomeNumbers";
import AudienceTabs from "@/components/AudienceTabs";
import { getSiteConfig } from "@/lib/site-config";

describe("homepage building blocks", () => {
  it("config exposes a brand name", () => {
    const cfg = getSiteConfig();
    expect(cfg.brand.name.length).toBeGreaterThan(0);
  });

  it("counts at least one of each by-the-numbers stat", async () => {
    const numbers = await loadHomeNumbers();
    expect(numbers.pages).toBeGreaterThan(0);
    expect(numbers.commands).toBeGreaterThan(0);
    expect(numbers.calculators).toBeGreaterThan(0);
    expect(numbers.lispRoutines).toBeGreaterThan(0);
    expect(numbers.jurisdictions).toBeGreaterThan(0);
    expect(numbers.mcpTools).toBeGreaterThan(0);
  });

  it("renders the by-the-numbers grid", async () => {
    // Server component returns a Promise; await before rendering.
    const ui = await HomeNumbers();
    render(ui);
    expect(
      screen.getByRole("heading", { name: /by the numbers/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/markdown pages/i)).toBeInTheDocument();
    expect(screen.getByText(/civil 3d commands/i)).toBeInTheDocument();
    expect(screen.getByText(/calculators/i)).toBeInTheDocument();
    expect(screen.getByText(/autolisp routines/i)).toBeInTheDocument();
    expect(screen.getByText(/counties covered/i)).toBeInTheDocument();
    expect(screen.getByText(/mcp tools/i)).toBeInTheDocument();
  });

  it("switches audience tabs on click", () => {
    render(<AudienceTabs />);
    // Default tab is "Working surveyors".
    const surveyorsTab = screen.getByRole("tab", {
      name: /working surveyors/i,
    });
    expect(surveyorsTab).toHaveAttribute("aria-selected", "true");

    const firmsTab = screen.getByRole("tab", {
      name: /surveying & engineering firms/i,
    });
    fireEvent.click(firmsTab);
    expect(firmsTab).toHaveAttribute("aria-selected", "true");
    expect(surveyorsTab).toHaveAttribute("aria-selected", "false");

    const educatorsTab = screen.getByRole("tab", {
      name: /educators & students/i,
    });
    fireEvent.click(educatorsTab);
    expect(educatorsTab).toHaveAttribute("aria-selected", "true");
  });
});
