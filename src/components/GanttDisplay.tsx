import { useGantt } from "../context/GanttProvider";

// Utility function to generate time labels
const generateTimeLabels = (interval = 2) => {
  const labels = [];
  for (let hour = 0; hour < 24; hour += interval) {
    const time = new Date(0, 0, 0, hour, 0);
    labels.push(
      time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    );
  }
  return labels;
};

// Component for rendering a single day's header
const DayHeader = ({ date }: { date: Date }) => {
  return (
    <h1>
      {date.toLocaleString("en-US", { weekday: "long" })},{" "}
      {date.toLocaleString("en-US", { month: "long" })}{" "}
      {date.toLocaleString("en-US", { day: "numeric" })}
    </h1>
  );
};

// Component for rendering the time grid
const TimeGrid = () => {
  const timeLabels = generateTimeLabels();
  return (
    <div className="absolute top-0 left-0 w-full h-full opacity-50 grid grid-cols-12">
      {timeLabels.map((label, index) => (
        <div key={index} className="text-xs">
          {label}
        </div>
      ))}
    </div>
  );
};

const DayDetails = ({ opening, closing }: { opening: Date; closing: Date }) => {
  const getPositionPercentage = (time: Date) => {
    const totalMinutes = time.getHours() * 60 + time.getMinutes();
    const percentage = (totalMinutes / (24 * 60)) * 100; // Normalize to 24 hours
    return percentage;
  };

  const openingPosition = getPositionPercentage(opening);
  const closingPosition = getPositionPercentage(closing);

  return (
    <div className="w-full h-full absolute top-0 left-0 overflow-hidden opacity-10">
      <div
        className="absolute top-0 left-0  h-full  bg-black"
        style={{ width: `${openingPosition}%` }}
      />
      <div
        className="absolute top-0 left-0  h-full w-full  bg-black"
        style={{ left: `${closingPosition}%` }}
      />
    </div>
  );
};

const getPositionPercentage = (time: Date) => {
  const totalMinutes = time.getHours() * 60 + time.getMinutes();
  const percentage = (totalMinutes / (24 * 60)) * 100; // Normalize to 24 hours
  return percentage;
};


const calculateProductBar = (product: ProductData, day: Date) => {

  if (!product.scheduled_start || !product.scheduled_end || !product.requested_ship_date) return null;

  const scheduledStart = new Date(product.scheduled_start)
  const scheduledEnd = new Date(product.scheduled_end)
  const requestedShip = new Date(product.requested_ship_date)
  const productNumber = product.job_number

  let className = ""
  let text = ""

  if (day < scheduledStart && day < scheduledEnd) {
    className += " border border-blue-500 border-2 "
    text += " NOT STARTED"
    
  }

  if (day > scheduledStart && day < scheduledEnd) {
    className += " bg-yellow-200 "
    text += " IN PROGRESS"
  }

  if (day > scheduledStart && day > scheduledEnd) {
    className += " bg-green-200 "
    text += " COMPLETED"
  }

  if (scheduledEnd > requestedShip) {
    className += " bg-blue-500 "
    text += "  EARLY"
  }

  if (scheduledEnd ==  requestedShip) {
    className += " bg-green-500 "
    text += " ON TIME"
  }

  if (scheduledEnd < requestedShip) {
    className += " bg-red-500 "
    text += " LATE"
  }

  text += ` ${scheduledStart.toLocaleTimeString()} - ${scheduledEnd.toLocaleTimeString()}`



  return (
    <div
      className={`${className}`}
    >
      <div className="text-xs text-center">{productNumber}</div>
      <div className="text-xs text-center">{text}</div>
    </div>
  );

}

const ProductBars = ({
  products,
  date,
}: {
  products: ProductData[];
  date: Date;
}) => {

  return (
    <div className="relative w-full">
      {products.map((product, index) => {
        return <div key={index}>{calculateProductBar(product, date)}</div>;
      })}
    </div>
  );
};

const GanttDisplay = () => {
  const { ganttDays, ganttProducts } = useGantt();

  if (!ganttDays || !ganttProducts) return null;

  return (
    <div>
      {ganttDays.map((day, index) => (
        <div key={index}>
          <DayHeader date={day.date} />
          <div className="relative flex flex-row w-full p-5 border border-gray-300">
            <TimeGrid />
            <DayDetails opening={day.opening} closing={day.closing} />
            <ProductBars products={ganttProducts} date={day.date} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GanttDisplay;
