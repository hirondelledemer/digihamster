import { Project } from "@/models/project";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Switch } from "../ui/switch";
import RteFormField from "../RteFormField";
import { useProjectsActions } from "@/app/utils/hooks/use-projects/actions-context";

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
  project: Project;
  editMode: true;
}

export type ProjectFormProps =
  | ProjectFormRegularProps
  | ProjectFormEditModeProps;

const FormSchema = z.object({
  title: z.string().min(1, { message: "Required." }),
  color: z.string().min(1, { message: "Required." }),
  disabled: z.boolean(),
  jsonDescription: z.any(),
});

export type FormValues = z.infer<typeof FormSchema>;

const ProjectForm: FC<ProjectFormProps> = ({
  testId,
  onDone,
  ...restProps
}): JSX.Element => {
  const { update: updateProject, create: createProject } = useProjectsActions();

  const getInitialValues = useCallback(() => {
    if (restProps.editMode) {
      console.log("description", restProps.project.jsonDescription);
      return {
        title: restProps.project.title,
        color: restProps.project.color,
        disabled: restProps.project.disabled,
        jsonDescription: {
          title: "",
          content: "",
          tags: [],
          tasks: [],
          textContent: "",
          contentJSON: restProps.project.jsonDescription,
          projectId: "",
        },
      };
    }
    return restProps.initialValues;
  }, [restProps]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      color: "#e11d48",
      disabled: false,
      jsonDescription: {
        title: "",
        content: "",
        tags: [],
        tasks: [],
        textContent: "",
        contentJSON: {},
        projectId: "",
      },
      ...getInitialValues(),
    },
  });

  const handleSubmit = (values: FormValues) => {
    if (restProps.editMode) {
      updateProject(restProps.project._id, {
        title: values.title,
        color: values.color,
        disabled: values.disabled,
        jsonDescription: values.jsonDescription.contentJSON,
      });
    } else {
      createProject({
        title: values.title,
        color: values.color,
        disabled: values.disabled,
        jsonDescription: values.jsonDescription.contentJSON,
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
          name="jsonDescription"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Goal</FormLabel>
              <FormControl>
                <RteFormField
                  testId={rteTestId}
                  value={field.value.contentJSON}
                  onChange={field.onChange}
                />
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
          name="disabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Disable</FormLabel>
                <FormDescription>Do not allow selection</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
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
