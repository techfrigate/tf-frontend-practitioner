import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area"; // Assuming you have a ScrollArea component
import { Separator } from "../ui/separator";

const GlobalDialog = ({
  title,
  description,
  children,
  triggerButtonLabel,
  triggerButtonVariant,
  scrollHeight,
  contentClassName,
  buttonClassName,
  size
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={buttonClassName} variant={triggerButtonVariant} size={size}>
          {triggerButtonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {/* Scrollable Content Area */}
        <Separator />
        <ScrollArea className={`grid gap-4${scrollHeight}`}>
          {children}
          <ScrollBar orientation={`horizontal`} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalDialog;
