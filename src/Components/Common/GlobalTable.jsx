import React from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { TableHead, TableRow, TableBody } from "../ui/table";

const GlobalTable = ({ headers, children, scrollAreaHeight }) => {
  return (
    <ScrollArea className={`${scrollAreaHeight} mt-4`}>
      <table className="min-w-full text-sm">
        <thead className="sticky top-[-1px] z-30 bg-blue-50 text-gray-800">
          <TableRow className="w-[100px] bg-blue-50 hover:bg-blue-50  text-gray-800">
            {headers?.map((header, index) => (
              <TableHead key={index} className="px-4 py-2">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </thead>
        <TableBody>{children}</TableBody>
      </table>
      <ScrollBar orientation={`horizontal`} />
    </ScrollArea>
  );
};

export default GlobalTable;
