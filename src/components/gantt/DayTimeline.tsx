import { differenceInMinutes, startOfDay, isSameDay } from "date-fns";
//import TimelineItem from "./TimelineItem";
import { useGantt } from "../../context/GanttProvider";

interface DayTimelineProps {
  date: Date;
  items: GanttProductData[];
}

const generateTimeLabels = (interval = 2) => {
  const labels = [];
  for (let hour = 0; hour < 24; hour += interval) {
    const time = new Date(0, 0, 0, hour, 0);
    labels.push(
      time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    );
  }
  return labels;
};

const TimeGrid = () => {
  const timeLabels = generateTimeLabels();
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {timeLabels.map((label, index) => (
        <div
          key={index}
          className="text-xs text-gray-500 absolute"
          style={{ left: `${(index / 12) * 100}%` }}
        >
          {label}
        </div>
      ))}
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 border-l border-gray-300"
          style={{ left: `${(i / 24) * 100}%` }}
        />
      ))}
    </div>
  );
};

const WorkHours = ({ date }: { date: Date }) => {
  const { ganttDays } = useGantt();

  const day = ganttDays.find((day) => isSameDay(day.date, date));
  if (!day) return null;

  const { opening, closing } = day;

  const getPositionPercentage = (time: Date) => {
    const totalMinutes = time.getHours() * 60 + time.getMinutes();
    const percentage = (totalMinutes / (24 * 60)) * 100;
    return percentage;
  };

  const openingPosition = getPositionPercentage(opening);
  const closingPosition = getPositionPercentage(closing);

  // Ensure these styles don't affect item placement
  return (
    <div className="w-full h-full absolute top-0 left-0 pointer-events-none">
      <div
        className="absolute top-0 left-0 h-full bg-black opacity-10"
        style={{ width: `${openingPosition}%` }}
      />
      <div
        className="absolute top-0 left-0 h-full bg-black opacity-10"
        style={{
          left: `${closingPosition}%`,
          width: `${100 - closingPosition}%`,
        }}
      />
    </div>
  );
};

const CurrentTimeIndicator = ({ date }: { date: Date }) => {
  const now = new Date();

  // Check if the current time falls on the given date
  if (!isSameDay(now, date)) return null;

  const totalMinutes = differenceInMinutes(now, startOfDay(date));
  const percentage = (totalMinutes / 1440) * 100; // 1440 = minutes in a day


  return (
    <div
      className="absolute top-0 bottom-0 w-1 bg-red-500 z-10"
      style={{ left: `${percentage}%` }}
    />
  );
};

export default function DayTimeline({ date, items }: DayTimelineProps) {
  const dayStart = startOfDay(date);

  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
       <TimeGrid />
     <WorkHours date={date} />
      <CurrentTimeIndicator date={date} />

      {/* Debugging Timeline items */}
      {items.map((item, index) => (
        <div key={index} className="relative h-16">
          <TimelineItem item={item} dayStart={dayStart} />
        </div>
      ))}
    </div>
  );
}

const TimelineItem = ({
  item,
  dayStart,
}: {
  item: GanttProductData;
  dayStart: Date;
}) => {
  // Calculate positions for start, end, and due
  const calculatePercentage = (time: Date) => {
    const totalMinutes = differenceInMinutes(time, dayStart);
    return (totalMinutes / 1440) * 100; // 1440 minutes in a day
  };

  const startPercentage = calculatePercentage(item.start);
  const endPercentage = calculatePercentage(item.end);
  const duePercentage = calculatePercentage(item.due);

  return (
    <div className="relative h-full">
      {/* Combined bar from start to end */}
      <div
        className="absolute top-0 bottom-0 bg-blue-500 z-10 opacity-50"
        style={{
          left: `${startPercentage}%`,
          width: `${endPercentage - startPercentage}%`,
        }}
        title={`From ${item.start.toLocaleTimeString()} to ${item.end.toLocaleTimeString()}`}
      />

      {/* Due Indicator as a marker */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-yellow-500 z-20"
        style={{ left: `${duePercentage}%` }}
        title={`Due: ${item.due.toLocaleTimeString()}`}
      />

      {/* Optional Title */}
      <div className="absolute left-0 p-4">{item.title}</div>
    </div>
  );
};