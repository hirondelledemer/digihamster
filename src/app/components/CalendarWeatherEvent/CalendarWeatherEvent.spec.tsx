import { render } from '@testing-library/react';
import CalendarWeatherEvent, { CalendarWeatherEventProps } from './CalendarWeatherEvent';
import { getCalendarWeatherEventTestkit } from './CalendarWeatherEvent.testkit';

describe('CalendarWeatherEvent', () => {
  const defaultProps: CalendarWeatherEventProps = {};
  const renderComponent = (props = defaultProps) =>
    getCalendarWeatherEventTestkit(render(<CalendarWeatherEvent {...props} />).container);

  it('should render CalendarWeatherEvent', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
