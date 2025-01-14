import { useEffect, useMemo, useState } from "react";
import { useGantt } from "../context/GanttProvider";
import { differenceInDays } from "date-fns";
import { Button } from "./ui/button";
import { useData } from "../context/DataProvider";
import { productsTab } from "../data/tabs";

const ReadyForInspection = () => {
  const { ganttProducts } = useGantt();
  const { handleDeleteRows } = useData();
  const [products, setProducts] = useState(ganttProducts);

  useEffect(() => {
    setProducts(ganttProducts);
  }, [ganttProducts]);

  const latenessMessages = useMemo(() => {
    return ganttProducts.map((product) => {
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
    });
  }, [ganttProducts]);

  const deleteItem = (product: ProductData) => {
    handleDeleteRows(productsTab, [product]);
    setProducts(products.filter((p) => p.job_number !== product.job_number));
  };

  return (
    <div className="flex flex-col p-4">
      {products.map((product, index) => (
        <div
          key={product.job_number}
          className="flex flex-row justify-between border-b-2 mb-2"
        >
          <div className="flex flex-row items-center gap-3">
            <Button
              className="bg-transparent hover:bg-zinc-500 text-zinc-500 font-semibold hover:text-white py-2 px-4 border border-zinc-500 hover:border-transparent rounded"
              onClick={() => deleteItem(product)}
            >
              Delete?
            </Button>
            <div className="flex flex-col p-2">
              <div className="font-bold">{product.job_number}</div>
              <div>{product.customer}</div>
            </div>
          </div>

          <div className="flex flex-row">
            <div>Ship Date:</div>
            <div className="font-bold">
              {new Date(product["requested_ship_date"]).toLocaleDateString()}
            </div>
          </div>

          <div>{latenessMessages[index]}</div>
        </div>
      ))}
    </div>
  );
};

export default ReadyForInspection;
