import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Column } from "@tanstack/react-table";
import NewProductForm from "../AddNewProductForm";

const formMap: Record<string, React.ElementType> = {
  products: NewProductForm,
  // Add mappings for other tab names:
  // AnotherTab: AnotherTabForm,
};

export const AddOption = ({ tabName, onSubmit }: { tabName: string, onSubmit: (newRow: DataRowT) => void }) => {
  const FormComponent = formMap[tabName];

  if (!FormComponent) return null; 

  return <FormComponent submitNewRow={onSubmit} />;
};


export const exportDataButton = (handleExportData: () => void) => {
  return <Button onClick={handleExportData}>Export Data</Button>;
};

export const DeleteOption = ({ disabled, onConfirm, numberOfRows }: { disabled: boolean, onConfirm: (confirmed: boolean) => void, numberOfRows: number }) => {

  const confirmDelete = () => {
    onConfirm(true);
  }

  const cancelDelete = () => {
    onConfirm(false);
  }

return (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="destructive" disabled={disabled}>
        Delete
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete {numberOfRows} row(s)? This action cannot be
          undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
      <DialogClose asChild>
        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={cancelDelete} >Cancel</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
}

export const FilterInput = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <Input
    placeholder={placeholder}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className="text-black"
  />
);

export const ViewOptions = ({ columns }: { columns: Column<any>[] }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="ml-auto text-black">
        View
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {columns
        .filter((column) => column.getCanHide())
        .map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={column.getIsVisible()}
            onCheckedChange={(value: boolean) => column.toggleVisibility(value)}
          >
            {column.id}
          </DropdownMenuCheckboxItem>
        ))}
    </DropdownMenuContent>
  </DropdownMenu>
);
