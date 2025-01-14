import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useState } from "react";
import { Label } from "../ui/label";

type CellAsPopupTwoTimePickersProps = {
  value: string; // Input format: "06:00-17:00"
  onSave: (newValue: string) => void;
  className?: string;
};

const normalizeTimeRange = (value: string): string => {
  const defaultRange = "06:00-17:00";
  if (!value || !/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(value)) {
    return defaultRange;
  }
  const [from, to] = value.split("-");
  const isValidTime = (time: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
  return isValidTime(from) && isValidTime(to) ? value : defaultRange;
};


const CellAsPopupDateTimePicker: React.FC<CellAsPopupTwoTimePickersProps> = ({
  value,
  onSave,
}) => {
  const normalizedValue = normalizeTimeRange(value);
  const [fromTime, setFromTime] = useState<string>(normalizedValue.split("-")[0]);
  const [toTime, setToTime] = useState<string>(normalizedValue.split("-")[1]);

  const handleSave = () => {
    const formattedValue = `${fromTime}-${toTime}`;
    onSave(formattedValue);
  };


  const handleTimeChange = (type: "from" | "to", newTime: string) => {
    if (type === "from") setFromTime(newTime);
    if (type === "to") setToTime(newTime);
  };


  return (
    <Popover onOpenChange={(open) => !open && handleSave()}>
    <PopoverTrigger asChild>
      <Button className="bg-transparent hover:bg-transparent border-[1px] border-black text-black hover:text-black">
        {`${fromTime}-${toTime}`}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-4">
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label htmlFor="fromTime" className="text-xs">
            From
          </Label>
          <input
            id="fromTime"
            type="time"
            value={fromTime}
            onChange={(e) => handleTimeChange("from", e.target.value)}
            className="w-full text-center"
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="toTime" className="text-xs">
            To
          </Label>
          <input
            id="toTime"
            type="time"
            value={toTime}
            onChange={(e) => handleTimeChange("to", e.target.value)}
            className="w-full text-center"
          />
        </div>
      </div>
    </PopoverContent>
  </Popover>
  );
};

export default CellAsPopupDateTimePicker;

