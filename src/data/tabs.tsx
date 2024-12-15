//import { timeRangeToString, toTimeRange } from "../utils/time";
import {
  cutOptions,
  endsOptions,
  extrusionOptions,
  workCentersList,
  drawingOption,
  groundOptions,
} from "./lists";
import { removeAllWhiteSpace } from "../utils/regexFuncs";

/* 

Google SHeet Values to copy in case they get deleted

Job Number	Customer	Text	Work Center	Quantity	Length	Production Quantity	Balance Quantity	Requested Ship Date	Requested Ship Time	Set Up	UPH	Cut	Extrusion	Ground	Drawing	Ends	Priority	Scheduled Start	Scheduled End 

*/

const renderBaseProductColumnDict = (
  tab:
    | "products"
    | "production_schedule"
    | "work_center"
    | "work_center_schedules"
    | "ledger"
) => {
  const isProductsTab = tab === "products";
  const isProductionScheduleTab = tab === "production_schedule";
  const isWorkCenterTab = tab === "work_center";

  const baseProductColumnDict: DataColumnDict = {
    ...(isProductsTab && {
      Id: {
        id: "id",
        googleSheetHeader: null,
        columnDef: {
          headerFunction: isWorkCenterTab ? "hidden" : "checkbox",
          cell: {
            view: {
              readOnly: false,
              editable: {
                default: {
                  checkbox: {},
                },
                editing: {
                  checkbox: {},
                },
              },
            },
            value: {
              type: "checkbox",
              default: false,
            },
          },
          enableSorting: false,
          enableHiding: false,
        },
      },
    }),

    Job_Number: {
      id: "job_number",
      googleSheetHeader: "Job Number",
      columnDef: {
        headerFunction: "sort",
        cell: {
          view: {
            readOnly: {
              text: {},
              styles: {
                needsAttention: "border border-2 rounded-md border-purple-200",
                error: "bg-red-200",
              },
            },
            // If isProductsTab, allow editing otherwise editable = false
            editable: isProductsTab
              ? {
                  default: {
                    button: {
                      labelIsValue: true,
                      label: "Job Number...",
                    },
                  },
                  editing: {
                    textInput: {
                      tooltip: "Enter the Product or Job Number.",
                      placeholder: "PR123",
                      requiresAttention: [
                        {
                          value: "isBlank",
                          message: "Job number cannot be blank.",
                          type: "error",
                          prevent: ["save", "approval"],
                          requires: ["update"],
                        },
                      ],
                    },
                    styles: {
                      focus: "bg-blue-200 text-black",
                      error: "bg-red-500",
                    },
                  },
                }
              : false,
          },
          value: {
            type: "text",
            default: "",
            nullable: false,
            required: true,
          },
        },
      },
    },
    Customer: {
      id: "customer",
      googleSheetHeader: "Customer",
      columnDef: {
        headerFunction: "sort",
        cell: {
          view: {
            readOnly: { text: {}, styles: {} },

            editable: isProductsTab
              ? {
                  default: {
                    button: { label: "Customer...", labelIsValue: true },
                    styles: {},
                  },
                  editing: {
                    textInput: { placeholder: "Enter Customer" },
                    styles: {},
                  },
                }
              : false,
          },
          value: {
            type: "text",
            default: "",
            nullable: false,
            required: true,
          },
        },
      },
    },
    Text: {
      id: "text",
      googleSheetHeader: "Text",
      columnDef: {
        headerFunction: "sort",
        cell: {
          view: {
            readOnly: { text: {}, styles: {} },

            editable: isProductsTab
              ? {
                  default: {
                    button: { label: "Edit Text", labelIsValue: true },
                    styles: {},
                  },
                  editing: {
                    textInput: { placeholder: "Enter Text" },
                    styles: {},
                  },
                }
              : false,
          },
          value: {
            type: "text",
            default: "",
            nullable: true,
          },
        },
      },
    },
    Work_Center: {
      id: "work_center",
      googleSheetHeader: "Work Center",
      columnDef: {
        headerFunction: "sort",
        cell: {
          view: {
            readOnly: { text: {}, styles: {} },
            editable:
              isProductsTab || isProductionScheduleTab
                ? {
                    default: {
                      button: {
                        label: "Select Work Center...",
                        labelIsValue: true,
                      },
                      styles: {},
                    },
                    editing: {
                      dropdown: {
                        placeholder: "Select a Work Center...",
                        items: workCentersList,
                        label: "Select",
                      },
                      styles: {},
                    },
                  }
                : false,
          },
          value: {
            type: "text",
            default: workCentersList[0] ?? "UNASSIGNED",
            nullable: false,
            required: true,
          },
        },
      },
    },
    Quantity: {
      id: "quantity",
      googleSheetHeader: "Quantity",

      columnDef: {
        headerFunction: "sort",
        cell: {
          view: {
            readOnly: { number: {}, styles: {} },
            editable: isProductsTab
              ? {
                  default: { chevron: { min: 0, stepCount: 5 }, styles: {} },
                  editing: {
                    numberInput: { placeholder: 0, min: 0 },
                    styles: {},
                  },
                }
              : false,
          },
          value: {
            type: "number",
            default: 0,
            nullable: false,
            required: true,
          },
        },
      },
    },
    Length: {
      id: "length",
      googleSheetHeader: "Length",

      columnDef: {
        headerFunction: "sort",
        cell: {
          view: {
            readOnly: { number: {}, styles: {} },

            editable: isProductsTab
              ? {
                  default: { chevron: { min: 0, stepCount: 10 }, styles: {} },
                  editing: {
                    numberInput: { placeholder: 0, min: 0 },
                    styles: {},
                  },
                }
              : false,
          },
          value: {
            type: "number",
            default: 0,
            nullable: false,
            required: true,
          },
        },
      },
    },
    Production_Quantity: {
      id: "production_quantity",
      googleSheetHeader: "Production Quantity",

      columnDef: {
        headerFunction: "sort",
        cell: {
          view: {
            readOnly: { number: {}, styles: {} },
            editable: isProductsTab
              ? {
                  default: { chevron: { min: 0, stepCount: 10 }, styles: {} },
                  editing: {
                    numberInput: { placeholder: 0, min: 0 },
                    styles: {},
                  },
                }
              : false,
          },
          value: {
            type: "number",
            default: 0,
            nullable: false,
            required: true,
          },
        },
      },
    },
    Balance_Quantity: {
      id: "balance_quantity",
      googleSheetHeader: "Balance Quantity",

      columnDef: {
        headerFunction: "sort",
        cell: {
          view: {
            readOnly: { number: {}, styles: {} },
            editable: {
              default: { chevron: { min: 0, stepCount: 10 }, styles: {} },
              editing: { numberInput: { placeholder: 0, min: 0 }, styles: {} },
            },
          },
          value: {
            type: "number",
            default: 0,
            nullable: false,
            required: true,
          },
        },
      },
    },
    Requested_Ship_Date: {
      id: "requested_ship_date",
      googleSheetHeader: "Requested Ship Date",
      columnDef: {
        headerFunction: "sort",
        cell: {
          
          view: {
            readOnly: {
              datetime: {
                format: {
                  delimiter: "/",
                  month: "short",
                  day: "DD",
                  year: "YYYY",
                  hour: "HH",
                  minute: "mm",
                },
              },
            },
            editable: isProductsTab
              ? {
                  default: {
                    button: {
                      labelIsValue: true,
                      label: "Select Date and Time...",
                    },
                  },
                  editing: {
                    popup: {
                      content: {
                        calendar: {
                          date: {
                            min: new Date(2000, 0, 1),
                            max: new Date(2100, 11, 31),
                            calendar: "month",
                          },
                          time: {
                            type: "24",
                            stepCount: 1,
                            min: 0,
                            max: 1440,
                          },
                        },
                      },
                    },
                  },
                }
              : false,
          },
          value: {
            type: "datetime",
            default: new Date(), // Defaults to current date and time
            nullable: false,
            required: true,
          },
        },
      },
    },
    Set_Up: {
      id: "set_up",
      googleSheetHeader: "Set Up",

      columnDef: {
        headerFunction: "sort",
        cell: {
          view: {
            readOnly: { number: {}, styles: {} },

            editable: isProductsTab
              ? {
                  default: { chevron: { min: 0, stepCount: 10 }, styles: {} },
                  editing: {
                    numberInput: { placeholder: 0, min: 0 },
                    styles: {},
                  },
                }
              : false,
          },
          value: {
            type: "number",
            default: 120,
            nullable: false,
            required: true,
          },
        },
      },
    },
    UPH: {
      id: "uph",
      googleSheetHeader: "UPH",

      columnDef: {
        headerFunction: "sort",
        cell: {
          view: {
            readOnly: { number: {}, styles: {} },

            editable: isProductsTab
              ? {
                  default: { chevron: { min: 0, stepCount: 1 }, styles: {} },
                  editing: {
                    numberInput: { placeholder: 0, min: 0 },
                    styles: {},
                  },
                }
              : false,
          },
          value: {
            type: "number",
            default: 10,
            nullable: false,
            required: true,
          },
        },
      },
    },
    Priority: {
      id: "priority",
      googleSheetHeader: "Priority",

      columnDef: {
        headerFunction: "sort",
        cell: {
          view: {
            readOnly: { number: {}, styles: {} },
            editable: isProductionScheduleTab
              ? {
                  default: {
                    button: {
                      labelIsValue: true,
                      label: "Select Priority...",
                    },
                  },
                  editing: {
                    popup: {
                      content: {
                        priority: {},
                      },
                    },
                  },
                }
              : false,
          },
          value: {
            type: "number",
            default: 0,
            nullable: false,
            required: true,
          },
        },
      },
    },
    Scheduled_Start: {
      id: "scheduled_start",
      googleSheetHeader: "Scheduled Start",

      columnDef: {
        viewable: !isProductsTab,
        headerFunction: "sort",
        cell: {
          view: {
            readOnly: {
              datetime: {
                format: {
                  delimiter: "/",
                  month: "short",
                  day: "DD",
                  year: "YYYY",
                  hour: "HH",
                  minute: "mm",
                },
              },
            },
            editable: false,
          },
          value: {
            type: "datetime",
            default: new Date(),
          },
        },
      },
    },
    Scheduled_End: {
      id: "scheduled_end",
      googleSheetHeader: "Scheduled End",

      columnDef: {
        viewable: !isProductsTab,
        headerFunction: "sort",
        cell: {
          view: {
            readOnly: {
              datetime: {
                format: {
                  delimiter: "/",
                  month: "short",
                  day: "DD",
                  year: "YYYY",
                  hour: "HH",
                  minute: "mm",
                },
              },
            },
            editable: false,
          },
          value: {
            type: "datetime",
            default: new Date(),
          },
        },
      },
    },
    Cut: {
      id: "cut",
      googleSheetHeader: "Cut",

      columnDef: {
        cell: {
          view: {
            readOnly: { text: {}, styles: {} },
            editable:
              isProductsTab || isProductionScheduleTab
                ? {
                    default: {
                      button: {
                        labelIsValue: true,
                        label: "Select Cut...",
                      },
                    },
                    editing: {
                      dropdown: {
                        placeholder: "Select Cut...",
                        items: cutOptions,
                        label: "Select",
                      },
                    },
                  }
                : false,
          },
          value: {
            type: "text",
            default: cutOptions[0],

            nullable: true,
          },
        },
      },
    },
    Extrusion: {
      id: "extrusion",
      googleSheetHeader: "Extrusion",

      columnDef: {
        cell: {
          view: {
            readOnly: { text: {}, styles: {} },
            editable:
              isProductsTab || isProductionScheduleTab
              ? {
                default: {
                  button: { label: "Extrusion...", labelIsValue: true },
                  styles: {},
                },
                editing: {
                  textInput: { placeholder: "Ext" },
                  styles: {},
                },
              }
                // ? {
                //     default: {
                //       button: {
                //         labelIsValue: true,
                //         label: "Select Extrusion...",
                //       },
                //     },
                //     editing: {
                //       dropdown: {
                //         placeholder: "Select Extrusion...",
                //         items: extrusionOptions,
                //         label: "Select",
                //       },
                //     },
                //   }
                : false,
          },
          value: {
            type: "text",
            default: extrusionOptions[0],

            nullable: true,
          },
        },
      },
    },
    Ground: {
      id: "ground",
      googleSheetHeader: "Ground",

      columnDef: {
        cell: {
          view: {
            readOnly: { text: {}, styles: {} },
            editable:
              isProductsTab || isProductionScheduleTab
               ? {
                default: {
                  button: { label: "Ground...", labelIsValue: true },
                  styles: {},
                },
                editing: {
                  textInput: { placeholder: "Ground" },
                  styles: {},
                },
              }
                // ? {
                //     default: {
                //       button: {
                //         labelIsValue: true,
                //         label: "Select Ground...",
                //       },
                //     },
                //     editing: {
                //       dropdown: {
                //         placeholder: "Select Ground...",
                //         items: groundOptions,
                //         label: "Select",
                //       },
                //     },
                //   }
                : false,
          },
          value: {
            type: "text",
            default: groundOptions[0],

            nullable: true,
          },
        },
      },
    },
    Drawing: {
      id: "drawing",
      googleSheetHeader: "Drawing",

      columnDef: {
        cell: {
          view: {
            readOnly: { text: {}, styles: {} },
            editable:
              isProductsTab || isProductionScheduleTab
              ? {
                default: {
                  button: { label: "Drawing...", labelIsValue: true },
                  styles: {},
                },
                editing: {
                  textInput: { placeholder: "Drawing" },
                  styles: {},
                },
              }
                // ? {
                //     default: {
                //       button: {
                //         labelIsValue: true,
                //         label: "Select Drawing...",
                //       },
                //     },
                //     editing: {
                //       dropdown: {
                //         placeholder: "Select Drawing...",
                //         items: drawingOption,
                //         label: "Select",
                //       },
                //     },
                //   }
                : false,
          },
          value: {
            type: "text",
            default: drawingOption[0],

            nullable: true,
          },
        },
      },
    },
    Ends: {
      id: "ends",
      googleSheetHeader: "Ends",

      columnDef: {
        cell: {
          view: {
            readOnly: { text: {}, styles: {} },
            editable:
              isProductsTab || isProductionScheduleTab
              ? {
                default: {
                  button: { label: "Ends...", labelIsValue: true },
                  styles: {},
                },
                editing: {
                  textInput: { placeholder: "Ends" },
                  styles: {},
                },
              }
                // ? {
                //     default: {
                //       button: {
                //         labelIsValue: true,
                //         label: "Select Ends...",
                //       },
                //     },
                //     editing: {
                //       dropdown: {
                //         placeholder: "Select Ends...",
                //         items: endsOptions,
                //         label: "Select",
                //       },
                //     },
                //   }
                : false,
          },
          value: {
            type: "text",
            default: endsOptions[0],

            nullable: true,
          },
        },
      },
    },
  };

  return baseProductColumnDict;
};

