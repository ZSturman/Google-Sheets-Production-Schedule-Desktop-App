// import { useGantt } from "../context/GanttProvider";
// import TimelineComponent from "./gantt/TimelineComponent";



// const calculateProductBar = (product: GanttProductData, day: Date) => {

//   if (!product.start || !product.end || !product.due) return null;

//   const scheduledStart = new Date(product.start)
//   const scheduledEnd = new Date(product.end)
//   const requestedShip = new Date(product.due)
//   const productNumber = product.title

//   let className = ""
//   let text = ""

//   if (day < scheduledStart && day < scheduledEnd) {
//     className += " border border-blue-500 border-2 "
//     text += " NOT STARTED"
    
//   }

//   if (day > scheduledStart && day < scheduledEnd) {
//     className += " bg-yellow-200 "
//     text += " IN PROGRESS"
//   }

//   if (day > scheduledStart && day > scheduledEnd) {
//     className += " bg-green-200 "
//     text += " COMPLETED"
//   }

//   if (scheduledEnd > requestedShip) {
//     className += " bg-blue-500 "
//     text += "  EARLY"
//   }

//   if (scheduledEnd ==  requestedShip) {
//     className += " bg-green-500 "
//     text += " ON TIME"
//   }

//   if (scheduledEnd < requestedShip) {
//     className += " bg-red-500 "
//     text += " LATE"
//   }

//   //text += ` ${scheduledStart.toLocaleTimeString()} - ${scheduledEnd.toLocaleTimeString()}`



//   return (
//     <div
//       className={`${className}`}
//     >
//       <div className="text-xs text-center">{productNumber}</div>
//       <div className="text-xs text-center">{text}</div>
//     </div>
//   );

// }

// const ProductBars = ({
//   products,
//   date,
// }: {
//   products: GanttProductData[];
//   date: Date;
// }) => {

//   return (
//     <div className="relative w-full">
//       {products.map((product, index) => {
//         return <div key={index}>{calculateProductBar(product, date)}</div>;
//       })}
//     </div>
//   );
// };




// const GanttDisplay = () => {
//   const { ganttDays, ganttProducts } = useGantt();

//   if (!ganttDays || !ganttProducts) return null;

//   return (
//     <div>
//       <TimelineComponent  />
//       {ganttDays.map((day, index) => (
//         <div key={index}>
//           <div className="relative flex flex-row w-full p-5 border border-gray-300">
            
           
//             <ProductBars products={ganttProducts} date={day.date} />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default GanttDisplay;
