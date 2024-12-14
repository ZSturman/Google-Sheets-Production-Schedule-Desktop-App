import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

type CellAsPopupDateTimePickerProps = {
  value: string; // Format: "YYYY-MM-DDTHH:MM"
  onSave: (newValue: string) => void;
  className?: string;
};

const CellAsPopupDateTimePicker: React.FC<CellAsPopupDateTimePickerProps> = ({
  value,
  onSave,
}) => {
  const [currentValue, setCurrentValue] = useState<string>(value);

  useEffect(() => {
    const isValidDateTime = (val: string) => {
      const [date, time] = val.split("T");
      const isValidDate = !isNaN(Date.parse(date));
      const [hour, minute] = time?.split(":").map(Number) || [];
      const isValidTime =
        !isNaN(hour) &&
        !isNaN(minute) &&
        hour >= 0 &&
        hour < 24 &&
        minute >= 0 &&
        minute < 60;

      return isValidDate && isValidTime;
    };

    if (!isValidDateTime(value)) {
      setCurrentValue("2024-01-01T00:00"); // Default value
    }
  }, [value]);

  // Helper function to normalize datetime values for comparison
  const normalizeDateTime = (dateTime: string) => dateTime.replace("T", " ").trim();

  // Save value and exit edit mode only if the normalized values are different
  const handleSave = () => {
    if (normalizeDateTime(currentValue) !== normalizeDateTime(value)) {
      onSave(currentValue);
    }
  };

  return (
    <Popover onOpenChange={(open) => !open && handleSave()}>
      <PopoverTrigger asChild>
        <Button>{normalizeDateTime(currentValue)}</Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        <input
          type="date"
          value={currentValue.split("T")[0]}
          onChange={(e) => {
            const time = currentValue.split("T")[1] || "00:00";
            setCurrentValue(`${e.target.value}T${time}`);
          }}
        />
        <input
          type="time"
          value={currentValue.split("T")[1]}
          onChange={(e) => {
            const date = currentValue.split("T")[0];
            setCurrentValue(`${date}T${e.target.value}`);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CellAsPopupDateTimePicker;