import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { useTodoFormSchema, type TodoFormValues } from "@/lib/schemas";
import { PRIORITIES, CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface TodoFormProps {
  defaultValues?: Todo;
  onSubmit: (values: TodoFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TodoForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel,
}: TodoFormProps) {
  const { t } = useTranslation();
  const formSchema = useTodoFormSchema();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      priority: defaultValues?.priority ?? "medium",
      category: defaultValues?.category ?? "personal",
      dueDate: defaultValues?.dueDate,
    },
  });

  const dueDateValue = watch("dueDate");
  const priorityValue = watch("priority");
  const categoryValue = watch("category");

  useEffect(() => {
    if (defaultValues) {
      reset({
        title: defaultValues.title,
        description: defaultValues.description ?? "",
        priority: defaultValues.priority,
        category: defaultValues.category,
        dueDate: defaultValues.dueDate,
      });
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = (values: TodoFormValues) => {
    onSubmit(values);
    if (!defaultValues) {
      reset({
        title: "",
        description: "",
        priority: "medium",
        category: "personal",
        dueDate: undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          {t("form.title")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder={t("form.title_placeholder")}
          {...register("title")}
          className={cn(errors.title && "border-destructive")}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">{t("form.description")}</Label>
        <Input
          id="description"
          placeholder={t("form.description_placeholder")}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Priority & Category row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("form.priority")}</Label>
          <Select
            value={priorityValue}
            onValueChange={(v) =>
              setValue("priority", v as TodoFormValues["priority"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("form.priority_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {t(`priority.${p.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("form.category")}</Label>
          <Select
            value={categoryValue}
            onValueChange={(v) =>
              setValue("category", v as TodoFormValues["category"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("form.category_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {t(`category.${c.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <Label>{t("form.due_date")}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDateValue && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDateValue
                ? format(dueDateValue, "PPP")
                : t("form.pick_date")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDateValue}
              onSelect={(date) =>
                setValue("dueDate", date ?? undefined, {
                  shouldValidate: true,
                })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {dueDateValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-xs text-muted-foreground"
            onClick={() => setValue("dueDate", undefined)}
          >
            {t("form.clear_date")}
          </Button>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("button.cancel")}
          </Button>
        )}
        <Button type="submit">{submitLabel || t("button.add_todo")}</Button>
      </div>
    </form>
  );
}
