import { differenceInMinutes, isBefore, isAfter } from "date-fns";

interface TimelineItemProps {
  item: GanttProductData;
  dayStart: Date;
  dayEnd: Date;
}

export default function TimelineItem({ item, dayStart, dayEnd }: TimelineItemProps) {
  const getIndicatorPosition = (time: Date) => {
    const totalMinutes = differenceInMinutes(time, dayStart);
    const percentage = (totalMinutes / 1440) * 100; // 1440 = minutes in a day
    return `${percentage}%`;
  };

  // Ensure the scheduled_start time is within the day range
  const isVisible =
    isBefore(dayStart, item.start) && isAfter(dayEnd, item.start);

  if (!isVisible) {
    return null;
  }

  const indicatorPosition = getIndicatorPosition(item.start);

  return (
    <div className="relative h-full">
      {/* Single indicator for scheduled_start */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-blue-500 z-10"
        style={{ left: indicatorPosition }}
      />
      
    </div>
  );
}