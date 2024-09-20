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
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import {
  IconCalendar,
  IconComet,
  IconStar,
  IconStars,
  IconCircle,
} from "@tabler/icons-react";
import useProjects from "@/app/utils/hooks/use-projects";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { TaskV2 as Task } from "@/models/taskV2";
import { useEditTask } from "@/app/utils/hooks/use-edit-task";
import Filter from "../Filter";
import useTags from "@/app/utils/hooks/use-tags";

export const minimalNoteTestId = "TaskForm-minimal-note-testId" as const;
export const taskFormTestId = "TaskForm-form-testid" as const;

const FormSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  description: z.string(),
  isActive: z.union([z.boolean(), z.undefined()]),
  eta: z.number(),
  deadline: z.union([z.number(), z.null(), z.undefined()]),
  project: z.string().min(1, { message: "This field has to be filled." }),
  tags: z.array(z.string()),
});

export type FormValues = z.infer<typeof FormSchema>;

interface CommonProps {
  testId?: string;
  onDone(): void;
}

export interface TaskFormRegularProps extends CommonProps {
  editMode?: undefined | false;
  initialValues?: Partial<FormValues>;
}
export interface TaskFormEditModeProps extends CommonProps {
  task: Task;
  editMode: true;
}

export type TaskFormProps = TaskFormRegularProps | TaskFormEditModeProps;

const TaskForm: FC<TaskFormProps> = ({
  testId,
  onDone,
  ...restProps
}): JSX.Element => {
  const { data: projects, defaultProject } = useProjects();
  const { data: tags } = useTags();
  const { editTask, deleteTask, createNewTask } = useEditTask();

  const getInitialValues = useCallback(() => {
    if (restProps.editMode) {
      return {
        title: restProps.task.title,
        description: restProps.task.description || "",
        eta: restProps.task.estimate || 0,
        project: restProps.task.projectId || defaultProject?._id,
        deadline: restProps.task.deadline,
        isActive: restProps.task.isActive,
        tags: restProps.task.tags,
      };
    }

    return restProps.initialValues;
  }, [defaultProject, restProps]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      eta: 0,
      project: defaultProject?._id,
      deadline: null,
      isActive: false,
      tags: [],
      ...getInitialValues(),
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (restProps.editMode) {
      editTask(restProps.task._id, {
        title: values.title,
        description: values.description,
        estimate: values.eta,
        projectId: values.project,
        deadline: values.deadline,
        tags: values.tags,
      });
    } else {
      const taskData = {
        title: values.title,
        description: values.description,
        projectId: values.project,
        isActive: values.isActive || false,
        estimate: values.eta,
        deadline: values.deadline || null,
        tags: values.tags,
      };
      createNewTask(taskData);
    }
    onDone();
  };

  const handleDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (restProps.editMode) {
        await deleteTask(restProps.task._id);
        onDone();
      }
    },
    [deleteTask, restProps, onDone]
  );

  const handleComplete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (restProps.editMode) {
        await editTask(restProps.task._id, {
          completed: true,
        });
        onDone();
      }
    },
    [editTask, restProps, onDone]
  );

  const handleUndo = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (restProps.editMode) {
        await editTask(restProps.task._id, {
          completed: false,
        });
        onDone();
      }
    },
    [editTask, restProps, onDone]
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

        <FormField
          control={form.control}
          name="eta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ETA</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  className="justify-start"
                  value={field.value.toString()}
                  onValueChange={(value) => {
                    field.onChange(Number(value));
                  }}
                >
                  <ToggleGroupItem value="0.5" aria-label="eta-0-5">
                    <IconComet className="h-4 w-4" color="#65a30d" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="1" aria-label="eta-1">
                    <IconStar className="h-4 w-4" color="#0284c7" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="2" aria-label="eta-2">
                    <IconStar className="h-4 w-4" color="#0284c7" />
                    <IconStar className="h-4 w-4" color="#0284c7" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="3" aria-label="eta-3">
                    <IconStar className="h-4 w-4" color="#0284c7" />
                    <IconStar className="h-4 w-4" color="#0284c7" />
                    <IconStar className="h-4 w-4" color="#0284c7" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="4" aria-label="eta-4">
                    <IconStars className="h-4 w-4" color="#e11d48" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="0" aria-label="eta-0">
                    <IconCircle className="h-4 w-4" color="#eab308" />
                  </ToggleGroupItem>
                </ToggleGroup>
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
                        key={project._id as unknown as string}
                        value={project._id as unknown as string}
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
                        !field.value && "text-muted-foreground"
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
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <Filter
                onChange={field.onChange}
                value={field.value}
                maxLengthToShow={10}
                options={tags.map((tag) => ({
                  value: tag._id,
                  label: tag.title,
                }))}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-x-2">
          <Button type="submit">
            {restProps.editMode ? "Save" : "Create"}
          </Button>
          {restProps.editMode && !restProps.task.deleted && (
            <Button onClick={handleDelete} variant="outline">
              Delete
            </Button>
          )}
          {restProps.editMode && !restProps.task.completed && (
            <Button onClick={handleComplete} variant="outline">
              Complete
            </Button>
          )}
          {restProps.editMode && restProps.task.completed && (
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
