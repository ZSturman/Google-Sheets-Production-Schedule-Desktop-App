// import { startOfMonth, endOfMonth, differenceInMinutes, isSameMonth } from "date-fns";

// interface MonthTimelineProps {
//   date: Date;
//   items: GanttProductData[];
// }

// const generateMonthLabels = (daysInMonth: number) => {
//   const labels = [];
//   for (let day = 1; day <= daysInMonth; day++) {
//     labels.push(day.toString());
//   }
//   return labels;
// };

// const MonthGrid = ({ daysInMonth }: { daysInMonth: number }) => {
//   const monthLabels = generateMonthLabels(daysInMonth);
//   return (
//     <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
//       {monthLabels.map((label, index) => (
//         <div
//           key={index}
//           className="text-xs text-gray-500 absolute"
//           style={{ left: `${(index / daysInMonth) * 100}%` }}
//         >
//           {label}
//         </div>
//       ))}
//       {Array.from({ length: daysInMonth }).map((_, i) => (
//         <div
//           key={i}
//           className="absolute top-0 bottom-0 border-l border-gray-300"
//           style={{ left: `${(i / daysInMonth) * 100}%` }}
//         />
//       ))}
//     </div>
//   );
// };

// export default function MonthTimeline({ date, items }: MonthTimelineProps) {
//   const monthStart = startOfMonth(date);
//   const monthEnd = endOfMonth(date);
//   const daysInMonth = monthEnd.getDate();

//   return (
//     <div className="relative bg-gray-100 rounded-lg overflow-hidden">
//       <MonthGrid daysInMonth={daysInMonth} />
//       <CurrentTimeIndicator monthStart={monthStart} monthEnd={monthEnd} />
//       {items
//         .filter((item) => isSameMonth(item.start, monthStart))
//         .map((item, index) => (
//           <div key={index} className="relative h-16">
//             <TimelineItem item={item} monthStart={monthStart} monthEnd={monthEnd} />
//           </div>
//         ))}
//     </div>
//   );
// }

// const CurrentTimeIndicator = ({ monthStart, monthEnd }: { monthStart: Date; monthEnd: Date }) => {
//   const now = new Date();

//   // Check if the current date falls within the current month
//   if (now < monthStart || now > monthEnd) return null;

//   const totalMinutes = differenceInMinutes(now, monthStart);
//   const monthMinutes = differenceInMinutes(monthEnd, monthStart);
//   const percentage = (totalMinutes / monthMinutes) * 100;

//   return (
//     <div
//       className="absolute top-0 bottom-0 w-1 bg-red-500 z-10"
//       style={{ left: `${percentage}%` }}
//     />
//   );
// };

// const TimelineItem = ({
//   item,
//   monthStart,
//   monthEnd,
// }: {
//   item: GanttProductData;
//   monthStart: Date;
//   monthEnd: Date;
// }) => {
//   const calculatePercentage = (time: Date) => {
//     const totalMinutes = differenceInMinutes(time, monthStart);
//     const monthMinutes = differenceInMinutes(monthEnd, monthStart);
//     return (totalMinutes / monthMinutes) * 100;
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