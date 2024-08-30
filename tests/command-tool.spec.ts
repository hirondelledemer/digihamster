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

// todo: figure out the way to mock user
// maybe redo the testkit

test.describe("command tool", () => {
  test("add quick task", async ({ page }) => {
    const { vals, urls, ...driver } = getDriver({ page });

    // login
    await driver.goto(urls.base);
    await expect(page).toHaveScreenshot("login-page.png");
    await driver.fillEmail(vals.email);
    await driver.fillPassword(vals.password);
    await driver.clickLogin();
    await expect(driver.loginButton).toBeHidden();
    await expect(page).toHaveURL(urls.home);

    // create task
    await driver.openCommandTool();
    await expect(driver.commandInput).toBeVisible();
    await driver.fillCommand("new task");
    await driver.pressEnter();
    await expect(driver.commandInput).toBeHidden();
    await expect(driver.getTaskCardByName("new task")).toBeVisible();

    // delete task
    await driver.getTaskCardByName("new task").click({ button: "right" });
    await driver.editButton.click();
    await expect(driver.taskFormDialog).toBeVisible();
    await driver.deleteButton.click();
    await expect(driver.taskFormDialog).toBeHidden();
    await expect(driver.getTaskCardByName("new task")).toBeHidden();
  });
});

const getDriver = ({ page }: { page: Page }) => {
  const emailInput = page.getByPlaceholder("email");
  const commandInput = page.getByPlaceholder("Type a command or search...");
  const passwordInput = page.getByPlaceholder("password");
  const loginButton = page.getByRole("button", { name: "Login" });
  const editButton = page.getByRole("menuitem", { name: /edit/i });
  const deleteButton = page.getByRole("button", { name: /delete/i });
  const taskFormDialog = page.getByRole("dialog");
  const getTaskCardByName = (name: string) => page.getByText(name);

  return {
    fillEmail: (email: string) => emailInput.fill(email),
    fillPassword: (password: string) => passwordInput.fill(password),
    fillCommand: (command: string) => commandInput.fill(command),
    clickLogin: () => loginButton.click(),
    editButton,
    loginButton,
    deleteButton,
    taskFormDialog,
    goto: (location: string) => page.goto(location),
    openCommandTool: () => page.keyboard.press("Meta+KeyK"),
    commandInput,
    getTaskCardByName,
    pressEnter: () => page.keyboard.press("Enter"),
    vals: {
      email: "test@test.com",
      password: "testtest",
    },
    urls: {
      login: "/login",
      profile: "/profile",
      base: "/",
      home: "/home",
    },
  };
};
