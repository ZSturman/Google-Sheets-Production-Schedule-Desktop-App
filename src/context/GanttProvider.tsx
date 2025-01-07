// GanttProvider.tsx
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useData } from "./DataProvider";

import { useTab } from "./TabProvider";

import { defaultOnOffTime } from "../data/defaults";

type ViewMode = "day" | "week" | "month";

type GanttContextType = {
  ganttDays: GanttDays[];
  ganttProducts: GanttProductData[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};

const GanttContext = createContext<GanttContextType | undefined>(undefined);

type GanttProviderProps = {
  children: ReactNode;
};

export const GanttProvider = ({ children }: GanttProviderProps) => {
  const { state, loading, updatedAt } = useData();
  const { selectedTab } = useTab();

  const [ganttDays, setGanttDays] = useState<GanttDays[]>([]);
  const [ganttProducts, setGanttProducts] = useState<GanttProductData[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("week");

  const getWorkCenterHours = (
    workCenter: string,
    date: Date,
    schedules: WorkCenterScheduleData[]
  ): { open: Date; closing: Date } => {
    const day = date.toLocaleString("en-US", { weekday: "long" });

    const daySchedule = schedules.find(
      (item) => item.date_weekday_holiday === day
    );

    const normalizedWorkCenter = workCenter.replace(/\s+/g, "").toLowerCase();
    const normalizedScheduleKey = Object.keys(daySchedule || {}).find(
      (key) => key.replace(/\s+/g, "").toLowerCase() === normalizedWorkCenter
    );

    const workCenterSchedule =
      daySchedule && normalizedScheduleKey
        ? daySchedule[normalizedScheduleKey]
        : defaultOnOffTime;

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
            // Get the earliest and latest dates across start, end, and due
            const allDates = data.flatMap((row) => [
              new Date(row["scheduled_start"]),
              new Date(row["scheduled_end"]),
              new Date(row["requested_ship_date"]),
            ]);
            let minDate = new Date(
              Math.min(...allDates.map((d) => d.getTime()))
            );

            // If the current date is before the minDate, set it to minDate
            if (new Date() < minDate) {
              minDate = new Date();
            }

            let maxDate = new Date(
              Math.max(...allDates.map((d) => d.getTime()))
            );
            maxDate.setDate(maxDate.getDate() + 1);

            // Generate ganttDays
            const ganttDays: GanttDays[] = [];
            let currentDate = new Date(minDate);
            while (currentDate < maxDate) {
              const { open, closing } = getWorkCenterHours(
                selectedTab.name,
                currentDate,
                state.workCenterSchedules
              );

              ganttDays.push({
                date: new Date(currentDate),
                opening: new Date(open),
                closing: new Date(closing),
              });

              currentDate.setDate(currentDate.getDate() + 1);
            }

            // Generate ganttProducts
            const ganttProducts: GanttProductData[] = data.map((row) => ({
              start: new Date(row["scheduled_start"]),
              end: new Date(row["scheduled_end"]),
              due: new Date(row["requested_ship_date"]),
              title: row["job_number"],
              description: row["text"],
              customer: row["customer"],
              balanceQuantity: parseInt(row["balance_quantity"]),
            }));

            // Update state
            setGanttDays(ganttDays);
            setGanttProducts(ganttProducts);
          }
        } else {
          const data = state.products.sort((a, b) => {
            const aaPriority = parseInt(a["priority"]);
            const bbPriority = parseInt(b["priority"]);
            return aaPriority - bbPriority;
          });

          if (data.length > 0) {
            // Get the earliest and latest dates across start, end, and due
            const allDates = data.flatMap((row) => [
              new Date(row["scheduled_start"]),
              new Date(row["scheduled_end"]),
              new Date(row["requested_ship_date"]),
            ]);
            let minDate = new Date(
              Math.min(...allDates.map((d) => d.getTime()))
            );

            // If the current date is before the minDate, set it to minDate
            if (new Date() < minDate) {
              minDate = new Date();
            }

            let maxDate = new Date(
              Math.max(...allDates.map((d) => d.getTime()))
            );
            maxDate.setDate(maxDate.getDate() + 1);
            // Generate ganttDays
            const ganttDays: GanttDays[] = [];
            let currentDate = new Date(minDate);
            while (currentDate < maxDate) {
              const { open, closing } = getWorkCenterHours(
                selectedTab.name,
                currentDate,
                state.workCenterSchedules
              );

              ganttDays.push({
                date: new Date(currentDate),
                opening: new Date(open),
                closing: new Date(closing),
              });

              currentDate.setDate(currentDate.getDate() + 1);
            }

            // Generate ganttProducts
            const ganttProducts: GanttProductData[] = data.map((row) => ({
              start: new Date(row["scheduled_start"]),
              end: new Date(row["scheduled_end"]),
              due: new Date(row["requested_ship_date"]),
              title: row["job_number"],
              description: row["text"],
              customer: row["customer"],
              balanceQuantity: parseInt(row["balance_quantity"]),
            }));

            // Update state
            setGanttDays(ganttDays);
            setGanttProducts(ganttProducts);
          }
        }
      }
    }
  }, [state, selectedTab, updatedAt, loading]);

  return (
    <GanttContext.Provider
      value={{
        ganttDays,
        ganttProducts,
        viewMode,
        setViewMode,
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
