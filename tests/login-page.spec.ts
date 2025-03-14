import { test, expect, TestInfo } from "@playwright/test";
import { HomePage } from "./driver";
import { HOME, LOGIN } from "@/app/utils/consts/routes";

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

test.describe("login page", () => {
  test.describe("happy path", () => {
    test("user logs in", async ({ page }) => {
      const driver = new HomePage(page);

      await driver.goto(HOME);
      await driver.login();

      await driver.homePage();
    });
  });

  test.describe("errors", () => {
    test("user does not exists", async ({ page }) => {
      const driver = new HomePage(page);

      await driver.goto(HOME);

      await driver.login({
        email: "incorrect@user.com",
        password: "testtest",
      });

      await driver.getNoUserError();
      await expect(page).toHaveURL(LOGIN);
    });

    test("password is incorrect", async ({ page }) => {
      const driver = new HomePage(page);
      await driver.goto(HOME);

      await driver.login({
        email: "test@test.com",
        password: "incorrect",
      });

      await driver.getWrongPassword();
    });
  });
});
