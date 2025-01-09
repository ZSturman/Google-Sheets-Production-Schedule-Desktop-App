import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import CurrentProduct from "../CurrentProduct";
const chartConfig = {
  notStartedOnTime: {
    label: "Not Started (On Time)",
    color: "hsl(var(--chart-2))",
  },
  notStartedLate: {
    label: "Not Started (Late)",
    color: "hsl(var(--chart-1))",
  },
  inProgressAndOnTime: {
    label: "In Progress (On Time)",
    color: "hsl(var(--chart-3))",
  },
  inProgressAndLate: {
    label: "In Progress (Late)",
    color: "hsl(var(--chart-4))",
  },
  completedBeforeDueDate: {
    label: "Completed",
    color: "hsl(var(--chart-5))",
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
  } = useGantt();

  // Determine the current page's data based on view mode and selected page
  const currentData =
    viewMode === "week" ? weeksData[selectedPage] : monthsData[selectedPage];

  if (!currentData) {
    return <div>No data available</div>;
  }

  const { startDate, endDate, data } = currentData;

  const normalizedDomain = [0, 1];

  const getTicks = () => {
    const totalRange =
      currentData.endDate.getTime() - currentData.startDate.getTime();

    if (viewMode === "week") {
      const weekTicks = [];
      let current = startOfWeek(currentData.startDate, { weekStartsOn: 0 });
      while (current <= currentData.endDate) {
        weekTicks.push(
          (current.getTime() - currentData.startDate.getTime()) / totalRange
        );
        current = addDays(current, 1); // Increment by 1 day
      }
      return weekTicks;
    } else if (viewMode === "month") {
      const start = startOfMonth(currentData.startDate);
      const daysInMonth = getDaysInMonth(start);
      const monthTicks = Array.from({ length: daysInMonth }, (_, i) => {
        const day = addDays(start, i);
        return (day.getTime() - currentData.startDate.getTime()) / totalRange;
      });
      return monthTicks;
    }
    return [];
  };

  console.log("Ticks, ", getTicks());
  console.log("Data, ", data);
  console.log("Current Data, ", currentData);
  console.log("View Mode, ", viewMode);
  console.log("Selected Page, ", selectedPage);
  console.log("Weeks Data, ", weeksData);
  console.log("Months Data, ", monthsData);


  const testData = [
    { job_number: "Task 1", notStarted: { onTime: 1, late: 0 } },
    { job_number: "Task 2", notStarted: { onTime: 0, late: 1 } },
  ];

  return (
    <Card className="m-2 p-2 shadow-none">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="flex gap-2">
            <Button onClick={toggleViewMode} disabled={viewMode === "week"}>
              Week
            </Button>
            <Button onClick={toggleViewMode} disabled={viewMode === "month"}>
              Month
            </Button>
          </div>
          <h2 className="text-xl font-bold">
            {format(startDate, "MMM d, yyyy")} -{" "}
            {format(endDate, "MMM d, yyyy")}
          </h2>{" "}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}  >
          <BarChart data={data} layout="vertical" height={300}>
            <CartesianGrid strokeDasharray="3 3" />

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
              domain={normalizedDomain}
              tickFormatter={(value) => {
                const absoluteTime =
                  currentData.startDate.getTime() +
                  value *
                    (currentData.endDate.getTime() -
                      currentData.startDate.getTime());
                return viewMode === "week"
                  ? format(new Date(absoluteTime), "EEE") // Format for day of the week
                  : format(new Date(absoluteTime), "d"); // Format for day of the month
              }}
              ticks={getTicks()}
              //interval={0}
            />
            {/* Bars */}
            <Bar
              dataKey="notStarted.onTime"
              stackId="a"
              fill="var(--color-notStartedOnTime)"
              label="var(--label-notStartedOnTime)"
            />
            <Bar
              dataKey="notStarted.late"
              stackId="a"
              fill="var(--color-notStartedLate)"
            />
            <Bar
              dataKey="inProgress.onTime"
              stackId="a"
              fill="var(--color-inProgressAndOnTime)"
            />
            <Bar
              dataKey="inProgress.late"
              stackId="a"
              fill="var(--color-inProgressAndLate)"
            />
            <Bar
              dataKey="completedBeforeDueDate"
              stackId="a"
              fill="var(--color-completedBeforeDueDate)"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-evenly items-center">
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
      </CardFooter>
    </Card>
  );
}
