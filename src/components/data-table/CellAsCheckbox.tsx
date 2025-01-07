import React, { useState } from "react";

type CellAsCheckboxProps = {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
};

const CellAsCheckbox: React.FC<CellAsCheckboxProps> = ({ value, onSave }) => {

  const [isChecked, setIsChecked] = useState<boolean>(value === "true");

  // Handle checkbox change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setIsChecked(newValue);
    handleSave(newValue ? "true" : "false");
  };

  // Save the updated value
  const handleSave = (newValue: string) => {
    onSave(newValue); // Notify parent component with string
  };

  return (
    <div>

        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
        />

    </div>
  );
};

export default CellAsCheckbox;