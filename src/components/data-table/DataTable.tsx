import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useTable } from "../../context/TableProvider";

const DataTable = () => {
  const { table, renderTableOptions } = useTable();

  if (!table) {
    return <div>Table is not loaded</div>;
  }

  return (
    <div className="w-full h-full">
      <div className="w-full flex items-center justify-between py-2">
        <div>
          <div className="flex flex-row justify-evenly items-center space-x-2">
            {renderTableOptions()}
          </div>
        </div>
      </div>

      <div className="rounded-md border border-gray-300">
        <Table>
          <TableHeader className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header as any,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={
                  rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white" // Alternate row background
                }
              >
                {row.getVisibleCells().map((cell: any) => (
                  <TableCell
                    key={cell.id}
                    className="border border-gray-300 px-4 py-2 text-center"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;