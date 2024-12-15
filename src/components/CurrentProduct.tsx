import { useGantt } from "../context/GanttProvider";

const CurrentProduct = () => {
  const { ganttDays, ganttProducts } = useGantt();

  if (ganttProducts.length === 0) {
    return <div>No jobs scheduled for this work center</div>;
  }

  // if product.balance_quantity === 0, ask "Move to Ready?"
  ganttProducts.forEach((product) => {
    if (product.balanceQuantity === 0) {
      console.log("Move to Ready?");
    }
  });

  return (
    <div>
      You have {ganttProducts.length} jobs scheduled for this work center. The
      first job is <br />
      {ganttProducts[0].title}
    </div>
  );
};

export default CurrentProduct;
