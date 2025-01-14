import { useEffect, useMemo, useState } from "react";
import { useData } from "../context/DataProvider";
import { useGantt } from "../context/GanttProvider";
import { useTab } from "../context/TabProvider";
import { differenceInDays } from "date-fns";

const SingleProductInfo = () => {
  const { moveToReady } = useData();
  const { ganttProducts } = useGantt();
  const { selectedTab } = useTab();
  const [products, setProducts] = useState(ganttProducts);

  useEffect(() => {
    setProducts(ganttProducts); // Update local state when ganttProducts changes
  }, [ganttProducts]);

  const product = products[0];

  const latenessMessage = useMemo(() => {
    if (!product) return null;

    const dueDate = new Date(product.requested_ship_date);
    const endDate = new Date(product.scheduled_end);
    const daysDifference = differenceInDays(dueDate, endDate);

    if (daysDifference < 0) {
      return `${Math.abs(daysDifference)} day(s) late`;
    } else if (daysDifference > 0) {
      return `${daysDifference} day(s) early`;
    } else {
      return "On time";
    }
  }, [product]);

  const isBalanceQuantityZero = useMemo(() => {
    if (!product) return false;

    return (
      product["balance_quantity"] === 0 ||
      product["balance_quantity"] === "0" ||
      product["balance_quantity"] === "" ||
      product["balance_quantity"] === null ||
      product["balance_quantity"] === undefined
    );
  }, [product]);

  if (products.length === 0 && selectedTab.isWorkCenter) {
    return <div>No jobs scheduled for this work center</div>;
  }

  if (!product) {
    return null;
  }

  return (
    <div className="flex flex-col p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col p-2">
          {isBalanceQuantityZero && (
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={() => moveToReady(product)}
            >
              Ready for Inspection
            </button>
          )}
          <div className="font-bold">{product.job_number}</div>
          <div>{product.customer}</div>
        </div>

        <div className="flex flex-row items-center text-xl ">
          <div>Balance Quantity: </div>
          <div className="font-bold">{product["balance_quantity"]}</div>
        </div>

        <div className="flex items-end flex-col">
          <div className="flex flex-row">
            <div>Ship Date:</div>
            <div className="font-bold">
              {new Date(product["requested_ship_date"]).toLocaleDateString()}
            </div>
          </div>

          <div className="flex flex-row">
            <div>Estimated Complete Date:</div>
            <div className="font-bold">
              {new Date(product["scheduled_end"]).toLocaleDateString()}
            </div>
          </div>
          <div>{latenessMessage}</div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductInfo;