import { render } from '@testing-library/react';
import { getRichTextEditorTestkit } from './RichTextEditor.testkit';

// todo: finish
describe('RichTextEditor', () => {
  const renderComponent = () =>
    getRichTextEditorTestkit(render(<div>test</div>).container);

  describe('readOnly is true', () => {
    it('should render RichTextEditor', () => {
      const wrapper = renderComponent();

      expect(wrapper.getComponent()).not.toBe(null);
      expect(wrapper.getComponent().textContent).toBe('test');
    });
  });
});
