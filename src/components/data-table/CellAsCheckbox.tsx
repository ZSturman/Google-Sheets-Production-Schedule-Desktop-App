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
    console.log("NEW CHECKBOX VALUE", newValue); // Log the new value as a string
    onSave(newValue); // Notify parent component with string
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
        />
        {isChecked ? "Checked" : "Unchecked"}
      </label>
    </div>
  );
};

export default CellAsCheckbox;