// import React, { useState } from "react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../ui/tooltip";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import {
//   formatDateHeader,
//   formatTimeHeader,
//   GanttChartStatusValues,
//   generateColumnHeaders,
// } from "./GanttChartUtils";
// import { defaultColumns, defaultGanttChartData } from "./defaultValues";

// const workHours = {
//   Monday: [6, 17],
//   Tuesday: [6, 17],
//   Wednesday: [6, 17],
//   Thursday: [6, 17],
//   Friday: [6, 17],
//   Saturday: [6, 17],
//   Sunday: [6, 17],
// };

// const GanttDisplay = () => {
//   const [viewByDateFormat, setViewByDateFormat] = useState<DateTimeFormatOptions>({
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//   });
//   const [viewByTimeFormat, setViewByTimeFormat] = useState<DateTimeFormatOptions>({
//     hour: "2-digit",
//     minute: "2-digit",
//   });

//   const startTime = Math.min(
//     ...defaultGanttChartData.map((job) => new Date(job.scheduled_start).getTime())
//   );
//   const endTime = Math.max(
//     ...defaultGanttChartData.map((job) => new Date(job.scheduled_end).getTime())
//   );
//   const currentTime = new Date().getTime();

//   const calculateBarPosition = (start: Date, end: Date) => {
//     const totalDuration = endTime - startTime;
//     const startOffset =
//       ((new Date(start).getTime() - startTime) / totalDuration) * 100;
//     const duration =
//       ((new Date(end).getTime() - new Date(start).getTime()) / totalDuration) *
//       100;

//     return { startOffset, duration };
//   };

//   const isWithinWorkHours = (date: Date) => {
//     const day = date.toLocaleString("en-US", { weekday: "long" });
//     const hours = date.getHours();
//     const [startHour, endHour] = workHours[day as keyof typeof workHours];
//     return hours >= startHour && hours < endHour;
//   };

//   const headers = generateColumnHeaders(defaultColumns);

//   return (
//     <Card className="w-full max-w-8xl overflow-scroll">
//       <CardHeader>
//         <CardTitle>Gantt Chart Visualizer</CardTitle>
//         {/* Optional selector for date/time formats */}
//         <div className="flex gap-4">
//           <select
//             value={JSON.stringify(viewByDateFormat)}
//             onChange={(e) => setViewByDateFormat(JSON.parse(e.target.value))}
//             className="p-2 border rounded"
//           >
//             {/* Add more options as needed */}
//             <option value='{"weekday":"short","month":"short","day":"numeric"}'>
//               Short Date
//             </option>
//             <option value='{"weekday":"long","month":"long","day":"numeric"}'>
//               Long Date
//             </option>
//           </select>
//           <select
//             value={JSON.stringify(viewByTimeFormat)}
//             onChange={(e) => setViewByTimeFormat(JSON.parse(e.target.value))}
//             className="p-2 border rounded"
//           >
//             <option value='{"hour":"2-digit","minute":"2-digit"}'>24-hour</option>
//             <option value='{"hour":"2-digit","minute":"2-digit","hour12":true}'>
//               12-hour
//             </option>
//           </select>
//         </div>
//       </CardHeader>
//       <CardContent className="overflow-auto">
//         <div
//           className={`grid grid-cols-${headers.length + 1} gap-0`}
//           style={{
//             gridTemplateColumns: `2fr repeat(${headers.length}, 1fr)`,
//           }}
//         >
//           {/* Job Name Header */}
//           <div className="font-bold flex items-center justify-center bg-green-200">
//             Job Name
//           </div>
//           {/* Column Headers */}
//           {headers.map((header, index) => (
//             <div
//               key={`header-${index}`}
//               className="flex flex-col items-center justify-center gap-0 border-r"
//             >
//               <div>{formatDateHeader(header, viewByDateFormat)}</div>
//               <div>{formatTimeHeader(header, viewByTimeFormat)}</div>
//             </div>
//           ))}

