import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  parseLandXml,
  findFirst,
  findAll,
  childrenNamed,
  LandXmlParseError,
} from "../src/index.js";

const here = dirname(fileURLToPath(import.meta.url));
const fix = (name: string) =>
  readFileSync(join(here, "fixtures", name), "utf8");

describe("parser - basic XML shapes", () => {
  it("parses an empty single-tag element", () => {
    const root = parseLandXml('<LandXML version="1.2"/>');
    expect(root.name).toBe("LandXML");
    expect(root.attrs.version).toBe("1.2");
    expect(root.children).toEqual([]);
  });

  it("parses a root with one child", () => {
    const root = parseLandXml(
      '<LandXML version="1.2"><Units/></LandXML>',
    );
    expect(root.children).toHaveLength(1);
    expect(root.children[0]!.name).toBe("Units");
  });

  it("parses double-quoted attributes", () => {
    const root = parseLandXml('<LandXML version="1.2" foo="bar"/>');
    expect(root.attrs.foo).toBe("bar");
  });

  it("parses single-quoted attributes", () => {
    const root = parseLandXml("<LandXML version='1.2' foo='bar'/>");
    expect(root.attrs.foo).toBe("bar");
  });

  it("decodes named entities in attributes and text", () => {
    const root = parseLandXml(
      '<LandXML version="1.2" desc="a &amp; b"><P>1 &lt; 2</P></LandXML>',
    );
    expect(root.attrs.desc).toBe("a & b");
    expect(root.children[0]!.text).toBe("1 < 2");
  });

  it("decodes numeric entities", () => {
    const root = parseLandXml(
      '<LandXML version="1.2"><P>&#65;&#x42;</P></LandXML>',
    );
    expect(root.children[0]!.text).toBe("AB");
  });

  it("strips comments", () => {
    const root = parseLandXml(
      '<!-- top --><LandXML version="1.2"><!-- inner --><P/></LandXML>',
    );
    expect(root.name).toBe("LandXML");
    expect(root.children[0]!.name).toBe("P");
  });

  it("preserves text inside CDATA", () => {
    const root = parseLandXml(
      '<LandXML version="1.2"><Note><![CDATA[a < b & c]]></Note></LandXML>',
    );
    expect(root.children[0]!.text).toBe("a < b & c");
  });

  it("ignores XML prolog", () => {
    const root = parseLandXml(
      '<?xml version="1.0" encoding="UTF-8"?><LandXML version="1.2"/>',
    );
    expect(root.name).toBe("LandXML");
  });

  it("throws on mismatched closing tag", () => {
    expect(() => parseLandXml('<LandXML version="1.2"></Wrong>')).toThrow(
      LandXmlParseError,
    );
  });

  it("throws on unterminated attribute", () => {
    expect(() => parseLandXml('<LandXML version="1.2 ><P/></LandXML>')).toThrow(
      LandXmlParseError,
    );
  });

  it("throws on empty document", () => {
    expect(() => parseLandXml("   \n\t  ")).toThrow(LandXmlParseError);
  });

  it("throws when input is not a string", () => {
    // @ts-expect-error - intentional type check
    expect(() => parseLandXml(123)).toThrow(TypeError);
  });

  it("reports line/column on parse error", () => {
    try {
      parseLandXml('<LandXML version="1.2">\n  <Bad>\n  </Wrong>\n</LandXML>');
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(LandXmlParseError);
      expect((err as LandXmlParseError).line).toBeGreaterThan(1);
    }
  });

  it("preserves whitespace-significant text in elements with no children", () => {
    const root = parseLandXml(
      '<LandXML version="1.2"><P>100.5 200.5 300.5</P></LandXML>',
    );
    expect(root.children[0]!.text).toBe("100.5 200.5 300.5");
  });
});

describe("parser - traversal helpers", () => {
  const xml = fix("valid-typical.xml");
  const root = parseLandXml(xml);

  it("findFirst locates a named descendant", () => {
    expect(findFirst(root, "Units")).toBeDefined();
    expect(findFirst(root, "Application")).toBeDefined();
  });

  it("findFirst returns undefined for missing nodes", () => {
    expect(findFirst(root, "DoesNotExist")).toBeUndefined();
  });

  it("findFirst with includeSelf matches root", () => {
    expect(findFirst(root, "LandXML", true)).toBe(root);
  });

  it("findAll returns every matching descendant", () => {
    expect(findAll(root, "P").length).toBe(4);
    expect(findAll(root, "F").length).toBe(2);
    expect(findAll(root, "PVI").length).toBe(3);
  });

  it("childrenNamed returns only direct children", () => {
    const surfaces = findFirst(root, "Surfaces")!;
    expect(childrenNamed(surfaces, "Surface")).toHaveLength(1);
  });

  it("findAll returns [] when nothing matches", () => {
    expect(findAll(root, "Nope")).toEqual([]);
  });
});

describe("parser - fixture files load", () => {
  const cases = [
    "valid-typical.xml",
    "missing-version.xml",
    "unsupported-version.xml",
    "missing-units.xml",
    "mixed-units.xml",
    "empty-surface.xml",
    "alignment-no-geom.xml",
    "parcel-not-closed.xml",
    "bad-coords.xml",
  ];
  for (const name of cases) {
    it(`parses ${name} without throwing`, () => {
      expect(() => parseLandXml(fix(name))).not.toThrow();
    });
  }
});
