import { useState, useMemo } from "react";
import { format, isSameDay, startOfDay, endOfDay } from "date-fns";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DayTimeline from "./DayTimeline";
import { useGantt } from "../../context/GanttProvider";

export default function TimelineComponent() {
  const { ganttProducts, ganttDays } = useGantt();

  const [currentDate, setCurrentDate] = useState(new Date());

  // const sortedDates = useMemo(() => {
  //   const allDates = ganttProducts.flatMap(item => [item.start, item.end, item.due])
  //   return [...new Set(allDates.map(date => startOfDay(date).getTime()))]
  //     .sort((a, b) => a - b)
  //     .map(timestamp => new Date(timestamp))
  // }, [ganttProducts])

  const sortedDates = useMemo(() => {
    const allDates = ganttDays.map((day) => day.date);
    return [...new Set(allDates.map((date) => startOfDay(date).getTime()))]
      .sort((a, b) => a - b)
      .map((timestamp) => new Date(timestamp));
  }, [ganttDays]);

  const currentDateIndex = sortedDates.findIndex((date) =>
    isSameDay(date, currentDate)
  );



  const goToPreviousDay = () => {
    if (currentDateIndex > 0) {
      setCurrentDate(sortedDates[currentDateIndex - 1]);
    }
  };

  const goToNextDay = () => {
    if (currentDateIndex < sortedDates.length - 1) {
      setCurrentDate(sortedDates[currentDateIndex + 1]);
    }
  };

  return (
    <div className="w-full  mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={goToPreviousDay} disabled={currentDateIndex <= 0}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Day
        </Button>
        <h2 className="text-xl font-bold">
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </h2>
        <Button
          onClick={goToNextDay}
          disabled={currentDateIndex === sortedDates.length - 1}
        >
          Next Day
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      <DayTimeline date={currentDate} items={ganttProducts} />
    </div>
  );
}
