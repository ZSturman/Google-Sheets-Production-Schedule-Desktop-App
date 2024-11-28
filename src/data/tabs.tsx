import { timeRangeToString, toTimeRange } from "../utils/time";
import { generateColumnDict } from "../utils/generators";
import { cutOptions, endsOptions, extrusionOptions, workCentersList, drawingOption, groundOptions } from "./lists";
import { removeAllWhiteSpace } from "../utils/regexFuncs";

const renderBaseProductColumnDict = (
  tab: "products" | "production_schedule"
) => {
  const isProductsTab = tab === "products";
  const isProductionScheduleTab = tab === "production_schedule";

  const editableTextBoxAppearance = {
    backgroundColor: "bg-blue-200",
  };
  const editableNumberBoxAppearance = {
    backgroundColor: "bg-green-200",
  };

  const editableDateFieldAppearance = {
    backgroundColor: "bg-yellow-200",
  };
  const ediatbleTimeFieldAppearance = {
    backgroundColor: "bg-pink-200",
  };

  const chevronOptionAppearance = {
    backgroundColor: "bg-zinc-200",
  };

  const dropdownOptionAppearance = {
    backgroundColor: "bg-blue-200",
  };

  const readOnlyTextBoxAppearance = {
    backgroundColor: "bg-orange-200",
  };
  const readOnlyNumberBoxAppearance = {
    backgroundColor: "bg-grpurpleay-200",
  };

  const readOnlyDateFieldAppearance = {
    backgroundColor: "bg-red-200",
  };
  const readOnlyTimeFieldAppearance = {
    backgroundColor: "bg-purple-200",
  };

  const editableOnClickTextBox = (
    fieldLabel: string,
    placeholder: string | number
  ) => {
    const isNumber = typeof placeholder === "number";
    return {
      onClickView: {
        inputField: {
          label: fieldLabel,
          placeholder: placeholder,
          type: isNumber ? ("number" as const) : ("text" as const),
        },
      },
    };
  };

  const editableOnClickDropdownView = (
    fieldLabel: string,
    placeholder: string,
    options: any[]
  ) => {
    return {
      onClickView: {
        dropdownField: {
          label: fieldLabel,
          placeholder,
          options
        },
      },
    };
  };

  const baseProductColumnDict: DataColumnDict = {
    Id: {
      sqlTableHeader: "id",
      googleSheetHeader: null,
      sqlText: "INTEGER PRIMARY KEY AUTOINCREMENT",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {
        headerFunction: "checkbox",
        cellInfo: {
          defaultView: "checkbox",
          validations: {
            nullable: false,
          },
        },
        enableSorting: false,
        enableHiding: false,
      },
    },
    Job_Number: {
      sqlText: "TEXT NOT NULL UNIQUE",
      sqlTableHeader: "Job_Number",
      googleSheetHeader: "Job Number",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "string",
          validations: {
            nullable: false,
          },
          ...(isProductsTab &&
            editableOnClickTextBox("Job Number", "Job Number")),
          appearance: isProductsTab
            ? editableTextBoxAppearance
            : readOnlyTextBoxAppearance,
        },
      },
    },
    Customer: {
      sqlText: "TEXT NOT NULL",
      sqlTableHeader: "Customer",
      googleSheetHeader: "Customer",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "string",
          validations: {
            nullable: false,
          },
          ...(isProductsTab && editableOnClickTextBox("Customer", "Customer")),
          appearance: isProductsTab
            ? editableTextBoxAppearance
            : readOnlyTextBoxAppearance,
        },
      },
    },
    Text: {
      sqlText: "TEXT",
      sqlTableHeader: "Text",
      googleSheetHeader: "Text",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "string",
          validations: {
            nullable: false,
          },
          ...(isProductsTab &&
            editableOnClickTextBox("Text", "Product Description...")),
          appearance: isProductsTab
            ? editableTextBoxAppearance
            : readOnlyTextBoxAppearance,
        },
      },
    },
    Work_Center: {
      sqlText: "TEXT NOT NULL",
      sqlTableHeader: "Work_Center",
      googleSheetHeader: "Work Center",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "string",
          validations: {
          
          },
          ...(isProductsTab &&
            editableOnClickDropdownView("Work Center", "Work Center...", workCentersList)),
          appearance: isProductsTab
            ? editableTextBoxAppearance
            : readOnlyTextBoxAppearance,
        },
      },
    },
    Quantity: {
      sqlText: "INTEGER NOT NULL",
      sqlTableHeader: "Quantity",
      googleSheetHeader: "Quantity",
      toSqlConverter: Number,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "number",
          newItemValue: 0,
          ...(isProductsTab
            ? {
                viewOptions: {
                  chevronOptions: {
                    step: 10,
                  },
                },
              }
            : {}), 
          validations: {
            nullable: false,
          },
          ...(isProductsTab && editableOnClickTextBox("Quantity", 0)),
          appearance: isProductsTab
            ? editableNumberBoxAppearance
            : readOnlyNumberBoxAppearance,
        },
      },
    },
    Length: {
      sqlText: "INTEGER",
      sqlTableHeader: "Length",
      googleSheetHeader: "Length",
      toSqlConverter: Number,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "number",
          newItemValue: 0,
          ...(isProductsTab
            ? {
                viewOptions: {
                  chevronOptions: {
                    step: 10,
                  },
                },
              }
            : {}), 
          validations: {
            nullable: false,
          },
          ...(isProductsTab && editableOnClickTextBox("Length", 0)),
          appearance: isProductsTab
            ? editableNumberBoxAppearance
            : readOnlyNumberBoxAppearance,
        },
      },
    },
    Product_Quantity: {
      sqlText: "INTEGER CHECK (Product_Quantity >= 0)",
      sqlTableHeader: "Product_Quantity",
      googleSheetHeader: "Product Quantity",
      toSqlConverter: Number,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "number",
          newItemValue: 0,
          ...(isProductsTab
            ? {
                viewOptions: {
                  chevronOptions: {
                    step: 10,
                  },
                },
              }
            : {}), 
          validations: {
            nullable: false,
          },
          ...(isProductsTab &&
            editableOnClickTextBox("Production Quantity", 0)),
          appearance: isProductsTab
            ? editableNumberBoxAppearance
            : readOnlyNumberBoxAppearance,
        },
      },
    },
    Balance_Quantity: {
      sqlText:
        "INTEGER CHECK (Balance_Quantity >= 0 AND Balance_Quantity <= Product_Quantity)",
      sqlTableHeader: "Balance_Quantity",
      googleSheetHeader: "Balance Quantity",
      toSqlConverter: Number,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "number",
          newItemValue: 0,
          viewOptions: {
            chevronOptions: {
              step: 10,
            },
          },
          validations: {
            nullable: false,
          },
          ...editableOnClickTextBox("Balance Quantity", 0),
          appearance: chevronOptionAppearance,
        },
      },
    },
    Requested_Ship_Date: {
      sqlTableHeader: "Requested_Ship_Date",
      googleSheetHeader: "Requested Ship Date",
      sqlText: "DATE",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "date",
          newItemValue:  new Date().toISOString().split('T')[0] as "YYYY-MM-DD",
          validations: {
            nullable: false,
          },
          ...(isProductsTab &&
            editableOnClickTextBox("Requested Ship Date", "YYYY-MM-DD")),
          appearance: isProductsTab
            ? editableDateFieldAppearance
            : readOnlyDateFieldAppearance,
        },
      },
    },
    Requested_Ship_Time: {
      sqlTableHeader: "Requested_Ship_Time",
      googleSheetHeader: "Requested Ship Time",
      sqlText: "TEXT",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "time",
          validations: {},
          newItemValue: { hour: 0, minute: 0 },
          ...(isProductsTab &&
            editableOnClickTextBox("Requested Ship Time", "HH:MM")),
          appearance: isProductsTab
            ? ediatbleTimeFieldAppearance : readOnlyTimeFieldAppearance,
        },
      },
    },
    Set_Up: {
      sqlTableHeader: "Set_Up",
      googleSheetHeader: "Set Up (min)",
      sqlText: "INTEGER CHECK (Set_Up >= 0)",
      toSqlConverter: Number,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "number",
          validations: {},
          newItemValue: 120,
          ...(isProductsTab
            ? {
                viewOptions: {
                  chevronOptions: {
                    step: 10,
                  },
                },
              }
            : {}), 
          ...(isProductsTab && editableOnClickTextBox("Set Up", 0)),
          appearance: isProductsTab
            ? editableNumberBoxAppearance
            : readOnlyNumberBoxAppearance,
        },
      },
    },
    UPH: {
      sqlTableHeader: "UPH",
      googleSheetHeader: "UPH (units/hour)",
      sqlText: "INTEGER CHECK (UPH >= 0)",
      toSqlConverter: Number,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "number",
          validations: {},
          newItemValue: 10,
          viewOptions: {
            chevronOptions: {
              step: 1,
            },
          },
          ...(isProductsTab && editableOnClickTextBox("UPH", 0)),
          appearance: isProductsTab
            ? editableNumberBoxAppearance
            : readOnlyNumberBoxAppearance,
        },
      },
    },
    ...(isProductionScheduleTab && {
      Priority: {
        sqlTableHeader: "Priority",
        googleSheetHeader: "Priority",
        sqlText: "INTEGER CHECK (Priority >= 0)",
        toSqlConverter: Number,
        toGoogleConverter: String,
        columnDef: {
          cellInfo: {
            defaultView: "number",
            nullValue: 999,
            newItemValue: 999,
            validations: {
              nullable: false,
            },
            onClickView: {
              priorityPopup: {},
            },
          },
        },
      },
      Scheduled_Start: {
        sqlTableHeader: "Scheduled_Start",
        googleSheetHeader: "Scheduled Start",
        sqlText: "DATE CHECK (Scheduled_Start < Scheduled_End)",
        toSqlConverter: Date,
        toGoogleConverter: String,
        columnDef: {
          cellInfo: {
            defaultView: "date",
            validations: {},
          },
        },
      },
      Scheduled_End: {
        sqlTableHeader: "Scheduled_End",
        googleSheetHeader: "Scheduled End",
        sqlText: "DATE CHECK (Scheduled_End > Scheduled_Start)",
        toSqlConverter: Date,
        toGoogleConverter: String,
        columnDef: {
          cellInfo: {
            defaultView: "date",
            validations: {},
          },
        },
      },
    }),
    Cut: {
      sqlTableHeader: "Cut",
      googleSheetHeader: "Cut",
      sqlText: "TEXT",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "string",
          validations: {},
          newItemValue: "_",
          ...editableOnClickDropdownView
          ("Cut", "Cut...", cutOptions),
          appearance: dropdownOptionAppearance,
        },
      },
    },
    Extrusion: {
      sqlTableHeader: "Extrusion",
      googleSheetHeader: "Extrusion",
      sqlText: "TEXT",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "string",
          newItemValue: "_",
          validations: {},
          ...editableOnClickDropdownView(
            "Extrusion",
            "Extrusion...",
            extrusionOptions
          ),
          appearance: dropdownOptionAppearance,
        },
      },
    },
    Ground: {
      sqlTableHeader: "Ground",
      googleSheetHeader: "Ground",
      sqlText: "TEXT",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "string",
          newItemValue: "_",
          validations: {},
          ...editableOnClickDropdownView(
            "Ground",
            "Ground...",
            groundOptions
          ),
          appearance: dropdownOptionAppearance,
        },
      },
    },
    Drawing: {
      sqlTableHeader: "Drawing",
      googleSheetHeader: "Drawing",
      sqlText: "TEXT",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "string",
          newItemValue: "_",
          validations: {},
          ...editableOnClickDropdownView(
            "Drawing",
            "Drawing...",
            drawingOption
          ),
          appearance: dropdownOptionAppearance,
        },
      },
    },
    Ends: {
      sqlTableHeader: "Ends",
      googleSheetHeader: "Ends",
      sqlText: "TEXT",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {
        cellInfo: {
          defaultView: "string",
          validations: {},
          newItemValue: "_",

          ...editableOnClickDropdownView(
            "Ends",
            "Ends...",
            endsOptions
          ),
          appearance: dropdownOptionAppearance,
        },
      },
    },
  };

  return baseProductColumnDict;
};

