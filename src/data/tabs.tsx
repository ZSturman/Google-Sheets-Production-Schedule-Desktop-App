//import { timeRangeToString, toTimeRange } from "../utils/time";
import {
  endsOptions,
  workCentersList,
} from "./lists";
import { removeAllWhiteSpace } from "../utils/regexFuncs";

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
        Cut: {
      id: "cut",
      googleSheetHeader: "Cut",

      columnDef: {
        cell: {
          view: {
            readOnly: {
              boolean: {},
              styles: {},
             },
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
      },
    },
    Extrusion: {
      id: "extrusion",
      googleSheetHeader: "Extrusion",

      columnDef: {
        cell: {
          view: {
            readOnly: {
              boolean: {},
              styles: {},
             },
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
      },
    },
    Ground: {
      id: "ground",
      googleSheetHeader: "Ground",

      columnDef: {
        cell: {
          view: {
            readOnly: {
              boolean: {},
              styles: {},
             },
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
                      button: {
                        labelIsValue: true,
                        label: "Select Ends...",
                      },
                    },
                    editing: {
                      dropdown: {
                        placeholder: "Select Ends...",
                        items: endsOptions,
                        label: "Select",
                      },
                    },
                  }
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

    Job_Number: {
      id: "job_number",
      googleSheetHeader: "Job Number",
      shortHeader: "JoNo",
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
      shortHeader: "Cust",
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
      shortHeader: "Text",
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
      shortHeader: "Center",
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
      shortHeader: "Qty",

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
      shortHeader: "Len",

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
      shortHeader: "Bal Qty",

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
      shortHeader: "Ship Date",
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
      shortHeader: "Set Up",

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
      shortHeader: "UPH",

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
      shortHeader: "Priority",

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
      shortHeader: "Sched Start",

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
      shortHeader: "Sched End",

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

  };

  return baseProductColumnDict;
};

export const productsTab: TabOption = {
  id: "products",
  name: "Add/ Edit Products",
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
            editable: {
           
                default: {
                  button: {
                    labelIsValue: true,
                    label: "Select Date and Time...",
                  },
                },
                editing: {
                  timeFromAndTo: {
                    time: {
                      type: "24",
                      stepCount: 1,
                      min: 0,
                      max: 1440,
                    }
                  }
                },
              }
            
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
  columnDict: {
    Date_Weekday_Holiday: {
      id: "date_weekday_holiday",
      googleSheetHeader: "Date / Weekday / Holiday",
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
  googleSheetName: "Ledger",
  columnDict: {
    Id: {
      id: "id",
      googleSheetHeader: null,

      columnDef: {
        cell: {
          view: {
            readOnly: {
              hidden: {},
            },
            editable: false
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
    groupTabs: [productionScheduleTab, productsTab, settingsTab, workCenterSchedulesTab],
  },
  { groupHeader: "Work Centers", groupTabs: workCenterTabs },
];
