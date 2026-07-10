import React, { FC, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { Button } from "../ui/button";
import { IconCalendar } from "@tabler/icons-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { TaskV2 as Task } from "@/models/taskV2";
// import { useTagsState } from "@/app/utils/hooks/use-tags/state-context";
import { Textarea } from "../ui/textarea";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { useTasksNewActions } from "@/app/utils/hooks/use-tasks-new/actions-context";

export const minimalNoteTestId = "TaskForm-minimal-note-testId" as const;
export const taskFormTestId = "TaskForm-form-testid" as const;

const FormSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  description: z.string(),
  deadline: z.union([z.string(), z.null(), z.undefined()]),
  project: z.string(),
});

export type FormValues = z.infer<typeof FormSchema>;

export interface TaskFormProps {
  testId?: string;
  onDone(): void;
  task: Task;
}

const TaskForm: FC<TaskFormProps> = ({
  testId,
  onDone,
  ...restProps
}): JSX.Element => {
  const { data: projects } = useProjectsState();
  // const { data: tags } = useTagsState();
  const { updateTask: editTask, deleteTask } = useTasksNewActions();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: restProps.task.title,
      description: restProps.task.description || "",
      project: restProps.task.project_id?.toString() || "",
      deadline: restProps.task.deadline,
    },
  });

  const handleSubmit = (values: FormValues) => {
    editTask(restProps.task.id, {
      title: values.title,
      description: values.description,
      project_id: Number(values.project),
      deadline: values.deadline,
    });
    onDone();
  };

  const handleDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      await deleteTask(restProps.task.id);
      onDone();
    },
    [deleteTask, restProps, onDone],
  );

  const handleComplete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      await editTask(restProps.task.id, {
        status: "done",
      });
      onDone();
    },
    [editTask, restProps, onDone],
  );

  const handleUndo = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      await editTask(restProps.task.id, {
        status: "doing",
      });
      onDone();
    },
    [editTask, restProps, onDone],
  );

  return (
    <Form {...form} data-testid={testId}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
        data-testid={taskFormTestId}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* todo: make it with filter */}
        <FormField
          control={form.control}
          name="project"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects
                    .filter((project) => !project.disabled)
                    .map((project) => (
                      <SelectItem
                        key={project.id as unknown as string}
                        value={project.id as unknown as string}
                        role="option"
                      >
                        {project.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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
                <Textarea placeholder="description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy-MM-dd")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      field.onChange(date ? date.getTime() : undefined);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-x-2">
          <Button type="submit">Save</Button>
          <Button onClick={handleDelete} variant="outline">
            Delete
          </Button>
          {!(restProps.task.status === "done") && (
            <Button onClick={handleComplete} variant="outline">
              Complete
            </Button>
          )}
          {restProps.task.status === "done" && (
            <Button onClick={handleUndo} variant="outline">
              Undo
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
