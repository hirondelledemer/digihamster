import "@testing-library/jest-dom";
// import { screen } from "@testing-library/react";
import { render } from "../config/utils/test-utils";
import Login from "../app/login/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe.skip("Login", () => {
  it("renders a heading", () => {
    const { container } = render(<Login />);

    /* 
        mantine generates random classnames, do not use toMatchSnapshot
        this test may not be usefull. Let's think about replacing it by screenshot/storybook tests instead
    */
    expect(container).toMatchSnapshot();
  });
});