export const productsTab: TabOption = {
  id: "products",
  name: "Products",
  //googleSheetName: "google",
  //sqlTableName: "Products",
  googleSheetName: "Products",
  columnDict: renderBaseProductColumnDict("products"),
  columnData: null,
};

const generateColumnDict = (workCenters: string[]) => {
  return workCenters.reduce((dict, center) => {
    const key = removeAllWhiteSpace(center);
    dict[key] = {
      id: key,
      googleSheetHeader: center as GoogleSheetHeader,

      columnDef: {
        enableHiding: true,
        enableSorting: true,
        cell: {
          view: {
            readOnly: { text: {} },
            editable: false,
          },
          value: {
            type: "text",
            default: "",
          },
        },
      },
    };
    return dict;
  }, {} as DataColumnDict);
};

export const workCenterSchedulesTab: TabOption = {
  id: "work_center_schedules",
  name: "Work Center Schedules",
  googleSheetName: "Work Center Schedules",
  //sqlTableName: "WorkCenterSchedules",
  //googleSheetName: "Work Center Schedules",
  columnDict: {
    Id: {
      id: "id",
      googleSheetHeader: null,

      columnDef: {
        headerFunction: "checkbox",
        cell: {
          view: {
            readOnly: false,
            editable: {
              default: {
                checkbox: {},
              },
              editing: {
                checkbox: {},
              },
            },
          },
          value: {
            type: "checkbox",
            default: false,
          },
        },
        enableSorting: false,
        enableHiding: false,
      },
    },
    Date_Weekday_Holiday: {
      id: "date_weekday_holiday",
      googleSheetHeader: "Date / Weekday / Holiday",

      // Normalize and validate the value
      //   const weekdayRegex =
      //     /^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)$/i;
      //   const mmddRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; // MM-DD
      //   const yyyymmddRegex =
      //     /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/; // YYYY-MM-DD

      //   if (weekdayRegex.test(value)) {
      //     // It's a weekday, store as-is
      //     return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(); // Capitalize
      //   } else if (mmddRegex.test(value)) {
      //     // It's an MM-DD holiday
      //     return value; // Store in MM-DD format
      //   } else if (yyyymmddRegex.test(value)) {
      //     // It's a specific date (YYYY-MM-DD)
      //     return value; // Store in YYYY-MM-DD format
      //   } else {
      //     // Invalid format
      //     throw new Error(`Invalid Date_Weekday_Holiday value: ${value}`);
      //   }
      // },
      columnDef: {
        enableHiding: true,
        enableSorting: true,
        cell: {
          view: {
            readOnly: { text: {} },
            editable: false,
          },
          value: {
            type: "text",
            default: "",
          },
        },
      },
    },
    ...generateColumnDict(workCentersList),
  },
  columnData: null,
};

