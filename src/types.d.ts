type LoadingState = "loading" | "error";

type DataTableT =
  | ProductData[]
  | WorkCenterScheduleData[]
  | LedgerData[];

type DataRowT =
  | ProductData
  | WorkCenterScheduleData
  | LedgerData;

type EditingCell = {
  row: DataRowT;
  newRow?: DataRowT
  columnId: string;
};

type LocalSheetUpdate = {
  tab: TabOption;
  updatedLocallyAt: Date;
  undo: boolean;
  type: "update" | "delete" | "add";
  row: DataRowT;
  prevRow?: DataRowT;
};

// type SqlSheetUpdate = LocalSheetUpdate & {
//   updatedSqlAt: Date | null;
// };

type FinalizedSheetUpdate = LocalSheetUpdate & {
  updatedGoogleAt: Date | null;
};

type CellFuncs = {
  handleImmediateCellUpdate: (value: string) => void;
  handleSetCellToEditing: () => void;
  handleCellUpdate: (value: string) => void;
  handleFinishEditing: () => void;
  cellEditingCancelled: () => void;
};

type Date = "YYYY-MM-DD";
// type string = {
//   hour: number;
//   minute: number;
// };

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
  googleSheetName: string | null
  columnDict: DataColumnDict | null
  columnData: DataRowT | null
};

type GoogleSheetHeader =
  | "Work Center"
  | "Job Number"
  | "Customer"
  | "Text"
  | "Quantity"
  | "Length"
  | "Production Quantity"
  | "Requested Ship Date"
  | "Requested Ship Time"
  | "Set Up"
  | "UPH"
  | "Cut"
  | "Extrusion"
  | "Ground"
  | "Drawing"
  | "Ends"
  | "Balance Quantity"
  | "Priority"
  | "Scheduled Start"
  | "Scheduled End"
  // Schedule Data
  | "Date / Weekday / Holiday"
  | "Date"
  | "Time"
  | "Notes"
  | "Start"
  | "End"
  | "On";

// type SqlTableHeader =
//   | "id"
//   | "work_center"
//   | "job_number"
//   | "customer"
//   | "text"
//   | "quantity"
//   | "length"
//   | "production_quantity"
//   | "requested_ship_date"
//   | "requested_ship_time"
//   | "set_up"
//   | "uph"
//   | "cut"
//   | "extrusion"
//   | "ground"
//   | "drawing"
//   | "ends"
//   | "balance_quantity"
//   | "priority"
//   | "scheduled_start"
//   | "scheduled_end"
//   // Schedule Data
//   | "date_weekday_holiday"
//   | "date"
//   | "time"
//   | "start"
//   | "end"
//   | "notes"
//   | "on";

type Conditionals =
  | "is"
  | "isNot"
  | "contains"
  | "doesNotContain"
  | "isBefore"
  | "isAfter"
  | "isOn"
  | "isNotOn"
  | "isIn"
  | "isNotIn"
  | "isBetween"
  | "isNotBetween"
  | "isLessThan"
  | "isLessThanOrEqualTo"
  | "isGreaterThan"
  | "isGreaterThanOrEqualTo"
  | "isTrue"
  | "isFalse"
  | "isBlank"
  | "isNotBlank";

type FieldType =
  | "range"
  | "minimum"
  | "maximum"
  | "value"
  | "values"
  | "date"
  | "time"
  | "datetime"
  | "dateRange"
  | "timeRange"
  | "number"
  | "numberRange"
  | "list";

type UserActions =
  | "save"
  | "delete"
  | "update"
  | "confirmation"
  | "approval"
  | "validation";

type RequiresAttentionItem = Partial<Record<FieldType, Conditionals>> & {
  message: string;
  prevent: UserActions[];
  type: "error" | "warning" | "info";
  requires: UserActions[];
};

type BaseViewProps = {
  label?: string;
  tooltip?: string;
  requiresAttention?: RequiresAttentionItem[];
};

