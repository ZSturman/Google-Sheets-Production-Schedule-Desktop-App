import { defaultOnOffTime } from "./defaults";

export const calculateScheduleStartAndEnd = async (
  data: ProductData[],
  workCenterSchedule: WorkCenterScheduleData[],
  workCenter: WorkCenter
): Promise<ProductData[] | null> => {

  if (
    workCenter === "UNASSIGNED" ||
    workCenter === "Ready for inspection" ||
    data.length === 0
  ) {
    return null;
  }

  const filteredData = data.filter((item) => item.work_center === workCenter);

  if (filteredData.length === 0) {
    return null;
  }

  filteredData.sort((a, b) => a.priority - b.priority);

  const updatedData: ProductData[] = [];
  let startTime = new Date();

  let priorityNumber = 0;

  for (const product of filteredData) {
    priorityNumber++;

    // Calculate the time needed to complete the product
    const timeToCompleteProduct = getTimeToComplete(product);


    // Schedule the product
    let { scheduledStart, scheduledEnd } = calculateProductSchedule(
      workCenter,
      startTime,
      timeToCompleteProduct,
      workCenterSchedule
    );


    // Ensure the scheduled start is not unnecessarily advanced
    if (
      scheduledStart.getTime() > startTime.getTime() &&
      scheduledStart.getDate() === startTime.getDate()
    ) {
      scheduledStart = startTime; // Correctly align with the previous product
      scheduledEnd = new Date(scheduledStart.getTime() + timeToCompleteProduct);
    }

    // Push updated product data
    updatedData.push({
      ...product,
      priority: priorityNumber,
      scheduled_start: String(scheduledStart),
      scheduled_end: String(scheduledEnd),
    });

    // Update startTime for the next product
    startTime = new Date(scheduledEnd);
  }
  return updatedData;
};

const calculateProductSchedule = (
  workCenter: string,
  currentStartTime: Date,
  remainingTimeToComplete: number,
  workCenterSchedule: WorkCenterScheduleData[],
  depth = 0 // Add a depth parameter to track recursion depth
): { scheduledStart: Date; scheduledEnd: Date } => {

  if (depth > 100) {
    // Exit if recursion exceeds 20 levels
    console.error("Max recursion depth reached. Exiting recursion.");
    throw new Error(
      "Max recursion depth exceeded while calculating product schedule."
    );
  }

  let startTime = new Date(currentStartTime);

  while (!isWorkCenterOpen(workCenter, startTime, workCenterSchedule)) {
    console.log("Work center closed. Incrementing start time...");
    startTime.setHours(startTime.getHours() + 1, 0, 0, 0);
  }

  const scheduledStart = startTime;

  const closingTime = getTimeTileWorkCenterCloses(
    workCenter,
    startTime,
    workCenterSchedule
  );
  

  const timeUntilWorkCenterCloses = closingTime.getTime() - startTime.getTime();


  // Handle negative or invalid closing times
  if (timeUntilWorkCenterCloses <= 0) {
    console.warn("Closing time has already passed. Moving to the next day...");
    const nextStartTime = new Date(closingTime);
    nextStartTime.setDate(nextStartTime.getDate() + 1);
    nextStartTime.setHours(6, 0, 0, 0); // Assume work center opens at 6:00 AM next day
    return calculateProductSchedule(
      workCenter,
      nextStartTime,
      remainingTimeToComplete,
      workCenterSchedule,
      depth + 1
    );
  }

  if (remainingTimeToComplete <= timeUntilWorkCenterCloses) {
    // Calculate scheduled end based on the remaining time
    const scheduledEnd = new Date(
      scheduledStart.getTime() + remainingTimeToComplete
    );
  
    // Ensure the scheduledEnd doesn’t exceed the closing time
    if (scheduledEnd.getTime() > closingTime.getTime()) {
      console.warn(
        "Scheduled end exceeds work center closing time. Adjusting to closing time."
      );
      return {
        scheduledStart,
        scheduledEnd: closingTime,
      };
    }
  
    console.log("Product can be completed within the current open period.");
    return { scheduledStart, scheduledEnd };
  } else {
    // Handle time spilling into the next day
    const timeUsedToday = timeUntilWorkCenterCloses;
    const remainingAfterToday = remainingTimeToComplete - timeUsedToday;
  
    // Schedule work till today's closing time
    const scheduledEndToday = new Date(scheduledStart.getTime() + timeUsedToday);
  
    console.log(
      "Work spills into the next day. Scheduling till end of current workday:",
      scheduledEndToday
    );
  
    // Calculate next day's start time (assume work center opens at 6:00 AM)
    const nextStartTime = new Date(closingTime);
    nextStartTime.setDate(nextStartTime.getDate() + 1);
    nextStartTime.setHours(6, 0, 0, 0);
  
    console.log(
      "Remaining time moved to the next workday start:",
      nextStartTime
    );
  
    // Recurse for remaining time
    const nextDaySchedule = calculateProductSchedule(
      workCenter,
      nextStartTime,
      remainingAfterToday,
      workCenterSchedule,
      depth + 1
    );
  
    return {
      scheduledStart: scheduledStart,
      scheduledEnd: nextDaySchedule.scheduledEnd, // Extend schedule
    };
  }
};

