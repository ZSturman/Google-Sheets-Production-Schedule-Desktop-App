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

// import React from "react";
// import { format, isBefore, isAfter, isSameDay, differenceInMinutes } from "date-fns";
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
//   dayStart: Date;
//   dayEnd: Date;
// }

// function getItemStatus(item: TimelineItemProps["item"], currentDate: Date) {
//   const { start, end, due } = item;

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

// function calculatePositionAndWidth(
//   itemStart: Date,
//   itemEnd: Date,
//   dayStart: Date,
//   dayEnd: Date
// ) {
//   const dayDuration = differenceInMinutes(dayEnd, dayStart);

//   // Calculate percentage positions
//   const leftPercentage = Math.max(
//     (differenceInMinutes(itemStart, dayStart) / dayDuration) * 100,
//     0
//   );

//   const rightPercentage = Math.min(
//     (differenceInMinutes(itemEnd, dayStart) / dayDuration) * 100,
//     100
//   );

//   // Calculate width as the difference between left and right percentages
//   const widthPercentage = rightPercentage - leftPercentage;

//   return {
//     left: `${leftPercentage}%`,
//     width: `${widthPercentage}%`,
//   };
// }

// export default function TimelineItem({
//   item,
//   style,
//   duePosition,
//   dayStart,
//   dayEnd,
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

//   const isVisible = isBefore(dayStart, item.end) && isAfter(dayEnd, item.start);

//   if (!isVisible) {
//     return null;
//   }

//   // Use the new position and width logic
//   const { left, width } = calculatePositionAndWidth(
//     item.start,
//     item.end,
//     dayStart,
//     dayEnd
//   );

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
//               left,
//               width,
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
//     </TooltipProvider>
//   );
// }