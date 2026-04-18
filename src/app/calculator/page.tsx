"use client";

import dynamic from "next/dynamic";

const CalculatorContent = dynamic(
  () => import("@/components/CalculatorContent"),
  {
    ssr: false,
  },
);

export default function CalculatorPage() {
  return <CalculatorContent />;
}
