import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";

type CellAsPopupDateTimePickerProps = {
  value: string; // Format: "YYYY-MM-DDTHH:MM"
  onSave: (newValue: string) => void;
  className?: string;
};

const normalizeDateTimeString = (value: string): string => {
  // Replace space with 'T' for ISO 8601 compliance
  let normalizedValue = value.includes(" ") ? value.replace(" ", "T") : value;

  // Ensure time part is complete (e.g., "00:00" if missing)
  if (!normalizedValue.includes("T")) {
    normalizedValue += "T00:00";
  } else if (normalizedValue.endsWith("T")) {
    normalizedValue += "00:00";
  }

  return normalizedValue;
};

const CellAsPopupDateTimePicker: React.FC<CellAsPopupDateTimePickerProps> = ({
  value,
  onSave,
}) => {
  const [date, setDate] = useState<Date | undefined>(
    value && !isNaN(new Date(normalizeDateTimeString(value)).getTime())
      ? new Date(normalizeDateTimeString(value))
      : new Date() // Default to the current date
  );

  useEffect(() => {
    if (!value || isNaN(new Date(normalizeDateTimeString(value)).getTime())) {
      console.error("Invalid date value:", value);
    }
  }, [value]);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate && !isNaN(newDate.getTime())) {
      setDate(newDate);
    } else {
      console.warn("Invalid date selected");
    }
  };

  const handleTimeChange = (newTime: Date) => {
    setDate((prevDate) => {
      const baseDate = prevDate || new Date(); // Fallback to a valid base date
      const updatedDate = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        newTime.getHours(),
        newTime.getMinutes()
      );
      return updatedDate;
    });
  };
  const handleSave = () => {
    if (date && !isNaN(date.getTime())) {
      onSave(date.toISOString());
    } else {
      console.error("Cannot save invalid date");
    }
  };

  return (
    <Popover onOpenChange={(open) => !open && handleSave()}>
      <PopoverTrigger asChild>
        <Button className="bg-transparent hover:bg-transparent border-[1px] border-black text-black hover:text-black">
          {date && !isNaN(date.getTime()) ? (
            format(date, "MMM d p")
          ) : (
            <span className="text-red-500">Invalid date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
        <div className="p-3 border-t">
          <TimePickerDemo
            setTime={handleTimeChange}
            date={date || new Date()}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CellAsPopupDateTimePicker;

interface TimePickerDemoProps {
  date: Date;
  setTime: (date: Date) => void;
}

export function TimePickerDemo({ date, setTime }: TimePickerDemoProps) {
  const formattedTime = date
    ? `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes()
      ).padStart(2, "0")}`
    : "00:00";

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const newDate = new Date(date);
      newDate.setHours(hours, minutes);
      setTime(newDate);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="time" className="text-xs">
          Time
        </Label>
        <input
          id="time"
          type="time"
          value={formattedTime}
          onChange={handleTimeChange}
          className="w-full text-center"
        />
      </div>
    </div>
  );
}
