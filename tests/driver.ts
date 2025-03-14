/* eslint-disable testing-library/prefer-screen-queries */
import { HOME } from "@/app/utils/consts/routes";
import { expect, type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly createButton: Locator;
  readonly noUserError: Locator;
  readonly wrongPasswordError: Locator;
  readonly commandInput: Locator;
  readonly taskFormDialog: Locator;
  readonly taskFormField: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder("email");
    this.passwordInput = page.getByPlaceholder("password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.createButton = page.getByRole("button", { name: "Create" });
    this.noUserError = page.getByText("User does not exist");
    this.wrongPasswordError = page.getByText("Invalid password");
    this.commandInput = page.getByPlaceholder("Type a command or search...");
    this.taskFormDialog = page.getByRole("dialog");
    this.taskFormField = page.getByRole("paragraph");
    this.editButton = page.getByRole("menuitem", { name: /edit/i });
    this.deleteButton = page.getByRole("button", { name: /delete/i });
  }

  async goto(route: string) {
    await this.page.goto(route);
  }

  async login(
    { email, password }: { email: string; password: string } = {
      email: "test-e2e@email.com",
      password: "testtest",
    }
  ) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    if (!email) {
      await this.page.waitForURL(HOME);
    }
  }

  async homePage() {
    await expect(this.createButton).toBeVisible();
  }

  async getNoUserError() {
    await expect(this.noUserError).toBeVisible();
  }

  async getWrongPassword() {
    await expect(this.wrongPasswordError).toBeVisible();
  }

  async waitForUrl(route: string) {
    await this.page.waitForURL(route);
  }

  async openTaskForm() {
    await this.page.keyboard.press("Meta+KeyK");
    await expect(this.commandInput).toBeVisible();
    // await this.commandInput.fill("Create Task");
    await this.page.keyboard.press("Enter");
    // await expect(this.commandInput).toBeHidden();
    await expect(this.taskFormDialog).toBeVisible();
  }

  async createActiveTask() {
    // type title
    const title = `Feed the cat (${new Date().valueOf()})`;
    await this.page.keyboard.type(title);
    await this.page.keyboard.press("Enter");
    await this.page.keyboard.press("Enter");

    // add active tag
    await this.page.keyboard.press("@");
    await this.page.keyboard.type("act");
    await this.page.keyboard.press("Enter");
    await this.page.keyboard.press("Enter");

    // add subtask
    await this.page.keyboard.type("@ta");
    await this.page.keyboard.press("Enter");
    await this.page.keyboard.type("buy food");
    await this.page.keyboard.press("Enter");

    // add another substask
    await this.page.keyboard.type("@task");
    await this.page.keyboard.press("Enter");
    await this.page.keyboard.type("poor water");
    await this.page.keyboard.press("Enter");

    // add description
    await this.page.keyboard.type("cat needs to be happy");

    await this.createButton.click();

    await expect(this.taskFormDialog).not.toBeVisible();

    // assess all the tasks

    const parentTask = this.page
      .getByRole("button", { name: `${title} default project` })
      .first();

    const moreTasksButton = this.page
      .getByRole("button", {
        name: "2 related tasks",
        exact: true,
      })
      .first();

    await expect(parentTask).toBeVisible();
    await expect(parentTask).toHaveText(
      `${title}default project${title}\n\n@active\n@task buy food\n@task poor water\ncat needs to be happy2 related tasks`
    );

    const childTask1 = this.page
      .getByRole("button", { name: "buy food default project" })
      .first();

    const childTask2 = this.page
      .getByRole("button", { name: "poor water default project" })
      .first();

    await moreTasksButton.click();

    await expect(childTask1).toBeVisible();
    await expect(childTask1).toHaveText("buy fooddefault project");

    await expect(childTask2).toBeVisible();
    await expect(childTask2).toHaveText("poor waterdefault project");

    // delete child 1 task
    await childTask1.click({ button: "right" });
    await this.editButton.click();
    await expect(this.taskFormDialog).toBeVisible();
    await this.deleteButton.click();
    await expect(this.taskFormDialog).not.toBeVisible();
    await expect(childTask1).not.toBeVisible();

    // delete child 2 task
    await childTask2.click({ button: "right" });
    await this.editButton.click();
    await expect(this.taskFormDialog).toBeVisible();
    await this.deleteButton.click();
    await expect(this.taskFormDialog).not.toBeVisible();
    await expect(childTask2).not.toBeVisible();

    // delete parent task
    await parentTask.click({ button: "right" });
    await this.editButton.click();
    await expect(this.taskFormDialog).toBeVisible();
    await this.deleteButton.click();
    await expect(this.taskFormDialog).not.toBeVisible();
    await expect(parentTask).not.toBeVisible();
  }
}
