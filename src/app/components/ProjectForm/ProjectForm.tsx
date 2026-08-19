import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { colors } from "./ProjectForm.consts";
import { Button } from "../ui/button";
import { useProjectsActions } from "@/app/utils/hooks/use-projects/actions-context";
import { useLifeAspectsState } from "@/app/utils/hooks/use-life-aspects/state-context";
import { IProject, ProjectStatus } from "@/app/utils/types/project";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Textarea } from "../ui/textarea";

interface CommonProps {
  testId?: string;
  onDone(): void;
}

export const rteTestId = "ProjectForm-rte-testid";

export interface ProjectFormRegularProps extends CommonProps {
  editMode?: undefined | false;
  initialValues?: Partial<FormValues>;
}
export interface ProjectFormEditModeProps extends CommonProps {
  project: IProject;
  editMode: true;
}

export type ProjectFormProps =
  | ProjectFormRegularProps
  | ProjectFormEditModeProps;

const FormSchema = z.object({
  title: z.string().min(1, { message: "Required." }),
  color: z.string().min(1, { message: "Required." }),
  status: z.enum([
    ProjectStatus.Cancelled,
    ProjectStatus.Doing,
    ProjectStatus.Done,
    ProjectStatus.Todo,
  ]),
  lifeAspectId: z.union([z.number(), z.undefined()]),
  description: z.union([z.string(), z.undefined()]),
});

export type FormValues = z.infer<typeof FormSchema>;

const ProjectForm: FC<ProjectFormProps> = ({
  testId,
  onDone,
  ...restProps
}): JSX.Element => {
  const { update: updateProject, create: createProject } = useProjectsActions();
  const { data: lifeAspects } = useLifeAspectsState();

  const getInitialValues = useCallback(() => {
    if (restProps.editMode) {
      return {
        title: restProps.project.title,
        color: restProps.project.color,
        lifeAspectId: restProps.project.life_aspect_id,
        status: restProps.project.status,
        description: restProps.project.description,
      };
    }
    return restProps.initialValues;
  }, [restProps]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      color: "#e11d48",
      status: ProjectStatus.Todo,
      lifeAspectId: lifeAspects[0]?.id,
      ...getInitialValues(),
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (restProps.editMode) {
      updateProject(restProps.project.id, {
        title: values.title,
        color: values.color,
        description: values.description,
        status: values.status || ProjectStatus.Todo,
        life_aspect_id: Number(values.lifeAspectId),
      });
    } else {
      createProject({
        title: values.title,
        color: values.color,
        description: values.description || "",
        status: values.status,
        life_aspect_id: Number(values.lifeAspectId),
      });
    }
    onDone();
  };

  return (
    <Form {...form} data-testid={testId}>
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Goal</FormLabel>
              <FormControl>
                <Textarea placeholder="description" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color} value={color} role="option">
                      <div className="flex space-x-2">
                        <div
                          className="h-4 w-4"
                          style={{ backgroundColor: color }}
                        />
                        <div>{color}</div>
                      </div>
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
          name="lifeAspectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Life aspect</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(Number(value));
                }}
                defaultValue={field.value ? field.value.toString() : undefined}
                value={field.value ? field.value.toString() : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Aspect" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lifeAspects.map((la) => (
                    <SelectItem
                      key={la.id}
                      value={la.id.toString()}
                      role="option"
                    >
                      {la.title}
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ToggleGroupItem value={ProjectStatus.Todo}>
                    Todo
                  </ToggleGroupItem>
                  <ToggleGroupItem value={ProjectStatus.Doing}>
                    In Progress
                  </ToggleGroupItem>
                  <ToggleGroupItem value={ProjectStatus.Done}>
                    Done
                  </ToggleGroupItem>
                  <ToggleGroupItem value={ProjectStatus.Cancelled}>
                    Canceled
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-x-2">
          <Button type="submit">
            {restProps.editMode ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProjectForm;