export const productsTab: TabOption = {
  id: "products",
  name: "Products",
  fetchFrom: "google",
  sqlTableName: "Products",
  googleSheetName: "Products",
  columnDict: renderBaseProductColumnDict("products"),
};

export const workCenterScheduleTab: TabOption = {
  id: "work_center_schedules",
  name: "Work Center Schedule",
  fetchFrom: "google",
  sqlTableName: "WorkCenterSchedule",
  googleSheetName: "Work Center Schedule",
  columnDict: {
    Date_Weekday_Holiday: {
      sqlText: "TEXT NOT NULL", // Store as TEXT since the column handles mixed formats
      sqlTableHeader: "Date_Weekday_Holiday",
      googleSheetHeader: "Date / Weekday / Holiday",
      toSqlConverter: (value: string): string => {
        // Normalize and validate the value
        const weekdayRegex =
          /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)$/i;
        const mmddRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; // MM-DD
        const yyyymmddRegex =
          /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; // YYYY-MM-DD

        if (weekdayRegex.test(value)) {
          // It's a weekday, store as-is
          return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(); // Capitalize
        } else if (mmddRegex.test(value)) {
          // It's an MM-DD holiday
          return value; // Store in MM-DD format
        } else if (yyyymmddRegex.test(value)) {
          // It's a specific date (YYYY-MM-DD)
          return value; // Store in YYYY-MM-DD format
        } else {
          // Invalid format
          throw new Error(`Invalid Date_Weekday_Holiday value: ${value}`);
        }
      },
      toGoogleConverter: String, // No special transformation required for Google Sheets
      columnDef: {},
    },
    ...generateColumnDict(workCentersList),
  },
};

