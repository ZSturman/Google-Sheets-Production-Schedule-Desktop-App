import { differenceInDays, isBefore } from "date-fns";
import { useGantt } from "../context/GanttProvider";
import { useTab } from "../context/TabProvider";

const getStatusForProduct = (product: ProductData): string => {
  const startdate = new Date(product["scheduled_start"]);
  const enddate = new Date(product["scheduled_end"]);
  const duedate = new Date(product["requested_ship_date"]);


  const isReady = checkBalanceQuantity(product);

  let className = isReady ? "bg-opacity-50" : "";

  if (isBefore(duedate, startdate)) {
    className += " bg-red-500";
  } else if (isBefore(duedate, enddate)) {
    className += " bg-yellow-500";
  } else {
    className += " bg-green-500";
  }

  return className;
};

const checkBalanceQuantity = (product: ProductData): boolean => {
  return (
    product["balance_quantity"] === 0 ||
    product["balance_quantity"] === "" ||
    product["balance_quantity"] === null ||
    product["balance_quantity"] === undefined
  );
};

const CurrentProduct = () => {
  const { ganttProducts } = useGantt();
  const { selectedTab } = useTab();

  if (ganttProducts.length === 0 && selectedTab.isWorkCenter) {
    return <div>No jobs scheduled for this work center</div>;
  }

  const calculateLateness = (product: ProductData): string => {
  const dueDate = new Date(product.requested_ship_date);
  const endDate = new Date(product.scheduled_end);
  const daysDifference = differenceInDays(dueDate, endDate);

  if (daysDifference < 0) {
    return `${Math.abs(daysDifference)} days late`;
  } else if (daysDifference > 0) {
    return `${daysDifference} days early`;
  } else {
    return "On time";
  }
};

  const handleMarkReadyForInspection = (productId: string) => {
    console.log(`Marking product ${productId} as Ready for Inspection`);
    // Implement logic here
  };

  return (
    <div>
      You have {ganttProducts.length} jobs scheduled for this work center
      <div>
        {ganttProducts.map((product) => (
          <div
            key={product.id}
            className={`${getStatusForProduct(product)} bg-opacity-50`}
          >
            <div className="flex flex-row justify-between">
              <div className="flex flex-col p-2">
                {checkBalanceQuantity(product) &&                  <button
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  onClick={() => handleMarkReadyForInspection(product.id)}
                >
                  Ready for Inspection
                </button>}
                <div className="font-bold">{product.job_number}</div>
              </div>

              <div className="flex items-end flex-col">
                <div className="flex flex-row">
                  <div>Ship Date:</div>

                  <div className="font-bold">
                    {new Date(
                      product["requested_ship_date"]
                    ).toLocaleDateString()}
                  </div>
                </div>

                <div>
                {calculateLateness(product)}
                </div>

                <div className="flex flex-row">
                  <div>Esitmated Complete Date:</div>

                  <div className="font-bold">
                    {new Date(product["scheduled_end"]).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentProduct;




// import { isBefore, isAfter, differenceInDays } from "date-fns";
// import { useGantt } from "../context/GanttProvider";
// import { useTab } from "../context/TabProvider";

// const getStatusForProduct = (product: ProductData): string => {
//   const startDate = new Date(product.scheduled_start);
//   const endDate = new Date(product.scheduled_end);
//   const dueDate = new Date(product.requested_ship_date);
//   const now = new Date();

//   if (isBefore(dueDate, now) && isAfter(now, endDate)) {
//     return "bg-red-500"; // Late
//   } else if (isBefore(now, endDate) && isAfter(now, startDate)) {
//     return "bg-yellow-500"; // In progress
//   } else {
//     return "bg-green-500"; // Ready or early
//   }
// };

// const checkBalanceQuantity = (product: ProductData): boolean => {
//   return !product.balance_quantity || product.balance_quantity === 0;
// };

// const calculateLateness = (product: ProductData): string => {
//   const dueDate = new Date(product.requested_ship_date);
//   const endDate = new Date(product.scheduled_end);
//   const daysDifference = differenceInDays(dueDate, endDate);

//   if (daysDifference < 0) {
//     return `${Math.abs(daysDifference)} days late`;
//   } else if (daysDifference > 0) {
//     return `${daysDifference} days early`;
//   } else {
//     return "On time";
//   }
// };

// const CurrentProduct = () => {
//   const { ganttProducts } = useGantt();
//   const { selectedTab } = useTab();

//   if (ganttProducts.length === 0 && selectedTab.isWorkCenter) {
//     return <div>No jobs scheduled for this work center</div>;
//   }

//   const handleMarkReadyForInspection = (productId: string) => {
//     console.log(`Marking product ${productId} as Ready for Inspection`);
//     // Implement logic here
//   };

//   return (
//     <div>
//       <h2 className="text-lg font-bold">
//         {`You have ${ganttProducts.length} jobs scheduled for this work center`}
//       </h2>
//       <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border px-4 py-2">Job Number</th>
//             <th className="border px-4 py-2">Ship Date</th>
//             <th className="border px-4 py-2">Scheduled Start</th>
//             <th className="border px-4 py-2">Scheduled End</th>
//             <th className="border px-4 py-2">Status</th>
//             <th className="border px-4 py-2">Ready</th>
//             <th className="border px-4 py-2">Lateness</th>
//             <th className="border px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {ganttProducts.map((product) => (
//             <tr
//               key={product.id}
//               className={`${getStatusForProduct(product)} bg-opacity-50`}
//             >
//               <td className="border px-4 py-2">{product.job_number}</td>
//               <td className="border px-4 py-2">
//                 {new Date(product.requested_ship_date).toLocaleDateString()}
//               </td>
//               <td className="border px-4 py-2">
//                 {new Date(product.scheduled_start).toLocaleDateString()}
//               </td>
//               <td className="border px-4 py-2">
//                 {new Date(product.scheduled_end).toLocaleDateString()}
//               </td>
//               <td className="border px-4 py-2">
//                 {checkBalanceQuantity(product) ? "Ready" : "In Progress"}
//               </td>
//               <td className="border px-4 py-2">
//                 {checkBalanceQuantity(product) ? "✔️" : "❌"}
//               </td>
//               <td className="border px-4 py-2">{calculateLateness(product)}</td>
//               <td className="border px-4 py-2">

//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CurrentProduct;