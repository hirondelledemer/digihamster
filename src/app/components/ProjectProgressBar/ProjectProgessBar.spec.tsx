import { render, screen } from "@/config/utils/test-utils";
import { ProjectProgressBar } from "./ProjectProgressBar";

describe("ProjectProgressBar", () => {
  it("shows different bar, when allCount is 0", () => {
    render(
      <ProjectProgressBar
        allCount={0}
        completedCount={1}
        activeCount={1}
        color="#fff"
      />
    );
    expect(screen.getByTestId("error-bar")).toBeInTheDocument();
  });
});
