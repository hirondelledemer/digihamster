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
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { IconComet, IconStar, IconStars } from "@tabler/icons-react";

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
  showEta?: boolean;
}
const TaskForm: FC<TaskFormProps> = ({
  testId,
  initialValues,
  projects,
  onSubmit,
  showEta = true,
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

          {/* // todo:  complete creating, add editing, revaiew calendar and make it optimistic where is matters */}
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
