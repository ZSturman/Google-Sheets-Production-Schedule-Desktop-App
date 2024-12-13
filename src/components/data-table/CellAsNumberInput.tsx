

import React, { useState, useEffect, useRef } from "react";

type CellAsNumberInputProps = {
    value: string;
    onSave: (newValue: string) => void;
    className?: string;
  };
  
const CellAsNumberInput: React.FC<CellAsNumberInputProps> = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value === "NaN") {
      // ADD TO LOGS, AND TOOLTIP. PLUS MAKE IT SO ATTENTION IS REQUIRED
      setCurrentValue("0");
    }
  }, [])

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.target.value);
  };

  // Save value and exit edit mode
  const handleSave = () => {
    setIsEditing(false);
    if (currentValue !== value) {
      onSave(currentValue);
    }
  };

  // Exit editing when clicking outside or pressing Enter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
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
        <input
          ref={inputRef}
          type="text"
          value={currentValue}
          onChange={handleInputChange}
        />
      ) : (
        <button onClick={() => setIsEditing(true)}>{value || "Click to edit"}</button>
      )}
    </div>
  );
};

export default CellAsNumberInput;