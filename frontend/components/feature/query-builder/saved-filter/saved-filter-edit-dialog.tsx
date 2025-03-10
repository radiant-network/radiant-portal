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
import { SavedFilterInstance } from "@/components/model/query-builder-core";
import {
  useQueryBuilderContext,
  useQueryBuilderDictContext,
} from "../query-builder-context";
import { SavedFilterTypeEnum } from "@/components/model/saved-filter";

const formSchema = z.object({
  title: z.string().min(2, "Min 2 characters").max(50, "Max 50 characters"),
});

function SavedFiltersEditDialog({
  open,
  onOpenChange,
  savedFilter,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedFilter: SavedFilterInstance | null;
}) {
  const dict = useQueryBuilderDictContext();
  const { queryBuilder } = useQueryBuilderContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      title: savedFilter?.raw().title || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (savedFilter) {
      savedFilter.save(SavedFilterTypeEnum.Filter, { title: values.title });
    } else {
      queryBuilder.saveNewFilter({ title: values.title });
    }

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dict.savedFilter.editDialog.title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {dict.savedFilter.editDialog.fields.title.label}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        dict.savedFilter.editDialog.fields.title.placeholder
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outlined">
                  {dict.savedFilter.editDialog.cancel}
                </Button>
              </DialogClose>
              <Button type="submit" color="primary">
                {dict.savedFilter.editDialog.ok}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default SavedFiltersEditDialog;
