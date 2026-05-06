---
title: "Cross-Connection Control and Backflow Prevention"
section: "engineering/water-distribution"
order: 40
visibility: public
tags: [water, distribution, backflow, cross-connection]
updated: 2026-05-06
sources:
  - title: "327 IAC 8-10 (Indiana Cross Connection Control Rule)"
    url: https://www.in.gov/idem/cleanwater/
    verified: 2026-05-06
  - title: "AWWA M14, Backflow Prevention and Cross-Connection Control, 4th ed."
    url: https://www.awwa.org/Store/Product-Details/productId/73711
    verified: 2026-05-06
  - title: "Recommended Standards for Water Works (Ten States Standards), 2018 ed., §8.6"
    url: https://10statesstandards.com/
    verified: 2026-05-06
  - title: "USC Foundation for Cross-Connection Control and Hydraulic Research, Manual of Cross-Connection Control"
    url: https://fccchr.usc.edu/
    verified: 2026-05-06
---

> **TL;DR**
> 1. A **cross connection** is any physical link between the potable supply and a non-potable source. **Backflow** occurs when pressure reversal pushes contaminants into the potable system via backpressure or backsiphonage.
> 2. Indiana's cross-connection control rule is **327 IAC 8-10**. It requires every public water system to have a cross-connection control program, and mandates backflow prevention at hazardous connections.
> 3. Device hierarchy by hazard level: **air gap** (highest protection) > **reduced pressure zone (RPZ)** > **double check valve assembly (DCVA)** > **atmospheric vacuum breaker (AVB)** (lowest).
> 4. Fire service connections without an air gap require an **RPZ** or **DCVA** depending on the hazard level. All testable assemblies must be tested at installation and **annually** thereafter by a certified tester.

## What cross connections are

A cross connection exists wherever the potable water supply is or could be connected to a non-potable source: irrigation systems, boilers, chemical feed systems, fire suppression systems with chemical additives, medical equipment, industrial process lines, or even a garden hose submerged in a pool. The risk is that if pressure in the potable system drops below the pressure at the cross-connected source (backsiphonage) or the non-potable source is pumped to a pressure above the potable supply (backpressure), contaminated water flows into the drinking water system.

## Indiana regulatory framework

Indiana's cross-connection control requirements are in **327 IAC 8-10**, administered by IDEM. The rule requires:

- Every community water system must have a **cross-connection control program** that includes a survey of all service connections, identification of cross-connection hazards, and enforcement authority to require backflow prevention devices.
- **Backflow prevention** is required at all connections deemed a health hazard (high hazard) or a non-health hazard but an aesthetic concern (low hazard).
- The water utility has the authority to refuse or discontinue service to any premises that has an unprotected cross connection and refuses to install a device.
- IDEM may require containment (a device at the meter or service connection) or isolation (devices at each individual cross-connection point within the premises), or both.

Most Indiana utilities implement a **containment** approach: an RPZ or DCVA at the service connection to the premises, with additional isolation devices at specific hazards inside the building.

## Backflow prevention devices

### Air gap

An air gap is a physical vertical separation between the potable supply outlet and the flood-level rim of the receiving vessel. The gap must be at least **2 times the supply pipe diameter** and not less than **1 in** (per IDEM and AWWA standards). Air gaps provide the highest level of protection and are required for the most severe hazards (sewage, radioactive materials, lethal chemicals).

### Reduced pressure zone assembly (RPZ / RP)

An RPZ consists of two independently acting check valves separated by a relief valve that opens to atmosphere (drains) whenever the zone between the checks is at or below the supply pressure. Key characteristics:

- Protects against both **backpressure** and **backsiphonage**.
- Suitable for **high-hazard** connections (chemical plants, mortuaries, hospitals, fire systems with chemical additives, irrigation with chemical injection).
- Must be installed **above grade** and in a location where the relief valve discharge can drain freely (not in a pit that could submerge the relief port).
- Typical sizes: 3/4 in to 10 in.
- Produces a pressure drop of 10 to 15 psi at rated flow.

### Double check valve assembly (DCVA / DC)

A DCVA consists of two independently acting check valves in series with test cocks between them. It does not have a relief valve.

- Protects against both backpressure and backsiphonage for **low-hazard** connections (fire sprinkler systems without additives, commercial HVAC makeup, lawn irrigation without chemical injection).
- Can be installed below grade in a vault (unlike an RPZ, which must drain freely).
- Typical pressure drop: 3 to 5 psi at rated flow.
- Sizes: 3/4 in to 12 in.

### Atmospheric vacuum breaker (AVB)

A simple, non-testable device that admits air to break a vacuum (backsiphonage only — no backpressure protection). Used on individual hose bibbs, irrigation zones (one per zone, downstream of the last valve), and laboratory faucets. Must be installed **at least 6 in above the highest downstream point**. Not acceptable as containment at the service connection.

### Pressure vacuum breaker (PVB) and spill-resistant vacuum breaker (SVB)

Testable devices that protect against backsiphonage but not backpressure. Used on irrigation systems and similar connections where backpressure is not possible. Must be installed at least 12 in above the highest sprinkler head.

## Fire service connections

Fire sprinkler and standpipe connections deserve special attention:

- **Systems with no chemical additives** (plain water) and no auxiliary supply: DCVA is typically acceptable (NFPA 13 §24.1).
- **Systems with antifreeze, foam, or other chemical additives**: RPZ required.
- **Combined fire/domestic service**: RPZ required because the stagnant water in the fire system is a contamination risk.
- **Fire pump with a bypass**: the bypass must also be protected.

The backflow device on a fire service must be sized to pass the required fire flow without excessive pressure drop. An undersized device can cause the fire suppression system to fail to deliver design flow. Coordinate the device selection with the fire protection engineer.

## Testing and maintenance

327 IAC 8-10 and most Indiana utility cross-connection control programs require:

- **Initial test** at the time of installation — before the device is placed in service.
- **Annual test** by a **certified backflow tester** (certified through the Indiana Section AWWA or ABPA program). Test results are reported to the water utility on a standard form.
- **Failed devices** must be repaired and re-tested within 30 days (or per the utility's ordinance). If repair fails, the device is replaced.
- **Records** — the utility must maintain records of all known cross connections, installed devices, and test results.

## Common review issues

- No backflow device shown on the fire service connection — required for all fire service connections by 327 IAC 8-10 and NFPA 24.
- RPZ installed below grade in a vault — the relief valve cannot discharge freely; relocate above grade or use a DCVA if the hazard level allows.
- DCVA specified on a high-hazard connection (chemical injection, sewage) — upgrade to an RPZ or air gap.
- Undersized backflow device on a fire service — pressure drop at fire flow exceeds the available margin; upsize the device or verify the supply pressure.
- No annual testing program referenced in the utility's cross-connection control plan — 327 IAC 8-10 requires it.

## Related

- [Valves](valves.md)
- [Demand estimation](demand-estimation.md)
- [Pressure zones](pressure-zones.md)
- [Hydrant placement](hydrant-placement.md)
- [Ten States Standards (water)](ten-states-standards-water.md)
