import { test, expect } from "@playwright/test";

test.describe("error cases", () => {
  test.describe("happy path", () => {
    test("user logs in", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveScreenshot("login-page.png");

      const emailInput = page.getByPlaceholder("email");
      const passwordInput = page.getByPlaceholder("password");
      const loginButton = page.getByRole("button", { name: "Login" });

      await emailInput.fill("test@test.com");
      await passwordInput.fill("testtest");
      await loginButton.click();

      await expect(page).toHaveURL("/profile");
      await expect(page).toHaveScreenshot("profile-page.png");
    });
  });

  test.describe("errors", () => {
    test("user does not exists", async ({ page }) => {
      await page.goto("/");
      const emailInput = page.getByPlaceholder("email");
      const passwordInput = page.getByPlaceholder("password");
      const loginButton = page.getByRole("button", { name: "Login" });

      await emailInput.fill("incorrect@user.com");
      await passwordInput.fill("testtest");
      await loginButton.click();

      await expect(page).toHaveURL("/login");
      await expect(page).toHaveScreenshot("login-error-no-user.png");
    });

    test("password is incorrect", async ({ page }) => {
      await page.goto("/");
      const emailInput = page.getByPlaceholder("email");
      const passwordInput = page.getByPlaceholder("password");
      const loginButton = page.getByRole("button", { name: "Login" });

      await emailInput.fill("test@test.com");
      await passwordInput.fill("incorrect");
      await loginButton.click();

      await expect(page).toHaveURL("/login");
      await expect(page).toHaveScreenshot("login-error-bad-password.png");
    });
  });
});
