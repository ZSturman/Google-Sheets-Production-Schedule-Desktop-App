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
  isAfter,
  areIntervalsOverlapping,
  Interval,
  min,
  max,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
} from "date-fns";

import { useTab } from "./TabProvider";

type ViewMode = "week" | "month";


type AsNumnbers = {
  notStarted: {
    onTime: number;
    late: number;
  };
  inProgress: {
    onTime: number;
    late: number;
  };
  completedBeforeDueDate: number;
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
            

              const minDate = new Date(Math.min(...validDates.map((date) => date.getTime())));
              const maxDate = new Date(Math.max(...validDates.map((date) => date.getTime())));
            

            // Calculate the number of weeks and months between min and max dates
            const numberOfWeeks = differenceInCalendarWeeks(maxDate, minDate);
            const numberOfMonths = differenceInCalendarMonths(maxDate, minDate);

            const weeks = numberOfWeeks >= 1 ? numberOfWeeks + 1 : 1;
            const months = numberOfMonths >= 1 ? numberOfMonths + 1 : 1;
            

            const adjustedMinDateForWeeks = startOfWeek(minDate, { weekStartsOn: 0 });
            const adjustedMinDateForMonths = startOfMonth(minDate);
            
            const weeksData: GanttPage[] = Array.from(
              { length: weeks },
              (_, i) => {
                const startDate = addWeeks(adjustedMinDateForWeeks, i);
                const endDate = endOfWeek(addWeeks(adjustedMinDateForWeeks, i), { weekStartsOn: 0 });
                const startAsNumber = 0;
                const endAsNumber = endDate.getTime() - startDate.getTime();
            
                // Include all products regardless of overlap
                const dataForPage = data.map((row) => ({
                  ...row,
                  dataStartDate: new Date(row["scheduled_start"]),
                  dataEndDate: new Date(row["scheduled_end"]),
                  dataDueDate: new Date(row["requested_ship_date"]),
                  ...getDatesAsNumbers(
                    {
                      asDate: { start: startDate, end: endDate },
                      asNumber: { start: startAsNumber, end: endAsNumber },
                    },
                    row
                  ),
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
            
            setWeeksData(weeksData);

            
            const monthsData: GanttPage[] = Array.from(
              { length: months },
              (_, i) => {
                const startDate = addMonths(adjustedMinDateForMonths, i);
                const endDate = endOfMonth(addMonths(adjustedMinDateForMonths, i));
                const startAsNumber = 0;
                const endAsNumber = endDate.getTime() - startDate.getTime();
            
                // Include all products regardless of overlap
                const dataForPage = data.map((row) => ({
                  ...row,
                  dataStartDate: new Date(row["scheduled_start"]),
                  dataEndDate: new Date(row["scheduled_end"]),
                  dataDueDate: new Date(row["requested_ship_date"]),
                  ...getDatesAsNumbers(
                    {
                      asDate: { start: startDate, end: endDate },
                      asNumber: { start: startAsNumber, end: endAsNumber },
                    },
                    row
                  ),
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



  const getDatesAsNumbers = (
    chart: {
      asDate: { start: Date; end: Date };
      asNumber: { start: number; end: number };
    },
    row: ProductData
  ): AsNumnbers => {
    const dataStartDate = new Date(row["scheduled_start"]);
    const dataEndDate = new Date(row["scheduled_end"]);
    const dataDueDate = new Date(row["requested_ship_date"]);

    // Helper function to calculate overlaps
    const calculateOverlap = (
      start1: Date,
      end1: Date,
      start2: Date,
      end2: Date
    ): number => {
      const interval1: Interval = { start: start1, end: end1 };
      const interval2: Interval = { start: start2, end: end2 };

      if (!areIntervalsOverlapping(interval1, interval2)) return 0;

      const overlapStart = max([start1, start2]);
      const overlapEnd = min([end1, end2]);

      return overlapEnd.getTime() - overlapStart.getTime();
    };

    // Calculate total chart duration
    const chartDuration =
      chart.asDate.end.getTime() - chart.asDate.start.getTime();

    // Calculate overlaps for the three categories
    const notStartedOverlap = calculateOverlap(
      chart.asDate.start,
      chart.asDate.end,
      chart.asDate.start,
      dataStartDate
    );
    const inProgressOverlap = calculateOverlap(
      chart.asDate.start,
      chart.asDate.end,
      dataStartDate,
      dataEndDate
    );
    const completedBeforeDueDateOverlap = calculateOverlap(
      chart.asDate.start,
      chart.asDate.end,
      dataEndDate,
      dataDueDate
    );

    // Normalize overlaps to chart duration
    const notStartedOnTime = notStartedOverlap / chartDuration;
    const notStartedLate =
      notStartedOverlap > 0 && isAfter(dataStartDate, dataDueDate)
        ? notStartedOverlap
        : 0;
    const inProgressOnTime = inProgressOverlap / chartDuration;
    const inProgressLate =
      inProgressOverlap > 0 && isAfter(dataEndDate, dataDueDate)
        ? inProgressOverlap
        : 0;
    const completedBeforeDueDate =
      completedBeforeDueDateOverlap / chartDuration;

    return {
      notStarted: {
        onTime: notStartedOnTime,
        late: notStartedLate,
      },
      inProgress: {
        onTime: inProgressOnTime,
        late: inProgressLate,
      },
      completedBeforeDueDate,
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
