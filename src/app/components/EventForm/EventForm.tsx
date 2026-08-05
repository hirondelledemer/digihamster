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

import { Textarea } from "../ui/textarea";
import { useEventsActions } from "@/app/utils/hooks/use-events/actions-context";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { ProjectStatus } from "@/app/utils/types/project";
import { Badge } from "../ui/badge";
import { IEvent } from "@/app/utils/types/event";
import { useTasksNewState } from "@/app/utils/hooks/use-tasks-new/state-context";
import TaskCard from "../TaskCard";

export const minimalNoteTestId = "EventForm-minimal-note-testId";

const FormSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  description: z.string(),
  project: z.union([z.number(), z.undefined()]),
  startAt: z.string(),
  endAt: z.string(),
  allDay: z.boolean(),
});

export type FormValues = z.infer<typeof FormSchema>;

export interface EventFormProps {
  onDone(): void;
  event: IEvent;
}

const EventForm: FC<EventFormProps> = ({ onDone, event }): JSX.Element => {
  const { data: projects } = useProjectsState();
  const { data: tasks } = useTasksNewState();
  const { update: updateEvent } = useEventsActions();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: event.title,
      description: event.description || "",
      project: event.project_id || undefined,
      allDay: event.all_day,
      startAt: event.start_at,
      endAt: event.end_at,
    },
  });

  const handleSubmit = async (data: FormValues) => {
    updateEvent(
      event.id,
      {
        title: data.title,
        description: data.description,
        project_id: data.project || null,
      },
      onDone,
    );
  };

  return (
    <div>
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
                  onValueChange={(value) => {
                    field.onChange(Number(value));
                  }}
                  defaultValue={
                    field.value !== undefined
                      ? field.value.toString()
                      : undefined
                  }
                  value={
                    field.value !== undefined
                      ? field.value.toString()
                      : undefined
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem
                        key={project.id}
                        value={project.id.toString()}
                        role="option"
                        disabled={
                          project.status === ProjectStatus.Cancelled ||
                          project.status === ProjectStatus.Done
                        }
                      >
                        <div className="flex gap-4">
                          {project.title}
                          {project.status === ProjectStatus.Doing && (
                            <Badge
                              variant="default"
                              className="mr-4"
                              color={project.color}
                            >
                              active
                            </Badge>
                          )}
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
          <Button type="submit">Save</Button>
        </form>
      </Form>

      <div className="flex flex-col gap-2 mt-2">
        {tasks
          .filter((task) => task.event_id === event.id)
          .sort(
            (taskA, taskB) =>
              (taskB.event_sort_order || 0) - (taskA.event_sort_order || 0),
          )
          .map((task) => (
            <TaskCard dragId={task.id} key={task.id} task={task} />
          ))}
      </div>
    </div>
  );
};

export default EventForm;
