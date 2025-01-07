import { ColumnDef } from "@tanstack/react-table";
import { v4 as uuidv4 } from 'uuid';

export const defaultNewProductsTableRow: ProductData = {
  id: uuidv4(),
  "Job Number": "",
  "Customer": "",
  "Text": "",
  "Quantity": 0,
  "Length": 0,
  "Requested Ship Date": new Date(new Date().setDate(new Date().getDate() + 7)),
  "Set Up": 120,
  "UPH": 10,
  "Cut": false,
  "Extrusion": false,
  "Ground": false,
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
  "Balance Quantity": 1000,
  "Requested Ship Date": new Date(new Date().setDate(new Date().getDate() + 7)),
  "Set Up": 120,
  "UPH": 10,
  "Cut": false,
  "Extrusion": false,
  "Ground": false,
  "Drawing": "",
  "Ends": "_" as EndsColumn,
  "Priority": 1,
  "Scheduled Start": new Date(),
  "Scheduled End": new Date(),
});



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
  "Balance Quantity": 1000,
  "Requested Ship Date": new Date(),
  "Set Up": 120,
  "UPH": 10,
  "Cut": false,
  "Extrusion": false,
  "Ground": false,
  "Drawing": "",
  "Ends": "_" as EndsColumn,
  "Priority": 1,
  "Scheduled Start": new Date(),
  "Scheduled End": new Date(),
};


export const defaultTables = {
  ledgerTable: {
    sheetName: "Ledger",
    headers: [
      "Work Center",
      "Date",
      "Weekday",
      "Start",
      "End",
      "Notes",
      "On",
    ],
  },
  productsTable: {
    sheetName: "Products",
    headers: [
      "Job Number",
      "Customer",
      "Text",
      "Quantity",
      "Length",
      "Requested Ship Date",
      "Set Up",
      "UPH",
      "Cut",
      "Extrusion",
      "Ground",
      "Drawing",
      "Ends",
      "Work Center",
      "Balance Quantity",
      "Priority",
      "Scheduled Start",
      "Scheduled End",
    ],
  },
  workCenterSchedulesTable: {
    sheetName: "Work Center Schedules",
    headers: [
      "Date / Weekday / Holiday",
      "UNASSIGNED",
      "SL 50",
      "SL 30",
      "Q",
      "Q2",
      "R",
      "A",
      "X",
      "SECT #1",
      "N",
      "H",
      "Long press",
      "Fabrication",
      "PVC",
      "PVC VG",
      "Punch press",
      "Loose BW",
      "Ready for inspection",
    ],
  },
}