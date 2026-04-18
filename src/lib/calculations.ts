// src/lib/calculations.ts

import {
  TransmissionInputs,
  TransmissionResults,
  ComplexNumber,
  ABCDParams,
} from "@/types/transmission";

// ── Complex Number Math ──────────────────────────────────────────
function czero(a: number): ComplexNumber {
  return { re: 0, im: 0 };
}
function cadd(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return { re: a.re + b.re, im: a.im + b.im };
}

function cmul(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

function cdiv(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  const denom = b.re * b.re + b.im * b.im;
  return {
    re: (a.re * b.re + a.im * b.im) / denom,
    im: (a.im * b.re - a.re * b.im) / denom,
  };
}

function cmag(a: ComplexNumber): number {
  return Math.sqrt(a.re * a.re + a.im * a.im);
}

function cang(a: ComplexNumber): number {
  return Math.atan2(a.im, a.re) * (180 / Math.PI);
}

// e^(a+jb) = e^a * (cos(b) + j*sin(b))
function cexp(a: ComplexNumber): ComplexNumber {
  const mag = Math.exp(a.re);
  return { re: mag * Math.cos(a.im), im: mag * Math.sin(a.im) };
}

// cosh(z) = (e^z + e^-z) / 2
function ccosh(a: ComplexNumber): ComplexNumber {
  const ep = cexp(a);
  const en = cexp({ re: -a.re, im: -a.im });
  return { re: (ep.re + en.re) / 2, im: (ep.im + en.im) / 2 };
}

// sinh(z) = (e^z - e^-z) / 2
function csinh(a: ComplexNumber): ComplexNumber {
  const ep = cexp(a);
  const en = cexp({ re: -a.re, im: -a.im });
  return { re: (ep.re - en.re) / 2, im: (ep.im - en.im) / 2 };
}

// sqrt(a + jb)
function csqrt(a: ComplexNumber): ComplexNumber {
  const mag = Math.sqrt(cmag(a));
  const ang = Math.atan2(a.im, a.re) / 2;
  return { re: mag * Math.cos(ang), im: mag * Math.sin(ang) };
}

// ── GMR Calculation ──────────────────────────────────────────────
// For stranded ACSR conductor:
// Overall radius of sub-conductor = (2n-1) * r_strand  where n = number of layers
// GMR of solid conductor = r * e^(-1/4)
// For stranded: GMR ≈ 0.726 * r (7 strands), use standard formula

function calcSubConductorGMR(
  numStrands: number,
  strandDiameterMm: number,
): number {
  // Overall radius of stranded conductor
  // For n strands: layers
  // 1 strand  → 1 layer  → overall r = r_strand
  // 7 strands → 2 layers → overall r = 3 * r_strand
  // 19 strands→ 3 layers → overall r = 5 * r_strand
  // 37 strands→ 4 layers → overall r = 7 * r_strand
  // General: layers = (sqrt(numStrands) rounds), overall r = (2*layers - 1) * r_strand

  const r_strand = strandDiameterMm / 2 / 1000; // convert mm to m

  let overallRadius: number;
  if (numStrands === 1) {
    overallRadius = r_strand;
  } else if (numStrands <= 7) {
    overallRadius = 3 * r_strand;
  } else if (numStrands <= 19) {
    overallRadius = 5 * r_strand;
  } else if (numStrands <= 37) {
    overallRadius = 7 * r_strand;
  } else {
    overallRadius = 9 * r_strand;
  }

  // GMR of stranded conductor ≈ 0.726 * overall_radius (for 7-strand ACSR)
  // More accurately: GMR = r' = r * e^(-1/4) for solid,
  // for stranded ACSR use 0.7788 factor on overall radius
  const GMR = 0.7788 * overallRadius;
  return GMR; // in meters
}

// ── Bundle GMR and GMD ───────────────────────────────────────────

function calcBundleGMR(
  subConductorGMR: number,
  numSubConductors: number,
  bundleSpacingMm: number,
): number {
  const d = bundleSpacingMm / 1000; // mm to m

  // Bundle GMR (Ds_bundle):
  // 2-bundle: sqrt(GMR * d)
  // 3-bundle: (GMR * d^2)^(1/3)
  // 4-bundle: 1.09 * (GMR * d^3)^(1/4)

  switch (numSubConductors) {
    case 2:
      return Math.sqrt(subConductorGMR * d);
    case 3:
      return Math.cbrt(subConductorGMR * d * d);
    case 4:
      return 1.09 * Math.pow(subConductorGMR * d * d * d, 1 / 4);
    default:
      return subConductorGMR;
  }
}

function calcBundleRadius(
  subConductorRadius: number,
  numSubConductors: number,
  bundleSpacingMm: number,
): number {
  // For capacitance, use actual radius instead of GMR
  const d = bundleSpacingMm / 1000;

  switch (numSubConductors) {
    case 2:
      return Math.sqrt(subConductorRadius * d);
    case 3:
      return Math.cbrt(subConductorRadius * d * d);
    case 4:
      return 1.09 * Math.pow(subConductorRadius * d * d * d, 1 / 4);
    default:
      return subConductorRadius;
  }
}

// ── GMD Calculation ──────────────────────────────────────────────

function calcGMD(inputs: TransmissionInputs): number {
  if (inputs.spacingType === "symmetrical") {
    return inputs.spacingAB; // D_eq = D for equilateral
  } else {
    // Transposed unsymmetrical: GMD = (D_AB * D_BC * D_CA)^(1/3)
    return Math.cbrt(inputs.spacingAB * inputs.spacingBC * inputs.spacingCA);
  }
}

// ── Main Calculation Function ────────────────────────────────────

export function calculate(inputs: TransmissionInputs): TransmissionResults {
  const {
    numStrands,
    strandDiameter,
    subConductorResistance,
    numSubConductors,
    bundleSpacing,
    lineLength,
    receivingEndLoad,
    powerFactor,
    pfLag,
    nominalVoltage,
    frequency,
    lineModel,
  } = inputs;

  const omega = 2 * Math.PI * frequency;

  // ── 1. Sub-conductor geometry ──────────────────────────────────
  const r_strand = strandDiameter / 2 / 1000; // m

  let overallRadius: number;
  if (numStrands === 1) overallRadius = r_strand;
  else if (numStrands === 7) overallRadius = 3 * r_strand;
  else if (numStrands === 19) overallRadius = 5 * r_strand;
  else if (numStrands === 37) overallRadius = 7 * r_strand;
  else if (numStrands === 61) overallRadius = 9 * r_strand;
  else overallRadius = 11 * r_strand;

  const subGMR = calcSubConductorGMR(numStrands, strandDiameter);

  // ── 2. Bundle parameters ───────────────────────────────────────
  const bundleGMR = calcBundleGMR(subGMR, numSubConductors, bundleSpacing);
  const bundleRadius = calcBundleRadius(
    overallRadius,
    numSubConductors,
    bundleSpacing,
  );

  // ── 3. GMD ─────────────────────────────────────────────────────
  const GMD = calcGMD(inputs);

  // ── 4. Inductance & Capacitance per phase per km ───────────────
  // L = (2e-7) * ln(GMD / GMR_bundle)   H/m  → multiply by 1000 for H/km
  const inductancePerKm = 2e-7 * Math.log(GMD / bundleGMR) * 1000;

  // C = (2*pi*eps0) / ln(GMD / r_bundle)   F/m → multiply by 1000 for F/km
  const eps0 = 8.854e-12;
  const capacitancePerKm =
    ((2 * Math.PI * eps0) / Math.log(GMD / bundleRadius)) * 1000;

  // ── 5. Line parameters ─────────────────────────────────────────
  // Resistance per phase (parallel sub-conductors)
  const R_per_km = subConductorResistance / numSubConductors; // Ω/km
  const R_total = R_per_km * lineLength; // Ω

  const L_total = inductancePerKm * lineLength; // H
  const C_total = capacitancePerKm * lineLength; // F

  const XL = omega * L_total; // Ω (inductive reactance)
  const XC = 1 / (omega * C_total); // Ω (capacitive reactance)

  // Series impedance z = R + jXL  (per phase total)
  const Z: ComplexNumber = { re: R_total, im: XL };

  // Shunt admittance Y = jωC (total)
  const Y: ComplexNumber = { re: 0, im: omega * C_total };

  // ── 6. Receiving end phasors ───────────────────────────────────
  // Vr = Vnom / sqrt(3)  (phase voltage)
  const Vr_mag = (nominalVoltage * 1000) / Math.sqrt(3); // V
  const Vr: ComplexNumber = { re: Vr_mag, im: 0 }; // reference phasor

  // Ir
  const phi = Math.acos(powerFactor);
  const Ir_mag =
    (receivingEndLoad * 1e6) /
    (Math.sqrt(3) * nominalVoltage * 1000 * powerFactor); // magnitude in A
  // Lagging: I = Ir*(cos(phi) - j*sin(phi)), Leading: + j*sin(phi)
  const Ir: ComplexNumber = {
    re: Ir_mag * powerFactor,
    im: pfLag ? -Ir_mag * Math.sin(phi) : Ir_mag * Math.sin(phi),
  };

  // ── 7. ABCD Parameters ─────────────────────────────────────────
  let abcd: ABCDParams;
  let Vs: ComplexNumber;
  let Is: ComplexNumber;

  if (lineModel === "short") {
    // A = D = 1, B = Z, C = 0
    abcd = {
      A: { re: 1, im: 0 },
      B: Z,
      C: { re: 0, im: 0 },
      D: { re: 1, im: 0 },
    };

    // Vs = A*Vr + B*Ir
    Vs = cadd(cmul(abcd.A, Vr), cmul(abcd.B, Ir));
    // Is = C*Vr + D*Ir
    Is = cadd(cmul(abcd.C, Vr), cmul(abcd.D, Ir));
  } else if (lineModel === "nominal-pi") {
    // A = D = 1 + ZY/2
    // B = Z
    // C = Y(1 + ZY/4)
    const ZY = cmul(Z, Y);
    const ZY_half = { re: ZY.re / 2, im: ZY.im / 2 };
    const ZY_quarter = { re: ZY.re / 4, im: ZY.im / 4 };

    const A: ComplexNumber = { re: 1 + ZY_half.re, im: ZY_half.im };
    const B: ComplexNumber = Z;
    const C: ComplexNumber = cmul(Y, {
      re: 1 + ZY_quarter.re,
      im: ZY_quarter.im,
    });
    const D: ComplexNumber = A;

    abcd = { A, B, C, D };

    Vs = cadd(cmul(A, Vr), cmul(B, Ir));
    Is = cadd(cmul(C, Vr), cmul(D, Ir));
  } else {
    // Distributed parameter model
    // γ = sqrt(ZY) per km  (use per-unit-length values)
    const z_pul: ComplexNumber = { re: R_per_km, im: omega * inductancePerKm };
    const y_pul: ComplexNumber = { re: 0, im: omega * capacitancePerKm };

    const gamma = csqrt(cmul(z_pul, y_pul)); // propagation constant per km
    const Zc = csqrt(cdiv(z_pul, y_pul)); // characteristic impedance

    const gl: ComplexNumber = {
      re: gamma.re * lineLength,
      im: gamma.im * lineLength,
    };

    const cosh_gl = ccosh(gl);
    const sinh_gl = csinh(gl);

    // A = D = cosh(γl)
    // B = Zc * sinh(γl)
    // C = sinh(γl) / Zc
    const A = cosh_gl;
    const B = cmul(Zc, sinh_gl);
    const C = cdiv(sinh_gl, Zc);
    const D = cosh_gl;

    abcd = { A, B, C, D };

    Vs = cadd(cmul(A, Vr), cmul(B, Ir));
    Is = cadd(cmul(C, Vr), cmul(D, Ir));
  }

  // ── 8. Results ─────────────────────────────────────────────────
  const Vs_mag_phase = cmag(Vs); // phase voltage (V)
  const Vs_line_kV = (Vs_mag_phase * Math.sqrt(3)) / 1000; // line voltage (kV)
  const Is_mag = cmag(Is); // sending current (A)

  // Charging current (nominal-pi / distributed only)
  // Ic = Y/2 * Vs  (sending end)
  const chargingCurrent = lineModel === "short" ? czero(0) : cmul(abcd.C, Vr);

  // Voltage regulation
  const VR = ((Vs_mag_phase - Vr_mag) / Vr_mag) * 100;

  // Power loss
  const P_send =
    3 *
    Vs_mag_phase *
    Is_mag *
    Math.cos(Math.atan2(Vs.im, Vs.re) - Math.atan2(Is.im, Is.re));
  const P_recv = receivingEndLoad * 1e6;
  const powerLoss = (P_send - P_recv) / 1e6; // MW

  // Efficiency
  const efficiency = (P_recv / P_send) * 100;

  // ── 9. Surge Impedance (lossless: R=0) ─────────────────────────
  // Zs = sqrt(L/C)
  const surgeImpedance = Math.sqrt(inductancePerKm / capacitancePerKm);

  // SIL = Vnom^2 / Zs  (MW)
  const surgeImpedanceLoading =
    (nominalVoltage * 1000) ** 2 / surgeImpedance / 1e6;

  return {
    inductancePerKm,
    capacitancePerKm,
    inductiveReactance: XL,
    capacitiveReactance: XC,
    abcd,
    sendingVoltage: Vs_line_kV,
    sendingCurrent: Is_mag,
    chargingCurrent,
    voltageRegulation: VR,
    powerLoss,
    efficiency,
    surgeImpedance,
    surgeImpedanceLoading,
  };
}