//           {/* Job Rows */}
//           {defaultGanttChartData.map((job, rowIndex) => {
//             const { startOffset, duration } = calculateBarPosition(
//               job.scheduled_start,
//               job.scheduled_end
//             );

//             const startWithinHours = isWithinWorkHours(
//               new Date(job.scheduled_start)
//             );
//             const endWithinHours = isWithinWorkHours(new Date(job.scheduled_end));
//             const barColor =
//               startWithinHours && endWithinHours
//                 ? "bg-blue-500"
//                 : "bg-blue-300 opacity-50";

//             return (
//               <React.Fragment key={`row-${rowIndex}`}>
//                 {/* Row Label */}
//                 <div className="flex items-center justify-center bg-green-200">
//                   {job.rowLabel}
//                 </div>
//                 {/* Job Timeline */}
//                 {headers.map((header, colIndex) => {
//                   const threshold = job.thresholds.find(
//                     ({ interval }) =>
//                       interval &&
//                       interval.start <= header &&
//                       interval.end >= header
//                   );

//                   const statusClass = threshold
//                     ? getStatusClass(threshold.status)
//                     : barColor;

//                   return (
//                     <TooltipProvider key={`${job.rowLabel}-${header}`}>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <div
//                             className={`border-r w-full ${statusClass}`}
//                             style={{
//                               left: `${startOffset}%`,
//                               width: `${duration}%`,
//                             }}
//                           >
//                             <div className="h-6"></div>
//                           </div>
//                         </TooltipTrigger>
//                         <TooltipContent>{job.toolTipContent}</TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   );
//                 })}
//               </React.Fragment>
//             );
//           })}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// // Helper function for status classes
// function getStatusClass(status: GanttChartStatusValues) {
//   switch (status) {
//     case GanttChartStatusValues.Completed:
//       return "bg-green-500";
//     case GanttChartStatusValues.InProgress:
//       return "bg-blue-500";
//     case GanttChartStatusValues.Overdue:
//       return "bg-red-500";
//     case GanttChartStatusValues.NotStarted:
//       return "bg-gray-500";
//     case GanttChartStatusValues.Pending:
//       return "bg-yellow-500";
//     case GanttChartStatusValues.Delayed:
//       return "bg-purple-500";
//     default:
//       return "bg-gray-300";
//   }
// }

// export default GanttDisplay;

// // // import GanttChartViewBySelector from "./GanttChartViewBySelector";
// // // import React, { useState } from "react";
// // // import {
// // //   DateFormatOptions,
// // //   formatDateHeader,
// // //   formatTimeHeader,
// // //   GanttChartStatusValues,
// // //   generateColumnHeaders,
// // //   TimeFormatOptions,
// // // } from "./GanttChartUtils";
// // // import { defaultColumns, defaultGanttChartData } from "./defaultValues";
// // // import {
// // //   Tooltip,
// // //   TooltipContent,
// // //   TooltipProvider,
// // //   TooltipTrigger,
// // // } from "../ui/tooltip";
// // // import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// // // const GanttChartContainer = () => {
// // //   const [viewByDateFormat, setViewByDateFormat] =
// // //     useState<DateTimeFormatOptions>(DateFormatOptions[0]);
// // //   const [viewByTimeFormat, setViewByTimeFormat] =
// // //     useState<DateTimeFormatOptions>(TimeFormatOptions[0]);

// // //   return (
// // //     <Card className="w-full max-w-8xl overflow-scroll">
// // //       <CardHeader>
// // //         {" "}
// // //         <CardTitle>Gantt Chart Visualizer</CardTitle>
// // //         <GanttChartViewBySelector
// // //           dateFormat={viewByDateFormat}
// // //           setDateFormat={setViewByDateFormat}
// // //           timeFormat={viewByTimeFormat}
// // //           setTimeFormat={setViewByTimeFormat}
// // //         />
// // //       </CardHeader>
// // //       <CardContent className="overflow-auto">
// // //         <div className="grid grid-flow-row-dense">
// // //           <GanttChartHeader
// // //             columns={defaultColumns}
// // //             viewByDateFormat={viewByDateFormat}
// // //             viewByTimeFormat={viewByTimeFormat}
// // //           />
// // //         </div>
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // };

