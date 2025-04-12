export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  chineseName: string;
  atomicMass: number;
  category: string;
  group: number;
  period: number;
  electronConfiguration?: string;
  electronegativity?: number;
  atomicRadius?: number;
  ionizationEnergy?: number;
  density?: number;
  meltingPoint?: number;
  boilingPoint?: number;
  discoveryYear?: number;
}

export type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble-gas"
  | "lanthanide"
  | "actinide"; 