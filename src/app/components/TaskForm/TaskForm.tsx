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
import { Project } from "@/models/project";
import RteFormField from "../RteFormField";

export const minimalNoteTestId = "TaskForm-minimal-note-testId";

const FormSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  description: z.object({
    title: z.string(),
    content: z.string(),
    tags: z.array(z.string()),
  }),
  eta: z.number(),
  project: z.string().min(1, { message: "This field has to be filled." }),
});

export interface TaskFormProps {
  testId?: string;
  initialValues?: z.infer<typeof FormSchema>;
  projects: Project[];
  onSubmit(values: z.infer<typeof FormSchema>): void;
}
const TaskForm: FC<TaskFormProps> = ({
  testId,
  initialValues,
  projects,
  onSubmit,
}): JSX.Element => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: {
        title: "",
        content: "",
        tags: [],
      },
      eta: 0,
      // todo: set default project
      project: "",
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

          {/* todo: redo to toggle */}
          <FormField
            control={form.control}
            name="eta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ETA</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="ETA"
                    {...field}
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
                  />
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
                  {/* todo: populate with projects */}
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

                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                    <SelectItem value="m@support.com">m@support.com</SelectItem>
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
                  <RteFormField
                    testId={minimalNoteTestId}
                    value={field.value.content}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create</Button>
        </form>
      </Form>
    </div>
  );
};

export default TaskForm;
