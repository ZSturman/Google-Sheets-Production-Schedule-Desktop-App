// Function to parse a single time string like "HH:MM"
function parseTimeString(timeString: string): TimeFormat {
    const [hour, minute] = timeString.split(":").map(Number);
    if (
      isNaN(hour) ||
      isNaN(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      throw new Error(`Invalid time format: ${timeString}`);
    }
    return { hour, minute };
  }
  
  // Reusable function to convert a "start-end" string into [TimeFormat, TimeFormat]
  function toTimeRange(value: string): [TimeFormat, TimeFormat] {
    const [startString, endString] = value.split("-").map((s) => s.trim());
    if (!startString || !endString) {
      throw new Error(`Invalid time range format: ${value}`);
    }
    return [parseTimeString(startString), parseTimeString(endString)];
  }
  
  // Reusable function to convert [TimeFormat, TimeFormat] into a string
  function timeRangeToString(value: [TimeFormat, TimeFormat]): string {
    return `${value[0].hour}:${value[0].minute.toString().padStart(2, "0")}-${
      value[1].hour
    }:${value[1].minute.toString().padStart(2, "0")}`;
  }

  
  export { parseTimeString, toTimeRange, timeRangeToString };