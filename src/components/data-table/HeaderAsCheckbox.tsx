import { Table as ReactTable } from "@tanstack/react-table";

const HeaderAsCheckbox = ({ table }: { table: ReactTable<DataRowT> }) => (
    <input
      type="checkbox"
      className="bg-transparent size-8 checked:bg-black checked:text-white"
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() ? true : false)
      }
      onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
      aria-label="SelectAll"
    />
  );

  export default HeaderAsCheckbox;