// // // export default GanttChartContainer;

// // // type GanttChartHeaderProps = {
// // //   columns: GanttChartColumns;
// // //   viewByDateFormat: DateTimeFormatOptions;
// // //   viewByTimeFormat: DateTimeFormatOptions;
// // // };

// // // const GanttChartHeader = ({
// // //   columns,
// // //   viewByDateFormat,
// // //   viewByTimeFormat,
// // // }: GanttChartHeaderProps) => {
// // //   const headers = generateColumnHeaders(columns);
// // //   const totalColumns = headers.length + 1; // +1 for the Job Name column

// // //   return (
// // //     <div
// // //       className={`grid grid-cols-${totalColumns} gap-0`}
// // //       style={{
// // //         gridTemplateColumns: `2fr repeat(${headers.length}, 1fr)`, // Job Name column takes 2fr, each date/time column takes 1fr
// // //       }}
// // //     >
// // //       {/* Job Name Column Header */}
// // //       <div className="font-bold flex items-center justify-center bg-green-200">
// // //         Job Name
// // //       </div>
// // //       {headers.map((header, index) => (
// // //         <div
// // //           key={`header-${index}`}
// // //           className="flex flex-col items-center justify-center gap-0 border-r"
// // //         >
// // //           <div>{`${formatDateHeader(header, viewByDateFormat)}`}</div>
// // //           <div>{`${formatTimeHeader(header, viewByTimeFormat)}`}</div>
// // //         </div>
// // //       ))}

// // //       {defaultGanttChartData.map((data, rowIndex) => (
// // //         <React.Fragment key={`row-${rowIndex}`}>
// // //           <div
// // //             key={`label-${rowIndex}-${data.rowLabel}`}
// // //             className="flex items-center justify-center bg-green-200"
// // //           >
// // //             {data.rowLabel}
// // //           </div>
// // //           {headers.map((header, colIndex) => {
// // //             // Determine the status for each header date based on thresholds
// // //             const threshold = data.thresholds.find(
// // //               ({ interval }) =>
// // //                 interval && interval.start <= header && interval.end >= header
// // //             );

// // //             const statusClass = threshold
// // //               ? getStatusClass(threshold.status)
// // //               : "bg-blue-300";

// // //             return (
// // //               <TooltipProvider key={`${data.rowLabel}-${header}`}>
// // //                 <Tooltip>
// // //                   <TooltipTrigger asChild>
// // //                     <div className={`border-r w-full ${statusClass}`}>
// // //                       <div className="h-6"></div>
// // //                     </div>
// // //                   </TooltipTrigger>
// // //                   <TooltipContent>{data.toolTipContent}</TooltipContent>
// // //                 </Tooltip>
// // //               </TooltipProvider>
// // //             );
// // //           })}
// // //         </React.Fragment>
// // //       ))}
// // //     </div>
// // //   );
// // // };

// // // // Helper function to map statuses to CSS classes for background colors
// // // function getStatusClass(status: GanttChartStatusValues) {
// // //   switch (status) {
// // //     case GanttChartStatusValues.Completed:
// // //       return "bg-green-500";
// // //     case GanttChartStatusValues.InProgress:
// // //       return "bg-blue-500";
// // //     case GanttChartStatusValues.Overdue:
// // //       return "bg-red-500";
// // //     case GanttChartStatusValues.NotStarted:
// // //       return "bg-gray-500";
// // //     case GanttChartStatusValues.Pending:
// // //       return "bg-yellow-500";
// // //     case GanttChartStatusValues.Delayed:
// // //       return "bg-purple-500";
// // //     default:
// // //       return "bg-gray-300"; // Default color if no status is matched
// // //   }
// // // }