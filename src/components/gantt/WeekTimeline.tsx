// import {
//   startOfWeek,
//   endOfWeek,
//   differenceInMinutes,
//   format,
//   isWithinInterval,
// } from "date-fns";

// interface WeekTimelineProps {
//   date: Date;
//   items: GanttProductData[];
// }

// const generateWeekLabels = () => {
//   const labels = [];
//   for (let day = 0; day < 7; day++) {
//     const dayDate = new Date(0, 0, day + 1);
//     labels.push(format(dayDate, "EEEE"));
//   }
//   return labels;
// };

// const WeekGrid = () => {
//   const weekLabels = generateWeekLabels();
//   return (
//     <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
//       {weekLabels.map((label, index) => (
//         <div
//           key={index}
//           className="text-xs text-gray-500 absolute"
//           style={{ left: `${(index / 7) * 100}%` }}
//         >
//           {label}
//         </div>
//       ))}
//       {Array.from({ length: 7 }).map((_, i) => (
//         <div
//           key={i}
//           className="absolute top-0 bottom-0 border-l border-gray-300"
//           style={{ left: `${(i / 7) * 100}%` }}
//         />
//       ))}
//     </div>
//   );
// };

// const CurrentTimeIndicator = ({ weekStart, weekEnd }: { weekStart: Date; weekEnd: Date }) => {
//   const now = new Date();

//   if (now < weekStart || now > weekEnd) return null;

//   const totalMinutes = differenceInMinutes(now, weekStart);
//   const weekMinutes = differenceInMinutes(weekEnd, weekStart);
//   const percentage = (totalMinutes / weekMinutes) * 100;

//   return (
//     <div
//       className="absolute top-0 bottom-0 w-1 bg-red-500 z-10"
//       style={{ left: `${percentage}%` }}
//     />
//   );
// };

// export default function WeekTimeline({ date, items }: WeekTimelineProps) {
//   const weekStart = startOfWeek(date);
//   const weekEnd = endOfWeek(date);

//   // Adjust filter to include items within the weekStart and weekEnd range
//   const filteredItems = items.filter((item) =>
//     isWithinInterval(item.start, { start: weekStart, end: weekEnd })
//   );

//   return (
//     <div className="relative bg-gray-100 rounded-lg overflow-hidden">
//       <WeekGrid />
//       <CurrentTimeIndicator weekStart={weekStart} weekEnd={weekEnd} />
//       {filteredItems.length > 0 ? (
//         filteredItems.map((item, index) => (
//           <div key={index} className="relative h-16">
//             <TimelineItem item={item} weekStart={weekStart} weekEnd={weekEnd} />
//           </div>
//         ))
//       ) : (
//         <div className="p-4 text-center text-gray-500">No items scheduled for this week.</div>
//       )}
//     </div>
//   );
// }

// const TimelineItem = ({
//   item,
//   weekStart,
//   weekEnd,
// }: {
//   item: GanttProductData;
//   weekStart: Date;
//   weekEnd: Date;
// }) => {
//   const calculatePercentage = (time: Date) => {
//     const totalMinutes = differenceInMinutes(time, weekStart);
//     const weekMinutes = differenceInMinutes(weekEnd, weekStart);
//     return (totalMinutes / weekMinutes) * 100;
//   };

//   const startPercentage = calculatePercentage(item.start);
//   const endPercentage = calculatePercentage(item.end);
//   const duePercentage = calculatePercentage(item.due);

//   return (
//     <div className="relative h-full">
//       <div
//         className="absolute top-0 bottom-0 bg-blue-500 z-10 opacity-50"
//         style={{
//           left: `${startPercentage}%`,
//           width: `${endPercentage - startPercentage}%`,
//         }}
       
//       />
//       <div
//         className="absolute top-0 bottom-0 w-1 bg-yellow-500 z-20"
//         style={{ left: `${duePercentage}%` }}
        
//       />
//       <div className="absolute left-0 p-4">{item.title}</div>
//     </div>
//   );
// };