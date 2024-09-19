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
import { Habit } from "@/models/habit";
import useHabits from "@/app/utils/hooks/use-habits";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TIMES_PER_MONTH } from "./HabitForm.consts";
import { Button } from "../ui/button";

const FormSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  category: z.string().min(1, { message: "This field has to be filled." }),
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
  habit: Habit;
  editMode: true;
}
export type HabitFormProps = HabitFormRegularProps | HabitFormEditModeProps;

const HabitForm: FC<HabitFormProps> = ({
  testId,
  onDone,
  ...restProps
}): JSX.Element => {
  const { updateHabit, createHabit, deleteHabit } = useHabits();
  const getInitialValues = useCallback(() => {
    if (restProps.editMode) {
      return {
        title: restProps.habit.title || "",
        category: restProps.habit.category || "",
        timesPerMonth: restProps.habit.timesPerMonth || 0,
      };
    }
    return restProps.initialValues;
  }, [restProps]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      category: "",
      timesPerMonth: 0,
      ...getInitialValues(),
    },
  });

  const handleDelete = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (restProps.editMode) {
        await deleteHabit(restProps.habit._id);
        onDone();
      }
    },
    [deleteHabit, restProps, onDone]
  );

  const handleSubmit = (values: FormValues) => {
    if (restProps.editMode) {
      updateHabit(restProps.habit._id, {
        title: values.title,
        category: values.category,
        timesPerMonth: values.timesPerMonth,
      });
    } else {
      const habitData = {
        title: values.title,
        category: values.category,
        timesPerMonth: values.timesPerMonth,
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Category" {...field} />
              </FormControl>
              <FormMessage />
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
          {restProps.editMode && !restProps.habit.deleted && (
            <Button onClick={handleDelete} variant="outline">
              Delete
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default HabitForm;
