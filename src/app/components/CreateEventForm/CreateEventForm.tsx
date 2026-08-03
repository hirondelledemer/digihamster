import React, { FC } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, RteMessage } from "../ui/form";
import RteFormField from "../RteFormField";
import { Button } from "../ui/button";
import { toBackendDateTime } from "@/app/utils/date/date";
import { useEventsActions } from "@/app/utils/hooks/use-events/actions-context";
import { FieldsRequired } from "@/app/utils/hooks/use-events/api";
import { useTasksNewActions } from "@/app/utils/hooks/use-tasks-new/actions-context";

export interface CreateEventFormProps {
  testId?: string;
  onDone(): void;
  startAt: string;
  endAt: string;
  projectId?: number;
}

export const rteTestId = "CreateTaskForm-rte-testId";

const FormSchema = z.object({
  description: z.object({
    title: z.string().min(1, { message: "required" }),
    content: z.any(),
    tasks: z.array(z.string()),
    textContent: z.string(),
    contentJSON: z.any(),
    projectId: z.string().optional(),
  }),
});

export type FormValues = z.infer<typeof FormSchema>;

export const CreateEventForm: FC<CreateEventFormProps> = ({
  testId,
  onDone,
  startAt,
  endAt,
  projectId,
}): JSX.Element => {
  const { create: createEvent } = useEventsActions();
  const { updateTask } = useTasksNewActions();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: {
        title: "",
        content: "",
        tasks: [],
        textContent: "",
        contentJSON: {},
        projectId: projectId ? projectId.toString() : "",
      },
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const eventData: FieldsRequired = {
      title: values.description.title,
      description: values.description.textContent,
      all_day: false,
      project_id: values.description.projectId
        ? Number(values.description.projectId)
        : undefined,
      start_at: toBackendDateTime(new Date(startAt)),
      end_at: toBackendDateTime(new Date(endAt)),
    };

    const event = await createEvent(eventData, onDone);

    console.log("event event ", event);
    if (event) {
      values.description.tasks.forEach((taskId) => {
        updateTask(Number(taskId), { event_id: event.id });
      });
    }
  };

  return (
    <Form {...form} data-testid={testId}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormControl>
                <RteFormField
                  testId={rteTestId}
                  value={field.value.content}
                  onChange={field.onChange}
                />
              </FormControl>
              <RteMessage />
            </FormItem>
          )}
        />

        <div className="space-x-2">
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  );
};
