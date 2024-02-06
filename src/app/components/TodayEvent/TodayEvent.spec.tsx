import { waitFor } from '@testing-library/react';
import {
  renderWithMockedProvider,
  wrapWithRouter,
} from 'src/utils/tests/render';
import TodayEvent, { TodayEventProps } from './TodayEvent';
import { getTodayEventTestkit } from './TodayEvent.testkit';
import { MockedResponse } from '@apollo/client/testing';
import { buildUpdateTaskMutationMock } from 'src/graphql/mutations.mocks';

describe('TodayEvent', () => {
  const defaultProps: TodayEventProps = {
    title: 'Title',
    completed: false,
    id: 'event1',
  };
  const renderComponent = (
    props = defaultProps,
    mocks: MockedResponse[] = [],
  ) =>
    getTodayEventTestkit(
      renderWithMockedProvider(
        wrapWithRouter(<TodayEvent {...props} />),
        mocks,
      ).container,
    );

  it('should render TodayEvent', () => {
    const wrapper = renderComponent();
    expect(wrapper.getComponent()).not.toBe(null);
  });

  describe('event is all day', () => {
    const props: TodayEventProps = {
      title: 'Title',
      completed: false,
      allDay: true,
      id: 'event1',
    };
    it('should show label all day', () => {
      const wrapper = renderComponent(props);
      expect(wrapper.getAllDayLabel()).toBeInTheDocument();
    });

    it('should show title', () => {
      const wrapper = renderComponent(props);
      expect(
        wrapper.getTitle(props.title as string),
      ).toBeInTheDocument();
    });

    it('should show checkbox', () => {
      const wrapper = renderComponent(props);
      expect(wrapper.getCheckbox()).toBeInTheDocument();
    });

    it('should complete task', () => {
      const mutationCallback = jest.fn();
      const mocks: MockedResponse[] = [
        buildUpdateTaskMutationMock({
          callback: mutationCallback,
          variables: {
            completed: true,
            id: props.id,
          },
        }),
      ];
      const wrapper = renderComponent(props, mocks);
      wrapper.clickCheckbox();
      waitFor(() => {
        expect(mutationCallback).toHaveBeenCalled();
      });
    });
  });

  describe('event is not all day', () => {
    const props: TodayEventProps = {
      title: 'Title',
      completed: false,
      allDay: false,
      id: 'event1',
      start: new Date(0),
      end: new Date(800000000),
    };
    it('should show label all day', () => {
      const wrapper = renderComponent(props);
      expect(wrapper.getTimeLabel('3:01-9:01')).toBeInTheDocument();
    });

    it('should show title', () => {
      const wrapper = renderComponent(props);
      expect(
        wrapper.getTitle(props.title as string),
      ).toBeInTheDocument();
    });

    it('should show checkbox', () => {
      const wrapper = renderComponent(props);
      expect(wrapper.getCheckbox()).toBeInTheDocument();
    });
  });
});
