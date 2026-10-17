import { forwardRef } from "react";
import { RotateCw } from "lucide-react";
import { Button, Icon, Separator } from "@/components/ui";
import {
  type ConfigOptionsProps,
  NUMBER_FIELDS,
  colorOptions,
} from "@/data/data";

export const ConfigOptions = forwardRef<HTMLDivElement, ConfigOptionsProps>(
  (props, ref) => {
    const fieldBindings = {
      lines: { value: props.lines, set: props.setLines },
      gap: { value: props.gap, set: props.setGap },
      opacity: { value: props.opacity, set: props.setOpacity },
    };

    return (
      <div
        ref={ref}
        className="fixed bottom-13 right-2 z-1000 pointer-events-auto bg-white/94 backdrop-blur-sm shadow-md border border-border/50 rounded-2xl p-3 w-auto flex flex-col items-end gap-1.5 min-w-50"
      >
        {NUMBER_FIELDS.map((field) => {
          const binding = fieldBindings[field.key];

          return (
            <div className="w-full flex flex-col gap-2 p-1.5" key={field.key}>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-0.5">
                  {field.label}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    className="w-16 h-8 rounded-md border border-border pl-3 text-sm text-foreground bg-background/50 focus:outline-none focus:ring-1 focus:ring-ring"
                    type="number"
                    step={field.step}
                    value={binding.value}
                    onChange={(e) => binding.set(+e.target.value)}
                  />
                  <div className="flex gap-0 overflow-x-auto scrollbar-hidden">
                    {field.quick.map((v) => {
                      return (
                        <div
                          className="size-9 shrink-0 flex items-center justify-center 
                        cursor-pointer"
                          key={v}
                          onClick={() => binding.set(v)}
                        >
                          <Button
                            selected={binding.value === v}
                            variant="ghost"
                            size="iconSm"
                            className="rounded-full text-sm"
                          >
                            {v}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <Separator className="w-full my-1" />

        <div className="w-full flex flex-col gap-2 p-1.5 pt-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pl-0.5">
            Cor
          </span>
          <div className="flex flex-wrap">
            {colorOptions.map((c) => (
              <div
                className="size-9 shrink-0 flex items-center justify-center 
                cursor-pointer"
                key={c.value}
                onClick={() => props.setColor(c.value)}
              >
                <Button
                  className="rounded-full ring-offset-2 hover:ring-2 ring-ring transition-all"
                  variant="ghost"
                  size="iconXs"
                  title={c.name}
                >
                  <span
                    className="block w-full h-full rounded-full border border-black/5"
                    style={{ backgroundColor: c.value }}
                  />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Separator className="w-full my-1" />

        <div className="w-full p-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full rounded-full text-xs font-semibold uppercase tracking-wider"
            onClick={() => props.setRotate(props.rotate === 0 ? 90 : 0)}
          >
            <Icon Icon={RotateCw} size="sm" strokeWidth="light" />
            Rotacionar
          </Button>
        </div>
      </div>
    );
  },
);

ConfigOptions.displayName = "ConfigOptions";
