import React, { FC } from "react";
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
} from "@tabler/icons-react";
import useProjects from "@/app/utils/hooks/use-projects";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

export const minimalNoteTestId = "TaskForm-minimal-note-testId";

const FormSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  description: z.string(),
  eta: z.number(),
  deadline: z.union([z.number(), z.null(), z.undefined()]),
  project: z.string().min(1, { message: "This field has to be filled." }),
});

export type FormValues = z.infer<typeof FormSchema>;

export interface TaskFormProps {
  testId?: string;
  initialValues?: Partial<FormValues>;
  onSubmit(values: FormValues): void;
  showEta?: boolean;
  showDeadline?: boolean;
  editMode?: boolean;
}

const TaskForm: FC<TaskFormProps> = ({
  testId,
  initialValues,
  onSubmit,
  showEta = true,
  showDeadline = true,
  editMode,
}): JSX.Element => {
  const { data: projects, defaultProject } = useProjects();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      eta: 0,
      project: defaultProject?._id,
      deadline: null,
      ...initialValues,
    },
  });

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  return (
    <div data-testid={testId}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
          {showEta && (
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
                      <ToggleGroupItem value="0" aria-label="eta-0">
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
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
                  {/* // todo */}
                  <SelectContent>
                    {projects.map((project) => (
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
          {showDeadline && (
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
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          console.log("aaa", date);
                          field.onChange(date ? date.getTime() : undefined);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type="submit">{editMode ? "Save" : "Create"}</Button>
        </form>
      </Form>
    </div>
  );
};

export default TaskForm;
