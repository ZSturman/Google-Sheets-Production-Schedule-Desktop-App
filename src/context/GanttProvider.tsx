// GanttProvider.tsx
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useData } from "./DataProvider";
import {
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  addWeeks,
  addMonths,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
} from "date-fns";
import { useTab } from "./TabProvider";
import { workCentersList } from "../data/lists";
import { Button } from "../components/ui/button";

type ViewMode = "week" | "month";

type AsNumnbers = {
  notStartedOnTime: number;
  notStartedLate: number;
  inProgressOnTime: number;
  inProgressLate: number;
  completedBeforeDueDate: number;
  completedAfterDueDate: number;
  //dueIndicator: number
};

type GanttItem = ProductData &
  AsNumnbers & {
    dataStartDate: Date;
    dataEndDate: Date;
    dataDueDate: Date;
  };

type GanttPage = {
  startDate: Date;
  endDate: Date;
  startAsNumber: number;
  endAsNumber: number;
  data: GanttItem[];
};

type GanttContextType = {
  //ganttDays: GanttDays[];
  ganttProducts: ProductData[];
  viewMode: ViewMode;
  toggleViewMode: () => void;
  nextPage: () => void;
  prevPage: () => void;
  selectedPage: number;
  weeksData: GanttPage[];
  monthsData: GanttPage[];
  productionScheduleGanttOptions: () => ReactNode;
};

const GanttContext = createContext<GanttContextType | undefined>(undefined);

type GanttProviderProps = {
  children: ReactNode;
};

