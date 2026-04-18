// src/components/Results.tsx
"use client";

import { useTransmission } from "@/context/TransmissionContext";
import { ComplexNumber } from "@/types/transmission";
import { formatPolar } from "@/lib/calculations";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";

function fmt(n: number, decimals = 4): string {
  return isNaN(n) ? "—" : n.toFixed(decimals);
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

  // ── Generate report lines ────────────────────────────────────

  async function downloadReport() {
    const noBorder = {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    };

    function textRun(text: string, bold = false) {
      return new TextRun({ text, font: "Arial", size: 20, bold });
    }

    function textPara(text: string, bold = false) {
      return new Paragraph({ children: [textRun(text, bold)] });
    }

    function tableRow(label: string, value: string) {
      return new TableRow({
        children: [
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [new Paragraph({ children: [textRun(label)] })],
          }),
          new TableCell({
            width: { size: 60, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [new Paragraph({ children: [textRun(": " + value)] })],
          }),
        ],
      });
    }

    const divider = "\u2500".repeat(55);

    const doc = new Document({
      sections: [
        {
          children: [
            textPara(divider),
            textPara("TRANSMISSION LINE ANALYSIS REPORT", true),
            textPara("EEPC17 - NIT Tiruchirappalli"),
            textPara(divider),
            textPara(""),
            textPara("Developed by:"),
            textPara("  1. Parth Kurade \u2014 107124074"),
            textPara("  2. Kumar Shubangam Verma \u2014 107124056"),
            textPara("  3. Pranav Jha \u2014 107124080"),
            textPara(""),
            textPara("Submitted on: 18-04-2026"),
            textPara(""),
            textPara(divider),
            textPara("INPUT PARAMETERS", true),
            textPara(divider),
            textPara(""),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: noBorder,
              rows: [
                tableRow("  Line Length", `${inputs.lineLength} km`),
                tableRow(
                  "  Receiving End Load",
                  `${inputs.receivingEndLoad} MW`,
                ),
                tableRow(
                  "  Power Factor",
                  `${inputs.powerFactor} (${inputs.pfLag ? "Lagging" : "Leading"})`,
                ),
                tableRow("  Nominal Voltage", `${inputs.nominalVoltage} kV`),
                tableRow("  Frequency", `${inputs.frequency} Hz`),
                tableRow("  Spacing Type", `${inputs.spacingType}`),
                tableRow("  Line Model", `${inputs.lineModel}`),
                tableRow(
                  "  Sub-conductors/Bundle",
                  `${inputs.numSubConductors}`,
                ),
                tableRow("  Bundle Spacing", `${inputs.bundleSpacing} mm`),
                tableRow("  No. of Strands", `${inputs.numStrands}`),
                tableRow("  Strand Diameter", `${inputs.strandDiameter} mm`),
                tableRow(
                  "  Sub-cond Resistance",
                  `${inputs.subConductorResistance} \u03A9/km`,
                ),
              ],
            }),
            textPara(""),
            textPara(divider),
            textPara("OUTPUT RESULTS", true),
            textPara(divider),
            textPara(""),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: noBorder,
              rows: [
                tableRow(
                  "1.  Inductance/phase/km",
                  `${(r.inductancePerKm * 1000).toFixed(4)} x 10^-3 H/km`,
                ),
                tableRow(
                  "2.  Capacitance/phase/km",
                  `${(r.capacitancePerKm * 1e9).toFixed(4)} x 10^-9 F/km`,
                ),
                tableRow(
                  "3.  Inductive Reactance",
                  `${fmt(r.inductiveReactance, 4)} \u03A9 (per phase)`,
                ),
                tableRow(
                  "4.  Capacitive Reactance",
                  `${fmt(r.capacitiveReactance, 4)} \u03A9 (per phase)`,
                ),
                tableRow("5.  ABCD Parameters", ""),
                tableRow("    A", `${formatPolar(r.abcd.A)}`),
                tableRow("    B", `${formatPolar(r.abcd.B)} \u03A9`),
                tableRow("    C", `${formatPolar(r.abcd.C, 6, 4)} S`),
                tableRow("    D", `${formatPolar(r.abcd.D)}`),
                tableRow(
                  "6.  Sending End Voltage",
                  `${formatPolar(r.sendingVoltage, 4, 2)} kV (L - L)`,
                ),
                tableRow(
                  "7.  Sending End Current",
                  `${formatPolar(r.sendingCurrent, 4, 2)} A`,
                ),
                tableRow(
                  "8.  Charging Current",
                  `${formatPolar(r.chargingCurrent, 4, 2)} A (per phase)`,
                ),
                tableRow(
                  "9.  Voltage Regulation",
                  `${fmt(r.voltageRegulation, 4)} %`,
                ),
                tableRow("10. Total Power Loss", `${fmt(r.powerLoss, 4)} MW`),
                tableRow(
                  "11. Transmission Efficiency",
                  `${fmt(r.efficiency, 4)} %`,
                ),
                tableRow(
                  "12. Surge Impedance",
                  `${fmt(r.surgeImpedance, 4)} \u03A9`,
                ),
                tableRow("13. SIL", `${fmt(r.surgeImpedanceLoading, 4)} MW`),
              ],
            }),
            textPara(""),
            textPara(divider),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transmission_line_report.docx";
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
          unit="Ω (per phase)"
        />
        <ResultRow
          label="Capacitive Reactance"
          value={fmt(r.capacitiveReactance)}
          unit="Ω (per phase)"
        />
      </Section>

      {/* ABCD Parameters */}
      <Section title="ABCD Parameters">
        <ResultRow label="A" value={formatPolar(r.abcd.A)} />
        <ResultRow label="B" value={formatPolar(r.abcd.B)} unit="Ω" />
        <ResultRow label="C" value={formatPolar(r.abcd.C, 6, 4)} unit="S" />
        <ResultRow label="D" value={formatPolar(r.abcd.D)} />
      </Section>

      {/* Sending End */}
      <Section title="Sending End">
        <ResultRow
          label="Sending End Voltage"
          value={formatPolar(r.sendingVoltage, 4, 2)}
          unit="kV (L - L)"
        />
        <ResultRow
          label="Sending End Current"
          value={formatPolar(r.sendingCurrent, 4, 2)}
          unit="A (per phase)"
        />
        <ResultRow
          label="Charging Current"
          value={formatPolar(r.chargingCurrent, 4, 2)}
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
        ⬇ Download Report (.docx)
      </button>
    </div>
  );
}
