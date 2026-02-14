import { useTranslation } from "react-i18next";
import { z } from "zod/v4";

export const useTodoFormSchema = () => {
  const { t } = useTranslation();

  return z.object({
    title: z
      .string()
      .min(1, t("validation.title_required"))
      .max(100, t("validation.title_max")),
    description: z
      .string()
      .max(500, t("validation.description_max"))
      .optional()
      .or(z.literal("")),
    priority: z.enum(["low", "medium", "high"]),
    category: z.enum(["work", "personal", "shopping", "health", "other"]),
    dueDate: z.date().optional(),
  });
};

export type TodoFormValues = z.infer<ReturnType<typeof useTodoFormSchema>>;
