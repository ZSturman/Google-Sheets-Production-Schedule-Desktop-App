// TableProvider.tsx
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";
import { Table as ReactTable } from "@tanstack/react-table";
import { Button } from "../components/ui/button";
import { useData } from "./DataProvider";
import HeaderAsCheckbox from "../components/data-table/HeaderAsCheckbox";
import ReadOnlyComponents from "../components/data-table/ReadOnlyComponents";
import { useTab } from "./TabProvider";
import CellAsCheckbox from "../components/data-table/CellAsCheckbox";
import CellAsChevronAndNumberInput from "../components/data-table/CellAsChevronAndNumberInput";
import CellAsNumberInput from "../components/data-table/CellAsNumberInput";
import CellAsDropdown from "../components/data-table/CellAsDropdown";
import CellAsTextInput from "../components/data-table/CellAsTextInput";
import CellAsPopupDateTimePicker from "../components/data-table/CellAsPopupDateTimePicker";
import {
  AddOption,
  DeleteOption,
  FilterInput,
  ViewOptions,
} from "../components/data-table/TableOptions";
import { v4 as uuidv4 } from "uuid";
import CellAsPopupTwoTimePickers from "../components/data-table/CellAsPopupTwoTimePickers";

type TableContextType = {
  table: ReactTable<DataRowT> | null;
  renderTableOptions: () => ReactNode;
  selectedData: DataRowT[];
  deleteFromLocalData: (deletedRows: DataRowT[]) => void;
  jobNumberQuery: string;
  workCenterQuery: string;
};

const TableContext = createContext<TableContextType | undefined>(undefined);

type TableProviderProps = {
  children: ReactNode;
};

