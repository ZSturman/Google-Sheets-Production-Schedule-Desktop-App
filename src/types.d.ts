type LoadingState = "loading" | "error";


type GanttDays = {
  date: Date;
  opening: Date;
  closing: Date;
}

type GanttProductData = {
  start: Date;
  end: Date;
  due: Date;
  title: string;
  description: string;
  customer: string;
  balanceQuantity: number;
}

type GanttItem = {
  start: Date;
  end: Date;
  due: Date;
  title: string;
  description: string;
  customer: string;
  balanceQuantity: number;
}



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
type DateTimeViewProps = BaseViewProps & {
  format?: {
    delimiter?: "-" | "/" | " ";
    year: "YYYY" | "YY" | null;
    month: "MM" | "short" | "full" | null;
    day: "DD" | "short" | "full" | null;
    hour: "HH" | "hh" | null;
    minute: "mm" | null;
  };
};
type DateTimePickerViewProps = BaseViewProps & {
  date: {

    min?: Date;
    max?: Date;
    calendar?: "week" | "month" | "year";
  }
  time: {
    type?: "12" | "24";
    stepCount?: number;
    min?: number;
    max?: number;
  }
};

type PriorityViewProps = BaseViewProps & {};
type PopupViewProps = BaseViewProps & {
  content:
    | { calendar: DateTimePickerViewProps }
    | { priority: PriorityViewProps }
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
  | DateTimeViewProps
  | PopupViewProps
  | DropdownViewProps
  | ButtonViewProps
  | BaseViewProps;

type ReadOnlyViewProps =
  | { text: TextViewProps; styles?: UiStyles }
  | { number: NumberViewProps; styles?: UiStyles }
  | { boolean: BooleanViewProps; styles?: UiStyles }
  | { datetime: DateTimeViewProps; styles?: UiStyles }
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
  | { dropdown: DropdownViewProps; styles?: UiStyles }
  | { checkbox: CheckboxViewProps; styles?: UiStyles }
  

type DataColumnDict = {
  [key: string]: {
    id: string;
    //sqlText: string;
    //sqlTableHeader: SqlTableHeader;
    googleSheetHeader: GoogleSheetHeader | null;
    shortHeader?: string
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

type HeaderFunctions = "checkbox" | "sort" | "hidden"

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
  | { type: "datetime"; default: Date }
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
  "Requested Ship Date": Date;
  "Set Up": number;
  "UPH": number;
  "Cut": boolean
  "Extrusion": boolean
  "Ground": boolean;
  "Drawing": string;
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



type EndsColumn = "_" | "Open" | "Lace" | "End" | "Long"