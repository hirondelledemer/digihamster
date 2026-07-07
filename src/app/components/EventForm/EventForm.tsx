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
import { Event } from "@/models/event";

import { Textarea } from "../ui/textarea";
import { useEventsActions } from "@/app/utils/hooks/use-events/actions-context";
import { FieldsRequired } from "@/app/utils/hooks/use-events/api";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { toBackendDateTime } from "#utils/date";

export const minimalNoteTestId = "EventForm-minimal-note-testId";

const FormSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  description: z.string(),
  project: z.string(),
  startAt: z.string(),
  endAt: z.string(),
  allDay: z.boolean(),
});

export type FormValues = z.infer<typeof FormSchema>;

interface CommonProps {
  testId?: string;
  onDone(): void;
}

export interface EventFormRegularProps extends CommonProps {
  editMode?: undefined | false;
  initialValues?: Partial<FormValues>;
}
export interface EventFormEditModeProps extends CommonProps {
  event: Event;
  editMode: true;
}

export type EventFormProps = EventFormRegularProps | EventFormEditModeProps;

const EventForm: FC<EventFormProps> = ({
  testId,
  onDone,
  ...restProps
}): JSX.Element => {
  const { data: projects } = useProjectsState();
  const { create: createEvent, update: updateEvent } = useEventsActions();

  const getInitialValues = useCallback(() => {
    if (restProps.editMode) {
      return {
        title: restProps.event.title,
        description: restProps.event.description || "",
        project: restProps.event.project_id || "",
        allDay: restProps.event.all_day,
        startAt: restProps.event.start_at,
        endAt: restProps.event.end_at,
      };
    }

    return restProps.initialValues;
  }, [restProps]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      project: "",
      allDay: false,
      ...getInitialValues(),
    },
  });

  const handleSubmit = async (data: FormValues) => {
    if (restProps.editMode) {
      updateEvent(
        restProps.event.id,
        {
          title: data.title,
          description: data.description,
          project_id: data.project,
        },
        onDone,
      );
      return;
    }

    const eventData: FieldsRequired = {
      title: data.title,
      description: data.description,
      // @ts-expect-error TODO: fix later
      project_id: data.project || undefined,
      all_day: data.allDay,
      start_at: toBackendDateTime(new Date(data.startAt)),
      end_at: toBackendDateTime(new Date(data.endAt)),
    };

    createEvent(eventData, onDone);
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
                  <Input autoFocus placeholder="Title" {...field} />
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
                    {projects.map((project) => (
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
          <Button type="submit">
            {restProps.editMode ? "Save" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EventForm;
