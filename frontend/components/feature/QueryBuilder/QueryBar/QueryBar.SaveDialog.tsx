import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/base/ui/dialog";
import { Button } from "@/components/base/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/base/ui/form";
import { Input } from "@/components/base/ui/input";
import { QueryInstance } from "@/components/model/query-builder-core";
import { useQueryBuilderDictContext } from "../QueryBuilder.Context";

const formSchema = z.object({
  title: z.string(),
});

const QueryBarSaveDialog = ({
  open,
  onOpenChange,
  query,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: QueryInstance;
}) => {
  const dict = useQueryBuilderDictContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    return Promise.resolve(query.saveAsCustomPill(values.title)).then(() =>
      onOpenChange(false)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.queryBar.saveDialog.title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {dict.queryBar.saveDialog.fields.title.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        dict.queryBar.saveDialog.fields.title.placeholder
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm">{dict.queryBar.saveDialog.notice}</div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  {dict.queryBar.saveDialog.cancel}
                </Button>
              </DialogClose>
              <Button type="submit" variant="primary">
                {dict.queryBar.saveDialog.ok}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default QueryBarSaveDialog;
