import { render, screen } from "@/config/utils/test-utils";
import { EventCard, EventCardProps } from "./EventCard";
import { generateEvent } from "@/app/utils/mocks/event";
import { generateProject } from "@/app/utils/mocks/project";
import { eventsState, providers } from "@/app/utils/tests/wrappers";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

describe("EventCard", () => {
  const DEFAULT_PROJECT = generateProject();
  const DEFAULT_EVENT = generateEvent(1, { project_id: DEFAULT_PROJECT.id });

  const DEFAULT_PROPS: EventCardProps = {
    event: DEFAULT_EVENT,
  };

  const renderComponent = (props: EventCardProps = DEFAULT_PROPS) => {
    render(<EventCard {...props} />, {
      wrapper: providers(eventsState({ data: [DEFAULT_EVENT] })),
    });
  };

  it("should show the event title and description", async () => {
    renderComponent();

    expect(screen.getByText(DEFAULT_EVENT.title)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_EVENT.description!)).toBeInTheDocument();
  });
});
