import React, { useState, useEffect, useRef } from "react";

type CellAsTextInputProps = {
    value: string;
    onSave: (newValue: string) => void;
    className?: string;
  };
  
const CellAsTextInput: React.FC<CellAsTextInputProps> = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

export default CellAsTextInput;