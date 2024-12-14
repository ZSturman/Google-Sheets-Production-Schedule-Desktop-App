// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { Button } from "../ui/button";
// import { useEffect, useState } from "react";

// type CellAsPopupAndTimePickerProps = {
//   value: string;
//   onSave: (newValue: string) => void;
//   triggerProps: ButtonViewProps;
//   popupProps: PopupViewProps;
//   timePickerProps: TimePickerViewProps;
//   className?: string;
// };

// const CellAsPopupAndTimePicker: React.FC<CellAsPopupAndTimePickerProps> = ({
//   value,
//   onSave,
//   // triggerProps,
//   // popupProps,
//   // timePickerProps,
// }) => {
//   const [currentValue, setCurrentValue] = useState<string>(value);

//   useEffect(() => {
//     if (value === undefined || typeof value !== "string") {
//       setCurrentValue("00:00");
//     } else {

//       const [hour, minute] = currentValue.split(":").map(Number);
//       if (
//         isNaN(hour) ||
//         isNaN(minute) ||
//         hour < 0 ||
//         hour > 23 ||
//         minute < 0 ||
//         minute > 59
//       ) {
//         console.log("Invalid time format");
//         setCurrentValue("00:00");
//       }
//     }
//   }, []);

//   // Save value and exit edit mode
//   const handleSave = () => {
//     if (currentValue !== value) {
//       onSave(currentValue);
//     }
//   };

//   return (
//     <Popover onOpenChange={handleSave}>
//       <PopoverTrigger asChild>
//         <Button>{currentValue}</Button>
//       </PopoverTrigger>
//       <PopoverContent>
//         <input
//           type="time"
//           value={currentValue}
//           onChange={(e) => setCurrentValue(e.target.value)}
//         />
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default CellAsPopupAndTimePicker;
