import { ColumnDef } from "@tanstack/react-table";
import { v4 as uuidv4 } from 'uuid';

export const defaultNewProductsTableRow: ProductData = {
  id: uuidv4(),
  "Job Number": "",
  "Customer": "",
  "Text": "",
  "Quantity": 0,
  "Length": 0,
  "Production Quantity": 0,
  "Requested Ship Date": new Date(),
  "Requested Ship Time": "00:00",
  "Set Up": 120,
  "UPH": 10,
  "Cut": "_",
  "Extrusion": "_",
  "Ground": "_",
  "Drawing": "_",
  "Ends": "_",
  "Work Center": "UNASSIGNED",
  "Balance Quantity": 0,
  "Priority": 0,
  "Scheduled Start": new Date(),
  "Scheduled End": new Date(),
};

export const defaultColumnData: ColumnDef<DataRowT> = {
  accessorKey: "",
  id: uuidv4(),
  header: () => <span>Header</span>,
  cell: () => <span>Cell</span>,
  enableHiding: true,
  enableSorting: true,
};

export const getDefaultProductsRow = (): ProductData => ({
  id: uuidv4(),
  "Job Number": "PR123",
  "Customer": "Default Customer",
  "Text": "Sample product description",
  "Work Center": "UNASSIGNED" as WorkCenter,
  "Quantity": 10,
  "Length": 100,
  "Production Quantity": 10,
  "Balance Quantity": 0,
  "Requested Ship Date": new Date(),
  "Requested Ship Time":"00:00",
  "Set Up": 120,
  "UPH": 10,
  "Cut": "_" as CutColumn,
  "Extrusion": "_" as ExtrusionColumn,
  "Ground": "_" as GroundColumn,
  "Drawing": "_" as DrawingColumn,
  "Ends": "_" as EndsColumn,
  "Priority": 1,
  "Scheduled Start": new Date(),
  "Scheduled End": new Date(),
});




// export const getDefaultWorkCenterSchedulesRow = (): WorkCenterScheduleData => ({
//   id: uuidv4(),
//   "Date / Weekday / Holiday": "Monday",
//   "UNASSIGNED": "00:00-23:59",
//   "SL 50": "06:00-17:00",
//   "SL 30": "06:00-17:00",
//   "Q" : "06:00-17:00",
//   "Q2": "06:00-17:00",
//   "R": "06:00-17:00",
//   "A": "06:00-17:00",
//   "X": "06:00-17:00",
//   "SECT #1": "06:00-17:00",
//   "N": "06:00-17:00",
//   "H": "06:00-17:00",
//   "Long press": "06:00-17:00",
//   "Fabrication": "06:00-17:00",
//   "PVC": "06:00-17:00",
//   "PVC VG": "06:00-17:00",
//   "Punch press": "06:00-17:00",
//   "Loose BW": "06:00-17:00",
//   "Ready for inspection": "00:00-23:59",
// });

export const defaultOnOffTime = "06:00-17:00";

export const getDefaultWorkCenterSchedules = (): WorkCenterScheduleData[] => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return daysOfWeek.map((day) => ({
    id: uuidv4(),
    "Date / Weekday / Holiday": day,
    "UNASSIGNED": "00:00-23:59",
    "SL 50": "06:00-17:00",
    "SL 30": "06:00-17:00",
    "Q": "06:00-17:00",
    "Q2": "06:00-17:00",
    "R": "06:00-17:00",
    "A": "06:00-17:00",
    "X": "06:00-17:00",
    "SECT #1": "06:00-17:00",
    "N": "06:00-17:00",
    "H": "06:00-17:00",
    "Long press": "06:00-17:00",
    "Fabrication": "06:00-17:00",
    "PVC": "06:00-17:00",
    "PVC VG": "06:00-17:00",
    "Punch press": "06:00-17:00",
    "Loose BW": "06:00-17:00",
    "Ready for inspection": "00:00-23:59",
  }));
};


export const getDefaultLedgersRow = (): LedgerData => ({
  id: uuidv4(),
  "Work Center": "UNASSIGNED" as WorkCenter,
  "Date": new Date(),
  "Weekday": "Monday",
  "Start": "08:00",
  "End": "16:00",
  "Notes": "Sample ledger note",
  "On": 1,
});

export const defaultProductionScheduleRow: ProductData = {
  id: uuidv4(),
  "Job Number": "PR123",
  "Customer": "Default Customer",
  "Text": "Sample production description",
  "Work Center": "UNASSIGNED" as WorkCenter,
  "Quantity": 10,
  "Length": 100,
  "Production Quantity": 10,
  "Balance Quantity": 0,
  "Requested Ship Date": new Date(),
  "Requested Ship Time": "00:00",
  "Set Up": 120,
  "UPH": 10,
  "Cut": "_" as CutColumn,
  "Extrusion": "_" as ExtrusionColumn,
  "Ground": "_" as GroundColumn,
  "Drawing": "_" as DrawingColumn,
  "Ends": "_" as EndsColumn,
  "Priority": 1,
  "Scheduled Start": new Date(1970),
  "Scheduled End": new Date(9999, 11, 31),
};
