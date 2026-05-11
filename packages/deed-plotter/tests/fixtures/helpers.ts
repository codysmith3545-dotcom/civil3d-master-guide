import type {
  Bearing,
  BearingQuadrant,
  CurveCourse,
  LineCourse,
  ParsedTraverse,
} from "../../src/types.js";

/**
 * Build a Bearing object from an azimuth (degrees clockwise from north).
 */
export function bearingFromAzimuth(azimuthDeg: number, raw?: string): Bearing {
  let az = ((azimuthDeg % 360) + 360) % 360;
  let quadrant: BearingQuadrant;
  let theta: number;
  if (az <= 90) {
    quadrant = "NE";
    theta = az;
  } else if (az <= 180) {
    quadrant = "SE";
    theta = 180 - az;
  } else if (az <= 270) {
    quadrant = "SW";
    theta = az - 180;
  } else {
    quadrant = "NW";
    theta = 360 - az;
  }
  const degrees = Math.floor(theta);
  const minutesFloat = (theta - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60 * 100) / 100;
  return {
    raw: raw ?? `${quadrant[0]} ${degrees}°${minutes}'${seconds}" ${quadrant[1]}`,
    quadrant,
    degrees,
    minutes,
    seconds,
    azimuthDeg: az,
  };
}

export function line(
  index: number,
  azimuthDeg: number,
  distanceFt: number,
  raw?: string,
): LineCourse {
  const b = bearingFromAzimuth(azimuthDeg);
  return {
    type: "line",
    bearing: b,
    distanceFt,
    raw: raw ?? `Thence ${b.raw}, ${distanceFt} feet`,
    index,
  };
}

export function curve(
  index: number,
  direction: "left" | "right",
  opts: Partial<Omit<CurveCourse, "type" | "direction" | "raw" | "index">> & {
    raw?: string;
  } = {},
): CurveCourse {
  const { raw, ...rest } = opts;
  return {
    type: "curve",
    direction,
    radiusFt: rest.radiusFt as number,
    arcLengthFt: rest.arcLengthFt,
    deltaDeg: rest.deltaDeg,
    chordFt: rest.chordFt,
    chordBearing: rest.chordBearing,
    tangentFt: rest.tangentFt,
    raw: raw ?? `Thence on a curve, ${direction}`,
    index,
  };
}

export function traverse(courses: (LineCourse | CurveCourse)[], unparsedCount = 0): ParsedTraverse {
  return {
    courses,
    unparsed: Array.from({ length: unparsedCount }, (_, i) => ({
      text: `??`,
      offset: i,
    })),
    normalizedText: courses.map((c) => c.raw).join(" "),
  };
}
