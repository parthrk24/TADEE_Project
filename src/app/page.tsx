// src/app/page.tsx
import Link from "next/link";
export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center
                     justify-center px-4"
    >
      <div
        className="max-w-md w-full bg-black/40 backdrop-blur-md 
                      rounded-2xl border border-purple-500/20 p-8 
                      flex flex-col gap-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Transmission Line Analyser
          </h1>
          <p className="text-sm text-purple-300/70 mt-1">
            EEPC17 — NIT Tiruchirappalli
          </p>
        </div>

        <p className="text-sm text-purple-200/70">
          Analyse three-phase single circuit transmission systems with bundled
          ACSR conductors. Supports short, nominal-π, and distributed parameter
          line models.
        </p>

        <ul
          className="text-sm text-purple-300/60 flex flex-col 
                       gap-1 list-disc list-inside"
        >
          <li>GMR & GMD for bundled conductors</li>
          <li>Symmetrical & unsymmetrical spacing</li>
          <li>ABCD parameters for all 3 models</li>
          <li>Voltage regulation, efficiency & SIL</li>
          <li>Downloadable report</li>
        </ul>

        <Link
          href="/calculator"
          className="w-full text-center py-3 rounded-xl bg-purple-600 
                     text-white font-semibold text-sm hover:bg-purple-500 
                     transition shadow-lg shadow-purple-500/30"
        >
          Start Analysis →
        </Link>
      </div>
    </main>
  );
}