export const ledgersTab: TabOption = {
  id: "ledger",
  name: "Ledger",
  //googleSheetName: "google",
  //sqlTableName: "Ledger",
  googleSheetName: "Ledger",
  columnDict: {
    Id: {
      id: "id",
      googleSheetHeader: null,

      columnDef: {
        headerFunction: "checkbox",
        cell: {
          view: {
            readOnly: false,
            editable: {
              default: {
                checkbox: {},
              },
              editing: {
                checkbox: {},
              },
            },
          },
          value: {
            type: "checkbox",
            default: false,
          },
        },
        enableSorting: false,
        enableHiding: false,
      },
    },
    Date: {
      id: "date",
      googleSheetHeader: "Date",

      columnDef: {
        enableHiding: true,
        enableSorting: true,
        cell: {
          view: {
            readOnly: { text: {} },
            editable: false,
          },
          value: {
            type: "text",
            default: "",
          },
        },
      },
    },
    Start: {
      id: "start",
      googleSheetHeader: "Start",

      columnDef: {
        enableHiding: true,
        enableSorting: true,
        cell: {
          view: {
            readOnly: { text: {} },
            editable: false,
          },
          value: {
            type: "text",
            default: "",
          },
        },
      },
    },
    End: {
      id: "end",
      googleSheetHeader: "End",

      columnDef: {
        enableHiding: true,
        enableSorting: true,
        cell: {
          view: {
            readOnly: { text: {} },
            editable: false,
          },
          value: {
            type: "text",
            default: "",
          },
        },
      },
    },
    Work_Center: {
      id: "work_center",
      googleSheetHeader: "Work Center",

      columnDef: {
        enableHiding: true,
        enableSorting: true,
        cell: {
          view: {
            readOnly: { text: {} },
            editable: false,
          },
          value: {
            type: "text",
            default: "",
          },
        },
      },
    },
    On: {
      id: "on",
      googleSheetHeader: "On",

      columnDef: {
        enableHiding: true,
        enableSorting: true,
        cell: {
          view: {
            readOnly: { text: {} },
            editable: false,
          },
          value: {
            type: "text",
            default: "",
          },
        },
      },
    },
    Notes: {
      id: "notes",
      googleSheetHeader: "Notes",

      columnDef: {
        enableHiding: true,
        enableSorting: true,
        cell: {
          view: {
            readOnly: { text: {} },
            editable: false,
          },
          value: {
            type: "text",
            default: "",
          },
        },
      },
    },
  },
  columnData: null,
};

