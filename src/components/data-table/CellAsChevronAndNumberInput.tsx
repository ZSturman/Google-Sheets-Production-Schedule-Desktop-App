import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import { useDebounce } from "../../hooks/useDebounce";
import { Input } from "../ui/input";

type CellAsChevronAndNumberInputProps = {
  value: string;
  onSave: (newValue: string) => void;
  chevronProps: ChevronViewProps;
  numberInputProps: NumberInputViewProps;
};

const CellAsChevronAndNumberInput: React.FC<
  CellAsChevronAndNumberInputProps
> = ({ value, onSave, chevronProps, numberInputProps }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState<string>(value);
  const debouncedChevronValue = useDebounce(currentValue, 5000);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const stepCount = chevronProps.stepCount || 1;

  const minValue = numberInputProps.min || chevronProps.min || 0;

  useEffect(() => {
    if (value === "NaN") {
      // ADD TO LOGS, AND TOOLTIP. PLUS MAKE IT SO ATTENTION IS REQUIRED
      setCurrentValue("0");
    }
  }, []);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.target.value);
  };

  const incrementValue = () =>
    setCurrentValue(String(Number(currentValue) + stepCount));
  const decrementValue = () => {
    if (Number(currentValue) - stepCount <= minValue) {
      setCurrentValue(String(minValue));
      return;
    }
    setCurrentValue(String(Number(currentValue) - stepCount));
  };

  // Save value and exit edit mode
  const handleSave = () => {
    setIsEditing(false);
    if (currentValue !== value) {
      onSave(currentValue);
    }
  };

  // Does not fire until 5 seconds after the last edit
  useEffect(() => {
    if (debouncedChevronValue !== value) {
      onSave(debouncedChevronValue);
    }
  }, [debouncedChevronValue]);

  // Exit editing when clicking outside or pressing Enter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleSave();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSave();
      } else if (event.key === "Escape") {
        setIsEditing(false);
        setCurrentValue(value); // Reset value on cancel
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, currentValue, value]);

  // Focus input when editing mode is activated
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div>
      {isEditing ? (

        <Input
        ref={inputRef}
        type="text"
        value={currentValue}
        onChange={handleInputChange}
        className="text-center p-0 "
      />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <button onClick={incrementValue}  className="bg-transparent text-black hover:bg-transparent hover:text-black shadow-none py-0  w-full flex items-center justify-center">
            <BsChevronCompactUp />
          </button>
          <Button onClick={() => setIsEditing(true)} className="bg-transparent text-black hover:bg-transparent hover:text-black shadow-none border-1px border-black">
            {currentValue || "0"}
          </Button>
          <button onClick={decrementValue}  className="bg-transparent text-black hover:bg-transparent hover:text-black shadow-none py-0  w-full flex items-center justify-center">
            <BsChevronCompactDown />
          </button>
        </div>
      )}
    </div>
  );
};

export default CellAsChevronAndNumberInput;