const isWorkCenterOpen = (
  workCenter: string,
  date: Date,
  schedules: WorkCenterScheduleData[]
): boolean => {
  const day = date.toLocaleString("en-US", { weekday: "long" });
  const timeString = date.toTimeString().slice(0, 5); // Extracts HH:mm

  console.log("Checking if work center is open...");
  console.log("Day:", day);
  console.log("Time:", timeString);

  const daySchedule = schedules.find(
    (item) => item.date_weekday_holiday === day
  );
  console.log("Day schedule:", daySchedule);

  const normalizedWorkCenter = workCenter.replace(/\s+/g, "").toLowerCase();
  const normalizedScheduleKey = Object.keys(daySchedule || {}).find(
    (key) => key.replace(/\s+/g, "").toLowerCase() === normalizedWorkCenter
  );

  const workCenterSchedule =
    daySchedule && normalizedScheduleKey
      ? daySchedule[normalizedScheduleKey]
      : defaultOnOffTime;


  const [openTime, closeTime] = workCenterSchedule.split("-");
  const isOpen = timeString >= openTime && timeString <= closeTime;

  return isOpen;
};

const getTimeToComplete = (product: ProductData): number => {

  const productionQuantity = parseFloat(product.production_quantity || "0");
  const uph = parseFloat(product.uph || "0");
  const setUpTime = parseFloat(product.set_up || "0");
  const balanceQuantity = parseFloat(product.balance_quantity || "0");

  console.log("Production Quantity:", productionQuantity);
  console.log("UPH:", uph);
  console.log("Set-up Time:", setUpTime);
  console.log("Balance Quantity:", balanceQuantity);


  if (
    isNaN(productionQuantity) ||
    isNaN(uph) ||
    isNaN(setUpTime) ||
    isNaN(balanceQuantity)
  ) {
    console.error("Invalid numeric values:", {
      productionQuantity,
      uph,
      setUpTime,
      balanceQuantity,
    });
  }

  const timeToComplete =
    ((productionQuantity - balanceQuantity) / uph) * 60 * 60 * 1000 +
    setUpTime * 60 * 1000;

  console.log("Time to Complete:", timeToComplete);

  console.log("Time to complete in minutes:", timeToComplete / 1000 / 60);
  return timeToComplete;
};

const getTimeTileWorkCenterCloses = (
  workCenter: string,
  date: Date,
  schedules: WorkCenterScheduleData[]
): Date => {
  console.log("Getting work center closing time...");
  const day = date.toLocaleString("en-US", { weekday: "long" });

  const daySchedule = schedules.find(
    (item) => item.date_weekday_holiday === day
  );
  console.log("Day schedule:", daySchedule);

  const normalizedWorkCenter = workCenter.replace(/\s+/g, "").toLowerCase();
  const normalizedScheduleKey = Object.keys(daySchedule || {}).find(
    (key) => key.replace(/\s+/g, "").toLowerCase() === normalizedWorkCenter
  );

  const workCenterSchedule =
    daySchedule && normalizedScheduleKey
      ? daySchedule[normalizedScheduleKey]
      : defaultOnOffTime;

  console.log("Work center schedule:", workCenterSchedule);

  const [_, closeTime] = workCenterSchedule.split("-");
  const closingDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    parseInt(closeTime.slice(0, 2)),
    parseInt(closeTime.slice(3, 5))
  );

  console.log("Closing Date:", closingDate);
  return closingDate;
};
