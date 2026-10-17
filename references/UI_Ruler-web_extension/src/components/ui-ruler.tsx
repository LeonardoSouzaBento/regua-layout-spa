import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  ConfigButton,
  ConfigOptions,
  MoveLinesButton,
  DismountButton,
} from "./ui-ruler/index";
import type { StateSetter } from "@/types";
import { Button, Icon } from "@/components/ui";

type Props = {
  showLines: boolean;
  setShowLines: StateSetter<boolean>;
};

function UIRulerCore({ showLines, setShowLines }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const configButtonRef = useRef<HTMLDivElement>(null);
  const configOptionsRef = useRef<HTMLDivElement>(null);
  const moveLinesButtonRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState(1);
  const [gap, setGap] = useState(24);
  const [opacity, setOpacity] = useState(0.4);
  const [color, setColor] = useState("#2563eb");
  const [showConfig, setShowConfig] = useState(false);
  const [rotate, setRotate] = useState(0);

  // Toggle por tecla
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === ";") {
        setShowLines((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Fechar ao clicar fora
  useEffect(() => {
    if (!showConfig) return;

    const handleClickOutside = (e: MouseEvent) => {
      const path = e.composedPath();
      const isInsideButton =
        configButtonRef.current && path.includes(configButtonRef.current);
      const isInsideOptions =
        configOptionsRef.current && path.includes(configOptionsRef.current);
      const isInsideMoveButton =
        moveLinesButtonRef.current && path.includes(moveLinesButtonRef.current);

      if (!isInsideButton && !isInsideOptions && !isInsideMoveButton) {
        setShowConfig(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showConfig]);

  const height = lines * gap - 0.625 * lines;

  if (!showLines) return null;

  return (
    <>
      <div
        ref={containerRef}
        className="absolute left-0 z-10 flex w-full justify-center pointer-events-none top-[calc(50dvh-24px)]"
        style={{ height }}
      >
        {/* linhas */}
        <div
          className="transition-transform duration-200"
          style={{
            width: rotate === 0 ? "100%" : "100dvh",
            height: rotate === 0 ? height : "100%",
            backgroundImage: `repeating-linear-gradient(
                to bottom,
                ${color},
                ${color} 1.25px,
                transparent 1px,
                transparent ${gap}px
              )`,
            opacity,
            transform: `rotate(${rotate}deg)`,
            borderBottom: `1.5px solid ${color}`,
          }}
        />
        {/* Move */}
        <MoveLinesButton
          ref={moveLinesButtonRef}
          targetRef={containerRef}
        />
      </div>
      {/* Config */}
      <ConfigButton
        ref={configButtonRef}
        setShowLines={setShowLines}
        onToggleConfig={() => setShowConfig((v) => !v)}
        open={showConfig}
      />
      {showConfig && (
        <ConfigOptions
          ref={configOptionsRef}
          lines={lines}
          gap={gap}
          opacity={opacity}
          color={color}
          setLines={setLines}
          setGap={setGap}
          setOpacity={setOpacity}
          setColor={setColor}
          rotate={rotate}
          setRotate={setRotate}
        />
      )}
    </>
  );
}

export function UIRuler() {
  const [showLines, setShowLines] = useState(true);

  return (
    <div className="fixed bottom-0 left-0 z-9000 h-dvh w-full font-sans text-black">
      <UIRulerCore setShowLines={setShowLines} showLines={showLines} />

      <Button
        variant="ghost"
        className="absolute right-2 bottom-2 z-20 bg-white/94 backdrop-blur-sm shadow-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground border-border/50"
        style={{
          visibility: showLines ? "hidden" : "visible",
        }}
        onClick={() => setShowLines((v) => !v)}
      >
        <Icon Icon={Eye} size="sm" strokeWidth="normal" />
        Ver Linhas
        <span className="text-muted-foreground/85 text-xs normal-case font-medium">
          Ctrl + <strong>;</strong>
        </span>
        <DismountButton />
      </Button>
    </div>
  );
}
