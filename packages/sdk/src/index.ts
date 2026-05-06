/**
 * @civil3d-master-guide/sdk
 *
 * Pure-function survey and civil-engineering calculators.
 * Zero dependencies. Works in Node.js, Deno, Bun, or the browser.
 */

export {
  // Existing calculators
  verticalCurve,
  horizontalCurve,
  rationalMethod,
  manningsOpenChannel,
  statePlaneIndianaCsf,
  traverseClosure,
  metesAndBoundsWriter,
  // New calculators
  inverse,
  bearingBearingIntersection,
  bearingDistanceIntersection,
  distanceDistanceIntersection,
  levelLoopAdjustment,
  areaByCoordinates,
  curveStakeout,
  trigLeveling,
  solarObservation,
  gridToGround,
} from "./calculators/index.js";

export type {
  // Existing types
  VerticalCurveInput,
  VerticalCurveResult,
  HorizontalCurveInput,
  HorizontalCurveResult,
  RationalMethodInput,
  RationalMethodResult,
  ManningsOpenChannelInput,
  ManningsOpenChannelResult,
  StatePlaneIndianaCsfInput,
  StatePlaneIndianaCsfResult,
  TraverseClosureInput,
  TraverseClosureResult,
  TraverseLeg,
  MetesAndBoundsInput,
  MetesAndBoundsResult,
  Coordinate,
  // New types
  InverseInput,
  InverseResult,
  BearingBearingIntersectionInput,
  BearingBearingIntersectionResult,
  BearingDistanceIntersectionInput,
  BearingDistanceIntersectionResult,
  DistanceDistanceIntersectionInput,
  DistanceDistanceIntersectionResult,
  LevelLoopAdjustmentInput,
  LevelLoopAdjustmentResult,
  AreaByCoordinatesInput,
  AreaByCoordinatesResult,
  CurveStakeoutInput,
  CurveStakeoutResult,
  TrigLevelingInput,
  TrigLevelingResult,
  SolarObservationInput,
  SolarObservationResult,
  GridToGroundInput,
  GridToGroundResult,
} from "./calculators/index.js";
