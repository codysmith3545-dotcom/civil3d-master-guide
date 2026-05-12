# Frontmatter audit — 2026-05-11

- Files scanned: 460
- Errors: 0 (must fix before merge)
- Warnings: 467 (review needed)

Rule severity follows CONTRIBUTING.md and CLAUDE.md. Errors block merge; warnings need human review.

## Coverage notes

- `content/customization/lisp/` is treated as full content (same frontmatter rules). The task spec mentioned a `library/<category>/` subtree of 50 routine docs; that subtree does not yet exist in this worktree (Quality-LispLint or a content agent will add it). When those pages land, this auditor will pick them up automatically because it walks `content/` recursively.
- `content/jurisdictions/indiana/**` and `content/field-and-boundary/legal-descriptions/**` are covered.

## Errors

_No errors._

## Warnings

| File | Rule | Detail |
|------|------|--------|
| `content/00-index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/alignments/alignment-creation-tools.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/alignments/alignment-from-polyline.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/alignments/alignment-labels.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/alignments/design-criteria.md` | BAD_SOURCE | source missing `title` |
| `content/civil3d/alignments/design-criteria.md` | BAD_SOURCE | source `https://help.autodesk.com/view/CIV3D/2025/ENU/?guid=GUID-1F2E1C52-3A96-4F9D-B6A5-E9E0E6F7F8A0` missing `verified` date |
| `content/civil3d/alignments/editing-alignments.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/alignments/horizontal-alignment-basics.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/alignments/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/alignments/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/alignments/offset-alignments.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/alignments/stationing-equations.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/alignments.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/alignments.md` | POSSIBLE_INVENTED_COMMAND | `AlignmentProperties` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/alignments.md` | POSSIBLE_INVENTED_COMMAND | `EditAlignmentLabelGroup` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/alignments.md` | POSSIBLE_INVENTED_COMMAND | `CreateAlignmentReference` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/alignments.md` | POSSIBLE_INVENTED_COMMAND | `ReverseAlignmentDirection` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/alignments.md` | POSSIBLE_INVENTED_COMMAND | `StationOffsetAlignmentLabels` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/corridors.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/corridors.md` | POSSIBLE_INVENTED_COMMAND | `EditCorridor` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/corridors.md` | POSSIBLE_INVENTED_COMMAND | `CorridorProperties` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/corridors.md` | POSSIBLE_INVENTED_COMMAND | `CreateCorridorSurface` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/corridors.md` | POSSIBLE_INVENTED_COMMAND | `CreateSampleLines` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/corridors.md` | POSSIBLE_INVENTED_COMMAND | `CreateSectionView` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/corridors.md` | POSSIBLE_INVENTED_COMMAND | `CreateMultipleSectionViews` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/corridors.md` | POSSIBLE_INVENTED_COMMAND | `RebuildCorridor` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/corridors.md` | POSSIBLE_INVENTED_COMMAND | `AddBaseline` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/corridors.md` | POSSIBLE_INVENTED_COMMAND | `AddRegion` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/data-shortcuts.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/data-shortcuts.md` | POSSIBLE_INVENTED_COMMAND | `CreateDataShortcuts` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/data-shortcuts.md` | POSSIBLE_INVENTED_COMMAND | `DataShortcutsManager` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/data-shortcuts.md` | POSSIBLE_INVENTED_COMMAND | `SetWorkingFolder` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/data-shortcuts.md` | POSSIBLE_INVENTED_COMMAND | `NewShortcutsFolder` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/data-shortcuts.md` | POSSIBLE_INVENTED_COMMAND | `SetShortcutsFolder` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/data-shortcuts.md` | POSSIBLE_INVENTED_COMMAND | `AssociateShortcutsToProject` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/data-shortcuts.md` | POSSIBLE_INVENTED_COMMAND | `PromoteToObject` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/data-shortcuts.md` | POSSIBLE_INVENTED_COMMAND | `SynchronizeReferences` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/drafting.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/grading.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/grading.md` | POSSIBLE_INVENTED_COMMAND | `CreateFeatureLineFromObject` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/grading.md` | POSSIBLE_INVENTED_COMMAND | `EditFeatureLineElevations` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/grading.md` | POSSIBLE_INVENTED_COMMAND | `GradingCreate` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/grading.md` | POSSIBLE_INVENTED_COMMAND | `CreateFeatureLines` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/grading.md` | POSSIBLE_INVENTED_COMMAND | `FitCurve` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/grading.md` | POSSIBLE_INVENTED_COMMAND | `Smooth` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/grading.md` | POSSIBLE_INVENTED_COMMAND | `GradingGroupProperties` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/grading.md` | POSSIBLE_INVENTED_COMMAND | `GradingCreateInfill` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/grading.md` | POSSIBLE_INVENTED_COMMAND | `EditGradingProperties` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/grading.md` | POSSIBLE_INVENTED_COMMAND | `ApplyFeatureLineStyle` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/parcels.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/parcels.md` | POSSIBLE_INVENTED_COMMAND | `CreateParcelFromObjects` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/parcels.md` | POSSIBLE_INVENTED_COMMAND | `CreateParcelByLayout` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/parcels.md` | POSSIBLE_INVENTED_COMMAND | `CreateRightOfWay` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/parcels.md` | POSSIBLE_INVENTED_COMMAND | `EditParcelProperties` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/parcels.md` | POSSIBLE_INVENTED_COMMAND | `AddParcelArea` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/parcels.md` | POSSIBLE_INVENTED_COMMAND | `AddParcelSegmentLabel` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/parcels.md` | POSSIBLE_INVENTED_COMMAND | `ParcelLayoutTools` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/parcels.md` | POSSIBLE_INVENTED_COMMAND | `ReverseParcelDirection` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/parcels.md` | POSSIBLE_INVENTED_COMMAND | `EditParcelSegments` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pipe-networks.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/pipe-networks.md` | POSSIBLE_INVENTED_COMMAND | `Structure` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pipe-networks.md` | POSSIBLE_INVENTED_COMMAND | `CreateNetwork` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pipe-networks.md` | POSSIBLE_INVENTED_COMMAND | `CreateNetworkFromObject` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pipe-networks.md` | POSSIBLE_INVENTED_COMMAND | `DrawNetworkInProfileView` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pipe-networks.md` | POSSIBLE_INVENTED_COMMAND | `EditNetwork` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pipe-networks.md` | POSSIBLE_INVENTED_COMMAND | `EditNetworkInProfileView` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pipe-networks.md` | POSSIBLE_INVENTED_COMMAND | `RenamePartsInNetwork` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pipe-networks.md` | POSSIBLE_INVENTED_COMMAND | `NetworkProperties` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pipe-networks.md` | POSSIBLE_INVENTED_COMMAND | `CreatePartsList` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pipe-networks.md` | POSSIBLE_INVENTED_COMMAND | `RunInterferenceCheck` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/plan-production.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/plan-production.md` | POSSIBLE_INVENTED_COMMAND | `CreateViewFrames` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/plan-production.md` | POSSIBLE_INVENTED_COMMAND | `CreateSheets` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/plan-production.md` | POSSIBLE_INVENTED_COMMAND | `ViewportType` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/plan-production.md` | POSSIBLE_INVENTED_COMMAND | `EditViewFrameGroupProperties` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/plan-production.md` | POSSIBLE_INVENTED_COMMAND | `CreateMatchLines` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/plan-production.md` | POSSIBLE_INVENTED_COMMAND | `EditMatchLineProperties` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/plan-production.md` | POSSIBLE_INVENTED_COMMAND | `RepathSheetSet` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/plot.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/points.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/points.md` | POSSIBLE_INVENTED_COMMAND | `PointGroupProperties` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/points.md` | POSSIBLE_INVENTED_COMMAND | `EditPointGroup` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/points.md` | POSSIBLE_INVENTED_COMMAND | `RenumberPoints` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/points.md` | POSSIBLE_INVENTED_COMMAND | `DatumPoints` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/points.md` | POSSIBLE_INVENTED_COMMAND | `LockPoints` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/points.md` | POSSIBLE_INVENTED_COMMAND | `UnlockPoints` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/points.md` | POSSIBLE_INVENTED_COMMAND | `PointFromCogo` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pressure-networks.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/pressure-networks.md` | POSSIBLE_INVENTED_COMMAND | `CreatePressureNetworkFromIndustryModel` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pressure-networks.md` | POSSIBLE_INVENTED_COMMAND | `CreatePressurePipeNetwork` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pressure-networks.md` | POSSIBLE_INVENTED_COMMAND | `CreatePressureNetworkFromObject` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pressure-networks.md` | POSSIBLE_INVENTED_COMMAND | `PressureNetworkProperties` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pressure-networks.md` | POSSIBLE_INVENTED_COMMAND | `AddPressurePipe` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pressure-networks.md` | POSSIBLE_INVENTED_COMMAND | `AddPressureFitting` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pressure-networks.md` | POSSIBLE_INVENTED_COMMAND | `AddPressureAppurtenance` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pressure-networks.md` | POSSIBLE_INVENTED_COMMAND | `DrawPressureNetworkInProfileView` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pressure-networks.md` | POSSIBLE_INVENTED_COMMAND | `EditPressureNetwork` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/pressure-networks.md` | POSSIBLE_INVENTED_COMMAND | `ValidatePressureNetwork` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/profiles.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/profiles.md` | POSSIBLE_INVENTED_COMMAND | `ProfileProperties` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/profiles.md` | POSSIBLE_INVENTED_COMMAND | `EditProfileView` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/profiles.md` | POSSIBLE_INVENTED_COMMAND | `CreateMultipleProfileViews` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/profiles.md` | POSSIBLE_INVENTED_COMMAND | `CreateSuperimposedProfile` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/surfaces.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/surfaces.md` | POSSIBLE_INVENTED_COMMAND | `AddPointsToSurface` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/surfaces.md` | POSSIBLE_INVENTED_COMMAND | `AddDEMFile` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/surfaces.md` | POSSIBLE_INVENTED_COMMAND | `AddContourData` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/surfaces.md` | POSSIBLE_INVENTED_COMMAND | `EditSurfaceStyle` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/surfaces.md` | POSSIBLE_INVENTED_COMMAND | `SurfaceProperties` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/surfaces.md` | POSSIBLE_INVENTED_COMMAND | `ExtractObjectsFromSurface` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/surfaces.md` | POSSIBLE_INVENTED_COMMAND | `WaterDrop` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/surfaces.md` | POSSIBLE_INVENTED_COMMAND | `AnalyzeSurface` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/survey.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/by-category/survey.md` | POSSIBLE_INVENTED_COMMAND | `OpenSurveyToolspace` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/survey.md` | POSSIBLE_INVENTED_COMMAND | `CreateSurveyDB` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/survey.md` | POSSIBLE_INVENTED_COMMAND | `ImportSurveyData` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/survey.md` | POSSIBLE_INVENTED_COMMAND | `EditFigureStyle` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/survey.md` | POSSIBLE_INVENTED_COMMAND | `CreateFigureFromObject` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/survey.md` | POSSIBLE_INVENTED_COMMAND | `InsertFigure` is not in content/civil3d/commands/ |
| `content/civil3d/commands/by-category/survey.md` | POSSIBLE_INVENTED_COMMAND | `RunNetworkAdjustment` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/commands/command-line-cheatsheet.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `EditDrawingSettings` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `SurveyImportFieldBook` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `AnalyzeSurface` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `EditCorridor` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `CreateNetwork` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `CreateNetworkFromObject` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `DrawNetworkInProfileView` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `EditPipeNetwork` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `CreateFeatureLineFromObject` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `EditFeatureLineElevations` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `GradingCreate` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `CreateGradingGroup` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `CreateParcelFromObjects` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `CreateParcelLayout` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `CreateViewFrames` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `CreateSheets` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `DataShortcutsManager` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `SetWorkingFolder` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `CreateDataShortcuts` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `PromoteDataShortcut` is not in content/civil3d/commands/ |
| `content/civil3d/commands/command-line-cheatsheet.md` | POSSIBLE_INVENTED_COMMAND | `SynchronizeReferences` is not in content/civil3d/commands/ |
| `content/civil3d/commands/createassembly.md` | POSSIBLE_INVENTED_COMMAND | `LaneOutsideSuper` is not in content/civil3d/commands/ |
| `content/civil3d/commands/createassembly.md` | POSSIBLE_INVENTED_COMMAND | `UrbanCurbGutterGeneral` is not in content/civil3d/commands/ |
| `content/civil3d/commands/createassembly.md` | POSSIBLE_INVENTED_COMMAND | `BasicSideSlopeCutDitch` is not in content/civil3d/commands/ |
| `content/civil3d/commands/createassembly.md` | POSSIBLE_INVENTED_COMMAND | `LinkOffset` is not in content/civil3d/commands/ |
| `content/civil3d/commands/editalignmentgeometry.md` | POSSIBLE_INVENTED_COMMAND | `SynchronizeReferences` is not in content/civil3d/commands/ |
| `content/civil3d/commands/importpoints.md` | POSSIBLE_INVENTED_COMMAND | `ImportSurveyData` is not in content/civil3d/commands/ |
| `content/civil3d/commands/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/commands/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/shortcuts.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/commands/shortcuts.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/commands/shortcuts.md` | POSSIBLE_INVENTED_COMMAND | `CreateAlignmentEntities` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/assemblies-and-subassemblies.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Assemblies Overview` missing `verified` date |
| `content/civil3d/corridors/assemblies-and-subassemblies.md` | POSSIBLE_INVENTED_COMMAND | `EdgeOfPavement` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/corridor-sections.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Sample Lines and Sections` missing `verified` date |
| `content/civil3d/corridors/corridor-surfaces.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Corridor Surfaces` missing `verified` date |
| `content/civil3d/corridors/frequency-and-regions.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Corridor Frequency` missing `verified` date |
| `content/civil3d/corridors/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/corridors/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/corridors/subassembly-catalogs.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Subassembly Catalog` missing `verified` date |
| `content/civil3d/corridors/subassembly-catalogs.md` | POSSIBLE_INVENTED_COMMAND | `LaneSuperelevationAOR` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/subassembly-catalogs.md` | POSSIBLE_INVENTED_COMMAND | `BasicCurbAndGutter` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/subassembly-catalogs.md` | POSSIBLE_INVENTED_COMMAND | `DaylightBench` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/subassembly-catalogs.md` | POSSIBLE_INVENTED_COMMAND | `LinkSlopeToSurface` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/subassembly-catalogs.md` | POSSIBLE_INVENTED_COMMAND | `ShoulderExtendSubbase` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/subassembly-composer.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Subassembly Composer Overview` missing `verified` date |
| `content/civil3d/corridors/subassembly-composer.md` | POSSIBLE_INVENTED_COMMAND | `LinkWidthAndSlope` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/targets.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Corridor Target Mapping` missing `verified` date |
| `content/civil3d/corridors/targets.md` | POSSIBLE_INVENTED_COMMAND | `DaylightBench` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/targets.md` | POSSIBLE_INVENTED_COMMAND | `LinkSlopeToSurface` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/targets.md` | POSSIBLE_INVENTED_COMMAND | `DaylightCut` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/targets.md` | POSSIBLE_INVENTED_COMMAND | `DaylightFill` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/targets.md` | POSSIBLE_INVENTED_COMMAND | `DaylightStandard` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/troubleshooting-corridors.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Corridor Troubleshooting` missing `verified` date |
| `content/civil3d/corridors/troubleshooting-corridors.md` | POSSIBLE_INVENTED_COMMAND | `DaylightBench` is not in content/civil3d/commands/ |
| `content/civil3d/corridors/troubleshooting-corridors.md` | POSSIBLE_INVENTED_COMMAND | `LinkSlopeToSurface` is not in content/civil3d/commands/ |
| `content/civil3d/data-shortcuts/creating-data-shortcuts.md` | POSSIBLE_INVENTED_COMMAND | `CreateDataShortcuts` is not in content/civil3d/commands/ |
| `content/civil3d/data-shortcuts/creating-data-shortcuts.md` | POSSIBLE_INVENTED_COMMAND | `UpdateDataShortcuts` is not in content/civil3d/commands/ |
| `content/civil3d/data-shortcuts/creating-data-shortcuts.md` | POSSIBLE_INVENTED_COMMAND | `SynchronizeReferences` is not in content/civil3d/commands/ |
| `content/civil3d/data-shortcuts/data-shortcuts-vs-vault.md` | POSSIBLE_INVENTED_COMMAND | `CreateDataShortcuts` is not in content/civil3d/commands/ |
| `content/civil3d/data-shortcuts/data-shortcuts-vs-vault.md` | POSSIBLE_INVENTED_COMMAND | `CreateReference` is not in content/civil3d/commands/ |
| `content/civil3d/data-shortcuts/data-shortcuts-vs-vault.md` | POSSIBLE_INVENTED_COMMAND | `SynchronizeReferences` is not in content/civil3d/commands/ |
| `content/civil3d/data-shortcuts/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/data-shortcuts/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/data-shortcuts/multi-discipline.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/data-shortcuts/project-structure.md` | POSSIBLE_INVENTED_COMMAND | `Surfaces` is not in content/civil3d/commands/ |
| `content/civil3d/data-shortcuts/project-structure.md` | POSSIBLE_INVENTED_COMMAND | `Alignments` is not in content/civil3d/commands/ |
| `content/civil3d/data-shortcuts/project-structure.md` | POSSIBLE_INVENTED_COMMAND | `Profiles` is not in content/civil3d/commands/ |
| `content/civil3d/data-shortcuts/referencing-syncing-promoting.md` | POSSIBLE_INVENTED_COMMAND | `CreateReference` is not in content/civil3d/commands/ |
| `content/civil3d/data-shortcuts/referencing-syncing-promoting.md` | POSSIBLE_INVENTED_COMMAND | `SynchronizeReferences` is not in content/civil3d/commands/ |
| `content/civil3d/data-shortcuts/referencing-syncing-promoting.md` | POSSIBLE_INVENTED_COMMAND | `PromoteDataShortcut` is not in content/civil3d/commands/ |
| `content/civil3d/data-shortcuts/repathing-shortcuts.md` | POSSIBLE_INVENTED_COMMAND | `SynchronizeReferences` is not in content/civil3d/commands/ |
| `content/civil3d/fundamentals/ambient-settings.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/fundamentals/ambient-settings.md` | POSSIBLE_INVENTED_COMMAND | `CreateAlignment` is not in content/civil3d/commands/ |
| `content/civil3d/fundamentals/ambient-settings.md` | POSSIBLE_INVENTED_COMMAND | `Surface` is not in content/civil3d/commands/ |
| `content/civil3d/fundamentals/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/fundamentals/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/fundamentals/object-and-label-styles.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/fundamentals/object-and-label-styles.md` | POSSIBLE_INVENTED_COMMAND | `Standard` is not in content/civil3d/commands/ |
| `content/civil3d/fundamentals/templates-and-settings.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/fundamentals/templates-and-settings.md` | POSSIBLE_INVENTED_COMMAND | `CreateAlignment` is not in content/civil3d/commands/ |
| `content/civil3d/fundamentals/user-profiles-and-support-paths.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/fundamentals/workspace-and-toolspace.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/fundamentals/workspace-and-toolspace.md` | POSSIBLE_INVENTED_COMMAND | `Survey` is not in content/civil3d/commands/ |
| `content/civil3d/grading/feature-line-editing.md` | POSSIBLE_INVENTED_COMMAND | `EditFeatureLineElevations` is not in content/civil3d/commands/ |
| `content/civil3d/grading/feature-line-editing.md` | POSSIBLE_INVENTED_COMMAND | `QuickElevationEditor` is not in content/civil3d/commands/ |
| `content/civil3d/grading/feature-line-editing.md` | POSSIBLE_INVENTED_COMMAND | `JoinFeatureLines` is not in content/civil3d/commands/ |
| `content/civil3d/grading/feature-lines.md` | POSSIBLE_INVENTED_COMMAND | `CreateFeatureLine` is not in content/civil3d/commands/ |
| `content/civil3d/grading/feature-lines.md` | POSSIBLE_INVENTED_COMMAND | `CreateFeatureLineFromObject` is not in content/civil3d/commands/ |
| `content/civil3d/grading/feature-lines.md` | POSSIBLE_INVENTED_COMMAND | `CreateFeatureLineFromAlignment` is not in content/civil3d/commands/ |
| `content/civil3d/grading/feature-lines.md` | POSSIBLE_INVENTED_COMMAND | `CreateFeatureLineFromCorridor` is not in content/civil3d/commands/ |
| `content/civil3d/grading/grading-groups.md` | POSSIBLE_INVENTED_COMMAND | `CreateGradingGroup` is not in content/civil3d/commands/ |
| `content/civil3d/grading/grading-groups.md` | POSSIBLE_INVENTED_COMMAND | `GradingVolumeTools` is not in content/civil3d/commands/ |
| `content/civil3d/grading/grading-objects.md` | POSSIBLE_INVENTED_COMMAND | `GradingCreate` is not in content/civil3d/commands/ |
| `content/civil3d/grading/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/grading/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/grading/sites-and-feature-lines.md` | POSSIBLE_INVENTED_COMMAND | `CreateFeatureLine` is not in content/civil3d/commands/ |
| `content/civil3d/grading/sites-and-feature-lines.md` | POSSIBLE_INVENTED_COMMAND | `MoveToSite` is not in content/civil3d/commands/ |
| `content/civil3d/grading/troubleshooting-grading.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/grading/troubleshooting-grading.md` | POSSIBLE_INVENTED_COMMAND | `GradingCreate` is not in content/civil3d/commands/ |
| `content/civil3d/grading/troubleshooting-grading.md` | POSSIBLE_INVENTED_COMMAND | `CreateFeatureLineFromObject` is not in content/civil3d/commands/ |
| `content/civil3d/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/parcels/creating-parcels.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/parcels/creating-parcels.md` | POSSIBLE_INVENTED_COMMAND | `CreateParcelFromObjects` is not in content/civil3d/commands/ |
| `content/civil3d/parcels/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/parcels/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/parcels/legal-descriptions-from-parcels.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/parcels/parcel-labels.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/parcels/parcel-sizing.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/parcels/sites-and-topology.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/pipe-networks/creating-pipe-networks.md` | POSSIBLE_INVENTED_COMMAND | `CreateNetwork` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/creating-pipe-networks.md` | POSSIBLE_INVENTED_COMMAND | `CreateNetworkFromObject` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/gravity-vs-pressure.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/pipe-networks/gravity-vs-pressure.md` | POSSIBLE_INVENTED_COMMAND | `CreateNetwork` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/gravity-vs-pressure.md` | POSSIBLE_INVENTED_COMMAND | `CreatePressureNetwork` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/gravity-vs-pressure.md` | POSSIBLE_INVENTED_COMMAND | `CreateNetworkFromObject` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/pipe-networks/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/pipe-networks/parts-list-and-rules.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/pipe-networks/parts-list-and-rules.md` | POSSIBLE_INVENTED_COMMAND | `EditPipeRules` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/parts-list-and-rules.md` | POSSIBLE_INVENTED_COMMAND | `EditStructureRules` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/parts-list-and-rules.md` | POSSIBLE_INVENTED_COMMAND | `PipeCatalogFolder` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/pipe-network-analysis.md` | POSSIBLE_INVENTED_COMMAND | `InterferenceCheck` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/pipe-network-analysis.md` | POSSIBLE_INVENTED_COMMAND | `PressurePipeDesignCheck` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/pipe-network-in-profile.md` | POSSIBLE_INVENTED_COMMAND | `DrawPartsInProfileView` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/pipe-network-interop.md` | POSSIBLE_INVENTED_COMMAND | `ExportLandXML` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/pipe-network-interop.md` | POSSIBLE_INVENTED_COMMAND | `ImportLandXML` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/pipe-network-labels.md` | POSSIBLE_INVENTED_COMMAND | `AddPipeNetworkLabels` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/pipe-network-labels.md` | POSSIBLE_INVENTED_COMMAND | `AddPipeTables` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/pipe-network-labels.md` | POSSIBLE_INVENTED_COMMAND | `AddStructureTables` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/pressure-networks.md` | POSSIBLE_INVENTED_COMMAND | `CreatePressureNetwork` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/pressure-networks.md` | POSSIBLE_INVENTED_COMMAND | `PressurePipeDesignCheck` is not in content/civil3d/commands/ |
| `content/civil3d/pipe-networks/pressure-networks.md` | POSSIBLE_INVENTED_COMMAND | `DrawPartsInProfileView` is not in content/civil3d/commands/ |
| `content/civil3d/plan-production/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/plan-production/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/plan-production/match-lines.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Match Lines` missing `verified` date |
| `content/civil3d/plan-production/plan-and-profile-sheets.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Plan and Profile Sheets` missing `verified` date |
| `content/civil3d/plan-production/sections-in-plan-production.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Section Views in Plan Production` missing `verified` date |
| `content/civil3d/plan-production/sheet-sets.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Sheet Sets` missing `verified` date |
| `content/civil3d/plan-production/sheet-templates.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Sheet Templates` missing `verified` date |
| `content/civil3d/plan-production/view-frame-groups.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — View Frames` missing `verified` date |
| `content/civil3d/points/creating-points.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/points/creating-points.md` | POSSIBLE_INVENTED_COMMAND | `Notify` is not in content/civil3d/commands/ |
| `content/civil3d/points/creating-points.md` | POSSIBLE_INVENTED_COMMAND | `Overwrite` is not in content/civil3d/commands/ |
| `content/civil3d/points/description-keys.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/points/import-export-formats.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/points/import-export-formats.md` | POSSIBLE_INVENTED_COMMAND | `Points` is not in content/civil3d/commands/ |
| `content/civil3d/points/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/points/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/points/point-editing.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/points/point-editing.md` | POSSIBLE_INVENTED_COMMAND | `TransformPoints` is not in content/civil3d/commands/ |
| `content/civil3d/points/point-groups.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/points/point-reports.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/points/point-styles-and-label-styles.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/points/point-styles-and-label-styles.md` | POSSIBLE_INVENTED_COMMAND | `Boundary` is not in content/civil3d/commands/ |
| `content/civil3d/profiles/editing-profiles.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Editing Layout Profiles` missing `verified` date |
| `content/civil3d/profiles/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/profiles/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/profiles/multiple-profiles.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Profile Display Options` missing `verified` date |
| `content/civil3d/profiles/profile-design-criteria.md` | BAD_SOURCE | source missing `url` |
| `content/civil3d/profiles/profile-design-criteria.md` | BAD_SOURCE | source `AASHTO A Policy on Geometric Design of Highways and Streets, 7th Edition` missing `verified` date |
| `content/civil3d/profiles/profile-design-criteria.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Design Criteria Files` missing `verified` date |
| `content/civil3d/profiles/profile-design-criteria.md` | POSSIBLE_INVENTED_COMMAND | `Imperial` is not in content/civil3d/commands/ |
| `content/civil3d/profiles/profile-labels.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Profile Labels` missing `verified` date |
| `content/civil3d/profiles/profile-views-and-bands.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/profiles/surface-vs-layout-profiles.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/profiles/vertical-curve-design.md` | BAD_SOURCE | source missing `url` |
| `content/civil3d/profiles/vertical-curve-design.md` | BAD_SOURCE | source `AASHTO A Policy on Geometric Design of Highways and Streets (Green Book), 7th Edition` missing `verified` date |
| `content/civil3d/profiles/vertical-curve-design.md` | BAD_SOURCE | source `Autodesk Civil 3D Help — Vertical Curve Overview` missing `verified` date |
| `content/civil3d/surfaces/breaklines-and-boundaries.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/surfaces/breaklines-and-boundaries.md` | POSSIBLE_INVENTED_COMMAND | `Triangles` is not in content/civil3d/commands/ |
| `content/civil3d/surfaces/breaklines-and-boundaries.md` | POSSIBLE_INVENTED_COMMAND | `Explode` is not in content/civil3d/commands/ |
| `content/civil3d/surfaces/building-a-tin-surface.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/surfaces/building-a-tin-surface.md` | POSSIBLE_INVENTED_COMMAND | `Surfaces` is not in content/civil3d/commands/ |
| `content/civil3d/surfaces/grid-surfaces.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/surfaces/grid-surfaces.md` | POSSIBLE_INVENTED_COMMAND | `Surfaces` is not in content/civil3d/commands/ |
| `content/civil3d/surfaces/importing-surfaces.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/surfaces/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/surfaces/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/surfaces/surface-analysis.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/surfaces/surface-editing.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/surfaces/surface-labels-and-contours.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/surfaces/troubleshooting-surfaces.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/surfaces/volume-calculations.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/survey/editing-survey-data.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/survey/equipment-databases.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/survey/field-book-format.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/survey/figures-and-figure-prefixes.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/survey/figures-and-figure-prefixes.md` | POSSIBLE_INVENTED_COMMAND | `CreateFigureFromObject` is not in content/civil3d/commands/ |
| `content/civil3d/survey/importing-raw-observations.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/survey/index.md` | MISSING_APPLIESTO | civil3d-behavior page should set `appliesTo` |
| `content/civil3d/survey/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/survey/linework-code-sets.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/survey/linework-code-sets.md` | POSSIBLE_INVENTED_COMMAND | `RunLineworkProcessing` is not in content/civil3d/commands/ |
| `content/civil3d/survey/network-adjustment.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/survey/network-adjustment.md` | POSSIBLE_INVENTED_COMMAND | `Traverses` is not in content/civil3d/commands/ |
| `content/civil3d/survey/network-adjustment.md` | POSSIBLE_INVENTED_COMMAND | `Networks` is not in content/civil3d/commands/ |
| `content/civil3d/survey/network-adjustment.md` | POSSIBLE_INVENTED_COMMAND | `Synchronize` is not in content/civil3d/commands/ |
| `content/civil3d/survey/survey-database.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/survey/survey-database.md` | POSSIBLE_INVENTED_COMMAND | `Figures` is not in content/civil3d/commands/ |
| `content/civil3d/survey/survey-points-vs-cogo-points.md` | MISSING_SOURCES | no `sources` listed |
| `content/civil3d/survey/survey-query-language.md` | MISSING_SOURCES | no `sources` listed |
| `content/customization/dotnet-api/adding-ribbon-button.md` | POSSIBLE_INVENTED_COMMAND | `IExtensionApplication` is not in content/civil3d/commands/ |
| `content/customization/dotnet-api/hello-world.md` | POSSIBLE_INVENTED_COMMAND | `IExtensionApplication` is not in content/civil3d/commands/ |
| `content/customization/dotnet-api/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/customization/dotnet-api/setup.md` | POSSIBLE_INVENTED_COMMAND | `MyC3DPlugin` is not in content/civil3d/commands/ |
| `content/customization/dotnet-api/working-with-objects.md` | POSSIBLE_INVENTED_COMMAND | `Alignment` is not in content/civil3d/commands/ |
| `content/customization/dotnet-api/working-with-objects.md` | POSSIBLE_INVENTED_COMMAND | `TinSurface` is not in content/civil3d/commands/ |
| `content/customization/dotnet-api/working-with-objects.md` | POSSIBLE_INVENTED_COMMAND | `Profile` is not in content/civil3d/commands/ |
| `content/customization/dotnet-api/working-with-objects.md` | POSSIBLE_INVENTED_COMMAND | `CivilDocument` is not in content/civil3d/commands/ |
| `content/customization/dotnet-api/working-with-objects.md` | POSSIBLE_INVENTED_COMMAND | `ProfileType` is not in content/civil3d/commands/ |
| `content/customization/dynamo/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/customization/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/customization/lisp/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/customization/lisp/useful-routines-index.md` | POSSIBLE_INVENTED_COMMAND | `LayerStateManager` is not in content/civil3d/commands/ |
| `content/customization/templates-and-kits/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/docs-mirror/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/ada-and-accessibility/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/earthwork/cut-fill-quick-checks.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/earthwork/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/earthwork/mass-haul.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/earthwork/shrink-swell.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/earthwork/stockpile-estimation.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/earthwork/topsoil-stripping.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/earthwork/volume-methods.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/erosion-and-sediment/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/hydraulics/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/hydraulics/mannings-reference.md` | POSSIBLE_INVENTED_COMMAND | `AnalyzePipeNetwork` is not in content/civil3d/commands/ |
| `content/engineering/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/roadway-design/cross-slope.md` | POSSIBLE_INVENTED_COMMAND | `LaneSuperelevationAOR` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/cross-slope.md` | POSSIBLE_INVENTED_COMMAND | `ShoulderExtendAll` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/horizontal-curve-design.md` | POSSIBLE_INVENTED_COMMAND | `AlignmentDesignChecks` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/roadway-design/intersection-design.md` | POSSIBLE_INVENTED_COMMAND | `CreateIntersection` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/intersection-design.md` | POSSIBLE_INVENTED_COMMAND | `CreateSightLineAnalysis` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/lane-and-shoulder-widths.md` | POSSIBLE_INVENTED_COMMAND | `LaneSuperelevationAOR` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/lane-and-shoulder-widths.md` | POSSIBLE_INVENTED_COMMAND | `LaneOutsideSuperWithWidening` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/lane-and-shoulder-widths.md` | POSSIBLE_INVENTED_COMMAND | `DefaultSlope` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/lane-and-shoulder-widths.md` | POSSIBLE_INVENTED_COMMAND | `ShoulderSubassemblyName` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/lane-and-shoulder-widths.md` | POSSIBLE_INVENTED_COMMAND | `BasicSideSlopeCutDitch` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/lane-and-shoulder-widths.md` | POSSIBLE_INVENTED_COMMAND | `GenericPavementStructure` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/sight-distance.md` | POSSIBLE_INVENTED_COMMAND | `CreateSightLineAnalysis` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/superelevation.md` | POSSIBLE_INVENTED_COMMAND | `CalculateSuperelevation` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/superelevation.md` | POSSIBLE_INVENTED_COMMAND | `CreateSuperelevationView` is not in content/civil3d/commands/ |
| `content/engineering/roadway-design/vertical-curve-design.md` | POSSIBLE_INVENTED_COMMAND | `ProfileDesignCheck` is not in content/civil3d/commands/ |
| `content/engineering/sanitary-sewer/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/stormwater/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/engineering/water-distribution/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/advanced-boundary/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/as-builts/as-built-deliverables.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/as-builts/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/as-builts/measuring-buried-pipes.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/as-builts/site-as-builts.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/as-builts/storm-sanitary-as-builts.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/as-builts/what-as-builts-capture.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/boundary-and-alta/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/construction-staking/building-corner-staking.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/construction-staking/curb-staking.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/construction-staking/grade-checks.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/construction-staking/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/construction-staking/pavement-staking.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/construction-staking/slope-stakes.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/construction-staking/staking-checklist.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/construction-staking/utility-staking.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/construction-staking/working-with-contractors.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/control-networks/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/coordinate-systems/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/coordinate-systems/setting-civil3d-cs.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/coordinate-systems/state-plane-indiana-quick-reference.md` | POSSIBLE_INVENTED_COMMAND | `EditDrawingSettings` is not in content/civil3d/commands/ |
| `content/field-and-boundary/easements-and-row/common-easement-language.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/easements-and-row/half-width-row.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/easements-and-row/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/legal-descriptions/description-from-parcel.md` | POSSIBLE_INVENTED_COMMAND | `CreateParcelFromObjects` is not in content/civil3d/commands/ |
| `content/field-and-boundary/legal-descriptions/description-from-parcel.md` | POSSIBLE_INVENTED_COMMAND | `CreateParcel` is not in content/civil3d/commands/ |
| `content/field-and-boundary/legal-descriptions/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/monuments-and-evidence/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/monuments-and-evidence/monument-documentation.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/monuments-and-evidence/monument-types.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/professional-practice/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/survey-equipment/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/topographic-surveys/breakline-strategy.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/topographic-surveys/difficult-ground.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/topographic-surveys/field-code-conventions.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/topographic-surveys/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/field-and-boundary/topographic-surveys/topo-qa-qc.md` | MISSING_SOURCES | no `sources` listed |
| `content/glossary.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/boone-county/municipalities/advance/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/boone-county/municipalities/jamestown/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/boone-county/municipalities/ulen/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/hancock-county/municipalities/shirley/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/hancock-county/municipalities/wilkinson/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/hendricks-county/municipalities/amo/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/hendricks-county/municipalities/clayton/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/hendricks-county/municipalities/coatesville/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/hendricks-county/municipalities/lizton/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/hendricks-county/municipalities/north-salem/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/hendricks-county/municipalities/stilesville/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/johnson-county/municipalities/princes-lakes/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/morgan-county/municipalities/brooklyn/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/morgan-county/municipalities/monrovia/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/morgan-county/municipalities/morgantown/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/morgan-county/municipalities/paragon/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/shelby-county/municipalities/fairland/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/jurisdictions/indiana/shelby-county/municipalities/st-paul/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/resources/blogs.md` | MISSING_SOURCES | no `sources` listed |
| `content/resources/books.md` | MISSING_SOURCES | no `sources` listed |
| `content/resources/forums-and-communities.md` | MISSING_SOURCES | no `sources` listed |
| `content/resources/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/resources/podcasts.md` | MISSING_SOURCES | no `sources` listed |
| `content/resources/tools-and-software.md` | MISSING_SOURCES | no `sources` listed |
| `content/resources/training-and-certs.md` | MISSING_SOURCES | no `sources` listed |
| `content/resources/youtube-channels.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/aashto/green-book-overview.md` | POSSIBLE_INVENTED_COMMAND | `EditProfileDesignChecks` is not in content/civil3d/commands/ |
| `content/standards/aashto/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/cad-layer-standards/aia-vs-ncs.md` | BAD_SOURCE | source missing `title` |
| `content/standards/cad-layer-standards/aia-vs-ncs.md` | BAD_SOURCE | source `https://www.nationalcadstandard.org/` missing `verified` date |
| `content/standards/cad-layer-standards/civil3d-layer-mappings.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/cad-layer-standards/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/cad-layer-standards/layer-keys.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/cad-layer-standards/layer-keys.md` | POSSIBLE_INVENTED_COMMAND | `Normal` is not in content/civil3d/commands/ |
| `content/standards/cad-layer-standards/ncs-overview.md` | BAD_SOURCE | source missing `title` |
| `content/standards/cad-layer-standards/ncs-overview.md` | BAD_SOURCE | source `https://www.nationalcadstandard.org/` missing `verified` date |
| `content/standards/cad-layer-standards/standardizing-company-wide.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/plotting-and-ctb/common-plotting-issues.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/plotting-and-ctb/ctb-vs-stb.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/plotting-and-ctb/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/plotting-and-ctb/lineweight-conventions.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/plotting-and-ctb/lineweight-conventions.md` | POSSIBLE_INVENTED_COMMAND | `Medium` is not in content/civil3d/commands/ |
| `content/standards/plotting-and-ctb/lineweight-conventions.md` | POSSIBLE_INVENTED_COMMAND | `Border` is not in content/civil3d/commands/ |
| `content/standards/plotting-and-ctb/page-setups.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/plotting-and-ctb/pdf-publishing.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/plotting-and-ctb/plotting-quick-reference.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/state-dot/index.md` | MISSING_SOURCES | no `sources` listed |
| `content/standards/state-dot/indot-idm-chapter-map.md` | BAD_SOURCE | source `INDOT Indiana Design Manual (IDM)` missing `verified` date |
| `content/standards/state-dot/indot-permitting.md` | BAD_SOURCE | source `INDOT Permits` missing `verified` date |
| `content/standards/state-dot/indot-standard-drawings.md` | BAD_SOURCE | source `INDOT Standard Drawings` missing `verified` date |
| `content/standards/state-dot/indot-standard-specs.md` | BAD_SOURCE | source `INDOT Standard Specifications` missing `verified` date |
| `content/standards/state-dot/surrounding-states.md` | BAD_SOURCE | source `IDOT Bureau of Design and Environment Manual` missing `verified` date |
| `content/standards/state-dot/surrounding-states.md` | BAD_SOURCE | source `ODOT Location & Design Manual` missing `verified` date |
| `content/standards/state-dot/surrounding-states.md` | BAD_SOURCE | source `KYTC Highway Design Manual` missing `verified` date |
| `content/standards/state-dot/surrounding-states.md` | BAD_SOURCE | source `MDOT Road Design Manual` missing `verified` date |
