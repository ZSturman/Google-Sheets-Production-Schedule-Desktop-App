export const renderCellValue = (
  val: any,
  type: "text" | "number" | "date" | "time" | "boolean" | "checkbox",
  defaultValue: any
): string => {
  if (val === null || val === undefined) {
    return String(defaultValue || "N/A"); // Fallback to default value or "N/A"
  }

  try {
    switch (type) {
      case "text":
        return typeof val === "string" ? val : String(val);

      case "number":
        if (typeof val === "number" && !isNaN(val)) {
          return val.toLocaleString(); // Format numbers (e.g., add commas)
        }
        return String(defaultValue || "N/A");

      case "date":
        if (typeof val === "string" || val instanceof Date) {
          const parsedDate = new Date(val);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate.toLocaleDateString(); // Format as date
          }
        }
        return String(defaultValue || "N/A");

      case "time":
        if (typeof val === "string" || val instanceof Date) {
          const parsedTime = new Date(val);
          if (!isNaN(parsedTime.getTime())) {
            return parsedTime.toLocaleTimeString(); // Format as time
          }
        }
        return String(defaultValue || "N/A");

      case "boolean":
        if (typeof val === "boolean") {
          return val ? "Yes" : "No";
        }
        if (typeof defaultValue === "boolean") {
          return defaultValue ? "Yes" : "No";
        }
        return "N/A";

      case "checkbox":
        if (typeof val === "boolean") {
          return val ? "Checked" : "Unchecked";
        }
        if (typeof defaultValue === "boolean") {
          return defaultValue ? "Checked" : "Unchecked";
        }
        return "N/A";

      default:
        return String(defaultValue || "N/A"); // Fallback for unsupported types
    }
  } catch (error) {
    // If any error occurs during processing, fallback to default value
    return String(defaultValue || "N/A");
  }
};