import { useGantt } from "../context/GanttProvider";

const CurrentProduct = () => {
  const {  ganttProducts } = useGantt();



  if (ganttProducts.length === 0) {
    return <div>No jobs scheduled for this work center</div>;
  }

  const currentProduct = ganttProducts[0];

  // if product.balance_quantity === 0, ask "Move to Ready?"
  ganttProducts.forEach((product) => {
    if (product.balanceQuantity === 0) {
      console.log("Move to Ready?");
    }
  });

  if (currentProduct.balanceQuantity <= 0) {
    return <div>Move to Ready?</div>;
  }


  return (
    <div>
      You have {ganttProducts.length} jobs scheduled for this work center. The
      first job is <br />
      {ganttProducts[0].title}

      <br />
      <br />
    </div>
  );
};

export default CurrentProduct;
