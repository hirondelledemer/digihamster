import { test, expect } from "@playwright/test";

test("user logs in", async ({ page }) => {
  await page.goto("/");

  const emailInput = page.getByPlaceholder("email");
  const passwordInput = page.getByPlaceholder("password");
  const loginButton = page.getByRole("button", { name: "Login" });

  await emailInput.fill("test@test.com");
  await passwordInput.fill("testtest");
  await loginButton.click();

  await expect(page).toHaveURL("/profile");
});

// test("get started link", async ({ page }) => {
//   await page.goto("https://playwright.dev/");

//   // Click the get started link.
//   await page.getByRole("link", { name: "Get started" }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(
//     page.getByRole("heading", { name: "Installation" })
//   ).toBeVisible();
// });
