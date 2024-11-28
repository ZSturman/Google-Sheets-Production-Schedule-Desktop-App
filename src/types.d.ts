type LoadingState = "loading" | "error";

type DataTableT =
  | ProductData[]
  | ProductionScheduleData[]
  | WorkCenterScheduleData[]
  | WorkCenterData[]
  | LedgerData[]

type DataRowT =
  | ProductData
  | ProductionScheduleData
  | WorkCenterScheduleData
  | WorkCenterData
  | LedgerData 

type EditingCell = {
  row: Row<DataRowT>;
  columnId: string;
  initialValue: any;
  newValue: any;
};

type LocalSheetUpdate = {
  tab: TabOption;
  updatedLocallyAt: Date;
  undo: boolean;
  type: "update" | "delete" | "add";
  row: DataRowT
  prevRow?: DataRowT
};

type SqlSheetUpdate = LocalSheetUpdate & {
  updatedSqlAt: Date | null;
};

type FinalizedSheetUpdate = SqlSheetUpdate & {
  updatedGoogleAt: Date | null;
};

type DateFormat = "YYYY-MM-DD";
type TimeFormat = {
  hour: number;
  minute: number;
};

type SidebarTabGroup = {
  groupHeader: string;
  groupTabs: TabOption[];
};

type WorkCenterId =
  | "wc_sl_50"
  | "wc_sl_30"
  | "wc_q"
  | "wc_r"
  | "wc_a"
  | "wc_x"
  | "wc_sect_1"
  | "wc_q2"
  | "wc_n"
  | "wc_h"
  | "wc_long_press"
  | "wc_fabrication"
  | "wc_pvc"
  | "wc_pvc_vg"
  | "wc_punch_press"
  | "wc_loose_bw"
  | "wc_ready_for_inspection";

type TabId =
  | "products"
  | "production_schedule"
  | "work_center_schedules"
  | "work_center_datas"
  | "ledger"
  | "settings"
  | WorkCenterId;

type TabOption = {
  id: TabId;
  isWorkCenter?: boolean;
  name: string;
  fetchFrom?: "sql" | "google";
  sqlTableName: string;
  requiredSqlTables?: TabOption[];
  googleSheetName?: string;
  columnDict?: DataColumnDict;
  columnData?: DataRowT
};

type DataColumnDict = {
  [key: string]: {
    sqlText: string;
    sqlTableHeader: string;
    googleSheetHeader: string | null;
    toSqlConverter?: (value: string) => any;
    toGoogleConverter?: (value: any) => string;
    columnDef: DataColumnDefinition;
  };
};

type DataColumnDefinition = {
  id?: string;
  headerFunction?: HeaderFunctions;
  cellInfo?: CellInfo;
  enableSorting?: boolean;
  enableHiding?: boolean;
};

type HeaderFunctions = "checkbox" | "sort";

type CellInfo = {
  defaultView: ReadOnlyView;
  viewOptions?: ViewOptions;
  newItemValue? : any;
  nullValue?: any;
  onClickView?: EditableFields;
  validations: Validations;
  appearance?: {
    justify?: "justify-start" | "justify-center" | "justify-end";
    items?: "items-start" | "items-center" | "items-end";
    truncate?: boolean;
    wrap?: boolean;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    backgroundColor?: string;
    border?: string;
    fontSize?: number;
  };
};

type ReadOnlyView =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "time"
  | "checkbox";


type ViewOptions = {
  booleanOptions?: {
    true: string;
    false: string;
  };
  chevronOptions?: {
    step: number;
  };
  buttonOptions?: {
    label: string;
  };
};

type EditableFields = {
  inputField?: InputField;
  dropdownField?: DropdownField;
  datePickerField?: DatePickerField;
  timePickerField?: TimePickerField;
  priorityPopup?: PriorityPopup;
};
type DropdownField = {
  label: string;
  options: string[];
  placeholder: string;
};

