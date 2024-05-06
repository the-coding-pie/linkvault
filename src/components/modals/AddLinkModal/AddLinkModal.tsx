"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RefreshCcw } from "lucide-react";
import CreatableSelect from "react-select/creatable";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getCategoryWithSubs } from "@/services/categoryWithSubs";
import toast from "react-hot-toast";
import addTempLinkSchema, { AddTempLinkSchemaType } from "@/schemas/addLink";
import addTempLink from "@/actions/links/addTempLink";

interface Props {
  children: JSX.Element;
}

const AddLinkModal = ({ children }: Props) => {
  const [open, setOpen] = useState(false);

  const [isPending, startTransition] = useTransition();

  const { data, isLoading, isFetching, refetch, isError } = useQuery({
    queryKey: ["categoriesWithSubs"],
    queryFn: getCategoryWithSubs,
    staleTime: Infinity,
  });

  const form = useForm<AddTempLinkSchemaType>({
    resolver: zodResolver(addTempLinkSchema),
    defaultValues: {
      title: "",
      url: "",
      category: {},
      subCategory: {},
      description: "",
    },
  });

  const onSubmit = useCallback(async (data: AddTempLinkSchemaType) => {
    startTransition(async () => {
      const res = await addTempLink(data);

      if (!res.success) {
        toast.error(res.message);

        // @ts-ignore
        if (res.statusCode == 409) {
          // already exists
          // clear the form and hide the modal
          form.reset({
            title: "",
            url: "",
            category: {},
            subCategory: {},
            description: "",
          });

          setOpen(false);
        }
      } else {
        toast.success(res.message);

        // clear the form and hide the modal
        form.reset({
          title: "",
          url: "",
          category: {},
          subCategory: {},
          description: "",
        });

        setOpen(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!isFetching && !isLoading) {
      if (
        (isError &&
          form.watch("category")?.label &&
          form.watch("category")?.value) ||
        (isError &&
          form.watch("subCategory")?.label &&
          form.watch("subCategory")?.value)
      ) {
        toast.error("Unable to fetch Categories & Sub Categories");
      }
    }
  }, [isError, isFetching, isLoading]);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit A Link</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="max-h-[100px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"category"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-x-2">
                    Category
                    <TooltipProvider>
                      <Tooltip delayDuration={0.2}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            disabled={isFetching || isLoading}
                            aria-label="Refetch Categories"
                            onClick={() => refetch()}
                            className={cn(
                              "cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-auto",
                              (isFetching || isLoading) && "animate-spin"
                            )}
                          >
                            <RefreshCcw size={14} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Refetch Categories & Sub Categories
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-2">
                      <CreatableSelect
                        isLoading={isLoading || isFetching}
                        isDisabled={isLoading || isFetching}
                        getOptionValue={(option) => option.label!}
                        // @ts-ignore
                        options={
                          data?.categories?.map((c) => ({
                            label: c.name,
                            value: `${c.id}`,
                            isNew: false,
                          })) || []
                        }
                        {...field}
                        onCreateOption={(e) => {
                          field.onChange({
                            label: e,
                            value: e,
                            isNew: true,
                          });

                          // if label and value changes
                          if (
                            field.value.label !== e &&
                            field.value.value !== e
                          ) {
                            // reset subCategory
                            // @ts-ignore
                            form.setValue("subCategory", {});
                          }
                        }}
                        onChange={(e) => {
                          field.onChange({
                            label: e?.label,
                            value: e?.value,
                            isNew: false,
                          });

                          // if label and value changes
                          if (
                            field.value.label !== e?.label &&
                            field.value.value !== e?.value
                          ) {
                            // reset subCategory
                            // @ts-ignore
                            form.setValue("subCategory", {});
                          }
                        }}
                        className="text-sm flex-1"
                      />
                    </div>
                  </FormControl>
                  {isError && !field.value?.label && !field.value?.value ? (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      Unable to fetch Categories & Sub Categories
                    </p>
                  ) : (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"subCategory"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Category</FormLabel>
                  <FormControl>
                    <CreatableSelect
                      isLoading={isLoading || isFetching}
                      isDisabled={isLoading || isFetching}
                      getOptionValue={(option) => option.label!}
                      // @ts-ignore
                      options={
                        data?.categories
                          ?.find(
                            (l) =>
                              l.id.toString() ===
                              form.watch("category")?.value?.toString()
                          )
                          ?.subCategories?.map((s) => ({
                            label: s.name,
                            value: `${s.id}`,
                            isNew: false,
                          })) || []
                      }
                      {...field}
                      onCreateOption={(e) =>
                        field.onChange({
                          label: e,
                          value: e,
                          isNew: true,
                        })
                      }
                      className="text-sm"
                    />
                  </FormControl>
                  {isError && !field.value?.label && !field.value?.value ? (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      Unable to fetch Categories & Sub Categories
                    </p>
                  ) : (
                    <FormMessage />
                  )}
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLinkModal;
