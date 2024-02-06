"use client";
import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Home as HomeComp } from "../components/Home/Home";
import { EntriesContextProvider } from "../utils/hooks/use-entry";

export default function SignupPage() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell header={{ height: { base: 60, md: 70, lg: 80 } }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <EntriesContextProvider>
          <HomeComp />
        </EntriesContextProvider>
      </AppShell.Main>
    </AppShell>
  );
}