type InputField = {
  label: string;
  placeholder: string | number;
  type: "text" | "number";
};

type DatePickerField = {
  label: string;
};

type TimePickerField = {
  label: string;
};

type PriorityPopup = {}

type Validations = {
  nullable?: boolean;
  required?: boolean;
  pattern?: string;
  min?: number;
  max?: number;
  minDate?: Date;
  maxDate?: Date;
  minLength?: number;
  maxLength?: number;
  minTime?: TimeFormat;
  maxTime?: TimeFormat;
};

type TabPermissions = "readOnly" | "edit" | "admin";
type EditingOptins = "always" | "confirm" | "never";
type SaveOptions = "confirm" | "auto" | "secondOption";

type Message = {
  timestamp: Date;
  message: string;
  type: "error" | "success" | "warning" | "info";
};

type ProductData = {
  [key: string]: any;
  Id: string;
  Work_Center: WorkCenter;
  Job_Number: string;
  Customer: string;
  Text: string;
  Quantity: number;
  Length: number;
  Production_Quantity: number;
  Requested_Ship_Date: DateFormat;
  Requested_Ship_Time: TimeFormat;
  Set_Up: number;
  UPH: number;
  Cut: CutColumn;
  Extrusion: ExtrusionColumn;
  Ground: GroundColumn;
  Drawing: DrawingColumn;
  Ends: EndsColumn;
  Balance_Quantity: number;
  Priority: number;
  Scheduled_Start: Date; 
  Scheduled_End: Date; 
};

type ProductionScheduleData = ProductData


type WorkCenterData = ProductData 

type LedgerData = {
  [key: string]: any;
  Id: string;
  Work_Center: WorkCenter;
  Date: Date;
  Weekday: string;
  Start: TimeFormat;
  End: TimeFormat;
};

type WorkCenterScheduleData = {
  [key: string]: any;
  Id: string;
  Date_Weekday_Holiday: WorkCenter;
  UNASSIGNED: TimeFormat;
  SL_50: TimeFormat;
  SL_30: TimeFormat;
  Q2: TimeFormat;
  R: TimeFormat;
  A: TimeFormat;
  X: TimeFormat;
  SECT_1: TimeFormat;
  N: TimeFormat;
  H: TimeFormat;
  Long_press: TimeFormat;
  Fabrication: TimeFormat;
  PVC: TimeFormat;
  PVC_VG: TimeFormat;
  Punch_press: TimeFormat;
  Loose_BW: TimeFormat;
  Ready: TimeFormat;
};

type WorkCenter =
  | "UNASSIGNED"
  | "SL 50"
  | "SL 30"
  | "Q2"
  | "R"
  | "A"
  | "X"
  | "SECT #1"
  | "N"
  | "H"
  | "Long press"
  | "Fabrication"
  | "PVC"
  | "PVC VG"
  | "Punch press"
  | "Loose BW"
  | "Ready for inspection";


type CutColumn =
  | "_"
  | "Cut"
  | "Extrusion"
  | "Ground"
  | "Drawing"
  | "Ends"
  | "None";


type ExtrusionColumn = "_" | "Ext 1" | "Ext 2" | "Ext 3" | "Ext 4" | "Ext 5";


type GroundColumn =
  | "_"
  | "Grind 1"
  | "Grind 2"
  | "Grind 3"
  | "Grind 4"
  | "Grind 5";


type DrawingColumn = "_" | "Draw 1" | "Draw 2" | "Draw 3" | "Draw 4" | "Draw 5";


type EndsColumn = "_" | "End 1" | "End 2" | "End 3" | "End 4" | "End 5";


// type TimeFormat = {
//   hour: number;
//   minute: number;
// };

// type DaySchedule = {
//   start: TimeFormat;
//   end: TimeFormat;
// };

