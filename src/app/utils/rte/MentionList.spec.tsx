import { MentionList, MentionListProps } from './MentionList';
import { getMentionListTestkit } from './MentionList.testkit';
import { renderWithMockedProvider } from '../tests/render';
import { act, waitFor } from '@testing-library/react';
import {
  buildCreateTagMutationMock,
  buildGetTagsMutationMock,
  data,
} from './MentionList.mocks';
import React from 'react';
import { MockedResponse } from '@apollo/client/testing';

jest.mock('../common/random-int', () => ({
  getRandomInt: () => 0,
}));

describe('MentionList', () => {
  const defaultProps: MentionListProps = {
    command: jest.fn(),
    query: '',
  };
  const renderComponent = (
    props = defaultProps,
    mocks: MockedResponse[] = [],
  ) =>
    getMentionListTestkit(
      renderWithMockedProvider(<MentionList {...props} />, [
        buildGetTagsMutationMock(),
        ...mocks,
      ]).container,
    );

  it('should render MentionList', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  it('should show tags', async () => {
    const wrapper = renderComponent();
    await waitFor(() => {
      expect(wrapper.getComponent().textContent).toBe(
        '@media (max-width: 35.99375em) {.mantine-visible-from-xs {display: none !important;}}@media (min-width: 36em) {.mantine-hidden-from-xs {display: none !important;}}@media (max-width: 47.99375em) {.mantine-visible-from-sm {display: none !important;}}@media (min-width: 48em) {.mantine-hidden-from-sm {display: none !important;}}@media (max-width: 61.99375em) {.mantine-visible-from-md {display: none !important;}}@media (min-width: 62em) {.mantine-hidden-from-md {display: none !important;}}@media (max-width: 74.99375em) {.mantine-visible-from-lg {display: none !important;}}@media (min-width: 75em) {.mantine-hidden-from-lg {display: none !important;}}@media (max-width: 87.99375em) {.mantine-visible-from-xl {display: none !important;}}@media (min-width: 88em) {.mantine-hidden-from-xl {display: none !important;}}Tag 1Tag 2Tag 3',
      );
    });
  });

  describe('selecting tag', () => {
    it('should select tag', async () => {
      const ref = React.createRef();
      const command = jest.fn();
      const wrapper = renderComponent({
        ...defaultProps,
        ref,
        command,
      } as any);

      await waitFor(() => {
        expect(wrapper.getComponent().textContent).toContain(
          'Tag 1Tag 2Tag 3',
        );
      });

      act(() => {
        (ref.current as any).onKeyDown({
          event: { key: 'ArrowDown' },
        });
      });
      (ref.current as any).onKeyDown({ event: { key: 'Enter' } });

      expect(command).toHaveBeenCalledWith({
        id: `${data.tags[1].id}:${data.tags[1].color}`,
        label: data.tags[1].title,
      });
    });

    it('should create new tag', async () => {
      const query = 'new';
      const callback = jest.fn();
      const ref = React.createRef();
      const command = jest.fn();

      const wrapper = renderComponent(
        {
          ...defaultProps,
          query,
          ref,
          command,
        } as any,
        [
          buildCreateTagMutationMock({
            variables: {
              title: query,
              color: '#F06595',
            },
            callback,
          }),
        ],
      );

      await waitFor(() => {
        expect(wrapper.getCreateButton()).toBeInTheDocument();
      });

      act(() => {
        (ref.current as any).onKeyDown({ event: { key: 'Enter' } });
      });

      await waitFor(() => {
        expect(callback).toHaveBeenCalled();
        expect(command).toHaveBeenCalledWith({
          id: 'newTag1:#F06595',
          label: 'new',
        });
      });
    });
  });

  describe('filtering', () => {
    describe('tag exists by query', () => {
      const query = 'Tag 1';
      it('should show tags filtered by query', async () => {
        const wrapper = renderComponent({
          ...defaultProps,
          query,
        });
        await waitFor(() => {
          expect(wrapper.getComponent()).toHaveTextContent('Tag 1');
        });
      });
    });

    describe('tag does not exists by query', () => {
      const query = 'new';
      it('should show show "create button"', async () => {
        const wrapper = renderComponent({
          ...defaultProps,
          query,
        });
        await waitFor(() => {
          expect(wrapper.getCreateButton()).toBeInTheDocument();
        });
      });
    });
  });
});
