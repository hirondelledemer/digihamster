import "@testing-library/jest-dom";

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
