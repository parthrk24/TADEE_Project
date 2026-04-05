// src/types/transmission.ts

export type SpacingType = "symmetrical" | "unsymmetrical";
export type BundleCount = 2 | 3 | 4;
export type LineModel = "short" | "nominal-pi" | "distributed";

export interface TransmissionInputs {
  // Step 1 - Conductor Parameters
  numStrands: number;
  strandDiameter: number; // mm
  subConductorResistance: number; // Ω/km per sub-conductor
  numSubConductors: BundleCount;
  bundleSpacing: number; // mm (spacing between sub-conductors)

  // Step 2 - Line Geometry
  spacingType: SpacingType;
  spacingAB: number; // m (if unsymmetrical, AB distance)
  spacingBC: number; // m (BC distance)
  spacingCA: number; // m (CA distance)
  // if symmetrical, only spacingAB is used as 'D'

  // Step 3 - System Parameters
  lineLength: number; // km
  receivingEndLoad: number; // MW
  powerFactor: number; // e.g. 0.9
  pfLag: boolean; // true = lagging, false = leading
  nominalVoltage: number; // kV (line-to-line)
  frequency: number; // Hz

  // Step 4 - Line Model
  lineModel: LineModel;
}

export interface ComplexNumber {
  re: number;
  im: number;
}

export interface ABCDParams {
  A: ComplexNumber;
  B: ComplexNumber;
  C: ComplexNumber;
  D: ComplexNumber;
}

export interface TransmissionResults {
  // Per-phase per-km
  inductancePerKm: number; // H/km
  capacitancePerKm: number; // F/km

  // Total line reactances
  inductiveReactance: number; // Ω
  capacitiveReactance: number; // Ω

  // ABCD
  abcd: ABCDParams;

  // Sending end
  sendingVoltage: number; // kV (line-to-line)
  sendingCurrent: number; // A

  // Charging current
  chargingCurrent: number; // A

  // Performance
  voltageRegulation: number; // %
  powerLoss: number; // MW
  efficiency: number; // %

  // Surge
  surgeImpedance: number; // Ω
  surgeImpedanceLoading: number; // MW
}

export interface TransmissionState {
  inputs: TransmissionInputs;
  results: TransmissionResults | null;
  currentStep: number; // 1 to 4
}
