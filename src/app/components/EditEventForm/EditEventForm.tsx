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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  Collision,
} from "@dnd-kit/core";

import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Textarea } from "../ui/textarea";
import { useEventsActions } from "@/app/utils/hooks/use-events/actions-context";
import { useProjectsState } from "@/app/utils/hooks/use-projects/state-context";
import { ProjectStatus } from "@/app/utils/types/project";
import { Badge } from "../ui/badge";
import { IEvent } from "@/app/utils/types/event";
import { useTasksNewState } from "@/app/utils/hooks/use-tasks-new/state-context";
import { useTasksNewActions } from "@/app/utils/hooks/use-tasks-new/actions-context";
import { SortableTaskCard } from "../TaskCard/SortableTaskCard";
import CreateTaskForm from "../CreateTaskForm";

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

const EditEventForm: FC<EventFormProps> = ({ onDone, event }): JSX.Element => {
  const { data: projects } = useProjectsState();
  const { data: tasks } = useTasksNewState();
  const { reorderTasksInTheEvent } = useTasksNewActions();
  const { update: updateEvent } = useEventsActions();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const handleDragEnd = async (e: DragEndEvent) => {
    if (!e.collisions) {
      return null;
    }

    reorderTasksInTheEvent(
      event.id,
      e.collisions.map((obj: Collision) => obj.id as number),
    );
  };

  const eventTasks = tasks
    .filter((task) => task.event_id === event.id)
    .sort(
      (taskA, taskB) =>
        (taskA.event_sort_order || 0) - (taskB.event_sort_order || 0),
    );

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={eventTasks}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2 mt-2">
            {eventTasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="mt-2">
        <CreateTaskForm onDone={() => {}} eventId={event.id} />
      </div>
    </div>
  );
};

export default EditEventForm;