export const productionScheduleTab: TabOption = {
  id: "production_schedule",
  name: "Production Schedule",
  //googleSheetName: "sql",
  //sqlTableName: "ProductionSchedule",
  googleSheetName: null,
  columnDict: renderBaseProductColumnDict("production_schedule"),
  columnData: null,
};

const settingsTab: TabOption = {
  id: "settings",
  name: "Settings",
  //sqlTableName: "Settings",
  googleSheetName: null,
  columnData: null,
  columnDict: null,
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
    googleSheetName: null,
    isWorkCenter: true,
    //sqlTableName: removeAllWhiteSpace(workCenter),
    columnDict: renderBaseProductColumnDict("work_center"),
    columnData: null,
  };
};

export const workCenterTabs = workCentersList.map((workCenter) =>
  generateWorkCenterTab(workCenter)
);

export const allTabs = [
  productsTab,
  productionScheduleTab,
  workCenterSchedulesTab,
  ledgersTab,
  ...workCenterTabs,
  settingsTab,
];

export const sidebarTabGroups: SidebarTabGroup[] = [
  {
    groupHeader: "Main",
    groupTabs: [productionScheduleTab, productsTab],
  },
  { groupHeader: "Work Centers", groupTabs: workCenterTabs },
  {
    groupHeader: "Settings",
    groupTabs: [settingsTab, workCenterSchedulesTab, ledgersTab ],
  },
];
