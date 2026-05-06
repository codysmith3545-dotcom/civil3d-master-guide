# @civil3d-master-guide/sdk

Pure-function survey and civil-engineering calculators extracted from the Civil 3D Master Guide. Zero runtime dependencies.

## Installation

```bash
npm install @civil3d-master-guide/sdk
```

## Usage

Import individual calculators from the `/calculators` sub-path:

```ts
import { rationalMethod } from '@civil3d-master-guide/sdk/calculators';

const result = rationalMethod({ c: 0.85, i_in_hr: 4.2, a_acres: 12 });
console.log(result.q_cfs); // peak runoff in cfs
```

Or import everything from the package root:

```ts
import { inverse, traverseClosure, areaByCoordinates } from '@civil3d-master-guide/sdk';
```

## Available Calculators

| Function | Description |
|---|---|
| `verticalCurve` | AASHTO vertical curve K-value and minimum length |
| `horizontalCurve` | Circular horizontal curve geometry (T, L, M, E, LC) |
| `rationalMethod` | Rational method peak runoff Q = CiA |
| `manningsOpenChannel` | Manning's equation for open-channel flow |
| `statePlaneIndianaCsf` | Indiana State Plane combined scale factor approximation |
| `traverseClosure` | Compass-rule traverse closure and adjustment |
| `metesAndBoundsWriter` | Generate metes-and-bounds legal descriptions |
| `inverse` | Inverse (COGO): azimuth, bearing, and distance between two points |
| `bearingBearingIntersection` | Intersection of two bearing lines |
| `bearingDistanceIntersection` | Intersection of a bearing line and a circle |
| `distanceDistanceIntersection` | Intersection of two circles |
| `levelLoopAdjustment` | Differential leveling loop adjustment |
| `areaByCoordinates` | Area by coordinates (shoelace formula) |
| `curveStakeout` | Curve stakeout table (deflection or chord-offset) |
| `trigLeveling` | Trigonometric leveling from slope distance and zenith angle |
| `solarObservation` | Solar observation (sun-shot) azimuth determination |
| `gridToGround` | Grid-to-ground / ground-to-grid distance and coordinate conversion |

## Design Principles

- Every calculator is a pure function: no side effects, no file system access.
- Every result includes a `source` string citing the reference standard or textbook.
- Many results include a `notes` array with warnings and caveats.
- All units are US customary (feet, acres, degrees) unless otherwise noted.
