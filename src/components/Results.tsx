// src/components/Results.tsx
"use client";

import { useTransmission } from "@/context/TransmissionContext";
import { ComplexNumber } from "@/types/transmission";

function fmt(n: number, decimals = 4): string {
  return isNaN(n) ? "—" : n.toFixed(decimals);
}

function fmtComplex(c: ComplexNumber): string {
  const sign = c.im >= 0 ? "+" : "-";
  return `${fmt(c.re)} ${sign} j${fmt(Math.abs(c.im))}`;
}

function ResultRow({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div
      className="flex justify-between items-start py-2 
                    border-b border-purple-500/10 gap-2"
    >
      <span className="text-sm text-purple-200/70 flex-1">{label}</span>
      <span className="text-sm font-mono font-medium text-purple-100 text-right">
        {value}{" "}
        {unit && <span className="text-xs text-purple-300/50">{unit}</span>}
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-purple-500/20 overflow-hidden">
      <div className="bg-purple-500/10 px-4 py-2 border-b border-purple-500/20">
        <h3 className="text-sm font-semibold text-purple-200">{title}</h3>
      </div>
      <div className="px-4 py-1">{children}</div>
    </div>
  );
}

export default function Results() {
  const { state, setStep, clearResults } = useTransmission();
  const { results, inputs } = state;

  if (!results) return null;

  const r = results;

  // ── Generate report text ─────────────────────────────────────
  function generateReport(): string {
    const line = "─".repeat(55);

    return `
${line}
  TRANSMISSION LINE ANALYSIS REPORT
  EEPC17 - NIT Tiruchirappalli
${line}

Developed by:
  1. Parth Kurade — 107124074
  2. Kumar Shubangam Verma — 107124056
  3. Pranav Jha — 107124080

Submitted on: 18-04-2026
${line}

INPUT PARAMETERS
  Line Length          : ${inputs.lineLength} km
  Receiving End Load   : ${inputs.receivingEndLoad} MW
  Power Factor         : ${inputs.powerFactor} (${inputs.pfLag ? "Lagging" : "Leading"})
  Nominal Voltage      : ${inputs.nominalVoltage} kV
  Frequency            : ${inputs.frequency} Hz
  Spacing Type         : ${inputs.spacingType}
  Line Model           : ${inputs.lineModel}
  Sub-conductors/Bundle: ${inputs.numSubConductors}
  Bundle Spacing       : ${inputs.bundleSpacing} mm
  No. of Strands       : ${inputs.numStrands}
  Strand Diameter      : ${inputs.strandDiameter} mm
  Sub-cond Resistance  : ${inputs.subConductorResistance} Ω/km

${line}
OUTPUT RESULTS
${line}

1.  Inductance/phase/km  : ${fmt(r.inductancePerKm, 6)} H/km
2.  Capacitance/phase/km : ${fmt(r.capacitancePerKm, 6)} F/km
3.  Inductive Reactance  : ${fmt(r.inductiveReactance, 4)} Ω (per phase)
4.  Capacitive Reactance : ${fmt(r.capacitiveReactance, 4)} Ω (per phase)

5.  ABCD Parameters:
    A = ${fmtComplex(r.abcd.A)}
    B = ${fmtComplex(r.abcd.B)} Ω
    C = ${fmtComplex(r.abcd.C)} S
    D = ${fmtComplex(r.abcd.D)}

6.  Sending End Voltage  : ${fmtComplex(r.sendingVoltage)} kV (line to line)
7.  Sending End Current  : ${fmtComplex(r.sendingCurrent)} A
8.  Charging Current     : ${fmtComplex(r.chargingCurrent)} A (per phase)
9.  Voltage Regulation   : ${fmt(r.voltageRegulation, 4)} %
10. Total Power Loss           : ${fmt(r.powerLoss, 4)} MW
11. Transmission Efficiency    : ${fmt(r.efficiency, 4)} %
12. Surge Impedance      : ${fmt(r.surgeImpedance, 4)} Ω
13. SIL                  : ${fmt(r.surgeImpedanceLoading, 4)} MW

${line}
    `.trim();
  }

  function downloadReport() {
    const text = generateReport();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transmission_line_report.doc";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-wide">Results</h2>
        <button
          onClick={() => {
            clearResults();
            setStep(4);
          }}
          className="text-xs text-purple-300/50 hover:text-purple-300 transition"
        >
          ← Edit Inputs
        </button>
      </div>

      {/* Line Parameters */}
      <Section title="Line Parameters">
        <ResultRow
          label="Inductance per phase per km"
          value={`${(r.inductancePerKm * 1000).toFixed(4)} × 10⁻³`}
          unit="H/km"
        />
        <ResultRow
          label="Capacitance per phase per km"
          value={`${(r.capacitancePerKm * 1e9).toFixed(4)} × 10⁻⁹`}
          unit="F/km"
        />
        <ResultRow
          label="Inductive Reactance"
          value={fmt(r.inductiveReactance)}
          unit="Ω"
        />
        <ResultRow
          label="Capacitive Reactance"
          value={fmt(r.capacitiveReactance)}
          unit="Ω"
        />
      </Section>

      {/* ABCD Parameters */}
      <Section title="ABCD Parameters">
        <ResultRow label="A" value={fmtComplex(r.abcd.A)} />
        <ResultRow label="B" value={fmtComplex(r.abcd.B)} unit="Ω" />
        <ResultRow label="C" value={fmtComplex(r.abcd.C)} unit="S" />
        <ResultRow label="D" value={fmtComplex(r.abcd.D)} />
      </Section>

      {/* Sending End */}
      <Section title="Sending End">
        <ResultRow
          label="Sending End Voltage"
          value={fmtComplex(r.sendingVoltage)}
          unit="kV"
        />
        <ResultRow
          label="Sending End Current"
          value={fmtComplex(r.sendingCurrent)}
          unit="A"
        />
        <ResultRow
          label="Charging Current"
          value={fmtComplex(r.chargingCurrent)}
          unit="A"
        />
      </Section>

      {/* Performance */}
      <Section title="Performance">
        <ResultRow
          label="Voltage Regulation"
          value={fmt(r.voltageRegulation)}
          unit="%"
        />
        <ResultRow label="Power Loss" value={fmt(r.powerLoss)} unit="MW" />
        <ResultRow
          label="Transmission Efficiency"
          value={fmt(r.efficiency)}
          unit="%"
        />
      </Section>

      {/* Surge */}
      <Section title="Surge Parameters (Lossless)">
        <ResultRow
          label="Surge Impedance"
          value={fmt(r.surgeImpedance)}
          unit="Ω"
        />
        <ResultRow
          label="Surge Impedance Loading"
          value={fmt(r.surgeImpedanceLoading)}
          unit="MW"
        />
      </Section>
      {/* Credit */}
      <div
        className="rounded-lg bg-purple-500/10 border border-purple-500/20
                      px-4 py-3"
      >
        <p className="text-xs font-semibold text-purple-300 mb-1">
          Developed by
        </p>
        <p className="text-xs text-purple-200/70">
          1. Parth Kurade — 107124074
        </p>
        <p className="text-xs text-purple-200/70">
          2. Kumar Shubangam Verma — 107124056
        </p>
        <p className="text-xs text-purple-200/70">3. Pranav Jha — 107124080</p>
      </div>
      {/* Download */}
      <button
        onClick={downloadReport}
        className="w-full py-3 rounded-xl bg-purple-600 text-white 
                   font-semibold text-sm hover:bg-purple-500 transition
                   shadow-lg shadow-purple-500/30"
      >
        ⬇ Download Report (.doc)
      </button>
    </div>
  );
}
