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
import { useData } from "../../context/DataProvider";


const DataTable = () => {
  const { loading } = useData();
  const { table, renderTableOptions } = useTable();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!table) {
    return <div>Table is not loaded</div>;
  }


  return (
    <div className="w-full h-full">
      <div className="flex  py-2">

            {renderTableOptions()}

      </div>

      <div className="rounded-md border border-gray-300">
        <Table>
          <TableHeader className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border border-gray-300 text-center truncate text-xs"
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
              className={`${
                rowIndex % 2 === 0 ? "bg-gray-150" : "bg-white"
              } `} // Add dynamic status class
            >
                {row.getVisibleCells().map((cell: any) => (
                  <TableCell
                    key={cell.id}
                    className="border border-gray-300  text-center  text-xs"
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