import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  addDays,
  differenceInDays,
  format,
  getDaysInMonth,
  isBefore,
} from "date-fns";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "./ui/chart";
import { Button } from "./ui/button";
import { useGantt } from "../context/GanttProvider";
import { useTab } from "../context/TabProvider";

const chartConfig = {
  notStartedOnTime: {
    label: "Not Started (On Time)",
    color: "hsl(var(--chart-not-started-on-time))",
  },
  notStartedLate: {
    label: "Not Started (Late)",
    color: "hsl(var(--chart-not-started-late))",
  },
  inProgressOnTime: {
    label: "In Progress (On Time)",
    color: "hsl(var(--chart-in-progress-on-time))",
  },
  inProgressLate: {
    label: "In Progress (Late)",
    color: "hsl(var(--chart-in-progress-late))",
  },
  completedBeforeDueDate: {
    label: "Completed (Early)",
    color: "hsl(var(--chart-completed-early))",
  },
  completedAfterDueDate: {
    label: "Completed",
    color: "hsl(var(--chart-completed))",
  },
  dueIndicator: {
    label: "Due",
    color: "hsl(var(--chart-due))",
  },
} 

export function ChartCustomBar() {
  const {
    viewMode,
    nextPage,
    prevPage,
    selectedPage,
    weeksData,
    monthsData,
    toggleViewMode,
  } = useGantt();
  const { selectedTab } = useTab();

const barSize = 15

  const getStatusForProduct = (product: ProductData): string => {
    const startdate = new Date(product["scheduled_start"]);
    const enddate = new Date(product["scheduled_end"]);
    const duedate = new Date(product["requested_ship_date"]);


    let className =  "";

    if (isBefore(duedate, startdate)) {
      className += " bg-red-500";
    } else if (isBefore(duedate, enddate)) {
      className += " bg-yellow-500";
    } else {
      className += " bg-green-500";
    }

    return className;
  };


  // Determine the current page's data based on view mode and selected page
  const currentData =
    viewMode === "week" ? weeksData[selectedPage] : monthsData[selectedPage];

  if (!currentData) {
    return <div>No data available</div>;
  }

  const { startDate, endDate, data } = currentData;

  const currentDate = new Date();
  const currentDateXValue = currentDate.getTime() - startDate.getTime();

  const getTicks = () => {
    if (viewMode === "week") {
      // Leave the "weeks" part unchanged
      const numberOfTicks =
        (currentData.endDate.getTime() - currentData.startDate.getTime()) / 7;
      return Array.from({ length: 7 }, (_, i) => i * numberOfTicks);
    } else {
      // Adjust the "months" part to calculate ticks dynamically based on the number of days in the month
      const daysInMonth = getDaysInMonth(startDate); // Number of days in the month
      //const numberOfTicks = daysInMonth + 1; // Include an extra tick for the end of the month
      const timeInterval =
        (endDate.getTime() - startDate.getTime()) / daysInMonth;
      return Array.from({ length: daysInMonth }, (_, i) => i * timeInterval);
    }
  };

  const tickFormatter = (value: number) => {
    const date = new Date(value + startDate.getTime());
    const fixedDate = addDays(date, 1);

    if (viewMode === "week") {
      if (value === 0) {
        return format(date, "EEE");
      }
      return format(fixedDate, "EEE");
    } else {
      if (value === 0) {
        return format(date, "d");
      }
      return format(fixedDate, "d");
    }
  };

  const CustomYAxisTick = ({ x, y, payload }: any) => {
    // Access the `job_number` and lookup the corresponding `work_center`
    const jobNumber = payload.value;
    const jobData = data.find((item) => item.job_number === jobNumber);
    const workCenter = jobData?.work_center || "Unknown Work Center";

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={4}
          textAnchor="end"
          fill="#666"
          className="font-bold"
        >
          {jobNumber}
        </text>
        <text x={0} y={16} textAnchor="end" fill="gray" fontSize="text-xs">
          {workCenter}
        </text>
      </g>
    );
  };

  const calculateLateness = (product: ProductData): string => {
    const dueDate = new Date(product.requested_ship_date);
    const endDate = new Date(product.scheduled_end);
    const daysDifference = differenceInDays(dueDate, endDate);

    if (daysDifference < 0) {
      return `${Math.abs(daysDifference)} days late`;
    } else if (daysDifference > 0) {
      return `${daysDifference} days early`;
    } else {
      return "On time";
    }
  };

  return (
    <div>
 
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={toggleViewMode} disabled={viewMode === "week"}>
            Week
          </Button>
          <Button onClick={toggleViewMode} disabled={viewMode === "month"}>
            Month
          </Button>
        </div>
        <div className="flex flex-col items-end">

        <h2 className="text-xl font-bold">
          {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
        </h2>{" "}

        <h3>
         Today: {format(currentDate, "MMM d, yyyy")}
        </h3>
        </div>
      </div>
<ResponsiveContainer width="100%" height={(barSize * 2) * (data.length + 4)}>


      <ChartContainer config={chartConfig}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" vertical />

          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const task = payload[0].payload;
                return (
                  <div
                    className={`rounded-lg border bg-background p-2 shadow-sm ${getStatusForProduct(
                      task
                    )} bg-opacity-70 text-lg`}
                  >
                    <div className="flex flex-row gap-4 justify-between">
                      <strong>{task.job_number}</strong>
             
                      {task.work_center}
                    </div>

                    {task.work_center === "Ready for inspection" ? (
                      <div className="font-bold text-center">
                        Ready
                        </div>

  ) : (
    <div className="flex flex-row gap-4 justify-between">
Balance Qty: <strong>{task.balance_quantity} / {Number(task.quantity) * Number(task.length)}</strong>
      </div>

  )}
                     <div className="flex flex-row gap-4 justify-between">
                      Start:{" "}
                      <strong>
                        {format(new Date(task.dataStartDate), "MMM d, yyyy")}
                      </strong>
                    </div>
                    <div className="flex flex-row gap-4 justify-between">
                      End:{" "}
                      <strong>
                        {format(new Date(task.dataEndDate), "MMM d, yyyy")}
                      </strong>
                    </div>
                    <div className="flex flex-row gap-4 justify-between">
                      Due:{" "}
                      <strong>
                        {format(new Date(task.dataDueDate), "MMM d, yyyy")}
                      </strong>
                    </div>

                    <div className="flex flex-row gap-4 justify-between">
                        Status:
                      <strong>
                        {calculateLateness(task)}
                        </strong> 
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <ChartLegend content={<ChartLegendContent />} />
          {selectedTab.isWorkCenter ? (
            <YAxis dataKey={"job_number"} type="category" />
          ) : (
            <YAxis
              dataKey={"job_number"}
              type="category"
              tick={<CustomYAxisTick />}
            />
          )}
          <XAxis
            type="number"
            domain={[0, endDate.getTime() - startDate.getTime()]}
            ticks={getTicks()}
            tickFormatter={tickFormatter}
            interval={0}
          />

          {/* Bars */}
          <Bar
            dataKey="notStartedOnTime"
            stackId="a"
            fill="var(--color-notStartedOnTime)"
            label="var(--label-notStartedOnTime)"
            barSize={barSize}
          />
          <Bar
            dataKey="notStartedLate"
            stackId="a"
            fill="var(--color-notStartedLate)"
            onMouseOver={(e) => {
              console.log("MOUSEOVER", e);
            }}
          />
          <Bar
            dataKey="inProgressOnTime"
            stackId="a"
            fill="var(--color-inProgressOnTime)"
          />
          <Bar
            dataKey="inProgressLate"
            stackId="a"
            fill="var(--color-inProgressLate)"
          />
          <Bar
            dataKey="completedBeforeDueDate"
            stackId="a"
            fill="var(--color-completedBeforeDueDate)"
          />
          <Bar
            dataKey="completedAfterDueDate"
            stackId="a"
            barSize={15}
            fill="var(--color-completedAfterDueDate)"
          />
          <ReferenceLine
            x={currentDateXValue}
            stroke="red"
            label={{
              value: "Now",
              position: "insideTopRight",
              fill: "red",
              fontSize: 12,
            }}
            strokeDasharray="3 3"
          />
        </BarChart>
      </ChartContainer>
      </ResponsiveContainer>
      <div className="flex justify-evenly items-center">
        <Button onClick={prevPage} disabled={selectedPage === 0}>
          Previous
        </Button>
        <div>
          {selectedPage + 1} /{" "}
          {viewMode === "week" ? weeksData.length : monthsData.length}
        </div>
        <Button
          onClick={nextPage}
          disabled={
            viewMode === "week"
              ? selectedPage === weeksData.length - 1
              : selectedPage === monthsData.length - 1
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
