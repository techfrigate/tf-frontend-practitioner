import React from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { cn } from "../../lib/utils";
const Container = ({ children }) => {
  return (
    <>
      <div className="rounded-md m-1 overflow-y-scroll flex justify-center items-center relative">
        <Alert
          className={cn(
            `border-slate-200 border-2 shadow-inner mt-1 min-h-[calc(100vh-85px)] md:w-[calc(100vw-260px)] w-[calc(98vw)]`
          )}
        >
          <AlertDescription className="flex flex-col mt-2">
            {children}
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
};

export default Container;
