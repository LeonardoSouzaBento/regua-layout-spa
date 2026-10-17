import { forwardRef } from "react";
import type { StateSetter } from "@/types";
import { Button, Icon, Separator } from "@/components/ui";
import { ChevronDown, ChevronUp, EyeOff } from "lucide-react";
import { DismountButton } from "./dismount-button";

interface Props {
  open: boolean;
  onToggleConfig: () => void;
  setShowLines: StateSetter<boolean>;
}

export const ConfigButton = forwardRef<HTMLDivElement, Props>(
  ({ onToggleConfig, open, setShowLines }, ref) => {
    const handleClick = (
      e: React.MouseEvent<HTMLButtonElement>,
      item: number,
    ) => {
      if (item === 1) {
        onToggleConfig();
      } else {
        e.stopPropagation();
        setShowLines((v) => !v);
      }
    };

    return (
      <div
        ref={ref}
        className="fixed bottom-2 right-2 z-9999 pointer-events-auto h-10 border border-border/50 bg-white/94 backdrop-blur-sm text-foreground shadow-sm flex items-center pl-4 pr-1.5 rounded-full"
      >
        <span
          className="font-semibold tracking-wide pr-2 text-sm uppercase select-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onToggleConfig();
          }}
        >
          Configurar
        </span>

        <div className="h-full flex items-center gap-1 text-[16px]">
          {[1, 2, 3].map((item) =>
            item !== 2 ? (
              <Button
                variant="ghost"
                size="iconSm"
                className="rounded-full"
                key={item}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(e, item);
                }}
              >
                {item === 1 ? (
                  <Icon
                    Icon={open ? ChevronDown : ChevronUp}
                    size="3xl"
                    strokeWidth="light"
                  />
                ) : (
                  <Icon Icon={EyeOff} size="lg" strokeWidth="light" />
                )}
              </Button>
            ) : (
              <Separator orientation="vertical" className="h-4" key={item} />
            ),
          )}
          <DismountButton />
        </div>
      </div>
    );
  },
);

ConfigButton.displayName = "ConfigButton";
