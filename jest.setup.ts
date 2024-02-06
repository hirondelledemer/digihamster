// import "@testing-library/jest-dom";

// Object.defineProperty(window, "matchMedia", {
//   writable: true,
//   value: (query: any) => ({
//     matches: false,
//     media: query,
//     onchange: null,
//     addListener: jest.fn(),
//     removeListener: jest.fn(),
//     addEventListener: jest.fn(),
//     removeEventListener: jest.fn(),
//     dispatchEvent: jest.fn(),
//   }),
// });

///////////////////////
//////////////////////

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

class ClipboardEventMock extends Event {
  clipboardData: {
    getData: jest.Mock<any, any>;
    setData: jest.Mock<any, any>;
  };
  constructor(type: string, eventInitDict: EventInit | undefined) {
    super(type, eventInitDict);
    this.clipboardData = {
      getData: jest.fn(),
      setData: jest.fn(),
    };
  }
}

class DragEventMock extends Event {
  // clipboardData: {
  //   getData: jest.Mock<any, any>;
  //   setData: jest.Mock<any, any>;
  // };
  constructor(type: string, eventInitDict: EventInit | undefined) {
    super(type, eventInitDict);
    // this.clipboardData = {
    //   getData: jest.fn(),
    //   setData: jest.fn(),
    // };
  }
}

window.ClipboardEvent = ClipboardEventMock as any;
window.DragEvent = DragEventMock as any;
window.ResizeObserver = ResizeObserver;
