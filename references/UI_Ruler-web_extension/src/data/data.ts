import type { StateSetter } from "@/types";

export type FieldBinding = {
  value: number;
  set: (v: number) => void;
};

export type ConfigOptionsProps = {
  lines: number;
  gap: number;
  opacity: number;
  color: string;
  setLines: (v: number) => void;
  setGap: (v: number) => void;
  setOpacity: (v: number) => void;
  setColor: (v: string) => void;
  rotate: number;
  setRotate: StateSetter<number>;
};

export type NumberFieldConfig = {
  key: "lines" | "gap" | "opacity";
  label: string;
  step?: number;
  quick: number[];
};

export const NUMBER_FIELDS: NumberFieldConfig[] = [
  {
    key: "lines",
    label: "Linhas",
    quick: [2, 4, 6, 8, 10],
    step: 2,
  },
  {
    key: "gap",
    label: "Gap",
    quick: [16, 24, 32, 40, 48],
    step: 4,
  },
  {
    key: "opacity",
    label: "Opacidade",
    quick: [0.2, 0.4, 0.6, 0.8, 1],
    step: 0.05,
  },
];

export const colorOptions = [
  { name: "Azul", value: "#2563eb" },
  { name: "Amarelo", value: "#eab308" },
  { name: "Verde", value: "#16a34a" },
  { name: "Roxo", value: "#7c3aed" },
  { name: "Violeta", value: "#9333ea" },
  { name: "Vermelho", value: "#d71212" },
  { name: "Preto", value: "#000000" },
  { name: "Ciano", value: "#06b6d4" },
];
