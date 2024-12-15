// import {
//   format,
//   differenceInMinutes,
//   startOfDay,
//   endOfDay,
//   isSameDay,
// } from "date-fns";
// import TimelineItem from "./TimelineItem";
// import { useGantt } from "../../context/GanttProvider";

// interface DayTimelineProps {
//   date: Date;
//   items: GanttProductData[];
// }

// const generateTimeLabels = (interval = 2) => {
//   const labels = [];
//   for (let hour = 0; hour < 24; hour += interval) {
//     const time = new Date(0, 0, 0, hour, 0);
//     labels.push(
//       time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
//     );
//   }
//   return labels;
// };

// // Component for rendering the time grid
// const TimeGrid = () => {
//   const timeLabels = generateTimeLabels();
//   return (
//     <div className="absolute top-0 left-0 w-full h-full opacity-50 grid grid-cols-12">
//       {timeLabels.map((label, index) => (
//         <div key={index} className="text-xs">
//           {label}
//         </div>
//       ))}
//       {Array.from({ length: 25 }).map((_, i) => (
//         <div
//           key={i}
//           className="absolute top-0 bottom-0 border-l border-gray-300"
//           style={{ left: `${(i / 24) * 100}%` }}
//         />
//       ))}
//     </div>
//   );
// };

// const WorkHours = ({ date }: { date: Date }) => {
//   const { ganttDays } = useGantt();



//   // find the matching date in ganttDays.date and get the opening and closing time
//   const day = ganttDays.find((day) => isSameDay(day.date, date));
//   if (!day) return null;

//   const { opening, closing } = day;

//   const getPositionPercentage = (time: Date) => {
//     const totalMinutes = time.getHours() * 60 + time.getMinutes();
//     const percentage = (totalMinutes / (24 * 60)) * 100; // Normalize to 24 hours
//     return percentage;
//   };

//   const openingPosition = getPositionPercentage(opening);
//   const closingPosition = getPositionPercentage(closing);

//   return (
//     <div className="w-full h-full absolute top-0 left-0 overflow-hidden opacity-10">
      
//       <div
//         className="absolute top-0 left-0  h-full  bg-black"
//         style={{ width: `${openingPosition}%` }}
//       />
//       <div
//         className="absolute top-0 left-0  h-full w-full  bg-black"
//         style={{ left: `${closingPosition}%` }}
//       />
//     </div>
//   );
// };

// export default function DayTimeline({ date, items }: DayTimelineProps) {
//   const dayStart = startOfDay(date);
//   const dayEnd = endOfDay(date);

//   const getPositionAndWidth = (start: Date, end: Date) => {
//     const startPosition = Math.max(
//       (differenceInMinutes(start, dayStart) / 1440) * 100,
//       0
//     );
//     const endPosition = Math.min(
//       (differenceInMinutes(end, dayStart) / 1440) * 100,
//       100
//     );
//     return {
//       left: `${startPosition}%`,
//       width: `${endPosition - startPosition}%`,
//     };
//   };

//   const getDuePosition = (due: Date) => {
//     return `${(differenceInMinutes(due, dayStart) / 1440) * 100}%`;
//   };

//   return (
//     <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
//       <TimeGrid />
//       <WorkHours date={date} />

//       {/* Timeline items */}
//       {items.map((item, index) => (
//         <div
//           key={index}
//           className="flex items-center border-b border-gray-200 last:border-b-0"
//         >
//           <div className="w-1/4 flex-shrink-0 p-2 font-semibold truncate">
//             {item.title}
//           </div>
//           <div className="flex-grow relative h-16">
//             <TimelineItem
//               item={item}
//               style={getPositionAndWidth(item.start, item.end)}
//               duePosition={getDuePosition(item.due)}
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


import {
  format,
  differenceInMinutes,
  startOfDay,
  endOfDay,
  isSameDay,
  addHours,
} from "date-fns";
import TimelineItem from "./TimelineItem";
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

// Component for rendering the time grid
const TimeGrid = () => {
  const timeLabels = generateTimeLabels();
  return (
    <div className="absolute top-0 left-0 w-full h-full opacity-50 grid grid-cols-12">
      {timeLabels.map((label, index) => (
        <div key={index} className="text-xs">
          {label}
        </div>
      ))}
      {Array.from({ length: 25 }).map((_, i) => (
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

  return (
    <div className="w-full h-full absolute top-0 left-0 overflow-hidden opacity-10">
      <div
        className="absolute top-0 left-0 h-full bg-black"
        style={{ width: `${openingPosition}%` }}
      />
      <div
        className="absolute top-0 left-0 h-full w-full bg-black"
        style={{ left: `${closingPosition}%` }}
      />
    </div>
  );
};

export default function DayTimeline({ date, items }: DayTimelineProps) {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const getPositionAndWidth = (start: Date, end: Date, due: Date) => {
    const startPosition = Math.max(
      (differenceInMinutes(start, dayStart) / 1440) * 100,
      0
    );
    const endPosition = Math.min(
      (differenceInMinutes(Math.max(end.getTime(), due.getTime()), dayStart) / 1440) * 100,
      100
    );
    return {
      left: `${startPosition}%`,
      width: `${endPosition - startPosition}%`,
    };
  };

  const getDuePosition = (due: Date) => {
    return `${(differenceInMinutes(due, dayStart) / 1440) * 100}%`;
  };

  return (
    <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
      <TimeGrid />
      <WorkHours date={date} />

      {/* Timeline items */}
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center border-b border-gray-200 last:border-b-0"
        >
          <div className="w-1/4 flex-shrink-0 p-2 font-semibold truncate">
            {item.title}
          </div>
          <div className="flex-grow relative h-16">
            <TimelineItem
              item={item}
              style={getPositionAndWidth(item.start, item.end, item.due)}
              duePosition={getDuePosition(item.due)}
              dayStart={dayStart}
              dayEnd={dayEnd}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

