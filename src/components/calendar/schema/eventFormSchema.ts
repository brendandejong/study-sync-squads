
import { z } from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  description: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
