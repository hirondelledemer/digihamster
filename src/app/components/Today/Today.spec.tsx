import { DAY } from 'src/utils/consts/dates';
import {
  renderWithMockedProvider,
  wrapWithRouter,
} from 'src/utils/tests/render';
import Today, { TodayProps } from './Today';
import { getTodayTestkit } from './Today.testkit';

jest.mock('src/utils/date/date');

describe('Today', () => {
  const defaultProps: TodayProps = {
    localizer: { endOf: (date) => date, startOf: (date) => date },
    date: new Date(0),
    events: [
      {
        start: new Date(0),
        end: new Date(10000),
        resource: { id: 'event1' },
        title: 'Event 1',
      },
      {
        allDay: true,
        resource: { id: 'event2' },
        title: 'Event 2',
        start: new Date(20000),
        end: new Date(30000),
      },

      {
        start: new Date(20000),
        end: new Date(30000),
        resource: { id: 'event3' },
        title: 'Event 3',
      },
    ],
  };
  const renderComponent = (props = defaultProps) =>
    getTodayTestkit(
      renderWithMockedProvider(
        wrapWithRouter(<Today {...props} />),
        [],
      ).container,
    );

  it('should render Today', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  describe('only todays tasks exists', () => {
    it('should show todays tasks', () => {
      const wrapper = renderComponent();
      expect(wrapper.getEventCount()).toBe(3);
      expect(
        wrapper
          .getEventAt(0)
          .getTitle(defaultProps.events[1].title as string),
      ).toBeInTheDocument();
      expect(
        wrapper
          .getEventAt(1)
          .getTitle(defaultProps.events[0].title as string),
      ).toBeInTheDocument();
      expect(
        wrapper
          .getEventAt(2)
          .getTitle(defaultProps.events[2].title as string),
      ).toBeInTheDocument();
    });

    it('should not show "upcoming events" button', () => {
      const wrapper = renderComponent();
      expect(wrapper.getUpcomingEventsBtn()).not.toBeInTheDocument();
    });
  });

  describe('there are feature tasks', () => {
    const props: TodayProps = {
      ...defaultProps,
      events: [
        ...defaultProps.events,
        {
          start: new Date(DAY + 20000),
          end: new Date(DAY + 30000),
          resource: { id: 'event4' },
          title: 'Event 4',
        },
        {
          start: new Date(6 * DAY + 20000),
          end: new Date(6 * DAY + 30000),
          resource: { id: 'event5' },
          title: 'Event 5',
        },
      ],
    };

    it('should show "Upcoming Tasks" button', () => {
      const wrapper = renderComponent(props);
      expect(wrapper.getUpcomingEventsBtn()).toBeInTheDocument();
    });

    it('should render rest tasks on button click', () => {
      const wrapper = renderComponent(props);
      expect(wrapper.getEventCount()).toBe(5);
    });
  });
});
