// GanttProvider.tsx
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState
} from "react";
import { useData } from "./DataProvider";

import { useTab } from "./TabProvider";

import { defaultOnOffTime } from "../data/defaults";

type GanttDays = {
  date: Date;
  opening: Date;
  closing: Date;
}


type GanttContextType = {
  ganttDays: GanttDays[];
  ganttProducts: ProductData[]
};

const GanttContext = createContext<GanttContextType | undefined>(undefined);

type GanttProviderProps = {
  children: ReactNode;
};

export const GanttProvider = ({ children }: GanttProviderProps) => {
  const { state, loading, updatedAt } = useData();
  const { selectedTab } = useTab();

  const [ganttDays, setGanttDays] = useState<GanttDays[]>([]);
  const [ganttProducts, setGanttProducts] = useState<ProductData[]>([]);




  const getWorkCenterHours = (
    workCenter: string,
    date: Date,
    schedules: WorkCenterScheduleData[]
  ): { open: Date; closing: Date } => {
    console.log("Getting work center closing time...");
    const day = date.toLocaleString("en-US", { weekday: "long" });

    const daySchedule = schedules.find(
      (item) => item.date_weekday_holiday === day
    );
    console.log("Day schedule:", daySchedule);

    const normalizedWorkCenter = workCenter.replace(/\s+/g, "").toLowerCase();
    const normalizedScheduleKey = Object.keys(daySchedule || {}).find(
      (key) => key.replace(/\s+/g, "").toLowerCase() === normalizedWorkCenter
    );

    const workCenterSchedule =
      daySchedule && normalizedScheduleKey
        ? daySchedule[normalizedScheduleKey]
        : defaultOnOffTime;

    console.log("Work center schedule:", workCenterSchedule);

    const [openTime, closeTime] = workCenterSchedule.split("-");
    const openingDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(openTime.slice(0, 2)),
      parseInt(openTime.slice(3, 5))
    );
    const closingDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(closeTime.slice(0, 2)),
      parseInt(closeTime.slice(3, 5))
    );

    return { open: openingDate, closing: closingDate };
  };

  useEffect(() => {
    if (!loading) {
      if (selectedTab && selectedTab.isWorkCenter) {
        const data = state.products
          .filter((row) => row["work_center"] === selectedTab.name)
          .sort((a, b) => {
            const aaPriority = parseInt(a["priority"]);
            const bbPriority = parseInt(b["priority"]);
            if (aaPriority < bbPriority) {
              return -1;
            }
            if (aaPriority > bbPriority) {
              return 1;
            }
            return 0;
          });

        if (data.length > 0) {
          const firstRow = data[0];
          const lastRow = data[data.length - 1];

          const firstRowScheduledStart = new Date(firstRow["scheduled_start"]);
          const lastRowScheduledEnd = new Date(lastRow["scheduled_end"]);

          const ganttDays: GanttDays[] = [];
         let currentDate = new Date(firstRowScheduledStart); 
          while (currentDate <= lastRowScheduledEnd) {
            const { open, closing } = getWorkCenterHours(
              selectedTab.name,
              currentDate,
              state.workCenterSchedules
            );

            ganttDays.push({
              date: new Date(currentDate),
              opening: new Date(open),
              closing: new Date(closing)
            });

            currentDate.setDate(currentDate.getDate() + 1);
          }

            setGanttDays(ganttDays);
            setGanttProducts(data);
        }
      }
    }
  }, [state, selectedTab, updatedAt, loading]);

  return <GanttContext.Provider value={{
    ganttDays,
    ganttProducts
  }}>{children}</GanttContext.Provider>;
};

export const useGantt = () => {
  const context = useContext(GanttContext);
  if (!context) {
    throw new Error("useTable must be used within a GanttProvider");
  }
  return context;
};
