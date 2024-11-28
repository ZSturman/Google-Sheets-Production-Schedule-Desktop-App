import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Table as ReactTable } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { Input } from "../components/ui/input";
import { useData } from "./DataProvider";
import { defaultNewProductsTableRow } from "../data/defaults";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

type TableContextType = {
  table: ReactTable<DataRowT> | null;
  renderTableOptions: () => ReactNode;
  loading: LoadingState;
};

const defaultTableContext: TableContextType = {
  table: null,
  renderTableOptions: () => null,
  loading: "loading",
};

const TableContext = createContext<TableContextType>(defaultTableContext);

type TableProviderProps = {
  children: ReactNode;
  selectedTab: TabOption;
  productsData: ProductData[]
  workCenterScheduleData: WorkCenterScheduleData[]
};

export const TableProvider = ({
  children,
  selectedTab,
  productsData,
  workCenterScheduleData
}: TableProviderProps) => {
  const {
    
    addLocalSheetUpdate,
    addMessage,
  } = useData();

  const [localProductsData, setLocalProductsData] = useState<
    ProductData[]
  >(productsData);
  const [localWorkCenterScheduleData, setLocalWorkCenterScheduleData] =
    useState<WorkCenterScheduleData[] >(workCenterScheduleData);
  const [localProductionScheduleData, setLocalProductionScheduleData] =
    useState<ProductionScheduleData[] | LoadingState>("loading");
  const [localLedgerData, setLocalLedgerData] = useState<
    LedgerData[] | LoadingState
  >("loading");
  const [localWorkCenterData, setLocalWorkCenterData] = useState<
    WorkCenterData[] | LoadingState
  >("loading");

  const [loading, setLoading] = useState<LoadingState>("loading");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [editingCell, setEditingCellInternal] = useState<EditingCell | null>(
    null
  );

  useEffect(() => {
    if (selectedTab.id === "work_center_schedules") {
      if (checkForLoadingOrErrorOrZeroLength(productsData)) return;
      setLocalWorkCenterScheduleData(workCenterScheduleData);
    }

    if (selectedTab.id === "products") {
      if (checkForLoadingOrErrorOrZeroLength(productsData)) return;
      setLocalProductsData(productsData);
    }

    if (selectedTab.isWorkCenter) {
      if (checkForLoadingOrErrorOrZeroLength(productsData)) return;
      const derivedWorkCenterData = getWorkCenterData()
    }
  }, [selectedTab, workCenterScheduleData, productsData]);

  const getWorkCenterData = (): WorkCenterData[] => {
    console.log("Get work center data");
    return productsData as WorkCenterData[]
  }

  const checkForLoadingOrErrorOrZeroLength = (
    tableData: DataTableT | LoadingState
  ) => {
    if (tableData === "loading" || tableData === "error") {
      addMessage({
        type: "error",
        message: "Error loading data",
        timestamp: new Date(),
      });
      return true;
    }

    if (tableData.length === 0) {
      addMessage({
        type: "info",
        message: "No data found",
        timestamp: new Date(),
      });
      return true;
    }

    return false;
  };

  useEffect(() => {
    setSorting([]);
    setColumnFilters([]);
    setColumnVisibility({});
    setRowSelection({});
  }, [selectedTab]);

  const cancelEditing = () => {
    setEditingCell(null);
  };

  const setEditingCell = (newCell: EditingCell | null) => {
    if (editingCell) {
      // Check if the new cell is different from the currently editing cell
      if (
        !newCell ||
        newCell.row.id !== editingCell.row.id ||
        newCell.columnId !== editingCell.columnId
      ) {
        // Save the changes to the current editing cell
        const updatedData = localProductsData.map((row) => {
          if (row === editingCell.row.original) {
            return {
              ...row,
              [editingCell.columnId]: editingCell.newValue,
            };
          }
          return row;
        }) 

        setLocalProductsData(updatedData);

        // Save the changes to the database
        handleUpdateRecord(editingCell.row.original.Id, {
          [editingCell.columnId]: editingCell.newValue,
        });

        // Log the previous value and cell
        console.log("Previous editing cell value saved:", {
          columnId: editingCell.columnId,
          initialValue: editingCell.initialValue,
          newValue: editingCell.newValue,
          row: editingCell.row,
        });
      }
    }

    // Set the new cell as the editing cell
    if (newCell) {
      console.log("New editing cell set:", {
        columnId: newCell.columnId,
        initialValue: newCell.initialValue,
        newValue: newCell.newValue,
        row: newCell.row,
      });
    }

    setEditingCellInternal(newCell);
  };
  const handleUpdateRecord = async (
    id: string,
    updatedRecord: Record<string, any>
  ) => {
    // Optimistically update local data
    const updatedData = localProductsData.map((row) => {
      if (row.Id === id) {
        return {
          ...row,
          ...updatedRecord,
        };
      }
      return row;
    }) 

    const updatedRow = updatedData.find((row) => row.Id === id);
    if (!updatedRow) {
      console.error("Updated record not found.");
      return;
    }

    // Push changes to the backend and Google Sheets
    addLocalSheetUpdate(selectedTab, "update", updatedRow as DataRowT);

    addMessage({
      type: "success",
      message: "Record updated successfully",
      timestamp: new Date(),
    });
  };

  useEffect(() => {}, [editingCell?.newValue]);

  const handleAddNewRow = () => {
    console.log("Add new row", defaultNewProductsTableRow);
  };

  const addRowButton = () => {
    return <Button onClick={handleAddNewRow}>Add Row</Button>;
  };

  const handleDeleteRows = () => {
    console.log("Delete selected rows");
  };

  const deleteRowsButton = () => {
    return <Button onClick={handleDeleteRows}>Delete Rows</Button>;
  };

  const handleExportData = () => {
    console.log("Export data");
  };

  const exportDataButton = () => {
    return <Button onClick={handleExportData}>Export Data</Button>;
  };

  const generateColumnDefs = (): ColumnDef<DataRowT>[] => {
    if (!selectedTab.columnDict) {
      addMessage({
        type: "error",
        message: "No column dictionary found for the selected tab",
        timestamp: new Date(),
      });
      return [];
    }

    return Object.values(selectedTab.columnDict).map(
      ({ googleSheetHeader, sqlTableHeader, columnDef }) => {
        const { headerFunction, id, cellInfo, enableHiding, enableSorting } =
          columnDef;

        const dataColumn: ColumnDef<DataRowT> = {
          accessorKey: sqlTableHeader,
          id,
          header: (context) => {
            // Lazy initialization of table-based headers
            const { table, column } = context;
            switch (headerFunction) {
              case "checkbox":
                return headerAsCheckbox({ table });
              case "sort":
                return sortColumns({ column });
              default:
                return <span>{googleSheetHeader}</span>;
            }
          },
          cell: ({ row, column }) => {
            let value = row.original[sqlTableHeader];

            // Check if the current cell is being edited
            const isEditing =
              editingCell &&
              editingCell.row === row &&
              editingCell.columnId === column.id;

            const handleValueChange = (newValue: any) => {
              if (!editingCell) {
                console.error("No editing cell set.");
                return;
              }



              // Update the current editing cell's newValue
              setEditingCell({ ...editingCell, newValue });
            };

            const handleSetCellToEditing = () => {
              console.log("Set cell to editing");
              setEditingCell({
                row,
                columnId: column.id,
                initialValue: row.original[column.id],
                newValue: row.original[column.id],
              });
            };

            if (!cellInfo) {
              return (
                <span className="text-gray-500">
                  {value === null ? "N/A" : value}
                </span>
              );
            }

            if (value === null && cellInfo.nullValue) {
              value = cellInfo.nullValue;
            } else if (cellInfo.defaultView === "number") {
              value = Number(value).toLocaleString();
            } else if (cellInfo.defaultView === "boolean") {
              if (cellInfo.viewOptions?.booleanOptions) {
                value = value
                  ? cellInfo.viewOptions.booleanOptions.true
                  : cellInfo.viewOptions.booleanOptions.false;
              } else {
                value = value ? "True" : "False";
              }
            } else if (cellInfo.defaultView === "date") {
              value = new Date(value).toLocaleDateString();
            } else if (cellInfo.defaultView === "time") {
              value = new Date(value).toLocaleTimeString();
            }

            if (cellInfo.defaultView === "checkbox") {
              return renderCellAsCheckbox({ row });
            }

            const renderWithAppearance = (value: string) => {
              if (!cellInfo.appearance) {
                return <span>{value}</span>;
              }

              const {
                justify = "justify-center",
                items = "items-center",
                truncate = "",
                wrap = "",
                bold = "",
                italic = "",
                underline = "",
                color = "text-black",
                backgroundColor = "bg-red-600",
                border = "",
                fontSize = "",
              } = cellInfo.appearance;

              return (
                <Button
                  className={`flex flex-row w-full h-full ${justify} ${items} ${backgroundColor} ${fontSize} ${color} ${
                    bold ? "font-bold" : ""
                  } ${italic ? "italic" : ""} ${underline ? "underline" : ""}`}
                  onClick={handleSetCellToEditing}
                >
                  {value}
                </Button>
              );
            };

            const renderDefaultView = (value: string) => {
              if (cellInfo.viewOptions?.chevronOptions) {
                const { step } = cellInfo.viewOptions.chevronOptions;

                return renderCellChevrons(
                  value,
                  handleValueChange,
                  renderWithAppearance,
                  cellInfo.validations,
                  step
                );
              }

              return renderWithAppearance(value);
            };

            if (isEditing) {
              if (cellInfo.onClickView) {
                if (cellInfo.onClickView.datePickerField) {
                  return renderDatePickerField(
                    handleValueChange,
                    renderWithAppearance,
                    cellInfo.validations
                  );
                } else if (cellInfo.onClickView.inputField) {
                  return renderInputField(
                    handleValueChange,
                    cellInfo.onClickView.inputField.placeholder,
                    cellInfo.onClickView.inputField.type
                  );
                } else if (cellInfo.onClickView.dropdownField) {
                  return renderDropDownField(
                    cellInfo.onClickView.dropdownField.options,
                    handleValueChange,
                    cellInfo.onClickView.dropdownField.placeholder,
                    cellInfo.onClickView.dropdownField.label
                  );
                } else if (cellInfo.onClickView.timePickerField) {
                  return renderTimePickerField();
                } else {
                  return renderDefaultView(value);
                }
              } else {
                return renderDefaultView(value);
              }
            } else {
              return renderDefaultView(value);
            }
          },
          enableHiding: enableHiding ?? true,
          enableSorting: enableSorting ?? true,
        };

        return dataColumn;
      }
    );
  };

  const headerAsCheckbox = ({ table }: { table: ReactTable<DataRowT> }) => (
    <input
      type="checkbox"
      className="bg-transparent size-8 checked:bg-black checked:text-white"
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() ? true : false)
      }
      onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
      aria-label="SelectAll"
    />
  );

  const sortColumns = ({ column }: { column: Column<DataRowT, unknown> }) => (
    <Button
      className="bg-transparent text-zinc-700 shadow-none"
      variant="secondary"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {column.id} {/* You can replace this with a custom label */}
    </Button>
  );

  const renderCellAsCheckbox = ({ row }: { row: Row<DataRowT> }) => (
    <input
      type="checkbox"
      className="bg-transparent size-8 checked:bg-black checked:text-white peer"
      checked={row.getIsSelected()}
      onChange={(e) => row.toggleSelected(e.target.checked)}
      aria-label="Select row"
    />
  );

  const renderCellChevrons = (
    value: string,
    handleValueChange: (value: number) => void,
    renderWithAppearance: (value: string) => ReactNode,
    validations: Validations,
    step: number
  ) => {
    const [localValue, setLocalValue] = useState<number>(parseInt(value));

    const min = validations.min ? validations.min : Number.MIN_SAFE_INTEGER;
    const max = validations.max ? validations.max : Number.MAX_SAFE_INTEGER;

    const increment = () => {
      const newValue = Math.min(localValue + step, max);
      setLocalValue(newValue);
      handleValueChange(newValue);
    };

    const decrement = () => {
      const newValue = Math.max(localValue - step, min);
      setLocalValue(newValue);
      handleValueChange(newValue);
    };

    return (
      <div className="flex flex-col items-center justify-center">
        {/* Chevron up */}
        <Button
          onClick={increment}
          variant="ghost"
          size="sm"
          className="shadow-none bg-transparent text-black flex items-end justify-center p-0 px-1"
        >
          <BsChevronCompactUp />
        </Button>

        {renderWithAppearance(localValue.toString())}
        {/* Chevron down */}
        <Button
          onClick={decrement}
          variant="ghost"
          size="sm"
          className="shadow-none bg-transparent text-black flex items-start justify-center p-0 px-1"
        >
          <BsChevronCompactDown />
        </Button>
      </div>
    );
  };

  const renderDatePickerField = (
    handleValueChange: (value: Date) => void,
    renderWithAppearance: (value: string) => ReactNode,
    validations: Validations
  ) => {
    if (!editingCell) return;
    const [localValue, setLocalValue] = useState<Date | undefined>(
      editingCell.initialValue ? new Date(editingCell.initialValue) : undefined
    );

    const minDate = validations.minDate || new Date(); // Default to today
    const maxDate = validations.maxDate || new Date(9999, 11, 31); // Default far future

    const handleChangeData = (date: Date) => {
      if (date < minDate || date > maxDate) return; // Ignore invalid dates
      setLocalValue(date);
      handleValueChange(date);
    };
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="text-black">
            {renderWithAppearance(
              localValue ? localValue.toLocaleDateString() : "Select Date"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex flex-col space-y-2">
            <Calendar
              mode="single"
              selected={localValue}
              onSelect={(date) => date && handleChangeData(date)}
              fromDate={minDate} // Minimum date
              toDate={maxDate} // Maximum date
              className="rounded-md border shadow"
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const renderInputField = (
    handleValueChange: (value: string) => void,
    placeholder: string | number,
    type: "text" | "number"
  ) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [inputWidth, setInputWidth] = useState("auto");

    if (!editingCell) return null;

    useEffect(() => {
      if (spanRef.current) {
        // Measure the content width dynamically
        setInputWidth(`${spanRef.current.scrollWidth}px`);
      }
    }, [editingCell.initialValue, placeholder]);

    const handleSetLocalValue = (value: string) => {
      handleValueChange(value);
    };

    return (
      <div className="relative w-full">
        {/* Hidden span for measuring width */}
        <span
          ref={spanRef}
          className="absolute invisible whitespace-pre px-2"
          style={{ font: "inherit", visibility: "hidden" }}
        >
          {editingCell.initialValue || placeholder}
        </span>

        <Input
          type={type}
          value={editingCell.newValue}
          placeholder={placeholder.toString()}
          onChange={(e) => handleSetLocalValue(e.target.value)}
          onBlur={() => setEditingCell(null)}
          autoFocus
          className="text-center bg-background tabular-nums focus:outline-none text-black text-wrap px-0 py-2 "
          style={{
            width: inputWidth, // Set width dynamically
            minWidth: "4ch", // Ensure a reasonable minimum width
            maxWidth: "100%", // Prevent overflow in table cell
          }}
        />
      </div>
    );
  };

  const renderDropDownField = (
    items: string[],
    handleValueChange: (value: string) => void,
    placeholder: string,
    label: string
  ) => {
    const handleSetEditingToNull = () => {
      setEditingCell(null);
    };
    return (
      <div>
        <Select
          onValueChange={handleValueChange}
          defaultOpen
          onOpenChange={handleSetEditingToNull}
        >
          <SelectTrigger className=" text-black">
            <SelectValue className="text-black" placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="text-black">{label}</SelectLabel>
              {items.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  };

  const renderTimePickerField = () => {
    return (
      <div>
        <Input type="time" />
      </div>
    );
  };

  const renderTableOptions = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto text-black">
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value: boolean) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const columnDefs = generateColumnDefs();

  const table = useReactTable({
    data: localProductsData,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <TableContext.Provider
      value={{
        table,
        renderTableOptions,
        loading,
      
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const usetable = () => useContext(TableContext);
