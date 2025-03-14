import { test, TestInfo } from "@playwright/test";
import { HomePage } from "./driver";
import { HOME } from "@/app/utils/consts/routes";

export const configureSnapshotPath =
  (options?: {}) =>
  ({}: any, testInfo: TestInfo): any => {
    const originalSnapshotPath = testInfo.snapshotPath;

    testInfo.snapshotPath = (snapshotName) => {
      const result = originalSnapshotPath
        .apply(testInfo, [snapshotName])
        .replace("-linux", "")
        .replace("-darwin", "");

      return result;
    };
  };

test.beforeEach(configureSnapshotPath());

// todo: figure out the way to mock user
// maybe redo the testkit

test.describe("tasks", () => {
  test("should create task", async ({ page }) => {
    const driver = new HomePage(page);
    // const taskName = `new task (${new Date().getTime()})`;

    // login
    await driver.goto(HOME);

    await driver.login();

    await driver.waitForUrl(HOME);

    // create task
    await driver.openTaskForm();
    await driver.createActiveTask();
  });
});
