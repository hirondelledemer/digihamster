"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar } from "@tabler/icons-react";
import { format } from "date-fns";
import React, { FC } from "react";
import { Control, useForm } from "react-hook-form";
import { z } from "zod";

import { parseBackendDate, toBackendDate } from "@/utils/date";
import { COLORS_V2 } from "@/app/utils/consts/colors";
import { now } from "@/app/utils/date/now";
import { useTimeSpacesActions } from "@/app/utils/hooks/use-time-spaces/actions-context";
import { CreateTimeSpaceParams } from "@/app/utils/hooks/use-time-spaces/api";
import { ITimeSpace, TimeSpaceKind } from "@/app/utils/types/time-space";

import { cn } from "../utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface CommonProps {
  testId?: string;
  onDone(): void;
}

export interface TimeSpaceFormCreateProps extends CommonProps {
  editMode?: undefined | false;
}

export interface TimeSpaceFormEditProps extends CommonProps {
  editMode: true;
  timeSpace: ITimeSpace;
}

export type TimeSpaceFormProps =
  | TimeSpaceFormCreateProps
  | TimeSpaceFormEditProps;

/** Radix Select cannot hold "" as a value, so "no color" needs a stand-in. */
const NO_COLOR = "none";

const MONTHS = [...Array(12)].map((_v, i) => ({
  value: i + 1,
  label: format(new Date(2000, i, 1), "LLLL"),
}));

/**
 * The schema is FLAT - start/end/month all live on the form at once - even
 * though the entity is a discriminated union. A `z.discriminatedUnion` would
 * mirror the entity more closely, but then `start` would not exist on the
 * yearly-month arm, `<FormField name="start">` would stop type-checking, and
 * flipping the kind toggle would throw away what you had already typed.
 *
 * So the union is rebuilt at the edge instead: validate conditionally here,
 * and fold the form back into `kind` + `params` in `toPayload`.
 */
const FormSchema = z
  .object({
    title: z.string().min(1, { message: "Required." }),
    color: z.string(),
    kind: z.nativeEnum(TimeSpaceKind),
    start: z.string(),
    end: z.string(),
    month: z.number().min(1).max(12),
  })
  .superRefine((values, ctx) => {
    if (values.kind !== TimeSpaceKind.DateRange) {
      return;
    }

    if (!values.start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["start"],
        message: "Required.",
      });
    }

    if (!values.end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end"],
        message: "Required.",
      });
    }

    // both are YYYY-MM-DD, so string order is date order
    if (values.start && values.end && values.end < values.start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end"],
        message: "End must be on or after start.",
      });
    }
  });

export type FormValues = z.infer<typeof FormSchema>;

const toPayload = (values: FormValues): CreateTimeSpaceParams => {
  const common = {
    title: values.title,
    color: values.color === NO_COLOR ? undefined : values.color,
  };

  return values.kind === TimeSpaceKind.DateRange
    ? {
        ...common,
        kind: TimeSpaceKind.DateRange,
        params: { start: values.start, end: values.end },
      }
    : {
        ...common,
        kind: TimeSpaceKind.YearlyMonth,
        params: { month: values.month },
      };
};

const getDefaultValues = (timeSpace?: ITimeSpace): FormValues => {
  const today = now();

  const base: FormValues = {
    title: "",
    color: NO_COLOR,
    kind: TimeSpaceKind.DateRange,
    start: toBackendDate(today),
    end: toBackendDate(today),
    month: today.getMonth() + 1,
  };

  if (!timeSpace) {
    return base;
  }

  return {
    ...base,
    title: timeSpace.title,
    color: timeSpace.color ?? NO_COLOR,
    kind: timeSpace.kind,
    // only the arm this time space actually has is filled in; the other one
    // keeps its default so the toggle stays usable
    ...(timeSpace.kind === TimeSpaceKind.DateRange
      ? { start: timeSpace.params.start, end: timeSpace.params.end }
      : { month: timeSpace.params.month }),
  };
};

const DayField: FC<{
  control: Control<FormValues>;
  name: "start" | "end";
  label: string;
}> = ({ control, name, label }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel>{label}</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                className={cn(
                  "pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? (
                  format(parseBackendDate(field.value), "PP")
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
              selected={field.value ? parseBackendDate(field.value) : undefined}
              onSelect={(date) => field.onChange(date ? toBackendDate(date) : "")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )}
  />
);

const TimeSpaceForm: FC<TimeSpaceFormProps> = ({
  testId,
  onDone,
  ...restProps
}): JSX.Element => {
  const { create, update } = useTimeSpacesActions();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: getDefaultValues(
      restProps.editMode ? restProps.timeSpace : undefined
    ),
  });

  const kind = form.watch("kind");

  const handleSubmit = async (values: FormValues) => {
    const payload = toPayload(values);

    if (restProps.editMode) {
      // kind and params always travel together: patching one without the other
      // leaves the row holding params its own kind cannot read
      await update(restProps.timeSpace.id, payload);
    } else {
      await create(payload);
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
          name="kind"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kind</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  value={field.value}
                  // the toggle group emits "" when you click the active item;
                  // a time space always has a kind, so ignore that
                  onValueChange={(value) => value && field.onChange(value)}
                >
                  <ToggleGroupItem value={TimeSpaceKind.DateRange}>
                    Date range
                  </ToggleGroupItem>
                  <ToggleGroupItem value={TimeSpaceKind.YearlyMonth}>
                    Every year
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {kind === TimeSpaceKind.DateRange ? (
          <div className="flex gap-4">
            <DayField control={form.control} name="start" label="Start" />
            <DayField control={form.control} name="end" label="End" />
          </div>
        ) : (
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Month</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value.toString()}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MONTHS.map((month) => (
                      <SelectItem
                        key={month.value}
                        value={month.value.toString()}
                        role="option"
                      >
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
                  <SelectItem value={NO_COLOR} role="option">
                    No color
                  </SelectItem>
                  {COLORS_V2.map((color) => (
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

        <div className="space-x-2">
          <Button type="submit">
            {restProps.editMode ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TimeSpaceForm;
