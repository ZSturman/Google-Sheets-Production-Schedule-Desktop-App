import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  addDays,
  format,
  getDaysInMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "../ui/chart";
import { Button } from "../ui/button";
import { useGantt } from "../../context/GanttProvider";

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
};

export function ChartCustomBar() {
  const {
    viewMode,
    nextPage,
    prevPage,
    selectedPage,
    weeksData,
    monthsData,
    toggleViewMode,
    productionScheduleGanttOptions
  } = useGantt();

  // Determine the current page's data based on view mode and selected page
  const currentData =
    viewMode === "week" ? weeksData[selectedPage] : monthsData[selectedPage];

  if (!currentData) {
    return <div>No data available</div>;
  }

  const { startDate, endDate, data } = currentData;

  //const normalizedDomain = [0, 1];

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
    console.log("DTE", date, value);
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

  return (
    <div>
      {productionScheduleGanttOptions()}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={toggleViewMode} disabled={viewMode === "week"}>
            Week
          </Button>
          <Button onClick={toggleViewMode} disabled={viewMode === "month"}>
            Month
          </Button>
        </div>
        <h2 className="text-xl font-bold">
          {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
        </h2>{" "}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ChartContainer config={chartConfig}>
          <BarChart data={data} layout="vertical" height={300}>
            <CartesianGrid strokeDasharray="3 3" vertical />

            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const task = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div>
                        <strong>Task:</strong> {task.job_number}
                      </div>
                      <div>
                        <strong>Start:</strong>{" "}
                        {format(new Date(task.dataStartDate), "MMM d, yyyy")}
                      </div>
                      <div>
                        <strong>End:</strong>{" "}
                        {format(new Date(task.dataEndDate), "MMM d, yyyy")}
                      </div>
                      <div>
                        <strong>Due:</strong>{" "}
                        {format(new Date(task.dataDueDate), "MMM d, yyyy")}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <YAxis dataKey="job_number" type="category" />
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
              barSize={20}
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
              fill="var(--color-completedAfterDueDate)"
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
