import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { CircleQuestionMark } from "lucide-react";
import { Button } from "../../ui/button";

const GridInfo = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center justify-between gap-4 tracking-wider">
    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-tight">
      {label}
    </span>
    <span className="text-xs font-bold text-primary font-mono px-1 rounded-sm">
      {value}
    </span>
  </div>
);

interface Props {
  selectedDevice: string;
  selectedAlias: string;
  configs: { label: string; value: string | number }[];
}

export const GridInfoTooltip = ({
  selectedDevice,
  selectedAlias,
  configs,
}: Props) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="iconXs"
            onClick={() => {
              console.log("click");
            }}
            className="absolute bottom-2 right-3 rounded-full text-base 
            font-medium text-primary [&_svg]:size-6"
          >
            <CircleQuestionMark strokeWidth={1.75} />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="flex flex-col gap-1.5 border bg-background/95 rounded-md z-1000
            px-2.5 pt-2 pb-3 shadow-lg min-w-max animate-in zoom-in-95 duration-200"
        >
          <p
            className="min-w-max text-muted-foreground/90 text-xs 
            font-medium pb-1.5 border-b mb-1 tracking-wide"
          >
            <span className="uppercase">{selectedDevice}</span> –{" "}
            <span className="capitalize">{selectedAlias}</span>
          </p>
          <div className="flex flex-col gap-3">
            {configs.map((config) => {
              return (
                <GridInfo
                  key={config.label}
                  label={config.label}
                  value={config.value}
                />
              );
            })}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
