import { Button } from "@/components/ui/button";
import type { Device, GridLayout } from "@/data/gridLayouts";
import { gridLayouts } from "@/data/gridLayouts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMatchMedias } from "@/hooks/useMatchMedias";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  ColorControls,
  Columns,
  ConfigPanel,
  DragButton,
} from "./column-grid/index";

function getInitialLayout(
  device: Device,
  lastGrid?: Record<string, string>,
): GridLayout {
  const group = gridLayouts[device];
  const lastAlias = lastGrid?.[device];
  const defaultAlias =
    lastAlias || (device === "desktop" ? "balanced" : "default");
  return (
    group.layouts.find((l) => l.alias === defaultAlias) ?? group.layouts[0]
  );
}

const DEFAULT_COLOR = "220 70% 55%";
const DEFAULT_OPACITY = 0.25;

const LayoutGrid = () => {
  const [open, setOpen] = useState(false);
  const device = useMatchMedias();

  const [lastGrid, setLastGrid] = useLocalStorage("lastGrid", {
    mobile: "default",
    tablet: "default",
    desktop: "balanced",
  });

  const [selection, setSelection] = useState(() => ({
    device,
    layout: getInitialLayout(device, lastGrid),
  }));

  const [columnColor, setColumnColor] = useState(DEFAULT_COLOR);
  const [columnOpacity, setColumnOpacity] = useState(DEFAULT_OPACITY);
  const containerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ bottom: 16, right: 16 });

  useEffect(() => {
    setSelection({
      device,
      layout: getInitialLayout(device, lastGrid),
    });
  }, [device]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !e.composedPath().includes(containerRef.current)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSelect = (device: Device, layout: GridLayout) => {
    setSelection({ device, layout });
  };

  return (
    <>
      <Columns
        layout={selection.layout}
        color={columnColor}
        opacity={columnOpacity}
      />

      <div
        ref={containerRef}
        className="fixed z-9000"
        style={{
          bottom: `${positionRef.current.bottom}px`,
          right: `${positionRef.current.right}px`,
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="rounded-xl shadow-sm ring-1 ring-glass-border"
          style={{
            background: "var(--color-glass-bg)",
            backdropFilter: `blur(var(--color-glass-blur))`,
            WebkitBackdropFilter: `blur(var(--color-glass-blur))`,
          }}
        >
          <div
            className={cn(
              "grid transition-all duration-200 ease-out",
              open
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div
              className="overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="border-b">
                <ConfigPanel
                  selectedDevice={selection.device}
                  selectedAlias={selection.layout.alias}
                  onSelect={handleSelect}
                  setLastGrid={setLastGrid}
                />
                <ColorControls
                  color={columnColor}
                  opacity={columnOpacity}
                  onColorChange={setColumnColor}
                  onOpacityChange={setColumnOpacity}
                />
              </div>
            </div>
          </div>

          <Button
            asChild
            variant="ghost"
            onClick={() => setOpen((v) => !v)}
            className="w-full justify-between gap-2 pl-4 pr-2 py-2.5 text-sm 
            font-medium text-foreground hover:bg-accent/50"
          >
            <div>
              <span className="w-full flex items-center gap-3">
                <ChevronDown
                  size={24}
                  strokeWidth={2}
                  className={cn(
                    "transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
                Configurar grid
              </span>
              <div className="shrink-0 p-1">
                <DragButton
                  containerRef={containerRef as React.RefObject<HTMLDivElement>}
                  positionRef={positionRef}
                />
              </div>
            </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default LayoutGrid;
