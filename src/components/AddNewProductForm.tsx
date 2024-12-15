import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
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
  cutOptions,
  groundOptions,
  extrusionOptions,
  drawingOption,
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
  cut: z.enum([...cutOptions] as [string, ...string[]]),
  extrusion: z.enum([...extrusionOptions] as [string, ...string[]]),
  ground: z.enum([...groundOptions] as [string, ...string[]]),
  drawing: z.enum([...drawingOption] as [string, ...string[]]),
  ends: z.enum([...endsOptions] as [string, ...string[]]),
  priorityValue: z.enum(["High", "Low"] as ["High", "Low"]),
});

const NewProductForm = ({
  submitNewRow,
}: {
  submitNewRow: (newRow: DataRowT) => void;
}) => {
  const [assignWorkCenter, setAssignWorkCenter] = useState<boolean>(false);
  const [extraInfo, setExtraInfo] = useState<boolean>(false);
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
      cut: "_",
      extrusion: "_",
      ground: "_",
      drawing: "_",
      ends: "_",
      priorityValue: "Low" as "Low",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newRow: ProductData = {
      id: uuidv4(),
      Customer: values.customer,
      Text: values.text,
      Quantity: values.quantity,
      Length: values.length,
      Priority: assignWorkCenter
        ? values.priorityValue === "High"
          ? 0
          : 999
        : 999,
      "Work Center": assignWorkCenter
        ? (values.workCenter as WorkCenter)
        : "UNASSIGNED",
      "Requested Ship Date": new Date(values.requestedShipDate),
      "Set Up": values.setUp,
      UPH: values.uph,
      Cut: extraInfo ? (values.cut as CutColumn) : "_",
      Extrusion: extraInfo ? (values.extrusion as ExtrusionColumn) : "_",
      Ground: extraInfo ? (values.ground as GroundColumn) : "_",
      Drawing: extraInfo ? (values.drawing as DrawingColumn) : "_",
      Ends: extraInfo ? (values.ends as EndsColumn) : "_",
      "Balance Quantity": values.quantity,
      "Job Number": values.jobNumber,
      "Production Quantity": values.quantity,
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

            {!assignWorkCenter && (
              <div className="w-full flex justify-end mb-2">
                <Button
                  className="bg-transparent text-black hover:text-white hover:bg-zinc-800"
                  onClick={() => setAssignWorkCenter(true)}
                >
                  Assign Work Center
                </Button>
              </div>
            )}

            {assignWorkCenter && (
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

                <div className="col-span-1">
                  {/** Priority */}
                  <FormField
                    control={form.control}
                    name="priorityValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
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
                <div className="col-span-1 mt-auto ml-auto">
                  <Button
                    className="bg-transparent shadow-none text-muted text-black  hover:bg-transparent"
                    onClick={() => setAssignWorkCenter(false)}
                  >
                    Use default values instead
                  </Button>
                </div>
              </div>
            )}

            {!extraInfo && (
              <div className="w-full flex justify-end">
                <Button
                  className="bg-transparent text-black hover:text-white hover:bg-zinc-800"
                  onClick={() => setExtraInfo(true)}
                >
                  Add Extra Info
                </Button>
              </div>
            )}

            {extraInfo && (
              <div className="w-full m-2 gap-2 p-4 border border-black grid grid-cols-2">
                <div className="col-span-1">
                  {/** Cut */}
                  <FormField
                    control={form.control}
                    name="cut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cut</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="text-black">
                            {field.value}
                          </SelectTrigger>
                          <SelectContent className="text-black">
                            {cutOptions.map((cut) => (
                              <SelectItem key={cut} value={cut}>
                                {cut}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="text-black">
                            {field.value}
                          </SelectTrigger>
                          <SelectContent className="text-black">
                            {extrusionOptions.map((extrusion) => (
                              <SelectItem key={extrusion} value={extrusion}>
                                {extrusion}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="text-black">
                            {field.value}
                          </SelectTrigger>
                          <SelectContent className="text-black">
                            {groundOptions.map((ground) => (
                              <SelectItem key={ground} value={ground}>
                                {ground}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="text-black">
                            {field.value}
                          </SelectTrigger>
                          <SelectContent className="text-black">
                            {drawingOption.map((drawing) => (
                              <SelectItem key={drawing} value={drawing}>
                                {drawing}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                <div className="col-span-1 mt-auto ml-auto">
                  <Button
                    className="bg-transparent shadow-none text-muted text-black  hover:bg-transparent"
                    onClick={() => setExtraInfo(false)}
                  >
                    Use default values instead
                  </Button>
                </div>
              </div>
            )}

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
