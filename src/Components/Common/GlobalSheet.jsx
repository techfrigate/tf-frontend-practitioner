import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button } from "../ui/button";

const GlobalSheet = ({
  isDialogOpen,
  setIsDialogOpen,
  label,
  triggerText,
  triggerVariant,
  children,
  buttonClassName
}) => {
  return (
    <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <SheetTrigger asChild>
        <Button className={buttonClassName} variant={triggerVariant} onClick={() => setIsDialogOpen(true)}>
          {triggerText}
        </Button>
      </SheetTrigger>
      <SheetContent className="p-4">
        <SheetHeader>
          <SheetTitle>{label}</SheetTitle>
        </SheetHeader>

        <div className="mt-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default GlobalSheet;
