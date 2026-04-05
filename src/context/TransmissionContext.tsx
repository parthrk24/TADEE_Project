// src/context/TransmissionContext.tsx
"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import {
  TransmissionState,
  TransmissionInputs,
  TransmissionResults,
} from "@/types/transmission";

// ── Default inputs ──────────────────────────────────────────────
const defaultInputs: TransmissionInputs = {
  // Conductor
  numStrands: 7,
  strandDiameter: 3.5,
  subConductorResistance: 0.05,
  numSubConductors: 2,
  bundleSpacing: 400,

  // Geometry
  spacingType: "symmetrical",
  spacingAB: 6,
  spacingBC: 6,
  spacingCA: 6,

  // System
  lineLength: 200,
  receivingEndLoad: 100,
  powerFactor: 0.9,
  pfLag: true,
  nominalVoltage: 220,
  frequency: 50,

  // Model
  lineModel: "nominal-pi",
};

const initialState: TransmissionState = {
  inputs: defaultInputs,
  results: null,
  currentStep: 1,
};

// ── Action types ─────────────────────────────────────────────────
type Action =
  | { type: "UPDATE_INPUT"; payload: Partial<TransmissionInputs> }
  | { type: "SET_RESULTS"; payload: TransmissionResults }
  | { type: "CLEAR_RESULTS" }
  | { type: "SET_STEP"; payload: number }
  | { type: "RESET" };

// ── Reducer ───────────────────────────────────────────────────────
function reducer(state: TransmissionState, action: Action): TransmissionState {
  switch (action.type) {
    case "UPDATE_INPUT":
      return {
        ...state,
        results: null, // clear results whenever input changes
        inputs: { ...state.inputs, ...action.payload },
      };
    case "SET_RESULTS":
      return { ...state, results: action.payload };
    case "CLEAR_RESULTS":
      return { ...state, results: null };
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────
interface TransmissionContextType {
  state: TransmissionState;
  updateInput: (payload: Partial<TransmissionInputs>) => void;
  setResults: (results: TransmissionResults) => void;
  clearResults: () => void;
  setStep: (step: number) => void;
  reset: () => void;
}

const TransmissionContext = createContext<TransmissionContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────
export function TransmissionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateInput = (payload: Partial<TransmissionInputs>) =>
    dispatch({ type: "UPDATE_INPUT", payload });

  const setResults = (results: TransmissionResults) =>
    dispatch({ type: "SET_RESULTS", payload: results });

  const clearResults = () => dispatch({ type: "CLEAR_RESULTS" });

  const setStep = (step: number) =>
    dispatch({ type: "SET_STEP", payload: step });

  const reset = () => dispatch({ type: "RESET" });

  return (
    <TransmissionContext.Provider
      value={{ state, updateInput, setResults, clearResults, setStep, reset }}
    >
      {children}
    </TransmissionContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────
export function useTransmission() {
  const ctx = useContext(TransmissionContext);
  if (!ctx)
    throw new Error("useTransmission must be used inside TransmissionProvider");
  return ctx;
}
