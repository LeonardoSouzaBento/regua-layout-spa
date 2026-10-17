import { X } from "lucide-react";
import { Button, Icon } from "@/components/ui";

export function DismountButton() {
  function handleDismount(e: React.MouseEvent) {
    e.stopPropagation();
    window.dispatchEvent(new Event("ui-ruler-dismount"));
  }

  return (
    <Button
      asChild
      size="iconXs"
      variant="destructive"
      onClick={handleDismount}
      className="rounded-full ml-1 hover:bg-destructive/80!"
    >
      <div>
        <Icon
          Icon={X}
          size="sm"
          strokeWidth="thin"
          className="text-destructive-foreground!"
        />
      </div>
    </Button>
  );
}