export const GanttProvider = ({ children }: GanttProviderProps) => {
  const { state, loading, updatedAt } = useData();
  const { selectedTab } = useTab();
  const [ganttProducts, setGanttProducts] = useState<ProductData[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [selectedPage, setSelectedPage] = useState<number>(0);
  const [weeksData, setWeeksData] = useState<GanttPage[]>([]);
  const [monthsData, setMonthsData] = useState<GanttPage[]>([]);
  const [showWorkCenter, setShowWorkCenter] = useState<WorkCenter[]>(workCentersList as WorkCenter[]);
  const [availableWorkCenters, setAvailableWorkCenters] = useState<WorkCenter[]>([]);

  useEffect(() => {
    if (!loading) {
      if (selectedTab) {
        if (selectedTab.isWorkCenter) {
          const data = state.products
            .filter((row) => row["work_center"] === selectedTab.name)
            .sort((a, b) => {
              const aaPriority = parseInt(a["priority"]);
              const bbPriority = parseInt(b["priority"]);
              return aaPriority - bbPriority;
            });

          if (data.length > 0) {
            setGanttProducts(data);

            // Update minDate and maxDate
            const dates: Date[] = data.flatMap((item) => [
              new Date(item["scheduled_start"]),
              new Date(item["scheduled_end"]),
              new Date(item["requested_ship_date"]),
            ]);

            // Filter out invalid dates
            const validDates = dates.filter((date) => !isNaN(date.getTime()));

            const minDate = new Date(
              Math.min(...validDates.map((date) => date.getTime()))
            );
            const maxDate = new Date(
              Math.max(...validDates.map((date) => date.getTime()))
            );

            // Calculate the number of weeks and months between min and max dates
            const numberOfWeeks = differenceInCalendarWeeks(maxDate, minDate);
            const numberOfMonths = differenceInCalendarMonths(maxDate, minDate);

            const weeks = numberOfWeeks >= 1 ? numberOfWeeks + 1 : 1;
            const months = numberOfMonths >= 1 ? numberOfMonths + 1 : 1;

            const adjustedMinDateForWeeks = startOfWeek(minDate, {
              weekStartsOn: 0,
            });
            const adjustedMinDateForMonths = startOfMonth(minDate);

            const weeksData: GanttPage[] = Array.from(
              { length: weeks },
              (_, i) => {
                const startDate = addWeeks(adjustedMinDateForWeeks, i);
                const endDate = endOfWeek(
                  addWeeks(adjustedMinDateForWeeks, i),
                  { weekStartsOn: 0 }
                );

                // Include all products regardless of overlap
                const dataForPage = data.map((row) => ({
                  ...row,
                  dataStartDate: new Date(row["scheduled_start"]),
                  dataEndDate: new Date(row["scheduled_end"]),
                  dataDueDate: new Date(row["requested_ship_date"]),
                  ...getDatesAsNumbers(
                    startDate,
                    endDate,

                    row
                  ),
                }));

                return {
                  startDate,
                  endDate,
                  startAsNumber: startDate.getTime(),
                  endAsNumber: endDate.getTime(),
                  data: dataForPage,
                  labels: [],
                };
              }
            );

            setWeeksData(weeksData);

            const monthsData: GanttPage[] = Array.from(
              { length: months },
              (_, i) => {
                const startDate = addMonths(adjustedMinDateForMonths, i);
                const endDate = endOfMonth(
                  addMonths(adjustedMinDateForMonths, i)
                );
                const startAsNumber = 0;
                const endAsNumber = endDate.getTime() - startDate.getTime();

                // Include all products regardless of overlap
                const dataForPage = data.map((row) => ({
                  ...row,
                  dataStartDate: new Date(row["scheduled_start"]),
                  dataEndDate: new Date(row["scheduled_end"]),
                  dataDueDate: new Date(row["requested_ship_date"]),
                  ...getDatesAsNumbers(startDate, endDate, row),
                }));

                return {
                  startDate,
                  endDate,
                  startAsNumber,
                  endAsNumber,
                  data: dataForPage,
                };
              }
            );

            setMonthsData(monthsData);
          }
        } else {
          const data = state.products
   
          .sort((a, b) => {
            const aaPriority = parseInt(a["priority"]);
            const bbPriority = parseInt(b["priority"]);
            return aaPriority - bbPriority;
          });

          if (data.length > 0) {
            setGanttProducts(data);

            const availWorkCenters = data.map((row) => row["work_center"]);
            const uniqueWorkCenters = [...new Set(availWorkCenters)];
            setAvailableWorkCenters(uniqueWorkCenters);


            // Update minDate and maxDate
            const dates: Date[] = data.flatMap((item) => [
              new Date(item["scheduled_start"]),
              new Date(item["scheduled_end"]),
              new Date(item["requested_ship_date"]),
            ]);

            // Filter out invalid dates
            const validDates = dates.filter((date) => !isNaN(date.getTime()));

            const minDate = new Date(
              Math.min(...validDates.map((date) => date.getTime()))
            );
            const maxDate = new Date(
              Math.max(...validDates.map((date) => date.getTime()))
            );

            // Calculate the number of weeks and months between min and max dates
            const numberOfWeeks = differenceInCalendarWeeks(maxDate, minDate);
            const numberOfMonths = differenceInCalendarMonths(maxDate, minDate);

            const weeks = numberOfWeeks >= 1 ? numberOfWeeks + 1 : 1;
            const months = numberOfMonths >= 1 ? numberOfMonths + 1 : 1;

            const adjustedMinDateForWeeks = startOfWeek(minDate, {
              weekStartsOn: 0,
            });
            const adjustedMinDateForMonths = startOfMonth(minDate);

            const weeksData: GanttPage[] = Array.from(
              { length: weeks },
              (_, i) => {
                const startDate = addWeeks(adjustedMinDateForWeeks, i);
                const endDate = endOfWeek(
                  addWeeks(adjustedMinDateForWeeks, i),
                  { weekStartsOn: 0 }
                );

                // Include all products regardless of overlap
                const dataForPage = data.map((row) => ({
                  ...row,
                  dataStartDate: new Date(row["scheduled_start"]),
                  dataEndDate: new Date(row["scheduled_end"]),
                  dataDueDate: new Date(row["requested_ship_date"]),
                  ...getDatesAsNumbers(
                    startDate,
                    endDate,

                    row
                  ),
                }));

                return {
                  startDate,
                  endDate,
                  startAsNumber: startDate.getTime(),
                  endAsNumber: endDate.getTime(),
                  data: dataForPage,
                  labels: [],
                };
              }
            );

            setWeeksData(weeksData);

            const monthsData: GanttPage[] = Array.from(
              { length: months },
              (_, i) => {
                const startDate = addMonths(adjustedMinDateForMonths, i);
                const endDate = endOfMonth(
                  addMonths(adjustedMinDateForMonths, i)
                );
                const startAsNumber = 0;
                const endAsNumber = endDate.getTime() - startDate.getTime();

                // Include all products regardless of overlap
                const dataForPage = data.map((row) => ({
                  ...row,
                  dataStartDate: new Date(row["scheduled_start"]),
                  dataEndDate: new Date(row["scheduled_end"]),
                  dataDueDate: new Date(row["requested_ship_date"]),
                  ...getDatesAsNumbers(startDate, endDate, row),
                }));

                return {
                  startDate,
                  endDate,
                  startAsNumber,
                  endAsNumber,
                  data: dataForPage,
                };
              }
            );

            setMonthsData(monthsData);
          }
        }
      }
    }
  }, [state, selectedTab, updatedAt, loading]);

  const productionScheduleGanttOptions = () => {
    if (selectedTab.name !== "Production Schedule") return null

    const onWorkCenterClick = (workCenter: WorkCenter) => {
      if (showWorkCenter.includes(workCenter)) {
        setShowWorkCenter((prev) => prev.filter((wc) => wc !== workCenter));
      } else {
        setShowWorkCenter((prev) => [...prev, workCenter]);
      }
    }
    return (
      <div className="flex flex-row pb-1 gap-1">
        {availableWorkCenters.map((workCenter) => (
          <Button key={workCenter} onClick={() => onWorkCenterClick(workCenter)} className={`${showWorkCenter.includes(workCenter) ? "bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white" : "bg-white border-zinc-800 border-2 text-black hover:bg-zinc-800 hover:text-white"}`}>
            <h2>{workCenter}</h2>
          </Button>
        ))}
      </div>
    );
  };

  enum DataDates {
    start,
    end,
    due,
    chartStart,
    chartEnd,
  }

  const getDatesAsNumbers = (
    chartStart: Date,
    chartEnd: Date,
    row: ProductData
  ): AsNumnbers => {
    const dataDates = [
      {
        id: DataDates.start,
        date: new Date(row["scheduled_start"]),
        number: new Date(row["scheduled_start"]).getTime(),
      },
      {
        id: DataDates.end,
        date: new Date(row["scheduled_end"]),
        number: new Date(row["scheduled_end"]).getTime(),
      },
      {
        id: DataDates.due,
        date: new Date(row["requested_ship_date"]),
        number: new Date(row["requested_ship_date"]).getTime(),
      },
      {
        id: DataDates.chartStart,
        date: chartStart,
        number: chartStart.getTime(),
      },
      {
        id: DataDates.chartEnd,
        date: chartEnd,
        number: chartEnd.getTime(),
      },
    ];

    // Sort the dates in an array
    dataDates.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Find the index of dataDates.id = DataDates.chartStart and DataDates.chartEnd
    const cs = dataDates.findIndex((date) => date.id === DataDates.chartStart);
    const ce = dataDates.findIndex((date) => date.id === DataDates.chartEnd);
    const ds = dataDates.findIndex((date) => date.id === DataDates.start);
    const de = dataDates.findIndex((date) => date.id === DataDates.end);
    const dd = dataDates.findIndex((date) => date.id === DataDates.due);

    if (cs === -1 || ce === -1) {
      throw new Error("Chart start or end date not found");
    }

    if (cs > ce) {
      throw new Error("Chart start date is after chart end date");
    }

    if (cs === ce) {
      throw new Error("Chart start date is the same as chart end date");
    }

    if (ds === -1 || de === -1 || dd === -1) {
      throw new Error("Data start, end or due date not found");
    }

    if (ds > de) {
      throw new Error("Data start date is after data end date");
    }

    const total_chart_width = dataDates[ce].number - dataDates[cs].number;
    //const dueIndicatorWidth = total_chart_width * 0.05;
    const dueIndicatorWidth = 0;

    // cs, ce, dx, dx, dx
    if (cs === 0 && ce === 1) {
      return {
        notStartedOnTime: total_chart_width,
        notStartedLate: 0,
        inProgressOnTime: 0,
        inProgressLate: 0,
        completedBeforeDueDate: 0,
        completedAfterDueDate: 0,
        //         dueIndicator: 0,
      };
    }

    // dx, dx, dx, cs, ce
    if (cs === 3 && ce === 4) {
      return {
        notStartedOnTime: 0,
        notStartedLate: 0,
        inProgressOnTime: 0,
        inProgressLate: 0,
        completedBeforeDueDate: 0,
        completedAfterDueDate: total_chart_width,
        // dueIndicator: 0,
      };
    }

    // cs, ds, ce
    if (cs === 0 && ds === 1 && ce === 2) {
      return {
        notStartedOnTime: dataDates[1].number - dataDates[0].number,
        notStartedLate: 0,
        inProgressOnTime: dataDates[2].number - dataDates[1].number,
        inProgressLate: 0,
        completedBeforeDueDate: 0,
        completedAfterDueDate: 0,
        // dueIndicator: 0
      };
    }
    // cs, ds, de, ce
    if (cs === 0 && ds === 1 && de === 2 && ce === 3) {
      return {
        notStartedOnTime: dataDates[1].number - dataDates[0].number,
        notStartedLate: 0,
        inProgressOnTime: dataDates[2].number - dataDates[1].number,
        inProgressLate: 0,
        completedBeforeDueDate: dataDates[3].number - dataDates[2].number,
        completedAfterDueDate: 0,
        // dueIndicator: 0,
      };
    }

    // cs, ds, de, dd, ce
    if (cs === 0 && ds === 1 && de === 2 && dd === 3 && ce === 4) {
      return {
        notStartedOnTime: dataDates[1].number - dataDates[0].number,
        notStartedLate: 0,
        inProgressOnTime: dataDates[2].number - dataDates[1].number,
        inProgressLate: 0,
        completedBeforeDueDate: dataDates[3].number - dataDates[2].number,
        completedAfterDueDate:
          dataDates[4].number - dataDates[3].number - dueIndicatorWidth,
        // dueIndicator: dueIndicatorWidth
      };
    }
    // cs, ds, dd, ce
    if (cs === 0 && ds === 1 && dd === 2 && ce === 3) {
      return {
        notStartedOnTime: dataDates[1].number - dataDates[0].number,
        notStartedLate: 0,
        inProgressOnTime:
          dataDates[2].number - dataDates[1].number - dueIndicatorWidth,
        inProgressLate: dataDates[3].number - dataDates[2].number,
        completedBeforeDueDate: 0,
        completedAfterDueDate: 0,
        // dueIndicator: dueIndicatorWidth
      };
    }
    // cs, ds, dd, de, ce
    if (cs === 0 && ds === 1 && dd === 2 && de === 3 && ce === 4) {
      return {
        notStartedOnTime: dataDates[1].number - dataDates[0].number,
        notStartedLate: 0,
        inProgressOnTime:
          dataDates[2].number - dataDates[1].number - dueIndicatorWidth,
        inProgressLate: dataDates[3].number - dataDates[2].number,
        completedBeforeDueDate: 0,
        completedAfterDueDate: dataDates[4].number - dataDates[3].number,
        // dueIndicator: dueIndicatorWidth
      };
    }

    // cs, dd, ce
    if (cs === 0 && dd === 1 && ce === 2) {
      return {
        notStartedOnTime: dataDates[1].number - dataDates[0].number,
        notStartedLate:
          dataDates[2].number - dataDates[1].number - dueIndicatorWidth,
        inProgressOnTime: 0,
        inProgressLate: 0,
        completedBeforeDueDate: 0,
        completedAfterDueDate: 0,
        // dueIndicator: dueIndicatorWidth
      };
    }

    // cs, dd, ds, ce
    if (cs === 0 && dd === 1 && ds === 2 && ce === 3) {
      return {
        notStartedOnTime:
          dataDates[1].number - dataDates[0].number - dueIndicatorWidth,
        notStartedLate: dataDates[2].number - dataDates[1].number,
        inProgressOnTime: 0,
        inProgressLate: dataDates[3].number - dataDates[2].number,
        completedBeforeDueDate: 0,
        completedAfterDueDate: 0,
        // dueIndicator: dueIndicatorWidth
      };
    }

    // cs, dd, ds, de, ce
    if (cs === 0 && dd === 1 && ds === 2 && de === 3 && ce === 4) {
      return {
        notStartedOnTime:
          dataDates[1].number - dataDates[0].number - dueIndicatorWidth,
        notStartedLate: dataDates[2].number - dataDates[1].number,
        inProgressOnTime: 0,
        inProgressLate: dataDates[3].number - dataDates[2].number,
        completedBeforeDueDate: 0,
        completedAfterDueDate: dataDates[4].number - dataDates[3].number,
        // dueIndicator: dueIndicatorWidth
      };
    }

    // ds, cs, ce
    if (ds === 0 && cs === 1 && ce === 2) {
      return {
        notStartedOnTime: 0,
        notStartedLate: 0,
        inProgressOnTime: total_chart_width,
        inProgressLate: 0,
        completedBeforeDueDate: 0,
        completedAfterDueDate: 0,
        // dueIndicator: 0
      };
    }
    // ds, cs, dd, ce
    if (ds === 0 && cs === 1 && dd === 2 && ce === 3) {
      return {
        notStartedOnTime: 0,
        notStartedLate: 0,
        inProgressOnTime: dataDates[2].number - dataDates[1].number,
        inProgressLate:
          dataDates[3].number - dataDates[2].number - dueIndicatorWidth,
        completedBeforeDueDate: 0,
        completedAfterDueDate: 0,
        // dueIndicator: dueIndicatorWidth
      };
    }
    // ds, cs, dd, de, ce
    if (ds === 0 && cs === 1 && dd === 2 && de === 3 && ce === 4) {
      return {
        notStartedOnTime: 0,
        notStartedLate: 0,
        inProgressOnTime: dataDates[2].number - dataDates[1].number,
        inProgressLate:
          dataDates[3].number - dataDates[2].number - dueIndicatorWidth,
        completedBeforeDueDate: 0,
        completedAfterDueDate: dataDates[4].number - dataDates[3].number,
        // dueIndicator: dueIndicatorWidth
      };
    }
    // ds, cs, de, ce
    if (ds === 0 && cs === 1 && de === 2 && ce === 3) {
      return {
        notStartedOnTime: 0,
        notStartedLate: 0,
        inProgressOnTime: dataDates[2].number - dataDates[1].number,
        inProgressLate: 0,
        completedBeforeDueDate: dataDates[3].number - dataDates[2].number,
        completedAfterDueDate: 0,
        // dueIndicator: 0
      };
    }
    // ds, cs, de, dd, ce
    if (ds === 0 && cs === 1 && de === 2 && dd === 3 && ce === 4) {
      return {
        notStartedOnTime: 0,
        notStartedLate: 0,
        inProgressOnTime: dataDates[2].number - dataDates[1].number,
        inProgressLate: 0,
        completedBeforeDueDate: dataDates[3].number - dataDates[2].number,
        completedAfterDueDate:
          dataDates[4].number - dataDates[3].number - dueIndicatorWidth,
        // dueIndicator: dueIndicatorWidth
      };
    }

    // ds, de, cs, ce
    if (ds === 0 && de === 1 && cs === 2 && ce === 3) {
      return {
        notStartedOnTime: 0,
        notStartedLate: 0,
        inProgressOnTime: 0,
        inProgressLate: 0,
        completedBeforeDueDate: dataDates[3].number - dataDates[2].number,
        completedAfterDueDate: 0,
        // dueIndicator: 0
      };
    }
    // ds, de, cs, dd, ce
    if (ds === 0 && de === 1 && cs === 2 && dd === 3 && ce === 4) {
      return {
        notStartedOnTime: 0,
        notStartedLate: 0,
        inProgressOnTime: 0,
        inProgressLate: 0,
        completedBeforeDueDate: dataDates[3].number - dataDates[2].number,
        completedAfterDueDate:
          dataDates[4].number - dataDates[3].number - dueIndicatorWidth,
        // dueIndicator: dueIndicatorWidth
      };
    }
    // ds, dd, cs, ce
    if (ds === 0 && dd === 1 && cs === 2 && ce === 3) {
      return {
        notStartedOnTime: 0,
        notStartedLate: 0,
        inProgressOnTime: 0,
        inProgressLate: total_chart_width,
        completedBeforeDueDate: 0,
        completedAfterDueDate: 0,
        // dueIndicator: 0
      };
    }
    // ds, dd, cs, de, ce
    if (ds === 0 && dd === 1 && cs === 2 && de === 3 && ce === 4) {
      return {
        notStartedOnTime: 0,
        notStartedLate: 0,
        inProgressOnTime: 0,
        inProgressLate: dataDates[3].number - dataDates[2].number,
        completedBeforeDueDate: 0,
        completedAfterDueDate: dataDates[4].number - dataDates[3].number,
        // dueIndicator: 0
      };
    }

    // dd, cs, ce
    if (dd === 0 && cs === 1 && ce === 2) {
      return {
        notStartedOnTime: 0,
        notStartedLate: total_chart_width,
        inProgressOnTime: 0,
        inProgressLate: 0,
        completedBeforeDueDate: 0,
        completedAfterDueDate: 0,
        // dueIndicator: 0
      };
    }
    // dd, cs, ds, ce
    if (dd === 0 && cs === 1 && ds === 2 && ce === 3) {
      return {
        notStartedOnTime: 0,
        notStartedLate: dataDates[2].number - dataDates[1].number,
        inProgressOnTime: 0,
        inProgressLate: dataDates[3].number - dataDates[2].number,
        completedBeforeDueDate: 0,
        completedAfterDueDate: 0,
        // dueIndicator: 0
      };
    }
    // dd, cs, ds, de, ce
    if (dd === 0 && cs === 1 && ds === 2 && de === 3 && ce === 4) {
      return {
        notStartedOnTime: 0,
        notStartedLate: dataDates[2].number - dataDates[1].number,
        inProgressOnTime: 0,
        inProgressLate: dataDates[3].number - dataDates[2].number,
        completedBeforeDueDate: 0,
        completedAfterDueDate: dataDates[4].number - dataDates[3].number,
        // dueIndicator: 0
      };
    }
    // dd, ds, cs, ce
    if (dd === 0 && ds === 1 && cs === 2 && ce === 3) {
      return {
        notStartedOnTime: 0,
        notStartedLate: 0,
        inProgressOnTime: 0,
        inProgressLate: total_chart_width,
        completedBeforeDueDate: 0,
        completedAfterDueDate: 0,
        // dueIndicator: 0
      };
    }
    // dd, ds, cs, de, ce
    if (dd === 0 && ds === 1 && cs === 2 && de === 3 && ce === 4) {
      return {
        notStartedOnTime: 0,
        notStartedLate: 0,
        inProgressOnTime: 0,
        inProgressLate: dataDates[3].number - dataDates[2].number,
        completedBeforeDueDate: 0,
        completedAfterDueDate: dataDates[4].number - dataDates[3].number,
        // dueIndicator: 0
      };
    }

    console.log("dd", dd, "ds", ds, "de", de, "cs", cs, "ce", ce);
    return {
      notStartedOnTime: 0,
      notStartedLate: 0,
      inProgressOnTime: 0,
      inProgressLate: 0,
      completedBeforeDueDate: 0,
      completedAfterDueDate: 0,
      // dueIndicator: 0
    };
  };
  const nextPage = () => {
    setSelectedPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setSelectedPage((prev) => prev - 1);
  };

  const toggleViewMode = () => {
    setSelectedPage(0);
    setViewMode((prev) => (prev === "week" ? "month" : "week"));
  };

  return (
    <GanttContext.Provider
      value={{
        //ganttDays,
        ganttProducts,
        viewMode,
        toggleViewMode,
        nextPage,
        prevPage,
        selectedPage,
        weeksData,
        monthsData,
        productionScheduleGanttOptions
      }}
    >
      {children}
    </GanttContext.Provider>
  );
};

export const useGantt = () => {
  const context = useContext(GanttContext);
  if (!context) {
    throw new Error("useTable must be used within a GanttProvider");
  }
  return context;
};
