// import React from "react";
// import { format, isBefore, isAfter, isSameDay } from "date-fns";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../ui/tooltip";

// interface TimelineItemProps {
//   item: GanttProductData;
//   style: React.CSSProperties;
//   duePosition: string;
// }

// function getItemStatus(item: TimelineItemProps["item"], currentDate: Date) {
//   const { start, end, due } = item;

//   if (isBefore(currentDate, start) || isAfter(currentDate, end)) {
//     return { timeStatus: null, progressStatus: null }; // Outside valid range
//   }

//   let timeStatus = "on time";
//   if (isAfter(end, due)) {
//     timeStatus = isBefore(currentDate, due) ? "going to be late" : "late";
//   } else if (isBefore(end, due)) {
//     timeStatus = "early";
//   }

//   let progressStatus = "waiting";
//   if (isAfter(currentDate, end) || isSameDay(currentDate, end)) {
//     progressStatus = "done";
//   } else if (isAfter(currentDate, start) || isSameDay(currentDate, start)) {
//     progressStatus = "in process";
//   }

//   return { timeStatus, progressStatus };
// }

// function isValidDate(date: any): boolean {
//   return date instanceof Date && !isNaN(date.getTime());
// }

// export default function TimelineItem({
//   item,
//   style,
//   duePosition,
// }: TimelineItemProps) {
//   const currentDate = new Date();
//   const { timeStatus, progressStatus } = getItemStatus(item, currentDate);

//   const statusColors = {
//     early: "bg-green-500",
//     "on time": "bg-blue-500",
//     "going to be late": "bg-yellow-500",
//     late: "bg-red-500",
//   };

//   const progressColors = {
//     waiting: "bg-gray-300",
//     "in process": "bg-purple-500",
//     done: "bg-green-700",
//   };

//   return (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <div
//             className={`absolute h-8 rounded ${
//               statusColors[timeStatus as keyof typeof statusColors]
//             }`}
//             style={{
//               ...style,
//               top: "50%",
//               transform: "translateY(-50%)",
//             }}
//           >
//             <div
//               className={`absolute inset-0 ${
//                 progressColors[progressStatus as keyof typeof progressColors]
//               } opacity-50`}
//             />
//           </div>
//         </TooltipTrigger>
//         <TooltipContent>
//           <div className="p-2">
//             <h3 className="font-bold">{item.title}</h3>
//             <p>{item.description}</p>
//             <p>
//               Start:{" "}
//               {isValidDate(item.start)
//                 ? format(item.start, "HH:mm")
//                 : "Invalid Entry, please check the Products Tab for more details"}
//             </p>
//             <p>
//               End:{" "}
//               {isValidDate(item.end)
//                 ? format(item.end, "HH:mm")
//                 : "Invalid Entry, please check the Products Tab for more details"}
//             </p>
//             <p>
//               Due:{" "}
//               {isValidDate(item.due)
//                 ? format(item.due, "HH:mm")
//                 : "Invalid Entry, please check the Products Tab for more details"}
//             </p>
//             <p>Status: {timeStatus}</p>
//             <p>Progress: {progressStatus}</p>
//           </div>
//         </TooltipContent>
//       </Tooltip>
//       <div
//         className="absolute top-0 bottom-0 w-px bg-red-500"
//         style={{ left: duePosition }}
//       />
//     </TooltipProvider>
//   );
// }


import React from "react";
import { format, isBefore, isAfter, isSameDay } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface TimelineItemProps {
  item: GanttProductData;
  style: React.CSSProperties;
  duePosition: string;
  dayStart: Date;
  dayEnd: Date;
}

function getItemStatus(item: TimelineItemProps["item"], currentDate: Date) {
  const { start, end, due } = item;

  let timeStatus = "on time";
  if (isAfter(end, due)) {
    timeStatus = isBefore(currentDate, due) ? "going to be late" : "late";
  } else if (isBefore(end, due)) {
    timeStatus = "early";
  }

  let progressStatus = "waiting";
  if (isAfter(currentDate, end) || isSameDay(currentDate, end)) {
    progressStatus = "done";
  } else if (isAfter(currentDate, start) || isSameDay(currentDate, start)) {
    progressStatus = "in process";
  }

  return { timeStatus, progressStatus };
}

function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export default function TimelineItem({
  item,
  style,
  duePosition,
  dayStart,
  dayEnd,
}: TimelineItemProps) {
  const currentDate = new Date();
  const { timeStatus, progressStatus } = getItemStatus(item, currentDate);

  const statusColors = {
    early: "bg-green-500",
    "on time": "bg-blue-500",
    "going to be late": "bg-yellow-500",
    late: "bg-red-500",
  };

  const progressColors = {
    waiting: "bg-gray-300",
    "in process": "bg-purple-500",
    done: "bg-green-700",
  };

  const isVisible = isBefore(dayStart, item.end) && isAfter(dayEnd, item.start);

  if (!isVisible) {
    return null;
  }

  const barEndPosition = isAfter(item.due, item.end) ? item.due : item.end;
  const transparentSection = isAfter(item.due, item.end);
  const redSection = isAfter(item.end, item.due);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`absolute h-8 rounded ${
              statusColors[timeStatus as keyof typeof statusColors]
            }`}
            style={{
              ...style,
              top: "50%",
              transform: "translateY(-50%)",
              right: isAfter(barEndPosition, dayEnd) ? '0' : 'auto',
            }}
          >
            <div
              className={`absolute inset-0 ${
                progressColors[progressStatus as keyof typeof progressColors]
              } opacity-50`}
            />
            {transparentSection && (
              <div
                className="absolute inset-y-0 bg-current opacity-30"
                style={{
                  left: `${((item.end.getTime() - item.start.getTime()) / (item.due.getTime() - item.start.getTime())) * 100}%`,
                  right: 0,
                }}
              />
            )}
            {redSection && (
              <div
                className="absolute inset-y-0 bg-red-500"
                style={{
                  left: `${((item.due.getTime() - item.start.getTime()) / (item.end.getTime() - item.start.getTime())) * 100}%`,
                  right: 0,
                }}
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="p-2">
            <h3 className="font-bold">{item.title}</h3>
            <p>{item.description}</p>
            <p>
              Start:{" "}
              {isValidDate(item.start)
                ? format(item.start, "HH:mm")
                : "Invalid Entry, please check the Products Tab for more details"}
            </p>
            <p>
              End:{" "}
              {isValidDate(item.end)
                ? format(item.end, "HH:mm")
                : "Invalid Entry, please check the Products Tab for more details"}
            </p>
            <p>
              Due:{" "}
              {isValidDate(item.due)
                ? format(item.due, "HH:mm")
                : "Invalid Entry, please check the Products Tab for more details"}
            </p>
            <p>Status: {timeStatus}</p>
            <p>Progress: {progressStatus}</p>
          </div>
        </TooltipContent>
      </Tooltip>
      <div
        className="absolute top-0 bottom-0 w-px bg-red-500"
        style={{ left: duePosition }}
      />
    </TooltipProvider>
  );
}

