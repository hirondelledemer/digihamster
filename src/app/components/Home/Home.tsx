"use client";

import { Container, Drawer, Grid } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { Views } from "react-big-calendar";
import Calendar from "../Calendar";
import JournalEntryForm from "../JournalEntryForm";

// import { Views } from "react-big-calendar";
// import Calendar from "src/components/Calendar";
// import Habits from "src/components/Habits";
// import { Container, Drawer, Grid } from "@mantine/core";
// import ActiveNotes from "src/components/ActiveNotes";
// import ActiveTasksList from "src/components/ActiveTasksList";

export const Home = (): JSX.Element => {
  const [opened, setOpened] = useState<boolean>(false);
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === "KeyN" && event.altKey) {
      setOpened((val) => !val);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Container fluid>
      <Grid gutter={"xl"} columns={12}>
        <Grid.Col span={6}>
          <Grid>
            <Grid.Col>
              <Calendar view={Views.WORK_WEEK} />
            </Grid.Col>
            <Grid.Col>
              <JournalEntryForm />
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span="auto">
          <Grid>
            <Grid.Col span={6}>{"<ActiveTasksList />"}</Grid.Col>
            <Grid.Col span="auto">{"<ActiveNotes />"}</Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Habits"
        padding="xl"
        size="md"
        closeOnClickOutside
        closeOnEscape
        styles={{ body: { overflow: "auto" } }}
      >
        {"   <Habits />"}
      </Drawer>
    </Container>
  );
};

export default Home;