export const ledgersTab: TabOption = {
  id: "ledger",
  name: "Ledger",
  fetchFrom: "sql",
  sqlTableName: "Ledger",
  requiredSqlTables: [workCenterScheduleTab],
  googleSheetName: "Ledger",
  columnDict: {
    Id: {
      sqlText: "INTEGER PRIMARY KEY AUTOINCREMENT",
      sqlTableHeader: "ID",
      googleSheetHeader: null,
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {},
    },
    Date: {
      sqlText: "DATE NOT NULL",
      sqlTableHeader: "Date",
      googleSheetHeader: "Date",
      toSqlConverter: Date,
      toGoogleConverter: String,
      columnDef: {},
    },
    Time: {
      sqlText: "TEXT NOT NULL",
      sqlTableHeader: "Time",
      googleSheetHeader: "Time",
      toSqlConverter: toTimeRange,
      toGoogleConverter: timeRangeToString,
      columnDef: {},
    },
    Work_Center: {
      sqlText: "TEXT NOT NULL",
      sqlTableHeader: "Work_Center",
      googleSheetHeader: "Work Center",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {},
    },
    On: {
      sqlText: "TEXT NOT NULL",
      sqlTableHeader: "On",
      googleSheetHeader: "On (min)",
      toSqlConverter: Number,
      toGoogleConverter: String,
      columnDef: {},
    },
    Notes: {
      sqlText: "TEXT",
      sqlTableHeader: "Notes",
      googleSheetHeader: "Notes",
      toSqlConverter: String,
      toGoogleConverter: String,
      columnDef: {},
    },
  },
};

