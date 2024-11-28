import { BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import { Button } from "../ui/button";
import { useState } from "react";

export const NumberIncrement = (
  value: number,
  handleValueChange: (value: number) => void,
  editing: boolean,
  toggleIsEditing: () => void,
  stepValue: number = 10
) => {
  const [localValue, setLocalValue] = useState(value);

  const increment = () => {
    handleValueChange(value + stepValue);
  };

  const decrement = () => {
    handleValueChange(value - stepValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value ? parseInt(e.target.value, 10) : NaN;
    if (!isNaN(newValue)) {

      setLocalValue(newValue);
    } else {

      setLocalValue(0);
    }
  };

  const handleBlur = () => {
    // Delay saving to avoid interruption during typing
    setTimeout(() => {

      handleValueChange(localValue);
      toggleIsEditing();
    }, 150); // Adjust delay as needed
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {

      handleValueChange(localValue);
      toggleIsEditing();
    }
  };

  if (!editing) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Button
          onClick={increment}
          variant="ghost"
          size="sm"
          className="shadow-none bg-transparent text-black flex items-end justify-center p-0 px-1"
        >
          <BsChevronCompactUp />
        </Button>
        <Button
          onClick={() => {
      
            toggleIsEditing();
          }}
          className="shadow-none bg-transparent text-black p-0 m-0 px-1 hover:bg-transparent hover:text-black hover:cursor-text"
        >
          {value}
        </Button>
        <Button
          onClick={decrement}
          variant="ghost"
          size="sm"
          className="shadow-none bg-transparent text-black flex items-start justify-center p-0 px-1"
        >
          <BsChevronCompactDown />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={increment}
        variant="ghost"
        size="sm"
        className="shadow-none bg-transparent text-black flex items-center justify-center p-0 px-1"
      >
        <BsChevronCompactUp />
      </Button>
      <input
        type="number" // Ensure proper input type for numbers
        value={localValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        autoFocus
        className="w-24 text-center bg-background py-2 tabular-nums text-foreground focus:outline-none appearance-none no-spinner"
        style={{
          appearance: "none",
        }}
      />
      <Button
        onClick={decrement}
        variant="ghost"
        size="sm"
        className="shadow-none bg-transparent text-black flex items-center justify-center p-0 px-1"
      >
        <BsChevronCompactDown />
      </Button>
    </div>
  );
};