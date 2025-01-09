// import { useState } from "react";
// import {
//   format,
//   startOfWeek,
//   addWeeks,
//   addMonths,
//   subWeeks,
//   subMonths,
// } from "date-fns";
// import { Button } from "../ui/button";

// import { useGantt } from "../../context/GanttProvider";
// import WeekTimeline from "./WeekTimeline";
// import MonthTimeline from "./MonthTimeline";

// export default function TimelineComponent() {
//   const { ganttProducts, viewMode, setViewMode } = useGantt();

//   const [currentDate, setCurrentDate] = useState(new Date());

//   const goToPrevious = () => {
//     if (viewMode === "week") {
//       setCurrentDate(subWeeks(currentDate, 1));
//     } else if (viewMode === "month") {
//       setCurrentDate(subMonths(currentDate, 1));
//     }
//   };

//   const goToNext = () => {
//     if (viewMode === "week") {
//       setCurrentDate(addWeeks(currentDate, 1));
//     } else if (viewMode === "month") {
//       setCurrentDate(addMonths(currentDate, 1));
//     }
//   };

//   return (
//     <div className="w-full mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">




//       {viewMode === "week" && (
//         <WeekTimeline date={currentDate} items={ganttProducts} />
//       )}
//       {viewMode === "month" && (
//         <MonthTimeline date={currentDate} items={ganttProducts} />
//       )}
//     </div>
//   );
// }
