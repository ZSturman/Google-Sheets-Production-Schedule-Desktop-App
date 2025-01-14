export const workCentersList = [
  "SL 50",
  "SL 30",
  "Q",
  "R",
  "A",
  "X",
  "SECT #1",
  "Q2",
  "N",
  "H",
  "Long press",
  "Fabrication",
  "PVC",
  "PVC VG",
  "Punch press",
  "Loose BW",
  "Ready for inspection",
  "UNASSIGNED",
]  

export const workCenters = [
  "SL 50",
  "SL 30",
  "Q",
  "R",
  "A",
  "X",
  "SECT #1",
  "Q2",
  "N",
  "H",
  "Long press",
  "Fabrication",
  "PVC",
  "PVC VG",
  "Punch press",
  "Loose BW",
  "Ready for inspection",
  "UNASSIGNED",
]  as const;

// Define a type-safe union type of all work center names
type WorkCenter = typeof workCenters[number];

// Define a mapping object with keys as WorkCenter type
export const wsqlTableWorkCenterMapping: Record<WorkCenter, string> = {
  "SL 50": "SL_50",
  "SL 30": "SL_30",
  Q: "Quality",
  R: "Repair",
  A: "Assembly",
  X: "Experimental",
  "SECT #1": "Sect_1",
  Q2: "Q2",
  N: "N",
  H: "H",
  "Long press": "Long_Press",
  Fabrication: "Fabrication",
  PVC: "PVC",
  "PVC VG": "PVC_VG",
  "Punch press": "Punch_Press",
  "Loose BW": "Loose_BW",
  "Ready for inspection": "Ready_for_inspection",
  "UNASSIGNED": "UNASSIGNED",
};

type WorkCenterId = 
  | 'sl_50'
  | 'sl_30'
  | 'q'
  | 'r'
  | 'a'
  | 'x'
  | 'sect_1'
  | 'q2'
  | 'n'
  | 'h'
  | 'long_press'
  | 'fabrication'
  | 'pvc_processing'
  | 'pvc_vg'
  | 'punch_press'
  | 'loose_bw'
  | 'ready_for_inspection'
  | 'unassigned'

export const workCenterIdMapping: Record<WorkCenterId, typeof workCentersList[number]> = {
  sl_50: "SL 50",
  sl_30: "SL 30",
  q: "Q",
  r: "R",
  a: "A",
  x: "X",
  sect_1: "SECT #1",
  q2: "Q2",
  n: "N",
  h: "H",
  long_press: "Long press",
  fabrication: "Fabrication",
  pvc_processing: "PVC",
  pvc_vg: "PVC VG",
  punch_press: "Punch press",
  loose_bw: "Loose BW",
  ready_for_inspection: "Ready for inspection",
  unassigned: "UNASSIGNED",
};




export const endsOptions: EndsColumn[] = [
  "_",
  "Open",
  "End",
  "Lace",
  "Long"
]