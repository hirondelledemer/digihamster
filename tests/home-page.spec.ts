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

test.describe("tasks", () => {
  test("should create active task with 2 child tasks", async ({ page }) => {
    const driver = new HomePage(page);

    await driver.goto(HOME);

    await driver.login();

    await driver.openTaskForm();
    await driver.createActiveTask();
  });
});
