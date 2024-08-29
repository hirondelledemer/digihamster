import { render } from '@testing-library/react';
import PinnedNotes, { PinnedNotesProps } from './PinnedNotes';
import { getPinnedNotesTestkit } from './PinnedNotes.testkit';

describe('PinnedNotes', () => {
  const defaultProps: PinnedNotesProps = {};
  const renderComponent = (props = defaultProps) =>
    getPinnedNotesTestkit(render(<PinnedNotes {...props} />).container);

  it('should render PinnedNotes', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });
});