export const TableProvider = ({ children }: TableProviderProps) => {
  const {
    state,
    updatedAt,
    loading,
    handleDataChange,
    handleDeleteRows,
    processAllWorkCenters,
    refreshData,
    dataChanged,
  } = useData();

  const { selectedTab } = useTab();

  const [selectedData, setSelectedData] = useState<DataRowT[]>([]);
  const [newRowAdded, setNewRowAdded] = useState<boolean>(false);

  const [jobNumberQuery, setJobNumberQueryQuery] = useState<string>("");
  const [workCenterQuery, setWorkCenterQuery] = useState<string>("");

  useEffect(() => {
    if (newRowAdded) {
      refreshData();
      setNewRowAdded(false);
    }
  }, [newRowAdded, refreshData]);

  useEffect(() => {
    if (!loading) {
      if (selectedTab) {
        let data: DataRowT[] = [];
        if (selectedTab.id === "work_center_schedules") {
          data = state.workCenterSchedules;
        } else if (selectedTab.id === "ledger") {
          data = state.ledger;
        } else {
          if (selectedTab.isWorkCenter) {
            data = state.products
              .filter((row) => row["work_center"] === selectedTab.name)
              .sort((a, b) => {
                const aaPriority = parseInt(a["priority"]);
                const bbPriority = parseInt(b["priority"]);
                if (aaPriority < bbPriority) {
                  return -1;
                }
                if (aaPriority > bbPriority) {
                  return 1;
                }
                return 0;
              });
          } else {
            data = state.products;
          }
        }
        data = data.filter(
          (row) =>
            row["work_center"] !== "Archived" ||
            selectedTab.id === "wc_archived"
        );

        setSelectedData(data);
      }
    }
  }, [state, selectedTab, updatedAt, loading]);

  const updateLocalData = useCallback(
    (updatedRow: DataRowT) => {
      console.log("Updating local data with: ", updatedRow);
      setSelectedData((prevData) =>
        prevData.map((row) =>
          row.id === updatedRow.id ? { ...row, ...updatedRow } : row
        )
      );
      handleDataChange(selectedTab, "update", updatedRow);
    },
    [handleDataChange, selectedTab]
  );

  const addToLocalData = useCallback(
    async (newRow: DataRowT) => {
      // Add a temporary ID if one doesn't exist
      if (!newRow.id) {
        newRow.id = uuidv4();
      }

      // Add the new row optimistically
      setSelectedData((prevData) => [...prevData, newRow]);

      try {
        // Simulate an async operation (e.g., API call)
        await handleDataChange(selectedTab, "add", newRow);
      } catch (error) {
        console.error("Failed to add new row:", error);

        // Rollback: Remove the optimistically added row
        setSelectedData((prevData) =>
          prevData.filter((row) => row.id !== newRow.id)
        );
      } finally {
        setNewRowAdded(true);
      }
    },
    [handleDataChange, selectedTab, refreshData]
  );

  const deleteFromLocalData = useCallback(
    (deletedRows: DataRowT[]) => {
      const deletedIds = new Set(deletedRows.map((row) => row.id));
      setSelectedData((prevData) =>
        prevData.filter((row) => !deletedIds.has(row.id))
      );
      handleDeleteRows(selectedTab, deletedRows);
    },
    [handleDeleteRows, selectedTab]
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    setSorting([]);
    setColumnFilters([]);
    setColumnVisibility({});
    setRowSelection({});
  }, [selectedTab]);

  // Memoize column definitions
  const generateColumnDefs = useCallback((): ColumnDef<DataRowT>[] => {
    if (!selectedTab.columnDict) {
      console.error("No column dictionary found for the selected tab");
      return [];
    }
    return Object.values(selectedTab.columnDict).map(
      ({ googleSheetHeader, shortHeader, id, columnDef }) => {
        const { headerFunction, cell, enableHiding, enableSorting } =
          columnDef || {};

        const columnId = id || "unknown_column";

        const updateCellValue = (row: any, column: any, newValue: string) => {
          const updatedRow = { ...row.original, [column.id]: newValue };
          updateLocalData(updatedRow);
        };

        return {
          accessorKey: id,
          id: columnId,
          header: (context) => {
            switch (headerFunction) {
              case "checkbox":
                return HeaderAsCheckbox({ table: context.table });
              case "sort":
                const handleSortClick = () => {
                  const currentSort = context.column.getIsSorted(); // Get current sort state
                  let desc;

                  if (!currentSort) {
                    desc = false;
                  } else if (currentSort === "asc") {
                    desc = true;
                  } else if (currentSort === "desc") {
                    desc = false;
                  }
                  context.column.toggleSorting(desc);
                };

                return (
                  <button
                    className="bg-transparent text-zinc-700 shadow-none p-1"
                    onClick={handleSortClick}
                  >
                    {shortHeader ? shortHeader : googleSheetHeader}
                    {context.column.getIsSorted() === "asc" && <span> ▲</span>}
                    {context.column.getIsSorted() === "desc" && <span> ▼</span>}
                  </button>
                );
              default:
                return (
                  <span>{shortHeader ? shortHeader : googleSheetHeader}</span>
                );
            }
          },
          cell: ({ row, column }) => {
            if (!cell || !cell.view) return null;

            if (headerFunction === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={row.getIsSelected()}
                  onChange={() => row.toggleSelected()}
                />
              );
            }

            if (selectedTab.id === "wc_archived") {
              const viewProps: ReadOnlyViewProps = cell.view.readOnly
                ? cell.view.readOnly
                : {
                    text: {},
                  };

              return (
                <ReadOnlyComponents
                  readOnlyProps={viewProps}
                  value={row.original[column.id]}
                />
              );
            }

            if (cell.view.editable) {
              const handleCellUpdate = (newValue: string) => {
                if (newValue !== row.original[column.id]) {
                  updateCellValue(row, column, newValue);
                }
              };

              if (
                "checkbox" in cell.view.editable.default ||
                "checkbox" in cell.view.editable.editing
              ) {
                return (
                  <CellAsCheckbox
                    value={row.original[column.id]}
                    onSave={handleCellUpdate}
                  />
                );
              }

              if ("numberInput" in cell.view.editable.editing) {
                if ("chevron" in cell.view.editable.default) {
                  return (
                    <CellAsChevronAndNumberInput
                      value={row.original[column.id]}
                      onSave={(newValue) => {
                        updateCellValue(row, column, newValue);
                      }}
                      chevronProps={cell.view.editable.default.chevron}
                      numberInputProps={cell.view.editable.editing.numberInput}
                    />
                  );
                } else {
                  return (
                    <CellAsNumberInput
                      value={row.original[column.id]}
                      onSave={(newValue) => {
                        updateCellValue(row, column, newValue);
                      }}
                    />
                  );
                }
              }

              if ("dropdown" in cell.view.editable.editing) {
                let buttonProps: ButtonViewProps;
                if ("button" in cell.view.editable.default) {
                  buttonProps = cell.view.editable.default.button;
                } else {
                  buttonProps = {
                    labelIsValue: true,
                    label: "Select",
                  };
                }

                return (
                  <CellAsDropdown
                    value={row.original[column.id]}
                    onSave={(newValue) => {
                      updateCellValue(row, column, newValue);
                    }}
                    triggerProps={buttonProps}
                    dropdownProps={cell.view.editable.editing.dropdown}
                  />
                );
              }

              if ("popup" in cell.view.editable.editing) {
                if ("calendar" in cell.view.editable.editing.popup.content) {
                  return (
                    <CellAsPopupDateTimePicker
                      value={row.original[column.id]}
                      onSave={(newValue) => {
                        updateCellValue(row, column, newValue);
                      }}
                    />
                  );
                }
              }

              if ("timeFromAndTo" in cell.view.editable.editing) {
                return (
                  <CellAsPopupTwoTimePickers
                    value={row.original[column.id]}
                    onSave={(newValue) => {
                      updateCellValue(row, column, newValue);
                    }}
                  />
                );
              }

              return (
                <CellAsTextInput
                  value={row.original[column.id]}
                  onSave={(newValue) => {
                    updateCellValue(row, column, newValue);
                  }}
                />
              );
            }
            if (cell.view.readOnly) {
              return (
                <ReadOnlyComponents
                  readOnlyProps={cell.view.readOnly}
                  value={row.original[column.id]}
                />
              );
            }
            return <div>No view configuration found for this cell.</div>;
          },
          enableHiding: enableHiding ?? true,
          enableSorting: enableSorting ?? true,
        };
      }
    );
  }, [selectedTab.columnDict, handleDataChange, updateLocalData]);

  const memoizedData = useMemo(() => selectedData, [selectedData]);
  const memoizedColumnDefs = useMemo(
    () => generateColumnDefs(),
    [generateColumnDefs]
  );

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumnDefs,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: (newSorting) => {
      console.log("onSortingChange: ", newSorting);
      setSorting(newSorting);
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  const renderLedgerTableOptions = () => {
    if (!table) return null;

    // Get selected rows
    const selectedRows = table.getSelectedRowModel().rows;

    const handleConfirmDelete = (confirmed: boolean) => {
      if (confirmed) {
        deleteFromLocalData(selectedRows.map((row) => row.original));
        table.setRowSelection({});
      } else {
        console.log("Delete operation cancelled.");
      }
    };

    return (
      <div className="flex flex-col px-2">
        <div className="text-sm text-muted-foreground lg:col-span-2">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex flex-row gap-3">
          <AddOption
            tabName={selectedTab.name}
            onSubmit={(newRow) => addToLocalData(newRow)}
          />

          <DeleteOption
            onConfirm={handleConfirmDelete}
            disabled={selectedRows.length === 0}
            numberOfRows={selectedRows.length}
          />

          <ViewOptions columns={table.getAllColumns()} />
        </div>
      </div>
    );
  };

  useEffect(() => {
    setJobNumberQueryQuery("");
    setWorkCenterQuery("");
  }, [selectedTab]);

  // TableProvider.tsx

  const renderProductionScheduleTableOptions = () => {
    if (!table) return null;

    const jobNumberFilterValue = table
      .getColumn("job_number")
      ?.getFilterValue() as string;

    const workCenterFilterValue = table
      .getColumn("work_center")
      ?.getFilterValue() as string;

    const handleChange = (value: string, col: "job_number" | "work_center") => {
      table.getColumn(col)?.setFilterValue(value);
      if (col === "job_number") {
        setJobNumberQueryQuery(value);
      }
      if (col === "work_center") {
        setWorkCenterQuery(value);
      }
    };

    return (
      <div className="flex flex-row gap-2 items-start justify-start w-full">
        <ViewOptions columns={table.getAllColumns()} />

        <FilterInput
          placeholder="Filter Job Number..."
          value={jobNumberFilterValue ?? ""}
          onChange={(value) => handleChange(value, "job_number")}
        />

        <FilterInput
          placeholder="Filter Work Center..."
          value={workCenterFilterValue ?? ""}
          onChange={(value) => handleChange(value, "work_center")}
        />

        <Button
          onClick={processAllWorkCenters}
          className={`${
            !dataChanged
              ? "bg-transparent border-2 border-zinc-400 text-zinc-500 hover:bg-zinc-300 hover:text-black"
              : " bg-black text-white"
          }  w-full`}
        >
          Process All Work Centers
        </Button>
      </div>
    );
  };

  const renderProductsTableOptions = () => {
    if (!table) return null;

    // Get selected rows
    const selectedRows = table.getSelectedRowModel().rows;

    const jobNumberFilterValue = table
      .getColumn("job_number")
      ?.getFilterValue() as string;

    const workCenterFilterValue = table
      .getColumn("work_center")
      ?.getFilterValue() as string;

      const handleChange = (value: string, col: "job_number" | "work_center") => {
        table.getColumn(col)?.setFilterValue(value);
        if (col === "job_number") {
          setJobNumberQueryQuery(value);
        }
        if (col === "work_center") {
          setWorkCenterQuery(value);
        }
      };

    const handleConfirmDelete = (confirmed: boolean) => {
      if (confirmed) {
        deleteFromLocalData(selectedRows.map((row) => row.original));
        table.setRowSelection({});
      }
    };

    return (
      <div className="flex flex-col px-2">
        <div className="text-sm text-muted-foreground lg:col-span-2">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex flex-row gap-3">
          <AddOption
            tabName={selectedTab.id}
            onSubmit={(newRow) => addToLocalData(newRow)}
          />

          <DeleteOption
            onConfirm={handleConfirmDelete}
            disabled={selectedRows.length === 0}
            numberOfRows={selectedRows.length}
          />

          <FilterInput
            placeholder="Filter Job Number..."
            value={jobNumberFilterValue ?? ""}
            onChange={(value) => handleChange(value, "job_number")}
          />

          <FilterInput
            placeholder="Filter Work Center..."
            value={workCenterFilterValue ?? ""}
            onChange={(value) => handleChange(value, "work_center")}
          />

          <ViewOptions columns={table.getAllColumns()} />
          <Button
            onClick={processAllWorkCenters}
            className={`${
              !dataChanged
                ? "bg-transparent border-2 border-zinc-400 text-zinc-500 hover:bg-zinc-300 hover:text-black"
                : " bg-black text-white"
            }  w-full`}
          >
            Process All Work Centers
          </Button>
        </div>
        <div>
          Note: When adding a new product, there may be a delay before the data
          is populated correctly.
          <br />
          If this happens, please press the 'Refresh' button to get the updated
          data from Google Sheets.
        </div>
      </div>
    );
  };

  const renderTableOptions = () => {
    switch (selectedTab.id) {
      case "ledger":
        return renderLedgerTableOptions();
      case "products":
        return renderProductsTableOptions();
      case "production_schedule":
        return renderProductionScheduleTableOptions();

      default:
        return null;
    }
  };

  return (
    <TableContext.Provider
      value={{ table, renderTableOptions, selectedData, jobNumberQuery, workCenterQuery, deleteFromLocalData }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
};
