import React, { FC, useCallback } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TIMES_PER_MONTH } from "./constants";
import { Button } from "../ui/button";
import { useLifeAspectsState } from "@/app/utils/hooks/use-life-aspects/state-context";
import { useHabitsNewActions } from "@/app/utils/hooks/use-habits-new/actions-context";
import { IHabitWithLogs } from "@/app/utils/types/habit";
import { Textarea } from "../ui/textarea";

const FormSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  description: z.string(),
  encouragement: z.string(),
  lifeAspectId: z.number().min(1, { message: "Required" }),
  timesPerMonth: z.number().min(1, { message: "Required" }),
});

export type FormValues = z.infer<typeof FormSchema>;

interface CommonProps {
  testId?: string;
  onDone(): void;
}

export interface HabitFormRegularProps extends CommonProps {
  editMode?: undefined | false;
  initialValues?: Partial<FormValues>;
}
export interface HabitFormEditModeProps extends CommonProps {
  habit: IHabitWithLogs;
  editMode: true;
}
export type HabitFormProps = HabitFormRegularProps | HabitFormEditModeProps;

// TODO: move HabitForm to the habits folder
const HabitForm: FC<HabitFormProps> = ({
  testId,
  onDone,
  ...restProps
}): JSX.Element => {
  const { updateHabit, createHabit, deleteHabit } = useHabitsNewActions();
  const { data: lifeAspects } = useLifeAspectsState();

  const getInitialValues = useCallback(() => {
    if (restProps.editMode) {
      return {
        title: restProps.habit.title || "",
        lifeAspectId: restProps.habit.life_aspect_id || undefined,
        timesPerMonth: restProps.habit.times_per_month || 0,
        description: restProps.habit.description || "",
        encouragement: restProps.habit.encouragement || "",
      };
    }
    return restProps.initialValues;
  }, [restProps]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      encouragement: "",
      lifeAspectId: lifeAspects[0].id,
      timesPerMonth: 0,
      ...getInitialValues(),
    },
  });

  const handleDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (restProps.editMode) {
        await deleteHabit(restProps.habit.id);
        onDone();
      }
    },
    [deleteHabit, restProps, onDone]
  );

  const handleSubmit = (values: FormValues) => {
    if (restProps.editMode) {
      updateHabit(restProps.habit.id, {
        title: values.title,
        life_aspect_id: values.lifeAspectId,
        times_per_month: values.timesPerMonth,
        description: values.description,
        encouragement: values.encouragement,
      });
    } else {
      const habitData = {
        title: values.title,
        life_aspect_id: values.lifeAspectId,
        times_per_month: values.timesPerMonth,
        description: values.description,
        encouragement: values.encouragement,
      };
      createHabit(habitData);
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
          name="lifeAspectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                defaultValue={field.value.toString()}
                value={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lifeAspects.map((lifeAspect) => (
                    <SelectItem
                      key={lifeAspect.id}
                      value={lifeAspect.id.toString()}
                      role="option"
                    >
                      {lifeAspect.title}
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
            <FormItem className="flex flex-col">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="description" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="encouragement"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Encouragement</FormLabel>
              <FormControl>
                <Textarea placeholder="encouragement" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timesPerMonth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Times per month</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                defaultValue={field.value.toString()}
                value={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TIMES_PER_MONTH.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value.toString()}
                      role="option"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-x-2">
          <Button type="submit">
            {restProps.editMode ? "Save" : "Create"}
          </Button>

          <Button onClick={handleDelete} variant="outline">
            Delete
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HabitForm;
