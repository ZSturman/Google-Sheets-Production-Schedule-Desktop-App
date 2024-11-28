import { removeAllWhiteSpace } from "./regexFuncs";
import { toTimeRange, timeRangeToString } from "./time";
// Function to generate the columnDict dynamically
const generateColumnDict = (workCenters: string[]) => {
    return workCenters.reduce((dict, center) => {
      const key = removeAllWhiteSpace(center)
      dict[key] = {
        sqlText: "TEXT",
        sqlTableHeader: key,
        googleSheetHeader: center,
        toSqlConverter: toTimeRange,
        toGoogleConverter: timeRangeToString,
        columnDef: {},
      };
      return dict;
    }, {} as DataColumnDict);
  };

  export { generateColumnDict };