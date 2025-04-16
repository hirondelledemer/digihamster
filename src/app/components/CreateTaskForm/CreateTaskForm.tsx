import React, { FC } from "react";
import useEditTask from "@/app/utils/hooks/use-edit-task";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, RteMessage } from "../ui/form";
import RteFormField from "../RteFormField";
import { Button } from "../ui/button";
import { now } from "@/app/utils/date/date";
import { addDays, addHours } from "date-fns";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";

export interface CreateTaskFormProps {
  testId?: string;
  onDone(): void;
  deadline?: number;
}

export const rteTestId = "CreateTaskForm-rte-testId";

const FormSchema = z.object({
  description: z.object({
    title: z.string().min(1, { message: "required" }),
    content: z.any(),
    tags: z.array(z.string()),
    tasks: z.array(z.string()),
    textContent: z.string(),
    contentJSON: z.any(),
    projectId: z.string().optional(),
    params: z.array(z.string()),
  }),
});

export type FormValues = z.infer<typeof FormSchema>;

const CreateTaskForm: FC<CreateTaskFormProps> = ({
  testId,
  onDone,
  deadline,
}): JSX.Element => {
  const { defaultProject } = useProjectsState();
  const { createNewTask } = useEditTask();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: {
        title: "",
        content: "",
        tags: [],
        tasks: [],
        textContent: "",
        contentJSON: {},
        projectId: defaultProject?._id,
      },
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log("aaaaa", values.description.title);
    const taskData = {
      title: values.description.title,
      description: values.description.textContent,
      descriptionFull: values.description.contentJSON,
      projectId: values.description.projectId || defaultProject?._id || null,
      isActive: values.description.params.includes("active"),
      tags: values.description.tags,
      subtasks: values.description.tasks,
      deadline: values.description.params.includes("tmr")
        ? addDays(now(), 1).valueOf()
        : values.description.params.includes("today")
        ? addHours(now(), 2).valueOf()
        : deadline,
    };

    createNewTask(taskData);

    onDone();
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

export default CreateTaskForm;
