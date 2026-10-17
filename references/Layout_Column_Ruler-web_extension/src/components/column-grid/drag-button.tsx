import { Hand, HandGrab } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export const DragButton = ({
  containerRef,
  positionRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  positionRef: React.MutableRefObject<{ bottom: number; right: number }>;
}) => {
  const [grab, setGrab] = useState<boolean>(false);
  const Icon = grab ? HandGrab : Hand;

  function handleMoveContainer(e: React.PointerEvent<HTMLButtonElement>) {
    if (!grab || !containerRef.current) return;

    const { movementX, movementY } = e;

    // Update ref values
    positionRef.current.bottom -= movementY;
    positionRef.current.right -= movementX;

    // Update DOM directly for high performance
    containerRef.current.style.bottom = `${positionRef.current.bottom}px`;
    containerRef.current.style.right = `${positionRef.current.right}px`;
  }

  return (
    <Button
      variant="ghost"
      size="iconMd"
      className="text-muted-foreground rounded-full"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setGrab(true);
        e.stopPropagation();
      }}
      onPointerMove={handleMoveContainer}
      onPointerUp={(e) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        setGrab(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Icon size={24} strokeWidth={1.75} />
    </Button>
  );
};
