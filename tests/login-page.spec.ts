import { test, expect, Page, TestInfo } from "@playwright/test";

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

test.describe("error cases", () => {
  test.describe("happy path", () => {
    test("user logs in", async ({ page }) => {
      const { vals, urls, ...driver } = getDriver({ page });

      await driver.goto(urls.base);
      await expect(page).toHaveScreenshot("login-page.png");

      await driver.fillEmail(vals.email);
      await driver.fillPassword(vals.password);
      await driver.clickLogin();

      await expect(page).toHaveURL(urls.profile);
      await expect(page).toHaveScreenshot("profile-page.png");
    });
  });

  test.describe("errors", () => {
    test("user does not exists", async ({ page }) => {
      const { vals, urls, ...driver } = getDriver({ page });

      await driver.goto(urls.base);
      await driver.fillEmail("incorrect@user.com");
      await driver.fillPassword(vals.password);
      await driver.clickLogin();

      await expect(page).toHaveURL(urls.login);
      await expect(page).toHaveScreenshot("login-error-no-user.png");
    });

    test("password is incorrect", async ({ page }) => {
      const { vals, urls, ...driver } = getDriver({ page });
      await driver.goto(urls.base);

      await driver.fillEmail(vals.email);
      await driver.fillPassword("incorrect");
      await driver.clickLogin();

      await expect(page).toHaveURL(urls.login);
      await expect(page).toHaveScreenshot("login-error-bad-password.png");
    });
  });
});

const getDriver = ({ page }: { page: Page }) => {
  const emailInput = page.getByPlaceholder("email");
  const passwordInput = page.getByPlaceholder("password");
  const loginButton = page.getByRole("button", { name: "Login" });

  return {
    fillEmail: (email: string) => emailInput.fill(email),
    fillPassword: (password: string) => passwordInput.fill(password),
    clickLogin: () => loginButton.click(),
    goto: (location: string) => page.goto(location),
    vals: {
      email: "test@test.com",
      password: "testtest",
    },
    urls: {
      login: "/login",
      profile: "/profile",
      base: "/",
    },
  };
};
