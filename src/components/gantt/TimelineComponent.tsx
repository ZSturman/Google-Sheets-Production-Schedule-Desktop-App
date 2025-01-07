import { useState, useMemo } from "react";
import {
  format,
  isSameDay,
  isSameWeek,
  isSameMonth,
  startOfDay,
  startOfWeek,
  startOfMonth,
  addWeeks,
  addMonths,
  subWeeks,
  subMonths,
} from "date-fns";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DayTimeline from "./DayTimeline";
import { useGantt } from "../../context/GanttProvider";
import WeekTimeline from "./WeekTimeline";
import MonthTimeline from "./MonthTimeline";

export default function TimelineComponent() {
  const { ganttProducts, ganttDays, viewMode, setViewMode } = useGantt();

  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate sorted dates based on the view mode
  const sortedDates = useMemo(() => {
    const allDates = ganttDays.map((day) => day.date);
    const uniqueDates = [...new Set(allDates.map((date) => startOfDay(date).getTime()))]
      .sort((a, b) => a - b)
      .map((timestamp) => new Date(timestamp));

    // Extend sortedDates logic to handle weekly and monthly intervals
    if (viewMode === "week") {
      const weeks = uniqueDates.map((date) => startOfWeek(date));
      return [...new Set(weeks.map((date) => date.getTime()))]
        .sort((a, b) => a - b)
        .map((timestamp) => new Date(timestamp));
    }

    if (viewMode === "month") {
      const months = uniqueDates.map((date) => startOfMonth(date));
      return [...new Set(months.map((date) => date.getTime()))]
        .sort((a, b) => a - b)
        .map((timestamp) => new Date(timestamp));
    }

    return uniqueDates;
  }, [ganttDays, viewMode]);

  const currentDateIndex = sortedDates.findIndex((date) => {
    if (viewMode === "day") return isSameDay(date, currentDate);
    if (viewMode === "week") return isSameWeek(date, currentDate);
    if (viewMode === "month") return isSameMonth(date, currentDate);
    return false;
  });

  const goToPrevious = () => {
    if (currentDateIndex > 0) {
      setCurrentDate(sortedDates[currentDateIndex - 1]);
    } else if (viewMode === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (currentDateIndex < sortedDates.length - 1) {
      setCurrentDate(sortedDates[currentDateIndex + 1]);
    } else if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button onClick={() => setViewMode("day")} disabled={viewMode === "day"}>
            Day
          </Button>
          <Button onClick={() => setViewMode("week")} disabled={viewMode === "week"}>
            Week
          </Button>
          <Button onClick={() => setViewMode("month")} disabled={viewMode === "month"}>
            Month
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center mb-4">
        <div className="flex gap-2">
          <Button onClick={goToPrevious} disabled={currentDateIndex <= 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <h2 className="text-xl font-bold">
            {viewMode === "day"
              ? format(currentDate, "EEEE, MMMM d, yyyy")
              : viewMode === "week"
              ? `Week of ${format(startOfWeek(currentDate), "MMMM d, yyyy")}`
              : format(currentDate, "MMMM yyyy")}
          </h2>
          <Button
            onClick={goToNext}
            disabled={currentDateIndex === sortedDates.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {viewMode === "day" && <DayTimeline date={currentDate} items={ganttProducts} />}
      {viewMode === "week" && <WeekTimeline date={currentDate} items={ganttProducts} />}
      {viewMode === "month" && <MonthTimeline date={currentDate} items={ganttProducts} />}
    </div>
  );
}