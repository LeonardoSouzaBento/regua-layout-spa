import { Smartphone, Tablet, Monitor } from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

type LucideIcon = ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

export interface GridLayout {
  alias: string;
  type: "stretch" | "center";
  columns: number;
  margin?: string;
  gutter: string;
  width?: string;
}

export interface DeviceGroup {
  label: string;
  icon: LucideIcon;
  maxWidth?: number;
  layouts: GridLayout[];
}

export interface GridLayouts {
  [key: string]: DeviceGroup;
}

export type Device = "mobile" | "tablet" | "desktop";

/*prettier-ignore*/
export const gridLayouts: GridLayouts = {
  desktop: {
    label: "Desktop",
    icon: Monitor,
    layouts: [
      { alias: "compact", type: "stretch", columns: 12, margin: "16px", gutter: "16px" },
      { alias: "balanced", type: "stretch", columns: 12, margin: "32px", gutter: "32px" },
      { alias: "wide", type: "center", columns: 12, width: "72px", gutter: "24px" },
      { alias: "container", type: "center", columns: 12, width: "88px", gutter: "16px" },
      { alias: "airy", type: "stretch", columns: 12, margin: "100px", gutter: "20px" },
    ],
  },
  mobile: {
    label: "Mobile",
    icon: Smartphone,
    maxWidth: 768,
    layouts: [
      { alias: "tight", type: "stretch", columns: 4, margin: "16px", gutter: "16px" },
      { alias: "compact", type: "stretch", columns: 4, margin: "12px", gutter: "12px" },
      { alias: "default", type: "stretch", columns: 4, margin: "24px", gutter: "16px" },
      { alias: "comfort", type: "stretch", columns: 4, margin: "24px", gutter: "20px" },
    ],
  },
  tablet: {
    label: "Tablet",
    icon: Tablet,
    maxWidth: 1024,
    layouts: [
      { alias: "compact", type: "stretch", columns: 8, margin: "32px", gutter: "20px" },
      { alias: "default", type: "stretch", columns: 8, margin: "64px", gutter: "16px" },
      { alias: "wide", type: "stretch", columns: 8, margin: "88px", gutter: "24px" },
    ],
  },
};
