import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./ui/select";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  workCentersList,
  endsOptions,
} from "../data/lists";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  jobNumber: z.string().nonempty("Job Number is required"),
  customer: z.string().nonempty("Customer is required"),
  text: z.string().nonempty("Text is required"),
  workCenter: z.enum([...workCentersList] as [string, ...string[]]),
  quantity: z.preprocess(
    (value) => Number(value),
    z.number().min(1, "Quantity must be at least 1")
  ),
  length: z.preprocess(
    (value) => Number(value),
    z.number().min(1, "Length must be at least 1")
  ),
  setUp: z.preprocess(
    (value) => Number(value),
    z.number().min(0, "Set Up time cannot be negative")
  ),
  uph: z.preprocess(
    (value) => Number(value),
    z.number().min(0, "UPH cannot be negative")
  ),
  requestedShipDate: z.string().nonempty("Requested Ship Date is required"),
  cut: z.boolean(),
  extrusion: z.boolean(),
  ground: z.boolean(),
  drawing: z.string(),
  ends: z.enum([...endsOptions] as [string, ...string[]]),
  priorityValue: z.enum(["High", "Low"] as ["High", "Low"]),
});

const NewProductForm = ({
  submitNewRow,
}: {
  submitNewRow: (newRow: DataRowT) => void;
}) => {
  //const [assignWorkCenter, setAssignWorkCenter] = useState<boolean>(false);
  //const [extraInfo, setExtraInfo] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobNumber: "",
      customer: "",
      text: "",
      workCenter: "UNASSIGNED",
      quantity: 10, // Default as a number
      length: 100, // Default as a number
      requestedShipDate: new Date().toISOString().slice(0, 16),
      setUp: 120, // Default as a number
      uph: 10, // Default as a number
      cut: false,
      extrusion: false,
      ground: false,
      drawing: "",
      ends: "_",
      priorityValue: "Low" as "Low",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formattedDate = new Date(values.requestedShipDate).toISOString();

    const newRow: ProductData = {
      id: uuidv4(),
      Customer: values.customer,
      Text: values.text,
      Quantity: values.quantity,
      Length: values.length,
      Priority: values.priorityValue === "High"
          ? 0
          : 999,
      "Work Center": (values.workCenter as WorkCenter),
      "Requested Ship Date": new Date(formattedDate),
      "Set Up": values.setUp,
      UPH: values.uph,
      Cut: values.cut,
      Extrusion: values.extrusion,
      Ground: values.ground,
      Drawing: values.drawing,
      Ends: values.ends as EndsColumn,
      "Balance Quantity": values.quantity,
      "Job Number": values.jobNumber,
      "Scheduled Start": new Date(),
      "Scheduled End": new Date(),
    };

    setLoading(true);

    try {
      // Call your function to handle the new row
      submitNewRow(newRow);

      // Close the dialog
      setDialogOpen(false);

      // Reset form fields to default values
      form.reset();
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>
      <DialogContent className="overflow-scroll max-h-[90vh]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Add a new product to the inventory.
              </DialogDescription>
            </DialogHeader>

            <div className="w-full m-2 gap-2 p-4 border border-black grid grid-cols-2">
              <div className="col-span-1">
                {/** Job Number */}

                <FormField
                  control={form.control}
                  name="jobNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Number</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Enter Job Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1">
                {/** Customer */}
                <FormField
                  control={form.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Customer Name"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2">
                {/** Text */}
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1">
                {/** Quantity */}
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter Quantity"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1">
                {/** Length */}
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          type="number"
                          placeholder="Enter Length"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1">
                {/** UPH */}
                <FormField
                  control={form.control}
                  name="uph"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UPH (unit/hour)</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          type="number"
                          placeholder="Enter UPH"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1">
                {/** Set Up */}
                <FormField
                  control={form.control}
                  name="setUp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Set Up (min)</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          type="number"
                          placeholder="Enter Set Up time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                {/** Requested Ship Date */}
                <FormField
                  control={form.control}
                  name="requestedShipDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requested Ship Date</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

              <div className="w-full m-2 gap-2 p-4 border border-black grid grid-cols-2">
                <div className="col-span-2">
                  {/** Work Center */}
                  <FormField
                    control={form.control}
                    name="workCenter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Center</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="text-black">
                            {field.value}
                          </SelectTrigger>
                          <SelectContent className="text-black">
                            {workCentersList.map((workCenter) => (
                              <SelectItem key={workCenter} value={workCenter}>
                                {workCenter}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2">
                  {/** Priority */}
                  <FormField
                    control={form.control}
                    name="priorityValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormDescription>
                          High priority jobs are given priority 1, meaning they will be put at the top of the queue.
                          Low priority jobs are given priority 999, meaning they will be put at the bottom of the queue.
                        </FormDescription>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={"low"}
                        >
                          <SelectTrigger className="text-black">
                            {field.value}
                          </SelectTrigger>
                          <SelectContent className="text-black">
                            <SelectItem value={"High"}>High</SelectItem>
                            <SelectItem value={"Low"}>Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
 

            <div className="w-full m-2 gap-2 p-4 border border-black grid grid-cols-2">
              <div className="col-span-1">
                {/** Cut */}
                <FormField
                  control={form.control}
                  name="cut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cut</FormLabel>
                      <FormControl>
                        <Input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1">
                {/** Extrusion */}
                <FormField
                  control={form.control}
                  name="extrusion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extrusion</FormLabel>
                      <FormControl>
                        <Input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1">
                {/** Ground */}
                <FormField
                  control={form.control}
                  name="ground"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ground</FormLabel>
                      <FormControl>
                        <Input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1">
                {/** Drawing */}
                <FormField
                  control={form.control}
                  name="drawing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drawing</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1">
                {/** Ends */}
                <FormField
                  control={form.control}
                  name="ends"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ends</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="text-black">
                          {field.value}
                        </SelectTrigger>
                        <SelectContent className="text-black">
                          {endsOptions.map((ends) => (
                            <SelectItem key={ends} value={ends}>
                              {ends}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProductForm;
