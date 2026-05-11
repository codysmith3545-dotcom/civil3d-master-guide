/**
 * Public types for @civil3d-master-guide/landxml-validator.
 */

export interface LandXmlElement {
  name: string;
  attrs: Record<string, string>;
  children: LandXmlElement[];
  text?: string;
}

export interface LandXmlSummary {
  schemaVersion: string;
  application?: { name?: string; version?: string; manufacturer?: string };
  units?: { linear?: string; area?: string; volume?: string; angular?: string };
  surfaces: {
    name: string;
    pntCount: number;
    faceCount: number;
    minElev?: number;
    maxElev?: number;
  }[];
  alignments: {
    name: string;
    staStart: number;
    staEnd: number;
    pviCount: number;
  }[];
  parcels: { name: string; areaSqFt?: number; coordCount: number }[];
  surveys: {
    name: string;
    instrumentCount: number;
    observationCount: number;
  }[];
  cgPoints: {
    count: number;
    minNorthing: number;
    maxNorthing: number;
    minEasting: number;
    maxEasting: number;
  };
  warnings: ValidationIssue[];
  errors: ValidationIssue[];
}

export type IssueSeverity = "error" | "warning" | "info";

export interface ValidationIssue {
  severity: IssueSeverity;
  code: string;
  message: string;
  xpath?: string;
}

export type ValidationCode =
  | "MISSING_VERSION"
  | "UNSUPPORTED_VERSION"
  | "MISSING_UNITS"
  | "MIXED_UNITS"
  | "EMPTY_SURFACE"
  | "ALIGNMENT_NO_GEOM"
  | "PARCEL_NOT_CLOSED"
  | "NEGATIVE_AREA"
  | "INVALID_COORD"
  | "LARGE_COORD";
