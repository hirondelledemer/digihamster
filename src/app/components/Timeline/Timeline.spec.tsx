import { render } from '@testing-library/react';
import Timeline, { TimelineProps } from './Timeline';
import { getTimelineTestkit } from './Timeline.testkit';

describe('Timeline', () => {
  const defaultProps: TimelineProps = {};
  const renderComponent = (props = defaultProps) =>
    getTimelineTestkit(render(<Timeline {...props} />).container);

  it('should render Timeline', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
