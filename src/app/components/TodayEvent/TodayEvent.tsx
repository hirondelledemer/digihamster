import { Checkbox, Loader, SimpleGrid, Text } from "@mantine/core";
import { lightFormat, format } from "date-fns";
import React, { ChangeEvent, FC, ReactNode } from "react";

export interface TodayEventProps {
  testId?: string;
  start?: Date;
  end?: Date;
  title: ReactNode | string;
  completed: boolean;
  allDay?: boolean;
  id: string;
  showDate?: boolean;
}

const TodayEvent: FC<TodayEventProps> = ({
  testId,
  allDay,
  title,
  start,
  end,
  completed,
  id,
  showDate,
}): JSX.Element => {
  // const [updateEvent, { loading }] = useMutation<
  //   UpdateTask,
  //   UpdateTaskVariables
  // >(MUTATION_UPDATE_TASK);
  // const refetchQueries = useRefetchQueries();
  const handleCompleteClick = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("updating event");
    // updateEvent({
    //   variables: {
    //     id: id,
    //     completed: event.target.checked,
    //   },
    //   refetchQueries,
    // });
  };
  if (allDay) {
    return (
      <SimpleGrid cols={3} data-testid={testId}>
        <Text>All Day</Text>
        <div>{title}</div>
        <div>
          {/* {loading ? (
            <Loader size="sm" />
          ) : ( */}
          <Checkbox checked={completed} onChange={handleCompleteClick} />
          {/* )} */}
        </div>
      </SimpleGrid>
    );
  }
  return (
    <SimpleGrid cols={3} data-testid={testId}>
      <div>
        {start && showDate && <div>{format(start, "MMM d, EEEEE")}</div>}
        {start && end && (
          <div>
            {lightFormat(start, "H:MM")}-{lightFormat(end, "H:MM")}
          </div>
        )}
      </div>
      <div>{title}</div>
      <div>
        {/* {loading ? (
          <Loader size="sm" />
        ) : ( */}
        <Checkbox checked={completed} onChange={handleCompleteClick} />
        {/* )} */}
      </div>
    </SimpleGrid>
  );
};

export default TodayEvent;