// type SheetData = {
//   sheetTitle: string;
//   sheetHeaders: {
//     index: number;
//     value: string;
//   }[];
//   data: {
//     value: string;
//   }[][];
// };

// type DataColumnDict = {
//   [key: string]: {
//     accessorKey:
//       | keyof ScheduledData
//       | keyof WorkCenterReferenceData
//       | keyof CalendarData
//       | keyof WorkCenterData;
//     converter: (value: string) => any;
//     toGoogleSheetsConverter?: (value: any) => string;
//   };
// };

// type DataState<T> = {
//   status: "idle" | "loading" | "error" | "success";
//   data?: T;
//   error?: string;
// };

// type WorkCenterReferenceData = {
//   [key: string]: any;
//   workCenter: WorkCenter;
//   sunday: DaySchedule[];
//   monday: DaySchedule[];
//   tuesday: DaySchedule[];
//   wednesday: DaySchedule[];
//   thursday: DaySchedule[];
//   friday: DaySchedule[];
//   saturday: DaySchedule[];
// };

// type CalendarData = {
//   [key: string]: any;
//   workCenter: WorkCenter;
//   date: Date;
//   start: TimeFormat;
//   end: TimeFormat;
//   predicted: boolean;
//   actual: boolean;
// };

// type WorkCenterData = {
//   [key: string]: any;
//   jobNo: string;
//   priority: number;
//   customer: string;
//   text: string;
//   quantity: number;
//   length: number;
//   productQuantity: number;
//   balanceQuantity: number;
//   requestedShipDate: Date;
//   requestedShipTime: TimeFormat;
//   setUp: number;
//   uph: number;
//   timeToCompleteTotal: number;
//   timeToCompleteRemaining: number;
// };

// type UserDefinedFields = {
//   spreadsheetIdentifier: string;
//   sheetIdentifier: string;
//   columnIdentifier: string;
//   options: string[];
// };

// type WorkCenter = {
//   id: string;
//   name: string;
// };

// type WorkCenterJob = {
//   id: string;
//   completedQty: number;
//   customer: string;
//   jobNo: string;
//   length: number;
//   noEarlier: number | null;
//   opNo: number;
//   prodQty: number;
//   qty: number;
//   requestedShipDate: number;
//   setUp: number;
//   status: string;
//   text: string;
//   timeToComplete: number;
//   uph: number;
// };

// type ScheduleConfig = {
//   workCenterReferenceSheetName: string;
//   scheduleSheetName: string;
//   calendarSheetName: string;
//   dateFormat: string;
//   timeFormat: string;
//   datetimeFormat: string;
//   sundayColumn: number;
//   mondayColumn: number;
//   tuesdayColumn: number;
//   wednesdayColumn: number;
//   thursdayColumn: number;
//   fridayColumn: number;
//   saturdayColumn: number;
//   [holiday: string]: number | string;
// };

// type UpdatedWorkCenterData = {
//   workCenterTab: TabOption;
//   rowsToDelete: ScheduledData[] | null;
//   rowsToUpdate: ScheduledData[] | null;
//   rowsToAdd: ScheduledData[] | null;
// };

/* -----------------------------------------------------------------------
  --------------------------------------------------------------------------

                              GANTT CHART
  
  --------------------------------------------------------------------------
  ----------------------------------------------------------------------- */

// type GanttChartColumns = {
//   step: 0.25 | 0.5 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 24;
//   from: Date;
//   to: Date;
// };

// type GanttChartData = {
//   rowLabel: string;
//   toolTipContent: React.ReactNode;
//   start: Date;
//   duration: Duration;
//   dueDate: Date;
//   end?: Date;
//   thresholds: {
//     interval?: Interval;
//     status: GanttChartStatusValues;
//   }[];
// };

// type GanttChartStatus = {
//   statusValue: GanttChartStatusValues;
//   className: string;
// };

// type DateTimeFormatOptions = {
//   type: "date" | "time";
//   name: string;
//   format: string;
// };
