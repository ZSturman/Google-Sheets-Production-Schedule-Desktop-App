import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useState } from "react";

type CellAsPopupAndCalendarProps = {
  value: string;
  onSave: (newValue: string) => void;
  triggerProps: ButtonViewProps;
  popupProps: PopupViewProps;
  calendarProps: DateViewProps;
  className?: string;
};

const CellAsPopupAndCalendar: React.FC<CellAsPopupAndCalendarProps> = ({
  value,
  onSave,
  // triggerProps,
  // popupProps,
  // calendarProps,
}) => {
  const [currentValue, setCurrentValue] = useState<string>(value);

  // Save value and exit edit mode
  const handleSave = () => {
    if (currentValue !== value) {
      onSave(currentValue);
    }
  };

  return (
    <Popover onOpenChange={handleSave}>
      <PopoverTrigger asChild>
        <Button>{currentValue}</Button>
      </PopoverTrigger>
      <PopoverContent>
      <input
            type="date"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
      </PopoverContent>
    </Popover>
  );
};

export default CellAsPopupAndCalendar;