export const productionScheduleTab: TabOption = {
  id: "production_schedule",
  name: "Production Schedule",
  fetchFrom: "sql",
  sqlTableName: "ProductionSchedule",
  requiredSqlTables: [productsTab, workCenterScheduleTab],
  googleSheetName: "Production Schedule",
  columnDict: renderBaseProductColumnDict("production_schedule"),
};

const settingsTab: TabOption = {
  id: "settings",
  name: "Settings",
  sqlTableName: "Settings",
};

const generateWorkCenterTab = (workCenter: string): TabOption => {
  let simpleId = workCenter
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
  simpleId = `wc_${simpleId}`;
  return {
    id: simpleId as TabId,
    name: workCenter,
    fetchFrom: "sql",
    isWorkCenter: true,
    sqlTableName: removeAllWhiteSpace(workCenter),
    requiredSqlTables: [
      productsTab,
      workCenterScheduleTab,
      productionScheduleTab,
    ],
    columnDict: {
      Id: {
        sqlText: "INTEGER PRIMARY KEY AUTOINCREMENT",
        sqlTableHeader: "ID",
        googleSheetHeader: null,
        toSqlConverter: String,
        toGoogleConverter: String,
        columnDef: {},
      },
      Production_Schedule_Id: {
        sqlText: "INTEGER NOT NULL REFERENCES ProductionSchedule(Id)",
        sqlTableHeader: "Production_Schedule_ID",
        googleSheetHeader: null,
        toSqlConverter: String,
        toGoogleConverter: String,
        columnDef: {},
      },
    },
  };
};

export const workCenterTabs = workCentersList.map((workCenter) =>
  generateWorkCenterTab(workCenter)
);

export const sidebarTabGroups: SidebarTabGroup[] = [
  {
    groupHeader: "Main",
    groupTabs: [
      productsTab,
      productionScheduleTab,
      workCenterScheduleTab,
      ledgersTab,
    ],
  },
  { groupHeader: "Work Centers", groupTabs: workCenterTabs },
  { groupHeader: "Settings", groupTabs: [settingsTab] },
];
