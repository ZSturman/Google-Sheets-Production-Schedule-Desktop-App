import { useMemo, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
    format,
    isSameDay,
    isSameWeek,
    isSameMonth,
    startOfDay,
    startOfWeek,
    startOfMonth,
    addWeeks,
    addMonths,
    subWeeks,
    subMonths,
  } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../../components/ui/chart'
import { Button } from '../ui/button'


import { useGantt } from '../../context/GanttProvider'


const allChartData = [
  [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ],
  [
    { month: 'July', desktop: 220, mobile: 150 },
    { month: 'August', desktop: 280, mobile: 180 },
    { month: 'September', desktop: 250, mobile: 160 },
    { month: 'October', desktop: 300, mobile: 200 },
    { month: 'November', desktop: 270, mobile: 190 },
    { month: 'December', desktop: 230, mobile: 170 },
  ],
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function ChartBar() {
    const { ganttProducts, ganttDays, viewMode, setViewMode } = useGantt();
    const [currentDate, setCurrentDate] = useState(new Date());

      // Generate sorted dates based on the view mode
      const sortedDates = useMemo(() => {
        const allDates = ganttDays.map((day) => day.date);
        const uniqueDates = [...new Set(allDates.map((date) => startOfDay(date).getTime()))]
          .sort((a, b) => a - b)
          .map((timestamp) => new Date(timestamp));
    
        // Extend sortedDates logic to handle weekly and monthly intervals
        if (viewMode === "week") {
          const weeks = uniqueDates.map((date) => startOfWeek(date));
          return [...new Set(weeks.map((date) => date.getTime()))]
            .sort((a, b) => a - b)
            .map((timestamp) => new Date(timestamp));
        }
    
        if (viewMode === "month") {
          const months = uniqueDates.map((date) => startOfMonth(date));
          return [...new Set(months.map((date) => date.getTime()))]
            .sort((a, b) => a - b)
            .map((timestamp) => new Date(timestamp));
        }
    
        return uniqueDates;
      }, [ganttDays, viewMode]);

      const currentDateIndex = sortedDates.findIndex((date) => {
        if (viewMode === "day") return isSameDay(date, currentDate);
        if (viewMode === "week") return isSameWeek(date, currentDate);
        if (viewMode === "month") return isSameMonth(date, currentDate);
        return false;
      });


  const [pageIndex, setPageIndex] = useState(0)
  const chartData = allChartData[pageIndex]


  const goToPrevious = () => {
    if (currentDateIndex > 0) {
      setCurrentDate(sortedDates[currentDateIndex - 1]);
    } else if (viewMode === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (currentDateIndex < sortedDates.length - 1) {
      setCurrentDate(sortedDates[currentDateIndex + 1]);
    } else if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

/*   const handlePrevious = () => {
    setPageIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setPageIndex((prev) => (prev < allChartData.length - 1 ? prev + 1 : prev))
  } */

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Horizontal Stacked + Pagination</CardTitle>
        <CardDescription>
          {pageIndex === 0 ? 'January - June 2024' : 'July - December 2024'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 80, right: 20, top: 10, bottom: 10 }}
            barSize={20}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              axisLine={false}
            />
            <XAxis type="number" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="desktop"
              stackId="a"
              fill="var(--color-desktop)"
              radius={[0, 4, 4, 0]}
            />
            <Bar
              dataKey="mobile"
              stackId="a"
              fill="var(--color-mobile)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4">
        <div className="flex w-full items-center justify-between">
          <Button onClick={goToPrevious} disabled={pageIndex === 0}>
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {pageIndex + 1} of {allChartData.length}
          </div>
          <Button onClick={goToNext} disabled={pageIndex === allChartData.length - 1}>
            Next
          </Button>
        </div>
        <div className="flex w-full flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for 6 months
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

