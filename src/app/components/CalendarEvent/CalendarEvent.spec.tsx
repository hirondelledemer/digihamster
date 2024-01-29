import { CalendarEventProps } from './CalendarEvent';
import CalendarEvent from './CalendarEvent';
import { getCalendarEventTestkit } from './CalendarEvent.testkit';
import {
  renderWithMockedProvider,
  wrapWithRouter,
} from 'src/utils/tests/render';

describe('CalendarEvent', () => {
  const defaultProps: CalendarEventProps = {
    event: {
      resource: {
        completed: false,
        id: 'event1',
      },
    },
  };
  const renderComponent = (props = defaultProps) =>
    getCalendarEventTestkit(
      renderWithMockedProvider(
        wrapWithRouter(<CalendarEvent {...props} />),
        [],
      ).container,
    );

  it('should render CalendarEvent', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
