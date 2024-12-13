import { useTable } from "../context/TableProvider";


const GanttDisplay = () => {

    const { selectedData } = useTable();

    console.log(selectedData);
  return (
    <div>
        {
            selectedData.map((data, index) => {
                return (
                    <div key={index}>
                        {data.scheduled_start}
                        <br />
                        - {data.scheduled_end}
                    </div>
                )
            })
        }
    </div>
  )
}

export default GanttDisplay