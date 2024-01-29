import { render } from 'src/utils/tests/render';
import MinimalNote, { MinimalNoteProps } from './MinimalNote';
import { getMinimalNoteTestkit } from './MinimalNote.testkit';

describe('MinimalNote', () => {
  const defaultProps: MinimalNoteProps = {
    note: 'note',
  };
  const renderComponent = (props = defaultProps) =>
    getMinimalNoteTestkit(
      render(<MinimalNote {...props} />).container,
    );

  it('should render MinimalNote', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  describe('Minimal note is not editable', () => {
    it('should show value', () => {
      const wrapper = renderComponent();
      expect(wrapper.getComponent()).toHaveTextContent('note');
    });
  });

  describe('MinimalNote is editbale', () => {
    it('should call onSubmit on Cmd Enter', () => {
      const onSubmitMock = jest.fn();
      const props: MinimalNoteProps = {
        note: 'note',
        onSubmit: onSubmitMock,
        editable: true,
      };
      const wrapper = renderComponent(props);

      wrapper.getTextarea().enterValue('new val');
      wrapper.getTextarea().pressCtrlEnter();

      expect(onSubmitMock).toHaveBeenCalledWith('<p>new val<br></p>');
    });
  });
});
