import { Smartphone, Tablet, Monitor, Sliders } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface GridLayout {
  alias: string;
  type: 'stretch' | 'center';
  columns: number;
  margin?: string;
  gutter: string;
  width?: string;
  description?: string;
}

export interface DeviceGroup {
  label: string;
  icon: LucideIcon;
  maxWidth?: number;
  layouts: GridLayout[];
}

export type Device = 'desktop' | 'tablet' | 'mobile' | 'frameworks';

export const gridLayouts: Record<Device, DeviceGroup> = {
  desktop: {
    label: 'Desktop',
    icon: Monitor,
    layouts: [
      { alias: 'default', type: 'stretch', columns: 12, margin: '24px', gutter: '24px', description: 'Padrão 12 colunas fluido' },
      { alias: 'compact', type: 'stretch', columns: 12, margin: '16px', gutter: '16px', description: '12 colunas compacto' },
      { alias: 'container-1280', type: 'center', columns: 12, width: '80px', gutter: '24px', description: 'Container 1280px centralizado' },
      { alias: 'container-1440', type: 'center', columns: 12, width: '90px', gutter: '32px', description: 'Ultra-wide 1440px centralizado' },
      { alias: '6-cols', type: 'stretch', columns: 6, margin: '24px', gutter: '24px', description: '6 colunas divididas' },
      { alias: '3-cols', type: 'stretch', columns: 3, margin: '24px', gutter: '32px', description: '3 colunas para seções e cards' },
      { alias: 'balanced', type: 'stretch', columns: 12, margin: '32px', gutter: '32px', description: '12 colunas equilibrado' },
      { alias: 'airy', type: 'stretch', columns: 12, margin: '100px', gutter: '20px', description: '12 colunas com margem ampla' },
    ],
  },
  frameworks: {
    label: 'Frameworks',
    icon: Sliders,
    layouts: [
      { alias: 'tailwind-xl', type: 'center', columns: 12, width: '85px', gutter: '16px', description: 'Tailwind CSS container max-w-7xl' },
      { alias: 'bootstrap-5', type: 'center', columns: 12, width: '88px', gutter: '24px', description: 'Bootstrap 5 container-xxl (1320px)' },
      { alias: 'bootstrap-xl', type: 'center', columns: 12, width: '74px', gutter: '24px', description: 'Bootstrap 5 container-xl (1140px)' },
      { alias: 'material-ui', type: 'stretch', columns: 12, margin: '24px', gutter: '24px', description: 'Material Design 12-col 24px' },
    ],
  },
  tablet: {
    label: 'Tablet',
    icon: Tablet,
    maxWidth: 1024,
    layouts: [
      { alias: 'default', type: 'stretch', columns: 8, margin: '64px', gutter: '16px', description: 'Tablet padrão 8 colunas' },
      { alias: 'compact', type: 'stretch', columns: 8, margin: '32px', gutter: '20px', description: 'Tablet compacto' },
      { alias: 'wide', type: 'stretch', columns: 8, margin: '88px', gutter: '24px', description: 'Tablet margem ampla' },
    ],
  },
  mobile: {
    label: 'Mobile',
    icon: Smartphone,
    maxWidth: 768,
    layouts: [
      { alias: 'default', type: 'stretch', columns: 4, margin: '24px', gutter: '16px', description: 'Mobile padrão 4 colunas' },
      { alias: 'compact', type: 'stretch', columns: 4, margin: '12px', gutter: '12px', description: 'Mobile telas compactas' },
      { alias: 'tight', type: 'stretch', columns: 4, margin: '16px', gutter: '16px', description: 'Mobile margem média' },
      { alias: 'comfort', type: 'stretch', columns: 4, margin: '24px', gutter: '20px', description: 'Mobile calha confortável' },
    ],
  },
};
