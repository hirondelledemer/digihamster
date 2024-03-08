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

window.DOMRect = {
  fromRect: () => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON: () => {},
  }),
} as any;

window.ClipboardEvent = ClipboardEventMock as any;
window.DragEvent = DragEventMock as any;
