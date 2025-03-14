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
    // await expect(driver.commandInput).toBeVisible();
    // await driver.fillCommand(taskName);
    // await driver.pressEnter();

    // await expect(driver.commandInput).toBeHidden();
    // await expect(driver.getTaskCardByName(taskName)).toBeVisible();

    // // delete task
    // await driver.getTaskCardByName(taskName).click({ button: "right" });
    // await driver.editButton.click();
    // await expect(driver.taskFormDialog).toBeVisible();
    // await driver.deleteButton.click();
    // await expect(driver.taskFormDialog).toBeHidden();
    // await expect(driver.getTaskCardByName(taskName)).toBeHidden();
  });
});

// const getDriver = ({ page }: { page: Page }) => {
//   const emailInput = page.getByPlaceholder("email");
//   const commandInput = page.getByPlaceholder("Type a command or search...");
//   const passwordInput = page.getByPlaceholder("password");
//   const loginButton = page.getByRole("button", { name: "Login" });
//   const editButton = page.getByRole("menuitem", { name: /edit/i });
//   const deleteButton = page.getByRole("button", { name: /delete/i });
//   const taskFormDialog = page.getByRole("dialog");
//   const getTaskCardByName = (name: string) => page.getByText(name);

//   return {
//     fillEmail: (email: string) => emailInput.fill(email),
//     fillPassword: (password: string) => passwordInput.fill(password),
//     fillCommand: (command: string) => commandInput.fill(command),
//     clickLogin: () => loginButton.click(),
//     emailInput,
//     editButton,
//     loginButton,
//     deleteButton,
//     taskFormDialog,
//     goto: (location: string) => page.goto(location),
//     openCommandTool: () => page.keyboard.press("Meta+KeyK"),
//     commandInput,
//     getTaskCardByName,
//     pressEnter: () => page.keyboard.press("Enter"),
//     vals: {
//       email: "test@test.com",
//       password: "testtest",
//     },
//     urls: {
//       login: "/login",
//       profile: "/profile",
//       base: "/",
//       home: "/",
//     },
//   };
// };