type UiStyles = {
  active?: string;
  focus?: string;
  hover?: string;
  empty?: string;
  needsAttention?: string;
  error?: string;
};

type TextViewProps = BaseViewProps & {
  wrap?: boolean;
  truncate?: boolean;
};
type TextInputViewProps = BaseViewProps & {
  placeholder: string;
  min?: number;
  max?: number;
};
type NumberViewProps = BaseViewProps & {
  decimalPlaces?: number;
};
type ChevronViewProps = BaseViewProps & {
  stepCount: number;
  min?: number;
  max?: number;
};
type NumberInputViewProps = BaseViewProps & {
  placeholder: number,
  min?: number;
  max?: number;
};
type BooleanViewProps = BaseViewProps & {
  truthyValue?: string;
  falseyValue?: string;
};
type CheckboxViewProps = BaseViewProps & {};
type DateViewProps = BaseViewProps & {
  format?: {
    delimiter?: "-" | "/" | " ";
    year: "YYYY" | "YY" | null;
    month: "MM" | "short" | "full" | null;
    day: "DD" | "short" | "full" | null;
  };
};
type DatePickerViewProps = BaseViewProps & {
  min?: Date;
  max?: Date;
  calendar?: "week" | "month" | "year";
};

type PriorityViewProps = BaseViewProps & {};
type PopupViewProps = BaseViewProps & {
  content:
    | { calendar: DatePickerViewProps }
    | { priority: PriorityViewProps }
    | { timepicker: TimePickerViewProps };
};
type TimeViewProps = BaseViewProps & {
  format?: {
    delimiter?: ":" | "." | " " | null;
    hour?: "HH" | "hh";
    minute?: "mm" | null;
    type?: "12" | "24";
    amPm?: "uppercase" | "lowercase";
  };
};

type TimePickerViewProps = BaseViewProps & {
  type?: "12" | "24";
  stepCount?: number;
  min?: number;
  max?: number;
};
type DropdownViewProps = BaseViewProps & {
  placeholder: string;
  items: string[];
  label: string;
};
type ButtonViewProps = BaseViewProps & {
  labelIsValue: boolean;
  label: string;
};


type ViewProps =
  | TextViewProps
  | TextInputViewProps
  | NumberViewProps
  | ChevronViewProps
  | NumberInputViewProps
  | BooleanViewProps
  | CheckboxViewProps
  | DateViewProps
  | PopupViewProps
  | TimeViewProps
  | TimePickerViewProps
  | DropdownViewProps
  | ButtonViewProps
  | BaseViewProps;

type ReadOnlyViewProps =
  | { text: TextViewProps; styles?: UiStyles }
  | { number: NumberViewProps; styles?: UiStyles }
  | { boolean: BooleanViewProps; styles?: UiStyles }
  | { date: DateViewProps; styles?: UiStyles }
  | { time: TimeViewProps; styles?: UiStyles }
  | { hidden: BaseViewProps; styles?: UiStyles };

type EditableViewProps = 
| { chevron: ChevronViewProps; styles?: UiStyles }
| { rowSelect: BaseViewProps; styles?: UiStyles }
| { button: ButtonViewProps; styles?: UiStyles }
| { checkbox: CheckboxViewProps; styles?: UiStyles }

type EditingViewProps =
  | { textInput: TextInputViewProps; styles?: UiStyles }
  | { numberInput: NumberInputViewProps; styles?: UiStyles }
  | { popup: PopupViewProps; styles?: UiStyles }
  | { timePicker: TimePickerViewProps; styles?: UiStyles }
  | { dropdown: DropdownViewProps; styles?: UiStyles }
  | { checkbox: CheckboxViewProps; styles?: UiStyles }
  

