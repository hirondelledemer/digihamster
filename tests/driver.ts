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

  async login(params?: { email: string; password: string }) {
    const { email, password } = params || {
      email: "test-e2e@email.com",
      password: "testtest",
    };

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    /*
      if no login data is passed, it is assumed that login is correct
    */
    if (!params) {
      await this.page.waitForURL(HOME, {
        waitUntil: "networkidle",
      });
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
    await this.page.keyboard.press("Enter");
    await expect(this.taskFormDialog).toBeVisible();
  }

  async createActiveTask() {
    // type title
    const title = `Feed the cat (${new Date().valueOf()})`;

    // Wait for the input to be ready
    await this.page.waitForSelector('input, [contenteditable="true"]');

    // type the titles
    await this.page.keyboard.type(title);
    await this.page.keyboard.press("Enter");
    await this.page.keyboard.press("Enter");

    // add active tag - wait for input to be ready after Enter
    await this.page.waitForTimeout(100); // Small delay to ensure input is ready
    await this.page.keyboard.type("$a");

    // Wait for suggestions to appear
    await this.page.waitForSelector('text="active"', { state: "visible" });
    await expect(this.page.getByText("active").nth(0)).toBeVisible();
    await expect(this.page.getByText("today")).toBeVisible();

    await this.page.keyboard.type("ct");
    await this.page.keyboard.press("Enter");
    await this.page.keyboard.press("Enter");

    // add subtask - wait for input to be ready
    await this.page.waitForTimeout(100);
    await this.page.keyboard.type("@ta");

    // Wait for task suggestion
    await this.page.waitForSelector('text="task"', { state: "visible" });
    await expect(this.page.getByText("task").nth(1)).toBeVisible();
    await this.page.keyboard.press("Enter");
    await this.page.keyboard.type("buy food");
    await this.page.keyboard.press("Enter");

    // add another subtask - wait for input to be ready
    await this.page.waitForTimeout(100);
    await this.page.keyboard.type("@ta");

    // Wait for task suggestion
    await this.page.waitForSelector('text="task"', { state: "visible" });
    await expect(this.page.getByText("task").nth(1)).toBeVisible();
    await this.page.keyboard.press("Enter");
    await this.page.keyboard.type("poor water");
    await this.page.keyboard.press("Enter");

    // add description - wait for input to be ready
    await this.page.waitForTimeout(100);
    await this.page.keyboard.type("cat needs to be happy");

    // Wait for create button to be ready and click it
    await this.createButton.waitFor({ state: "visible" });
    await this.createButton.click();

    // Wait for dialog to close
    await expect(this.taskFormDialog).not.toBeVisible();

    // Wait for tasks to appear and be visible
    const parentTask = this.page
      .getByRole("button", { name: `${title} default project` })
      .first();

    // Wait for parent task to be visible with timeout
    await expect(parentTask).toBeVisible({ timeout: 5000 });
    await expect(parentTask).toHaveText(
      `${title}default project cat needs to be happy`
    );

    // Wait for child tasks to be visible

    await this.page.getByTestId("task-info-icon").first().click();
    await expect(this.taskFormDialog).toBeVisible();
    await this.page.waitForSelector('input, [contenteditable="true"]');

    const childTask1 = this.page
      .getByRole("button", { name: "buy food default project" })
      .first();

    const childTask2 = this.page
      .getByRole("button", { name: "poor water default project" })
      .first();

    // Wait for both child tasks with retries and longer timeout
    await expect(childTask1).toBeVisible({ timeout: 15000 });
    await expect(childTask2).toBeVisible({ timeout: 15000 });

    await this.page.getByRole("button", { name: "Close" }).click();

    // delete parent task
    await parentTask.click({ button: "right" });
    await this.editButton.click();
    await expect(this.taskFormDialog).toBeVisible();
    await this.deleteButton.click();
    await expect(this.taskFormDialog).not.toBeVisible();
    await expect(parentTask).not.toBeVisible();
  }
}
