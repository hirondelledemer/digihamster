import { ReactNode } from "react";
import { render, screen, userEvent } from "@/config/utils/test-utils";
import { RelationshipEntityType } from "@/app/utils/types/relationship";
import { EventsStateContext } from "@/app/utils/hooks/use-events/state-context";
import { PeopleStateContext } from "@/app/utils/hooks/use-people/state-context";
import { generateEvent } from "@/app/utils/mocks/event";
import { generatePerson } from "@/app/utils/mocks/person";
import { NavigatorPath, crumbTestId } from "./NavigatorPath";
import {
  RelationshipNavigatorContext,
  RelationshipNavigatorContextProvider,
} from "./navigator-context";

const EVENT = generateEvent(1, { title: "Morning standup" });
const PERSON = generatePerson(2, { name: "Mom" });

const Harness = ({ children }: { children: ReactNode }) => (
  <EventsStateContext.Provider value={{ data: [EVENT], isLoading: false }}>
    <PeopleStateContext.Provider value={{ data: [PERSON], isLoading: false }}>
      {children}
    </PeopleStateContext.Provider>
  </EventsStateContext.Provider>
);

/** walks the trail to a person, so there are two crumbs to assert on */
const Opener = () => (
  <RelationshipNavigatorContext.Consumer>
    {({ selectFromColumn }) => (
      <button
        onClick={() =>
          selectFromColumn(0, {
            id: PERSON.id,
            type: RelationshipEntityType.Person,
          })
        }
      >
        open person
      </button>
    )}
  </RelationshipNavigatorContext.Consumer>
);

const renderPath = () =>
  render(
    <Harness>
      <RelationshipNavigatorContextProvider
        initialItem={{ id: EVENT.id, type: RelationshipEntityType.Event }}
      >
        <NavigatorPath />
        <Opener />
      </RelationshipNavigatorContextProvider>
    </Harness>
  );

describe("NavigatorPath", () => {
  it("names the entity rather than only its type", async () => {
    renderPath();

    expect(await screen.findByText("Morning standup")).toBeInTheDocument();
  });

  it("grows a crumb for each level that is opened", async () => {
    renderPath();

    expect(screen.getAllByTestId(crumbTestId)).toHaveLength(1);

    await userEvent.click(screen.getByText("open person"));

    const crumbs = screen.getAllByTestId(crumbTestId);
    expect(crumbs).toHaveLength(2);
    expect(crumbs[1]).toHaveTextContent("Mom");
  });

  it("marks only the last crumb as current, and leaves it unclickable", async () => {
    renderPath();
    await userEvent.click(screen.getByText("open person"));

    const [first, last] = screen.getAllByTestId(crumbTestId);

    expect(first).not.toBeDisabled();
    expect(last).toBeDisabled();
    expect(last).toHaveAttribute("aria-current", "page");
  });

  // the rail toggles an open entity closed; a crumb must instead take you back
  // to it, which is why it uses goToIndex and not setActiveEntity
  it("navigates back to an earlier crumb, keeping that entity", async () => {
    renderPath();
    await userEvent.click(screen.getByText("open person"));
    expect(screen.getAllByTestId(crumbTestId)).toHaveLength(2);

    await userEvent.click(screen.getByText("Morning standup"));

    const crumbs = screen.getAllByTestId(crumbTestId);
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0]).toHaveTextContent("Morning standup");
  });
});