type DataColumnDict = {
  [key: string]: {
    id: string;
    //sqlText: string;
    //sqlTableHeader: SqlTableHeader;
    googleSheetHeader: GoogleSheetHeader | null;
    //toSqlConverter?: (value: string) => any;
    //toGoogleConverter?: (value: any) => string;
    columnDef?: DataColumnDefinition;
  };
};

type DataColumnDefinition = {
  id?: string;
  headerFunction?: HeaderFunctions;
  cell: CellView | null;
  enableSorting?: boolean;
  enableHiding?: boolean;
  viewable?: boolean;
};

type HeaderFunctions = "checkbox" | "sort";

type CellValueStatus = {
  needsAttention: boolean;
  hasError: boolean;
  isEditable: boolean;
  editing: boolean;
  isNull: boolean;
};

type ValueSpecifics =
  | { type: "text"; default: string }
  | { type: "number"; default: number }
  | { type: "date"; default: Date }
  | { type: "time"; default: string }
  | { type: "boolean"; default: boolean }
  | { type: "checkbox"; default: boolean };

type CellView = {
  view: {
    readOnly: ReadOnlyViewProps | false
    editable: {
      default: EditableViewProps;
      editing: EditingViewProps;
    } | false
    
  };
  value: ValueSpecifics & {
    nullable?: boolean;
    required?: boolean;
  };
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
  id: string;
  "Work Center": WorkCenter;
  "Job Number": string;
  "Customer": string;
  "Text": string;
  "Quantity": number;
  "Length": number;
  "Production Quantity": number;
  "Requested Ship Date": Date;
  "Requested Ship Time": string;
  "Set Up": number;
  "UPH": number;
  "Cut": CutColumn;
  "Extrusion": ExtrusionColumn;
  "Ground": GroundColumn;
  "Drawing": DrawingColumn;
  "Ends": EndsColumn;
  "Balance Quantity": number;
  "Priority": number;
  "Scheduled Start": Date;
  "Scheduled End": Date;
};

type ProductionScheduleData = ProductData;

type WorkCenterData = ProductData;

type LedgerData = {
  [key: string]: any;
  id: string;
  "Work Center": WorkCenter;
  "Date": Date;
  "Weekday": string;
  "Start": string;
  "End": string;
};

type WorkCenterScheduleData = {
  [key: string]: any;
  id: string;
  "Date / Weekday / Holiday": string;
  "UNASSIGNED": string;
  "SL 50": string;
  "SL 30": string;
  "Q": string;
  "Q2": string;
  "R": string;
  "A": string;
  "X": string;
  "SECT #1": string;
  "N": string;
  "H": string;
  "Long press": string;
  "Fabrication": string;
  "PVC": string;
  "PVC VG": string;
  "Punch press": string;
  "Loose BW": string;
  "Ready for inspection": string;
};

type WorkCenter =
  | "UNASSIGNED"
  | "SL 50"
  | "SL 30"
  | "Q"
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

// type string = {
//   hour: number;
//   minute: number;
// };

// type DaySchedule = {
//   start: string;
//   end: string;
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
//   start: string;
//   end: string;
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
//   requestedShipTime: string;
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
//   Date: string;
//   string: string;
//   datestring: string;
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

// type DatestringOptions = {
//   type: "date" | "time";
//   name: string;
//   format: string;
// };

// type UiType =
//   | "text"
//   | "textInput"
//   | "number"
//   | "chevron"
//   | "numberInput"
//   | "boolean"
//   | "checkbox"
//   | "date"
//   | "popup"
//   | "time"
//   | "timePicker"
//   | "dropdown"
//   | "button"
//   | "hidden";

// type CellStyle = {
//   readOnly: string;
//   editable: string;
//   editing: string;
//   null: string;
//   needsAttention: string;
//   error: string;
// };

// type OptionalCellStyles = {
//   readOnly?: string;
//   editable?: string;
//   editing?: string;
//   null?: string;
//   needsAttention?: string;
//   error?: string;
// };
