import type { GridLayout } from "@/data/gridLayouts";

interface ColumnsProps {
  layout: GridLayout;
  color: string;
  opacity: number;
}

export const Columns = ({ layout, color, opacity }: ColumnsProps) => {
  const { columns, gutter, margin, width, type } = layout;

  const containerStyle: React.CSSProperties =
    type === "stretch"
      ? {
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: gutter,
          padding: `0 ${margin}`,
        }
      : {
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, ${width})`,
          gap: gutter,
          justifyContent: "center",
        };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-8000 h-full w-full"
      style={containerStyle}
    >
      {Array.from({ length: columns }, (_, i) => (
        <div
          key={i}
          className="h-full"
          style={{ background: `hsl(${color} / ${opacity})` }}
        />
      ))}
    </div>
  );
};
