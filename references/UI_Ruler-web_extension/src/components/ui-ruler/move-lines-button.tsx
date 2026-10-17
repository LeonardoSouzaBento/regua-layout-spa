import { Move } from "lucide-react";
import {
  useRef,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
  forwardRef,
} from "react";
import { Button, Icon } from "@/components/ui";

export const MoveLinesButton = forwardRef<
  HTMLDivElement,
  { targetRef: RefObject<HTMLDivElement | null> }
>(({ targetRef }, ref) => {
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  function onMouseDown(e: ReactMouseEvent<HTMLButtonElement>) {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  function onMove(e: MouseEvent) {
    if (!dragging.current || !targetRef.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    const el = targetRef.current;

    el.style.left = `${el.offsetLeft + dx}px`;
    el.style.top = `${el.offsetTop + dy}px`;

    last.current = { x: e.clientX, y: e.clientY };
  }

  function onUp() {
    dragging.current = false;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
  }

  return (
    <div
      ref={ref}
      className="w-full h-full absolute left-0 top-0 flex items-center justify-center pointer-events-auto"
    >
      <Button
        size="iconMd"
        variant="ghost"
        onMouseDown={onMouseDown}
        className="bg-white/75 backdrop-blur-[2px] rounded-full text-muted-foreground hover:text-foreground transition-colors shadow-sm border-border/50"
      >
        <Icon Icon={Move} size="lg" strokeWidth="normal" />
      </Button>
    </div>
  );
});

MoveLinesButton.displayName = "MoveLinesButton";
