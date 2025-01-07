import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "../ui/select";

type CellAsDropdownProps = {
  value: string;
  onSave: (newValue: string) => void;
  triggerProps: ButtonViewProps;
  dropdownProps: DropdownViewProps;
  className?: string;
};

const CellAsDropdown: React.FC<CellAsDropdownProps> = ({
  value,
  onSave,
  dropdownProps,
}) => {
  const [currentValue, setCurrentValue] = useState<string>(value);

  
  // Save value and exit edit mode
  const handleSave = (newValue: string) => {
    setCurrentValue(newValue);
    if (newValue !== value) {
      onSave(newValue);
    }
  };

  return (
    <Select value={currentValue} onValueChange={(v) => handleSave(v)} >
      <SelectTrigger className="text-black border-[1px] border-black text-xs">
        <SelectValue
          placeholder={
            currentValue === "UNASSIGNED"
              ? dropdownProps.placeholder
              : currentValue
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-black text-xs">
            {dropdownProps.label}
          </SelectLabel>
          {dropdownProps.items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CellAsDropdown;
