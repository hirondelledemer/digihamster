import React, { FC } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, RteMessage } from "../ui/form";
import RteFormField from "../RteFormField";
import { Button } from "../ui/button";
import { now, toBackendDateTime } from "@/app/utils/date/date";
import { addDays } from "date-fns";
// import { TaskWithRelations } from "@/app/utils/types/task";
import { useTasksNewActions } from "@/app/utils/hooks/use-tasks-new/actions-context";
import { CreateTaskParams } from "@/app/utils/hooks/use-tasks-new/api";

export interface CreateTaskFormProps {
  testId?: string;
  onDone(): void;
  deadline?: string;
  projectId?: string;
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
  projectId,
}): JSX.Element => {
  const { createTask: createNewTask } = useTasksNewActions();

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
        projectId: "",
      },
    },
  });

  const getDeadline = (params: string[]) => {
    if (params.includes("tmr")) {
      return toBackendDateTime(addDays(now(), 1));
    }
    if (params.includes("today")) {
      return toBackendDateTime(addDays(now(), 1));
    }
    if (deadline) {
      return toBackendDateTime(new Date(deadline));
    }
    return null;
  };

  const handleSubmit = (values: FormValues) => {
    const taskData: CreateTaskParams = {
      title: values.description.title,
      description: values.description.textContent,
      project_id: Number(projectId) || Number(values.description.projectId),
      status: values.description.params.includes("active") ? "doing" : "todo",
      deadline: getDeadline(values.description.params),
    };

    createNewTask(taskData);
    form.resetField("description");
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
