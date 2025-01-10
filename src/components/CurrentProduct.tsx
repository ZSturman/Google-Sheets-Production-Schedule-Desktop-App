import { isAfter, isBefore } from "date-fns";
import { useGantt } from "../context/GanttProvider";
import { Button } from "./ui/button";

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

  if (ganttProducts.length === 0) {
    return <div>No jobs scheduled for this work center</div>;
  }

  return (
    <div>
      You have {ganttProducts.length} jobs scheduled for this work center
      <div>
        {ganttProducts.map((product) => (
          <div
            key={product.id}
            className={`${getStatusForProduct(product)} p-4`}
          >
            <div className="flex flex-row justify-between">
              <div>
                {checkBalanceQuantity(product) && <div>Ready</div>}
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
