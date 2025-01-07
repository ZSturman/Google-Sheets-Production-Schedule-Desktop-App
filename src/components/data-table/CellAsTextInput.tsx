import React, { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type CellAsTextInputProps = {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
};

const CellAsTextInput: React.FC<CellAsTextInputProps> = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState<string>(value);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    <div className="flex items-center justify-center">
      {isEditing ? (
        <textarea
          ref={inputRef}
          value={currentValue}
          onChange={handleInputChange}
          className="text-center p-0 text-xs border-[1px] border-black rounded-md" 
        />
      ) : (
        <Button
          className="bg-transparent hover:bg-transparent text-black hover:text-black p-1  text-xs border-[1px] border-black shadown-none min-w-5 text-wrap line-clamp-2"
          onClick={() => setIsEditing(true)}
        >
          {value || "Click to edit"}
        </Button>
      )}
    </div>
  );
};

export default CellAsTextInput;
